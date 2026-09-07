// Acceptarea contractului de prestări servicii — la distanță, electronic.
// Copia pleacă AMBILOR (client + proprietar) și rămâne ca lead în admin (comenzi).

import { NextResponse } from "next/server";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { hasDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { contractHtml, contractNumber, type ContractInput } from "@/lib/contract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`contract:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări — așteaptă câteva minute." }, { status: 429 });
  }

  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const clientEmail = String(b?.clientEmail ?? "").trim().toLowerCase();
  const input: ContractInput = {
    clientName: String(b?.clientName ?? "").trim().slice(0, 200),
    clientCui: String(b?.clientCui ?? "").replace(/\D/g, "").slice(0, 10),
    clientAddress: String(b?.clientAddress ?? "").trim().slice(0, 300),
    clientRep: String(b?.clientRep ?? "").trim().slice(0, 120),
    clientEmail,
    service: String(b?.service ?? "").trim().slice(0, 120),
    price: String(b?.price ?? "").trim().slice(0, 60),
    acceptedAt: new Date(),
    ip,
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clientEmail)) {
    return NextResponse.json({ error: "Emailul e obligatoriu — pe el primești contractul." }, { status: 400 });
  }
  if (!input.clientName || input.clientCui.length < 2 || !input.clientRep || !input.service) {
    return NextResponse.json({ error: "CUI-ul, denumirea firmei, numele tău și pachetul sunt obligatorii." }, { status: 400 });
  }
  if (b?.accepted !== true) {
    return NextResponse.json({ error: "Bifează acceptarea contractului." }, { status: 400 });
  }

  const nr = contractNumber(input);
  const html = contractHtml(input);

  let sent = false;
  try {
    await sendSimpleEmail({
      to: clientEmail,
      subject: `Contractul tău de prestări servicii — ${nr} (Imperial Media)`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
        <p>Salut! Mai jos ai exemplarul tău din contract — păstrează acest email. O copie identică a ajuns și la noi.</p>
        <hr/>${html}</div>`,
    });
    sent = true;
  } catch (e) {
    console.error("[contract] client email failed:", e);
  }
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `📜 CONTRACT ACCEPTAT — ${input.clientName} (${nr})`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
        <p><b>${input.clientName}</b> (CUI ${input.clientCui}) a acceptat contractul pentru „${input.service}" — reprezentant: ${input.clientRep}, email: ${clientEmail}, IP: ${ip}.</p>
        <hr/>${html}</div>`,
      replyTo: clientEmail,
    });
    sent = true;
  } catch (e) {
    console.error("[contract] owner email failed:", e);
  }
  if (!sent) {
    return NextResponse.json({ error: "Nu am putut trimite contractul — încearcă din nou." }, { status: 500 });
  }

  if (hasDb()) {
    insertBrief({
      name: input.clientName,
      email: clientEmail,
      selected_package: `📜 CONTRACT ${nr}`,
      industry: "",
      message: `Contract de prestări servicii ACCEPTAT electronic.\nNr: ${nr}\nFirma: ${input.clientName} / CUI ${input.clientCui}\nAdresa: ${input.clientAddress}\nReprezentant: ${input.clientRep}\nPachet: ${input.service} — ${input.price}\nAcceptat la: ${input.acceptedAt.toISOString()} · IP: ${ip}\n(Copiile complete: pe emailul tău și al clientului.)`,
      source: "contract-acceptat",
    }).catch((e) => console.error("[contract] lead insert failed:", e));
  }

  const { insertNotification } = await import("@/lib/monitoring");
  insertNotification(
    clientEmail,
    "order",
    `📜 Contractul ${nr} e semnat`,
    "Exemplarul tău e pe email. Spor la treabă — urmează site-ul!"
  ).catch(() => {});

  return NextResponse.json({ ok: true, nr });
}
