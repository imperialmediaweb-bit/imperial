// Integrare Stripe minimală, fără SDK: Checkout Session prin REST API
// + verificarea semnăturii de webhook cu HMAC. Cheile vin din env:
//   STRIPE_SECRET_KEY      — sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET  — whsec_... (din dashboard, la endpoint-ul de webhook)
//   SERVICE_REPORT_PRICE_RON — opțional, default 199

import { createHmac, timingSafeEqual } from "crypto";

export function stripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function reportPriceRon(): number {
  const v = Number(process.env.SERVICE_REPORT_PRICE_RON);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : 299;
}

export async function createReportCheckoutSession(opts: {
  token: string;
  origin: string;
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
    "line_items[0][price_data][unit_amount]": String(reportPriceRon() * 100),
    "line_items[0][price_data][product_data][name]":
      "Audit complet de afaceri + promovare în 50 de ziare online",
    "line_items[0][price_data][product_data][description]":
      "Raport de consultanță Imperial Media (valoare 299€) + promovare în rețeaua Media Expres (valoare 300€)",
  });

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
