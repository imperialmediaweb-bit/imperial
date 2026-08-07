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
    // Idempotență vs UPGRADE: relivrarea aceluiași eveniment are ACELAȘI subscription id
    // → duplicat, ieșim. Un id NOU la un abonat deja activ înseamnă upgrade/schimbare de plan
    // → anulăm vechiul abonament Stripe (să nu plătească două în paralel) și continuăm normal.
    let upgradeNote = "";
    if (email && session.subscription) {
      const { getSubscription } = await import("@/lib/subscribers");
      const cur = await getSubscription(email).catch(() => null);
      if (cur?.active) {
        if (cur.stripe_subscription_id === String(session.subscription)) {
          return NextResponse.json({ received: true, duplicate: true });
        }
        if (cur.stripe_subscription_id) {
          const { cancelStripeSubscription } = await import("@/lib/stripe");
          const cancelled = await cancelStripeSubscription(cur.stripe_subscription_id);
          upgradeNote = cancelled
            ? `<p>🔁 UPGRADE de la planul „${cur.plan ?? "?"}" — vechiul abonament Stripe a fost ANULAT automat.</p>`
            : `<p>⚠️ UPGRADE de la planul „${cur.plan ?? "?"}" — anularea vechiului abonament Stripe A EȘUAT: anulează-l MANUAL din Stripe (${cur.stripe_subscription_id}), altfel clientul plătește dublu!</p>`;
        }
      }
    }
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
        productName: plan.startsWith("premium")
          ? `Abonament premium monitorizare & social media Imperial Media (${plan})`
          : `Abonament monitorizare afacere Imperial Media (${plan})`,
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
          <h2>✅ Abonament activat automat</h2>
          <p><b>Email:</b> ${email} · <b>Plan:</b> ${plan} · <b>Suma:</b> ${amount}</p>
          ${upgradeNote}${billingBlock}${invoiceNote}
          <p>Monitorizarea lunară îl include automat de la următoarea scanare. Nimic de făcut.</p>
        </div>`,
      });
    } catch (e) {
      console.error("[stripe-webhook] owner email failed:", e);
    }
    return NextResponse.json({ received: true });
  }

  // ═══ PACHET START ONLINE (comandat prin consultant) ═══
  if (session.metadata?.purpose === "start-online") {
    const startEmail = billing.email ?? "";
    // Idempotență: lead-ul plății conține id-ul sesiunii Stripe. Îl scriem ÎNAINTE de
    // factură/emailuri — dacă marcajul nu poate fi scris, dăm 500 și Stripe reîncearcă,
    // ca să nu riscăm două facturi fiscale la o relivrare de webhook.
    if (hasDb()) {
      try {
        const { getPool } = await import("@/lib/db");
        const dup = await getPool()!.query(`SELECT 1 FROM briefs WHERE message LIKE $1 LIMIT 1`, [
          `%${session.id}%`,
        ]);
        if (dup.rows[0]) return NextResponse.json({ received: true, duplicate: true });
        await insertBrief({
          name: billing.firmName || startEmail || "necunoscut",
          email: startEmail || "necunoscut@plata-stripe.ro",
          selected_package: "Pachet Start Online — PLĂTIT",
          industry: "",
          message: `✅ A PLĂTIT Pachetul Start Online (${amount}). Facturare: ${billing.firmName || "—"} / CUI ${billing.cui || "—"}. DE FĂCUT: creează paginile (datele în lead-ul consultantului, pozele în Cloudinary), apoi livrează din /admin/rapoarte. [stripe:${session.id}]`,
          source: "start-online-paid",
        });
      } catch (e) {
        console.error("[stripe-webhook] start idempotency/lead failed:", e);
        return NextResponse.json({ error: "db error" }, { status: 500 });
      }
    }

    let invoiceNote = "";
    if (invoicingEnabled()) {
      const inv = await issueInvoice({
        client: { name: billing.firmName, cif: billing.cui, address: billing.address, city: billing.city, email: startEmail },
        productName: "Servicii creare și optimizare prezență online (profil Google Business + pagină Facebook)",
        priceRon: amountRon,
      });
      invoiceNote = inv.issued
        ? `<p>✅ Factura a fost emisă și trimisă AUTOMAT prin StartCo.</p>`
        : `<p>⚠️ Emiterea automată a facturii a eșuat — emite manual.</p>`;
    } else {
      invoiceNote = `<p>🧾 Emite factura manual (StartCo neconfigurat).</p>`;
    }

    try {
      await sendSimpleEmail({
        to: ownerEmail(),
        subject: `💰 START ONLINE PLĂTIT (${amount}) — ${billing.firmName || startEmail}`,
        html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
          <h2>✅ Pachet Start Online plătit — ${amount}</h2>
          <p><b>Client:</b> ${startEmail || "necunoscut"}</p>
          ${billingBlock}${invoiceNote}
          <p style="background:#fff3e6;border:1px solid #ffc999;border-radius:8px;padding:12px;">
            🛠️ <b>DE FĂCUT:</b> creează profilul Google Business + pagina de Facebook.
            Datele comenzii (denumire, program, Gmail, profil FB, logo) sunt în lead-ul trimis de consultant,
            pozele în Cloudinary. La final: /admin/rapoarte → „Livrează pagini create".
          </p>
        </div>`,
        replyTo: startEmail || undefined,
      });
    } catch (e) {
      console.error("[stripe-webhook] start owner email failed:", e);
    }

    if (startEmail) {
      try {
        await sendSimpleEmail({
          to: startEmail,
          subject: "🚀 Comanda ta e confirmată — Pachet Start Online",
          html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
            <h2 style="margin:0 0 12px;">Plata a reușit — ne apucăm de treabă! 🚀</h2>
            <p>Îți creăm profilul Google Business + pagina de Facebook, cu design și optimizare completă.</p>
            <p><b>Ce ne ajută să mergem repede:</b> dacă nu ai apucat, urcă pozele firmei (local, produse, echipă)
            din contul tău — cardul „📸 Trimite-ne poze": <a href="${siteConfig.url}/cont">${siteConfig.url}/cont</a></p>
            <p>Livrarea durează de regulă câteva zile — primești totul pe email + în cont, cu linkurile și accesul TĂU de proprietar. Fără telefoane.</p>
            <p style="color:#666;font-size:13px;">Factura fiscală sosește separat pe email.<br/>Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
          </div>`,
        });
      } catch (e) {
        console.error("[stripe-webhook] start client email failed:", e);
      }
    }

    // Comanda apare și în contul clientului — statusul „în lucru"
    if (startEmail) {
      const { insertNotification } = await import("@/lib/monitoring");
      insertNotification(
        startEmail,
        "order",
        "🚀 Comanda ta Start Online e confirmată — în lucru",
        `Plata (${amount}) a intrat, factura sosește pe email. Creăm profilul Google Business + pagina de Facebook. Dacă nu ai apucat, urcă pozele firmei din cardul „📸 Trimite-ne poze”.`
      ).catch(() => {});
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

  // IDEMPOTENȚĂ: Stripe livrează „at-least-once" — la retry/duplicat, raportul e deja
  // plătit și NU mai emitem încă o factură / încă un rând de emailuri.
  const existing = await getServiceReport(token).catch(() => null);
  if (existing?.paid) {
    return NextResponse.json({ received: true, duplicate: true });
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
      productName: "Radiografia afacerii + promovare în 50 de ziare online (rețeaua Media Expres)",
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
          🗞️ <b>DE FĂCUT:</b> publică articolul de promovare în TOATE cele 50 de ziare din rețeaua Media Expres (campania completă, 300€) — e inclusă în ce a plătit.
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
          <p>În următoarele zile publicăm și <b>articolul de promovare despre afacerea ta în cele 50 de ziare online din rețeaua Media Expres</b> (pachetul de publicare de 300€ — inclus). Primești linkurile pe acest email.</p>
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
        message: `✅ A PLĂTIT auditul (${amount}). Facturare: ${billing.firmName || "—"} / CUI ${billing.cui || "—"}. DE FĂCUT: campania de promovare în cele 50 de ziare (Media Expres).\nRaport: ${reportUrl}`,
        source: "service-report-paid",
      });
    } catch (e) {
      console.error("[stripe-webhook] lead insert failed:", e);
    }
  }

  return NextResponse.json({ received: true });
}
