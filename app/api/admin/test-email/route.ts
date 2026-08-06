// Tester de email pentru diagnoză — protejat cu sesiunea de admin.
// Deschizi /api/admin/test-email în browser (logat în /admin) și vezi pe loc:
// pleacă emailul sau ce eroare exactă dă Resend.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const to = (searchParams.get("to") ?? ownerEmail()).trim();

  const diagnostics = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? `setat (${process.env.RESEND_API_KEY.slice(0, 8)}…)` : "❌ LIPSEȘTE",
    FROM_EMAIL: process.env.FROM_EMAIL ?? "(default) Imperial Media <noreply@imperial-media.ro>",
    LEAD_EMAIL: process.env.LEAD_EMAIL ?? "(default din siteConfig)",
    trimit_catre: to,
  };

  try {
    await sendSimpleEmail({
      to,
      subject: "✅ Test email — Imperial Media",
      html: `<p>Dacă citești asta, trimiterea emailurilor funcționează.<br/>Trimis la ${new Date().toISOString()}.</p>`,
    });
    return NextResponse.json({ ok: true, mesaj: `Email trimis către ${to} — verifică inboxul (și Spam).`, diagnostics });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, eroare: String(e?.message ?? e), diagnostics },
      { status: 500 }
    );
  }
}
