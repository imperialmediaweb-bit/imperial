// Deblocarea raportului /service: cu Stripe configurat → sesiune de plată;
// fără Stripe (mod lansare) → deblocare directă, ca site-ul să nu stea blocat.
// Emailul clientului e cerut la deblocare — pe el pleacă linkul raportului
// (în TOATE fluxurile: Stripe, VIP, lansare) și cu el intră în /cont.

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getServiceReport, markServiceReportPaid, setServiceReportEmail } from "@/lib/service-reports";
import { createReportCheckoutSession, stripeEnabled, reportPriceRon } from "@/lib/stripe";
import { getPartner } from "@/lib/partners";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { siteConfig, publicOrigin } from "@/lib/site";

// Prețul cu reducere de recomandare (link de afiliere al unui client)
const REF_PRICE_RON = 249;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

async function emailReportLink(to: string, companyName: string, reportUrl: string) {
  await sendSimpleEmail({
    to,
    subject: `Raportul tău pentru ${companyName} e deblocat — Imperial Media`,
    html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
      <h2 style="margin:0 0 12px;">Raportul tău e gata 🎉</h2>
      <p>Îl găsești oricând aici (link permanent):</p>
      <p><a href="${reportUrl}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Deschide raportul complet</a></p>
      <p>Ai și un <b>cont</b> cu toate rapoartele, notificările de monitorizare și consultantul tău dedicat:
      <a href="${siteConfig.url}/cont">${siteConfig.url}/cont</a> — intri cu emailul ăsta, fără parolă.</p>
      <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
    </div>`,
  });
}

export async function POST(req: Request) {
  if (!rateLimit(`service-checkout:${getClientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări. Revino în câteva minute." }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const token = String(body?.token ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ error: "Token invalid." }, { status: 400 });
  }
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Lasă un email valid — pe el primești raportul." }, { status: 400 });
  }

  let row;
  try {
    row = await getServiceReport(token);
  } catch (e) {
    console.error("[service-checkout] DB read failed:", e);
    return NextResponse.json({ error: "Eroare temporară. Încearcă din nou." }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "Raportul nu există sau a expirat." }, { status: 404 });
  }

  // Legăm emailul de raport din prima — pentru /cont, monitorizare și follow-up.
  try {
    await setServiceReportEmail(token, email);
  } catch (e) {
    console.error("[service-checkout] email attach failed:", e);
  }

  const origin = publicOrigin(req);
  const reportPath = `/service/raport/${token}`;
  const reportUrl = `${siteConfig.url}${reportPath}`;

  if (row.paid) {
    return NextResponse.json({ url: reportPath });
  }

  // Reduceri: partener (ex: Bizz Club) sau link de recomandare — se aplică cea mai bună.
  // Codurile sunt luate din raportul salvat (au venit din URL la generare), nu din client.
  const fd = row.form_data ?? {};
  const partner = getPartner(fd.partner);
  const hasRef = /^[a-z0-9]{4,16}$/i.test(String(fd.ref ?? ""));
  let priceRon = reportPriceRon();
  let labelSuffix = "";
  if (partner && partner.priceRon < priceRon) {
    priceRon = partner.priceRon;
    labelSuffix = ` (reducere ${partner.label})`;
  } else if (hasRef && REF_PRICE_RON < priceRon) {
    priceRon = REF_PRICE_RON;
    labelSuffix = " (reducere recomandare)";
  }

  // Invitație VIP (preț 0) → deblocare directă, fără plată.
  // Proprietarul e notificat la FIECARE deblocare VIP — dacă linkul scapă în public,
  // se vede imediat din volumul de emailuri (și codul se schimbă dintr-o linie).
  if (priceRon <= 0) {
    try {
      await markServiceReportPaid(token, email);
    } catch (e) {
      console.error("[service-checkout] VIP unlock failed:", e);
      return NextResponse.json({ error: "Eroare temporară. Încearcă din nou." }, { status: 500 });
    }
    try {
      await emailReportLink(email, fd.companyName ?? "firma ta", reportUrl);
    } catch (e) {
      console.error("[service-checkout] VIP client email failed:", e);
    }
    try {
      await sendSimpleEmail({
        to: ownerEmail(),
        subject: `⭐ Deblocare VIP — ${fd.companyName ?? "?"} (${fd.city ?? "?"})`,
        html: `<p>Raport deblocat GRATUIT prin linkul de invitație VIP:<br/>
          <b>${fd.companyName ?? "?"}</b> · ${fd.city ?? "?"} · ${fd.industry ?? "?"} · ${email}<br/>
          <a href="${origin}${reportPath}">Vezi raportul</a></p>
          <p style="color:#666;font-size:13px;">Dacă primești multe astfel de emailuri de la necunoscuți, linkul VIP a scăpat — schimbăm codul.</p>`,
        replyTo: email,
      });
    } catch (e) {
      console.error("[service-checkout] VIP notify failed:", e);
    }
    return NextResponse.json({ url: reportPath, vip: true });
  }

  if (stripeEnabled()) {
    try {
      const { url } = await createReportCheckoutSession({
        token,
        origin,
        priceRon,
        labelSuffix,
        customerEmail: email,
      });
      return NextResponse.json({ url });
    } catch (e) {
      console.error("[service-checkout] Stripe failed:", e);
      return NextResponse.json({ error: "Plata e temporar indisponibilă. Încearcă din nou." }, { status: 502 });
    }
  }

  // Mod lansare: fără Stripe, raportul se deblochează gratuit — emailul pleacă și aici.
  try {
    await markServiceReportPaid(token, email);
  } catch (e) {
    console.error("[service-checkout] launch unlock failed:", e);
    return NextResponse.json({ error: "Eroare temporară. Încearcă din nou." }, { status: 500 });
  }
  try {
    await emailReportLink(email, fd.companyName ?? "firma ta", reportUrl);
  } catch (e) {
    console.error("[service-checkout] launch client email failed:", e);
  }
  return NextResponse.json({ url: reportPath, launchMode: true });
}
