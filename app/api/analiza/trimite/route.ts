// „Trimite-mi analiza pe email”: clientul primește raportul, Imperial primește contactul,
// iar dacă a bifat, intră în reamintirile automate (după 3 și 14 zile).

import { NextResponse } from "next/server";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { insertBrief } from "@/lib/briefs";
import { hasDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { raportHtml, sanitizeRaport } from "@/lib/analiza-raport";
import { stopUrl } from "@/lib/analiza-follow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`analiza-trimite:${getClientIp(req)}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe trimiteri. Încearcă din nou în câteva minute." }, { status: 429 });
  }
  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  const email = String(b?.email ?? "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Scrie o adresă de email validă." }, { status: 400 });
  }
  const raport = sanitizeRaport(b?.raport);
  if (!raport) return NextResponse.json({ error: "Analiza lipsește." }, { status: 400 });
  const reamintiri = b?.reamintiri === true;
  const html = raportHtml(raport);

  try {
    await sendSimpleEmail({
      to: email,
      subject: `Analiza ta${raport.firma ? ` pentru ${raport.firma}` : ""} — Imperial Media`,
      html: `<div style="background:#f5f5f7;padding:20px 10px;">${html}
        ${reamintiri ? `<p style="max-width:720px;margin:12px auto 0;font:11px Arial,sans-serif;color:#888;text-align:center;">Ți-am trimis analiza la cererea ta. Nu mai vrei reamintiri? <a href="${stopUrl(email)}" style="color:#888;">Dezabonează-te</a>.</p>` : ""}</div>`,
    });
  } catch (e) {
    console.error("[analiza/trimite] client email failed:", e);
    return NextResponse.json({ error: "Nu am putut trimite emailul. Încearcă din nou." }, { status: 500 });
  }

  if (hasDb()) {
    insertBrief({
      name: raport.firma || email,
      email,
      selected_package: raport.pachet,
      industry: raport.domeniu,
      current_site: raport.site?.url,
      message: `Analiză gratuită — ${raport.domeniu}, ${raport.oras}, ${raport.prezenta}. Total orientativ ${raport.total} lei.${raport.site ? ` Site: ${raport.site.url} — verdict ${raport.site.verdict}.` : ""}\nreamintiri: ${reamintiri ? "da" : "nu"}\noferta: ${raport.ofertaUrl}`,
      source: reamintiri ? "analiza-email-reamintiri" : "analiza-email",
    }).catch((e) => console.error("[analiza/trimite] db failed:", e));
  }
  sendSimpleEmail({
    to: ownerEmail(),
    subject: `📩 Analiză cerută pe email: ${raport.firma || email} — ${raport.domeniu}, ${raport.oras}`,
    replyTo: email,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;">
      <p><b>${email}</b> a cerut analiza pe email${reamintiri ? " și a acceptat reamintirile" : ""}. Merită un mesaj sau un telefon.</p>${html}</div>`,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
