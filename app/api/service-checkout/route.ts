// Deblocarea raportului /service: cu Stripe configurat → sesiune de plată;
// fără Stripe (mod lansare) → deblocare directă, ca site-ul să nu stea blocat.

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getServiceReport, markServiceReportPaid } from "@/lib/service-reports";
import { createReportCheckoutSession, stripeEnabled, reportPriceRon } from "@/lib/stripe";
import { getPartner } from "@/lib/partners";

// Prețul cu reducere de recomandare (link de afiliere al unui client)
const REF_PRICE_RON = 249;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const reportUrl = `/service/raport/${token}`;
  if (row.paid) {
    return NextResponse.json({ url: reportUrl });
  }

  if (stripeEnabled()) {
    try {
      const origin = new URL(req.url).origin;
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
      const { url } = await createReportCheckoutSession({ token, origin, priceRon, labelSuffix });
      return NextResponse.json({ url });
    } catch (e) {
      console.error("[service-checkout] Stripe failed:", e);
      return NextResponse.json({ error: "Plata e temporar indisponibilă. Încearcă din nou." }, { status: 502 });
    }
  }

  // Mod lansare: fără Stripe, raportul se deblochează gratuit.
  try {
    await markServiceReportPaid(token);
  } catch (e) {
    console.error("[service-checkout] launch unlock failed:", e);
    return NextResponse.json({ error: "Eroare temporară. Încearcă din nou." }, { status: 500 });
  }
  return NextResponse.json({ url: reportUrl, launchMode: true });
}
