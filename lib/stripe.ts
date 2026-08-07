// Integrare Stripe minimală, fără SDK: Checkout Session prin REST API
// + verificarea semnăturii de webhook cu HMAC. Cheile vin din env:
//   STRIPE_SECRET_KEY      — sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET  — whsec_... (din dashboard, la endpoint-ul de webhook)
//   SERVICE_REPORT_PRICE_RON — opțional, default 299

import { createHmac, timingSafeEqual } from "crypto";

export function stripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function reportPriceRon(): number {
  const v = Number(process.env.SERVICE_REPORT_PRICE_RON);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : 299;
}

// Date de facturare cerute la orice plată: adresă + denumire firmă + CUI.
// Ajung în webhook (custom_fields + customer_details) → emailul către proprietar
// conține tot ce trebuie pentru emiterea facturii.
function billingParams(params: URLSearchParams) {
  params.set("billing_address_collection", "required");
  params.set("custom_fields[0][key]", "firma");
  params.set("custom_fields[0][label][type]", "custom");
  params.set("custom_fields[0][label][custom]", "Denumire firmă (pentru factură)");
  params.set("custom_fields[0][type]", "text");
  params.set("custom_fields[1][key]", "cui");
  params.set("custom_fields[1][label][type]", "custom");
  params.set("custom_fields[1][label][custom]", "CUI / CIF (pentru factură)");
  params.set("custom_fields[1][type]", "text");
  params.set("custom_fields[1][optional]", "true");
}

export async function createReportCheckoutSession(opts: {
  token: string;
  origin: string;
  priceRon?: number;
  labelSuffix?: string;
  customerEmail?: string;
}): Promise<{ url: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");

  const params = new URLSearchParams({
    mode: "payment",
    client_reference_id: opts.token,
    success_url: `${opts.origin}/service/raport/${opts.token}?platit=1`,
    cancel_url: `${opts.origin}/service?anulat=1`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "ron",
    "line_items[0][price_data][unit_amount]": String((opts.priceRon ?? reportPriceRon()) * 100),
    "line_items[0][price_data][product_data][name]":
      `Radiografia afacerii + promovare în 50 de ziare online${opts.labelSuffix ?? ""}`,
    "line_items[0][price_data][product_data][description]":
      "Raport de consultanță Imperial Media pe date oficiale + articol de promovare publicat în 50 de ziare online — rețeaua Media Expres (pachet de publicare în valoare de 300€)",
  });
  if (opts.customerEmail) params.set("customer_email", opts.customerEmail);
  billingParams(params);

  return createSession(key, params);
}

// Abonamentul de monitorizare — plată recurentă self-service (lunar 99 / anual 990).
export async function createSubscriptionCheckoutSession(opts: {
  email: string;
  origin: string;
  plan: "lunar" | "anual";
}): Promise<{ url: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");

  const monthly = opts.plan !== "anual";
  const params = new URLSearchParams({
    mode: "subscription",
    client_reference_id: opts.email,
    customer_email: opts.email,
    "metadata[plan]": opts.plan,
    success_url: `${opts.origin}/cont?abonat=1`,
    cancel_url: `${opts.origin}/cont`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "ron",
    "line_items[0][price_data][unit_amount]": String((monthly ? 99 : 990) * 100),
    "line_items[0][price_data][recurring][interval]": monthly ? "month" : "year",
    "line_items[0][price_data][product_data][name]":
      `Monitorizare afacere Imperial Media (${monthly ? "lunar" : "anual — 2 luni gratis"})`,
    "line_items[0][price_data][product_data][description]":
      "Raport regenerat automat în fiecare lună + notificări (recenzii, competitori, site) + sfaturile lunii + consultant dedicat în cont",
  });
  billingParams(params);

  return createSession(key, params);
}

async function createSession(key: string, params: URLSearchParams): Promise<{ url: string }> {
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json();
  if (!res.ok || !data?.url) {
    throw new Error(`Stripe checkout failed: ${data?.error?.message ?? res.status}`);
  }
  return { url: String(data.url) };
}

// Verifică semnătura "Stripe-Signature: t=...,v1=..." pe body-ul RAW.
export function verifyStripeSignature(
  rawBody: string,
  sigHeader: string | null,
  toleranceSec = 300
): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !sigHeader) return false;

  const parts = new Map<string, string[]>();
  for (const kv of sigHeader.split(",")) {
    const [k, v] = kv.split("=", 2);
    if (!k || !v) continue;
    const arr = parts.get(k.trim()) ?? [];
    arr.push(v.trim());
    parts.set(k.trim(), arr);
  }
  const t = parts.get("t")?.[0];
  const v1s = parts.get("v1") ?? [];
  if (!t || v1s.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(t));
  if (!Number.isFinite(age) || age > toleranceSec) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  return v1s.some((v1) => {
    const got = Buffer.from(v1, "utf8");
    return got.length === expectedBuf.length && timingSafeEqual(got, expectedBuf);
  });
}
