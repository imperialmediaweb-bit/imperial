// Mesaj de la tine către un client — cu UN singur link, fără telefoane:
// /api/admin/mesaj?email=client@x.ro&text=Mai am nevoie de 2 poze cu vitrina
// Clientul primește EMAIL + NOTIFICARE în cont, cu butoanele potrivite
// (pozele → cardul 📸, întrebările → consultantul). Răspunsurile vin la tine.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") ?? "").trim().toLowerCase();
  const text = String(searchParams.get("text") ?? "").trim().slice(0, 1000);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !text) {
    return NextResponse.json({
      folosire: "?email=clientul@lui.ro&text=Ce ai nevoie de la el (ex: Mai am nevoie de 2 poze cu vitrina și programul de sărbători)",
    });
  }

  try {
    await sendSimpleEmail({
      to: email,
      subject: "O întrebare scurtă despre site-ul tău — Imperial Media",
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
        <h2 style="margin:0 0 12px;">Lucrez la site-ul tău și mai am nevoie de ceva 🏗️</h2>
        <p style="background:#f6f6f6;border-radius:8px;padding:12px;">${text.replace(/</g, "&lt;")}</p>
        <p><a href="${siteConfig.url}/cont" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">📸 Urcă poze / răspunde din contul tău</a></p>
        <p style="font-size:13px;color:#666;">Poți și să răspunzi direct la acest email — ajunge la mine. Cu cât primesc mai repede, cu atât mai repede e gata site-ul.</p>
        <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
      </div>`,
      replyTo: ownerEmail(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Emailul nu a plecat: ${String(e?.message ?? e)}` }, { status: 500 });
  }

  const { insertNotification } = await import("@/lib/monitoring");
  insertNotification(email, "info", "💬 Avem nevoie de ceva de la tine pentru site", text).catch(() => {});

  return NextResponse.json({
    ok: true,
    mesaj: `📨 Trimis către ${email} — email + notificare în cont. Răspunsurile îți vin pe office@.`,
  });
}
