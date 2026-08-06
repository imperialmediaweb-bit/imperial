// Emitere automată de facturi prin Oblio (www.oblio.eu — plan gratuit, API + e-Factura).
// Se activează prin env: OBLIO_EMAIL, OBLIO_TOKEN (API secret), OBLIO_CIF (firma ta),
// OBLIO_SERIES (seria facturilor, ex: "IMP"). Fără chei → returnează {issued:false}
// și facturarea rămâne manuală (datele vin oricum pe emailul proprietarului).
//
// Notă: dacă folosești SmartBill în loc de Oblio, schimbăm doar acest fișier.

const OBLIO_BASE = "https://www.oblio.eu/api";

export function invoicingEnabled(): boolean {
  return !!(
    process.env.OBLIO_EMAIL &&
    process.env.OBLIO_TOKEN &&
    process.env.OBLIO_CIF &&
    process.env.OBLIO_SERIES
  );
}

export type InvoiceClient = {
  name: string;
  cif?: string;
  address?: string;
  city?: string;
  email?: string;
};

export async function issueInvoice(opts: {
  client: InvoiceClient;
  productName: string;
  priceRon: number; // preț final, TVA inclus
}): Promise<{ issued: boolean; link?: string; error?: string }> {
  if (!invoicingEnabled()) return { issued: false, error: "invoicing not configured" };

  try {
    // 1. Token de acces
    const tokenRes = await fetch(`${OBLIO_BASE}/authorize/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.OBLIO_EMAIL,
        client_secret: process.env.OBLIO_TOKEN,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;
    if (!accessToken) throw new Error("Oblio auth failed");

    // 2. Emitere factură + trimitere pe email către client
    const invoiceRes = await fetch(`${OBLIO_BASE}/docs/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        cif: process.env.OBLIO_CIF,
        seriesName: process.env.OBLIO_SERIES,
        language: "RO",
        precision: 2,
        currency: "RON",
        sendEmail: opts.client.email ? 1 : 0,
        client: {
          name: opts.client.name || "Persoană fizică",
          cif: opts.client.cif || "",
          address: opts.client.address || "",
          city: opts.client.city || "",
          country: "România",
          email: opts.client.email || "",
        },
        products: [
          {
            name: opts.productName,
            price: opts.priceRon,
            quantity: 1,
            measuringUnit: "buc",
            currency: "RON",
            vatIncluded: true,
          },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const invoiceData = await invoiceRes.json();
    if (invoiceData?.status !== 200 && !invoiceData?.data) {
      throw new Error(`Oblio invoice failed: ${JSON.stringify(invoiceData).slice(0, 200)}`);
    }
    return { issued: true, link: invoiceData?.data?.link };
  } catch (e: any) {
    console.error("[invoicing] failed:", e?.message ?? e);
    return { issued: false, error: String(e?.message ?? e) };
  }
}
