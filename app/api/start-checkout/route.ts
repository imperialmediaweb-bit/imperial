// Plata Pachetului Start Online (500 lei) — consultantul trimite clientul aici după comandă.
// Cu Stripe configurat → plată cu cardul + factură automată prin webhook.
// Fără Stripe (mod lansare) → cererea se înregistrează și proprietarul e anunțat.

import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/site";
import { createStartCheckoutSession, stripeEnabled, startPriceRon } from "@/lib/stripe";
import { getClientEmail } from "@/lib/client-auth";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { hasDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req: Request) {
  if (!rateLimit(`start-checkout:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări — așteaptă un minut." }, { status: 429 });
  }

  let sessionEmail: string | null = null;
  try {
    sessionEmail = getClientEmail();
  } catch {
    sessionEmail = null;
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const bodyEmail = String(body?.email ?? "").trim().toLowerCase();
  const email = sessionEmail ?? (isEmail(bodyEmail) ? bodyEmail : null);

  if (!email) {
    return NextResponse.json(
      { error: "Lasă un email valid — pe el primești confirmarea și paginile." },
      { status: 400 }
    );
  }

  const origin = publicOrigin(req);

  if (stripeEnabled()) {
    try {
      const { url } = await createStartCheckoutSession({ origin, email });
      return NextResponse.json({ url });
    } catch (e: any) {
      console.error("[start-checkout] stripe failed:", e);
      return NextResponse.json(
        { error: "Plata online nu e disponibilă momentan — scrie-ne la office@imperial-media.ro." },
        { status: 500 }
      );
    }
  }

  // Mod lansare: fără Stripe — înregistrăm cererea și anunțăm proprietarul
  let recorded = false;
  if (hasDb()) {
    try {
      await insertBrief({
        name: email,
        email,
        selected_package: "Pachet Start Online 500 lei",
        industry: "",
        message: `Cerere Pachet Start Online (fără plată online — Stripe neconfigurat). De facturat manual ${startPriceRon()} lei.`,
        source: "start-online-cerere",
      });
      recorded = true;
    } catch (e) {
      console.error("[start-checkout] lead insert failed:", e);
    }
  }
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `🚀 CERERE Pachet Start Online — ${email}`,
      html: `<p><b>${email}</b> vrea Pachetul Start Online (${startPriceRon()} lei). Stripe nu e configurat — facturezi manual. Detaliile comenzii sunt în lead-ul trimis de consultant.</p>`,
      replyTo: email,
    });
    recorded = true;
  } catch (e) {
    console.error("[start-checkout] owner email failed:", e);
  }
  if (!recorded) {
    return NextResponse.json(
      { error: "Nu am putut înregistra cererea — scrie-ne la office@imperial-media.ro." },
      { status: 500 }
    );
  }
  // Comanda apare și în contul clientului
  const { insertNotification } = await import("@/lib/monitoring");
  insertNotification(
    email,
    "order",
    "🚀 Comanda ta Start Online e înregistrată",
    "Îți trimitem pe email factura și pașii următori. Între timp poți urca pozele firmei din cardul „📸 Trimite-ne poze”."
  ).catch(() => {});
  return NextResponse.json({
    ok: true,
    offline: true,
    mesaj: "Comanda ta e înregistrată! Te contactăm pe email cu factura și pașii următori — fără telefoane.",
  });
}
