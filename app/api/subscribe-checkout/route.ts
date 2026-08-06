// Activarea abonamentului de monitorizare — self-service, din contul clientului.
// Cu Stripe configurat → sesiune de plată recurentă; fără → înregistrăm cererea
// ca lead (mod lansare, îl contactează proprietarul).

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getClientEmail } from "@/lib/client-auth";
import { createSubscriptionCheckoutSession, stripeEnabled } from "@/lib/stripe";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`subscribe:${getClientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări." }, { status: 429 });
  }

  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  if (!email) {
    return NextResponse.json({ error: "Intră întâi în contul tău." }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const plan: "lunar" | "anual" = body?.plan === "anual" ? "anual" : "lunar";

  if (stripeEnabled()) {
    try {
      const origin = new URL(req.url).origin;
      const { url } = await createSubscriptionCheckoutSession({ email, origin, plan });
      return NextResponse.json({ url });
    } catch (e) {
      console.error("[subscribe-checkout] Stripe failed:", e);
      return NextResponse.json({ error: "Plata e temporar indisponibilă." }, { status: 502 });
    }
  }

  // Mod lansare: fără Stripe — cererea ajunge în admin (DB) ȘI pe emailul proprietarului,
  // ca să nu se piardă niciodată în tăcere.
  let recorded = false;
  if (hasDb()) {
    try {
      await insertBrief({
        name: email,
        email,
        selected_package: "ABONAMENT (cerere)",
        message: `Vrea abonamentul de monitorizare (${plan}) — activare manuală până se configurează Stripe.`,
        source: "abonament-interes",
      });
      recorded = true;
    } catch (e) {
      console.error("[subscribe-checkout] lead insert failed:", e);
    }
  }
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `🔄 Cerere abonament (${plan}) — ${email}`,
      html: `<p><b>${email}</b> vrea abonamentul de monitorizare (<b>${plan}</b>). Activare manuală până se configurează Stripe.</p>`,
      replyTo: email,
    });
    recorded = true;
  } catch (e) {
    console.error("[subscribe-checkout] owner email failed:", e);
  }
  if (!recorded) {
    return NextResponse.json({ error: "Nu am putut înregistra cererea. Încearcă din nou." }, { status: 500 });
  }
  return NextResponse.json({ launchMode: true });
}
