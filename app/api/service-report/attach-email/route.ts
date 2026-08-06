// Leagă emailul lăsat de user de raportul lui (dacă raportul nu are deja email).
// Necesar ca raportul să-i apară în /cont — mai ales în modul de lansare fără Stripe.

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { setServiceReportEmail } from "@/lib/service-reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  if (!rateLimit(`attach-email:${getClientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ ok: true });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const token = String(body?.token ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!/^[0-9a-f-]{36}$/i.test(token) || !isEmail(email)) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  try {
    await setServiceReportEmail(token, email);
  } catch (e) {
    console.error("[attach-email] failed:", e);
  }
  return NextResponse.json({ ok: true });
}
