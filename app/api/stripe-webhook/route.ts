// Webhook Stripe — inima automatizării, zero intervenție umană:
// · plată audit → deblochează raportul, emite factura AUTOMAT (StartCo, dacă e configurat),
//   email client cu linkul, email proprietar cu datele de facturare + reminder articol local
// · abonament monitorizare → activează abonatul automat + factură + notificări
// · anulare abonament → dezactivare automată

import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { markServiceReportPaid, getServiceReport } from "@/lib/service-reports";
import { upsertSubscriber, deactivateBySubscriptionId } from "@/lib/subscribers";
import { issueInvoice, invoicingEnabled } from "@/lib/invoicing";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { insertBrief } from "@/lib/briefs";
import { hasDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Datele de facturare culese de Stripe Checkout (custom_fields + adresă)
function extractBilling(session: any) {
  const fields: any[] = session.custom_fields ?? [];
  const get = (key: string) =>
    String(fields.find((f) => f?.key === key)?.text?.value ?? "").trim();
  const addr = session.customer_details?.address ?? {};
  return {
    firmName: get("firma") || String(session.customer_details?.name ?? ""),
    cui: get("cui"),
    address: [addr.line1, addr.line2].filter(Boolean).join(", "),
    city: String(addr.city ?? ""),
    email: String(session.customer_details?.email ?? "").trim() || undefined,
  };
}

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

  // ─── Anulare abonament → dezactivare automată ───
  if (event?.type === "customer.subscription.deleted") {
    const subId = String(event.data?.object?.id ?? "");
    if (subId) {
      try {
        await deactivateBySubscriptionId(subId);
      } catch (e) {
        console.error("[stripe-webhook] deactivate failed:", e);
        return NextResponse.json({ error: "db error" }, { status: 500 });
      }
    }
    return NextResponse.json({ received: true });
  }

  if (event?.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data?.object ?? {};
  const billing = extractBilling(session);
  const amountRon = session.amount_total ? session.amount_total / 100 : 0;
  const amount = amountRon ? `${amountRon.toFixed(0)} ${String(session.currency ?? "ron").toUpperCase()}` : "—";

  const billingBlock = `<p style="background:#eef4ff;border:1px solid #bcd0f7;border-radius:8px;padding:12px;">
    🧾 <b>Date facturare:</b> ${billing.firmName || "—"} · CUI: ${billing.cui || "— (persoană fizică)"}<br/>
    ${billing.address || ""} ${billing.city || ""} · ${billing.email ?? "—"}</p>`;

  // ═══ ABONAMENT monitorizare ═══
  if (session.mode === "subscription") {
    const email = billing.email ?? String(session.client_reference_id ?? "");
    const plan = String(session.metadata?.plan ?? "lunar");
    if (email) {
      try {
        await upsertSubscriber({
          email,
          plan,
          stripeSubscriptionId: String(session.subscription ?? "") || undefined,
        });
      } catch (e) {
        console.error("[stripe-webhook] subscriber upsert failed:", e);
        return NextResponse.json({ error: "db error" }, { status: 500 });
      }
    }

    let invoiceNote = "";
    if (invoicingEnabled()) {
      const inv = await issueInvoice({
        client: { name: billing.firmName, cif: billing.cui, address: billing.address, city: billing.city, email },
        productName: `Abonament monitorizare afacere Imperial Media (${plan})`,
        priceRon: amountRon,
      });
      invoiceNote = inv.issued
        ? `<p>✅ Factura a fost emisă și trimisă AUTOMAT prin StartCo.</p>`
        : `<p>⚠️ Emiterea automată a facturii a eșuat — emite manual.</p>`;
    } else {
      invoiceNote = `<p>🧾 Emite factura manual (StartCo neconfigurat — pune STARTCO_TOKEN + STARTCO_SERIES).</p>`;
    }

    try {
      await sendSimpleEmail({
        to: ownerEmail(),
        subject: `🔄 ABONAMENT NOU (${amount}/${plan}) — ${billing.firmName || email}`,
        html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
          <h2>✅ Abonament monitorizare activat automat</h2>
          <p><b>Email:</b> ${email} · <b>Plan:</b> ${plan} · <b>Suma:</b> ${amount}</p>
          ${billingBlock}${invoiceNote}
          <p>Monitorizarea lunară îl include automat de la următoarea scanare. Nimic de făcut.</p>
        </div>`,
      });
    } catch (e) {
      console.error("[stripe-webhook] owner email failed:", e);
    }
    return NextResponse.json({ received: true });
  }

  // ═══ PLATĂ AUDIT ═══
  const token = String(session.client_reference_id ?? "").trim();
  const email = billing.email;

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
  const companyName = row?.form_data?.companyName ?? billing.firmName ?? "necunoscut";
  const city = row?.form_data?.city ?? billing.city ?? "";
  const reportUrl = `${siteConfig.url}/service/raport/${token}`;

  // Factura — automată dacă StartCo e configurat
  let invoiceNote = "";
  if (invoicingEnabled()) {
    const inv = await issueInvoice({
      client: { name: billing.firmName || companyName, cif: billing.cui, address: billing.address, city: billing.city, email },
      productName: "Audit complet de afaceri + articol de promovare în presa locală",
      priceRon: amountRon,
    });
    invoiceNote = inv.issued
      ? `<p>✅ Factura a fost emisă și trimisă AUTOMAT prin StartCo.</p>`
      : `<p>⚠️ Emiterea automată a facturii a eșuat — emite manual.</p>`;
  } else {
    invoiceNote = `<p>🧾 Emite factura manual (StartCo neconfigurat — pune STARTCO_TOKEN + STARTCO_SERIES).</p>`;
  }

  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `💰 AUDIT PLĂTIT (${amount}) — ${companyName}`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
        <h2 style="margin:0 0 12px;">✅ Audit plătit — ${amount}</h2>
        <p><b>Firma:</b> ${companyName}${city ? ` (${city})` : ""}<br/>
        <b>Email client:</b> ${email ?? "necunoscut"}<br/>
        <b>Raport:</b> <a href="${reportUrl}">${reportUrl}</a></p>
        ${billingBlock}${invoiceNote}
        <p style="background:#fff3e6;border:1px solid #ffc999;border-radius:8px;padding:12px;">
          🗞️ <b>DE FĂCUT:</b> publică articolul de promovare în ziarele din ${city || "zona lui"} (rețeaua Media Expres) — e inclus în ce a plătit.
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
          <p>În următoarele zile publicăm și <b>articolul de promovare despre afacerea ta în presa online din zona ta</b> (inclus). Primești linkurile pe acest email.</p>
          <p>Ai și un <b>cont</b> cu toate rapoartele și notificările tale de monitorizare: <a href="${siteConfig.url}/cont">${siteConfig.url}/cont</a> — intri cu emailul ăsta, fără parolă.</p>
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
        message: `✅ A PLĂTIT auditul (${amount}). Facturare: ${billing.firmName || "—"} / CUI ${billing.cui || "—"}. DE FĂCUT: articolul de promovare în presa din ${city || "zona lui"}.\nRaport: ${reportUrl}`,
        source: "service-report-paid",
      });
    } catch (e) {
      console.error("[stripe-webhook] lead insert failed:", e);
    }
  }

  return NextResponse.json({ received: true });
}
