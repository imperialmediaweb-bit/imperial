// Login clienți /cont: primește emailul, trimite link magic dacă există rapoarte.
// Răspunde mereu ok (fără user enumeration).

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getServiceReportsByEmail } from "@/lib/service-reports";
import { buildMagicToken } from "@/lib/client-auth";
import { sendSimpleEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  if (!rateLimit(`cont-login:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încercări. Revino în câteva minute." }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Email invalid." }, { status: 400 });
  }

  try {
    const reports = await getServiceReportsByEmail(email);
    if (reports.length > 0) {
      const token = buildMagicToken(email);
      const link = `${siteConfig.url}/api/cont/session?t=${encodeURIComponent(token)}`;
      await sendSimpleEmail({
        to: email,
        subject: "Linkul tău de acces — Contul Imperial Media",
        html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
          <h2 style="margin:0 0 12px;">Intră în contul tău</h2>
          <p>Apasă butonul de mai jos ca să intri în contul tău Imperial Media — rapoartele, evoluția și notificările afacerii tale:</p>
          <p><a href="${link}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Intră în cont</a></p>
          <p style="color:#666;font-size:13px;">Linkul e valabil 30 de minute. Dacă nu ai cerut tu accesul, ignoră emailul.</p>
        </div>`,
      });
    }
  } catch (e) {
    console.error("[cont/login] failed:", e);
    // Nu divulgăm nimic — răspunsul rămâne ok.
  }

  return NextResponse.json({ ok: true });
}
