// Activarea manuală a unei comenzi Site Start plătite prin TRANSFER BANCAR.
// Când banii intră în cont: /api/admin/site-start-manual?email=clientul@lui.ro&firma=Numele
// → clientul primește ACELAȘI email cu cei 3 pași ca la plata cu cardul (contract,
//   datele site-ului, pozele) + comanda intră în sistem (brief „site-start-paid"),
//   deci TOATE plasele se activează: reminderul de 48h, cardul din cont, consultantul.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail } from "@/lib/email";
import { hasDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { siteStartPriceRon } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") ?? "").trim().toLowerCase();
  const firma = String(searchParams.get("firma") ?? "").trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({
      folosire: "?email=clientul@lui.ro&firma=Numele Firmei — de folosit DUPĂ ce transferul a intrat în cont și ai emis factura din StartCo",
    });
  }

  if (hasDb()) {
    try {
      await insertBrief({
        name: firma || email,
        email,
        selected_package: "Site Start — PLĂTIT",
        industry: "",
        message: `✅ A PLĂTIT Site Start prin TRANSFER BANCAR (${siteStartPriceRon()} lei) — confirmat manual din admin. Factura: emisă manual din StartCo. DE FĂCUT: site de prezentare 4 pagini — clientul primește acum emailul cu cei 3 pași (contract, date, poze). [manual:${Date.now()}]`,
        source: "site-start-paid",
      });
    } catch (e) {
      console.error("[site-start-manual] lead insert failed:", e);
      return NextResponse.json({ error: "Nu am putut înregistra comanda în sistem." }, { status: 500 });
    }
  }

  try {
    await sendSimpleEmail({
      to: email,
      subject: "Comanda ta Site Start e confirmată — pasul următor 🏗️",
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
        <h2 style="margin:0 0 12px;">Am primit plata — mulțumim! Începem site-ul tău 🎉</h2>
        <p>Ca să-l livrăm în câteva zile, mai avem nevoie de TREI lucruri de la tine (10 minute cu totul):</p>
        <p><a href="${siteConfig.url}/contract" style="display:inline-block;background:#111;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">📜 Semnează contractul (2 min)</a></p>
        <p style="font-size:13px;color:#555;">Pui CUI-ul, datele firmei se completează singure de la ANAF, accepți — copia vine pe email la amândoi.</p>
        <p><a href="${siteConfig.url}/site-start/date" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">1️⃣ Completează datele site-ului (5 min)</a></p>
        <p style="font-size:13px;color:#555;">Ce face firma, serviciile, program, contact, domeniul dorit, culorile — totul într-un singur formular. Nu trebuie texte perfecte, le șlefuim noi.</p>
        <p><a href="${siteConfig.url}/cont" style="display:inline-block;background:#7C3AED;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">2️⃣ Urcă pozele în contul tău</a></p>
        <p style="font-size:13px;color:#555;">Logo (dacă ai), poze cu firma/lucrările — sau folosim imagini profesionale de stock, incluse.</p>
        <p>Apoi: îți trimitem linkul de previzualizare → o rundă de modificări → site-ul e LIVE. Totul online, fără telefoane.</p>
        <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
      </div>`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Comanda e în sistem, dar emailul nu a plecat: ${String(e?.message ?? e)}` }, { status: 500 });
  }

  const { insertNotification } = await import("@/lib/monitoring");
  insertNotification(email, "order", "🏗️ Comanda ta Site Start e confirmată", "Pașii următori sunt pe emailul tău: contractul, datele site-ului și pozele.").catch(() => {});

  return NextResponse.json({
    ok: true,
    mesaj: `✅ Comanda Site Start (transfer) e ACTIVATĂ pentru ${email} — a primit emailul cu cei 3 pași; reminderul de 48h, cardul din cont și consultantul o văd de-acum.`,
  });
}
