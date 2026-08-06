// Emitere automată de facturi prin StartCo Cloud (api.cloud.startco.ro).
// Docs: https://api.cloud.startco.ro/developer/docs
// Se activează prin env:
//   STARTCO_TOKEN  — cheia API din StartCo Cloud (Contul Meu → Integrări → API)
//   STARTCO_SERIES — seria facturilor (ex: "FCT")
// Fără chei → returnează {issued:false} și facturarea rămâne manuală
// (datele de facturare vin oricum pe emailul proprietarului).
//
// Flux: 1) creăm/actualizăm clientul (partner — StartCo validează CUI-ul la ANAF)
//       2) emitem factura pe clientId (PDF generat automat, e-Factura conform
//          setărilor contului StartCo).

const STARTCO_BASE = "https://api.cloud.startco.ro";

export function invoicingEnabled(): boolean {
  return !!(process.env.STARTCO_TOKEN && process.env.STARTCO_SERIES);
}

export type InvoiceClient = {
  name: string;
  cif?: string;
  address?: string;
  city?: string;
  email?: string;
};

async function startcoFetch(path: string, body: any): Promise<any> {
  const res = await fetch(`${STARTCO_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.STARTCO_TOKEN!,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`StartCo ${path} → ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

// Id-ul poate veni sub mai multe forme în funcție de endpoint — căutăm defensiv.
function extractId(data: any): number | null {
  const candidates = [data?.id, data?.data?.id, data?.partner?.id, data?.client?.id, data?.data?.partner?.id];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

export async function issueInvoice(opts: {
  client: InvoiceClient;
  productName: string;
  priceRon: number; // preț final încasat
}): Promise<{ issued: boolean; link?: string; error?: string }> {
  if (!invoicingEnabled()) return { issued: false, error: "invoicing not configured" };

  try {
    // 1. Clientul (partner) — trimitem CUI-ul sub ambele denumiri uzuale;
    //    câmpurile necunoscute sunt ignorate de API.
    const partnerData = await startcoFetch("/developer/partners", {
      name: opts.client.name || "Persoană fizică",
      cif: opts.client.cif || "",
      cui: opts.client.cif || "",
      address: opts.client.address || "",
      city: opts.client.city || "",
      email: opts.client.email || "",
      country: "România",
    });
    const clientId = extractId(partnerData);
    if (!clientId) {
      throw new Error(`StartCo partner id missing: ${JSON.stringify(partnerData).slice(0, 300)}`);
    }

    // 2. Factura
    const today = new Date().toISOString().slice(0, 10);
    const invoiceData = await startcoFetch("/developer/invoice", {
      currency: "RON",
      dateEmitted: today,
      dateDue: today,
      series: process.env.STARTCO_SERIES,
      clientId,
      products: [
        {
          name: opts.productName,
          price: opts.priceRon,
          um: "buc",
          risky: false,
          nc: "",
          cpv: "",
        },
      ],
    });

    const link =
      invoiceData?.pdf ?? invoiceData?.data?.pdf ?? invoiceData?.link ?? invoiceData?.data?.link ?? undefined;
    return { issued: true, link: link ? String(link) : undefined };
  } catch (e: any) {
    console.error("[invoicing/startco] failed:", e?.message ?? e);
    return { issued: false, error: String(e?.message ??e) };
  }
}
