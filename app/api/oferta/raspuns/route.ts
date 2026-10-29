// „Nu accept oferta” din emailul cu oferta, cu motivul — pleacă doar spre noi, ca să știm de ce n-a mers.

import { NextResponse } from "next/server";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { parseConfig, configSummary, configPriceText } from "@/lib/configuratie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  if (!rateLimit(`oferta-raspuns:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări — așteaptă câteva minute." }, { status: 429 });
  }
  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const name = String(b?.name ?? "").trim().slice(0, 120);
  const email = String(b?.email ?? "").trim().slice(0, 200);
  const phone = String(b?.phone ?? "").trim().slice(0, 40);
  const reason = String(b?.reason ?? "").trim().slice(0, 80);
  const note = String(b?.note ?? "").trim().slice(0, 2000);
  const config = parseConfig(b?.tip, b?.optiuni);
  const oferta = config ? `${configSummary(config)} — ${configPriceText(config)}` : "—";

  const subject = `❌ Ofertă refuzată: ${name || email}${reason ? ` — ${reason}` : ""}`;
  const line = (k: string, v: string) => (v ? `<p style="margin:4px 0;"><b>${k}:</b> ${esc(v)}</p>` : "");

  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6;">
        ${line("Client", name)}${line("Email", email)}${line("Telefon", phone)}
        ${line("Oferta", oferta)}
        ${line("Motiv", reason)}${line("Mesaj", note)}
      </div>`,
    });
  } catch (e) {
    console.error("[oferta/raspuns] email failed:", e);
    return NextResponse.json({ error: "Nu am putut trimite. Sună-ne la 0741 970 247." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
