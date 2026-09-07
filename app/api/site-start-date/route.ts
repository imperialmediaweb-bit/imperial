// Primirea datelor de conținut Site Start — formularul /site-start/date.
// Totul ajunge la proprietar pe email + ca lead în admin, legat de emailul plății.

import { NextResponse } from "next/server";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { hasDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`site-start-date:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe trimiteri — așteaptă câteva minute." }, { status: 429 });
  }

  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  const email = String(b?.email ?? "").trim().toLowerCase();
  const companyName = String(b?.companyName ?? "").trim().slice(0, 200);
  const description = String(b?.description ?? "").trim().slice(0, 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !companyName || !description) {
    return NextResponse.json({ error: "Email, numele firmei și descrierea sunt obligatorii." }, { status: 400 });
  }
  const F = (k: string, max = 800) => String(b?.[k] ?? "").trim().slice(0, max);

  const detalii = [
    `FIRMA: ${companyName}`,
    `DOMENIU DE ACTIVITATE: ${F("industry", 150) || "—"}`,
    `DOMENIU DORIT: ${F("domain", 200) || "—"}`,
    `DESCRIERE: ${description}`,
    `SERVICII: ${F("services", 1500) || "—"}`,
    `PROGRAM: ${F("schedule", 200) || "—"}`,
    `TELEFON AFIȘAT: ${F("phone", 50) || "—"}`,
    `ADRESĂ: ${F("address", 300) || "—"}`,
    `CULORI/STIL: ${F("colors", 300) || "—"}`,
    `LOGO: ${F("hasLogo", 60) || "—"}`,
    `POZELE — CE ARE ȘI UNDE LE VREA: ${F("photosWhere", 600) || "le așezăm noi"}`,
    `EXTRA-OPȚIUNI CERUTE: ${F("extras") || "niciuna"}`,
    `ALTCEVA: ${F("other", 1000) || "—"}`,
  ].join("\n");

  let recorded = false;
  if (hasDb()) {
    try {
      await insertBrief({
        name: companyName,
        email,
        selected_package: "Site Start — DATELE SITE-ULUI",
        industry: F("industry", 150),
        message: `📋 Conținutul pentru construcție:\n${detalii}\n\n(Pozele: emailurile „📸 a urcat poze" / Cloudinary pe emailul lui.)`,
        source: "site-start-continut",
      });
      recorded = true;
    } catch (e) {
      console.error("[site-start-date] lead insert failed:", e);
    }
  }
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `📋 DATELE SITE-ULUI — ${companyName} (Site Start)`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6;">
        <h2>📋 Conținutul pentru site-ul „${companyName}"</h2>
        <p><b>Client:</b> ${email}</p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;border-radius:8px;padding:12px;">${detalii.replace(/</g, "&lt;")}</pre>
        <p>Pozele: caută emailurile „📸 a urcat poze" de la ${email} (Cloudinary). Poți începe construcția.</p>
      </div>`,
      replyTo: email,
    });
    recorded = true;
  } catch (e) {
    console.error("[site-start-date] owner email failed:", e);
  }
  if (!recorded) {
    return NextResponse.json({ error: "Nu am putut trimite — încearcă din nou sau scrie-ne pe email." }, { status: 500 });
  }

  const { insertNotification } = await import("@/lib/monitoring");
  insertNotification(
    email,
    "order",
    "📋 Datele site-ului tău au ajuns la noi",
    "Ne apucăm de construcție. Nu uita de poze — cardul de poze din cont. Primești preview-ul pe email în câteva zile."
  ).catch(() => {});

  return NextResponse.json({ ok: true });
}
