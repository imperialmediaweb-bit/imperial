// Webhook Stripe: la plata reușită deblochează raportul, notifică proprietarul
// („trimite promovarea în 50 ziare") și trimite clientului linkul raportului.

import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { markServiceReportPaid, getServiceReport } from "@/lib/service-reports";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { insertBrief } from "@/lib/briefs";
import { hasDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!verifyStripeSignature(rawBody, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  if (event?.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data?.object ?? {};
  const token = String(session.client_reference_id ?? "").trim();
  const email = String(session.customer_details?.email ?? "").trim() || undefined;

  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    console.error("[stripe-webhook] missing/invalid client_reference_id");
    return NextResponse.json({ received: true });
  }

  try {
    await markServiceReportPaid(token, email);
  } catch (e) {
    // 500 → Stripe reîncearcă livrarea webhook-ului
    console.error("[stripe-webhook] markPaid failed:", e);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  const row = await getServiceReport(token).catch(() => null);
  const companyName = row?.form_data?.companyName ?? "necunoscut";
  const city = row?.form_data?.city ?? "";
  const reportUrl = `${siteConfig.url}/service/raport/${token}`;
  const amount = session.amount_total ? `${(session.amount_total / 100).toFixed(0)} ${String(session.currency ?? "ron").toUpperCase()}` : "—";

  // Emailurile nu blochează confirmarea către Stripe.
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `💰 AUDIT PLĂTIT (${amount}) — ${companyName}`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
        <h2 style="margin:0 0 12px;">✅ Audit plătit — ${amount}</h2>
        <p><b>Firma:</b> ${companyName}${city ? ` (${city})` : ""}<br/>
        <b>Email client:</b> ${email ?? "necunoscut"}<br/>
        <b>Raport:</b> <a href="${reportUrl}">${reportUrl}</a></p>
        <p style="background:#fff3e6;border:1px solid #ffc999;border-radius:8px;padding:12px;">
          🗞️ <b>DE FĂCUT:</b> trimite promovarea în cele 50 de ziare online (rețeaua Media Expres) — e inclusă în ce a plătit.
        </p>
      </div>`,
      replyTo: email,
    });
  } catch (e) {
    console.error("[stripe-webhook] owner email failed:", e);
  }

  if (email) {
    try {
      await sendSimpleEmail({
        to: email,
        subject: "Raportul tău complet e gata — Imperial Media",
        html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
          <h2 style="margin:0 0 12px;">Mulțumim! Raportul tău e deblocat 🎉</h2>
          <p>Îl găsești oricând aici:</p>
          <p><a href="${reportUrl}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Vezi raportul complet</a></p>
          <p>În următoarele zile pornim și <b>promovarea afacerii tale în 50 de ziare online</b> (inclusă). Te contactăm pe acest email pentru detalii.</p>
          <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
        </div>`,
      });
    } catch (e) {
      console.error("[stripe-webhook] client email failed:", e);
    }
  }

  if (hasDb()) {
    try {
      await insertBrief({
        name: companyName,
        email: email ?? "necunoscut@plata-stripe.ro",
        selected_package: "AUDIT PLĂTIT",
        industry: row?.form_data?.industry ?? "",
        message: `✅ A PLĂTIT auditul (${amount}). DE FĂCUT: promovarea în 50 ziare online.\nRaport: ${reportUrl}`,
        source: "service-report-paid",
      });
    } catch (e) {
      console.error("[stripe-webhook] lead insert failed:", e);
    }
  }

  return NextResponse.json({ received: true });
}
