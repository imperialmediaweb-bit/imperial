// Livrarea paginilor create pentru client (Facebook + Google Business) — fără telefoane.
// Admin lipește linkurile + ce a optimizat → clientul primește email + notificare în cont,
// iar datele firmei se actualizează ca monitorizarea și consultantul să știe de noile pagini.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getPool, ensureSchema, hasDb } from "@/lib/db";
import { insertNotification } from "@/lib/monitoring";
import { sendSimpleEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const facebookUrl = String(body?.facebookUrl ?? "").trim();
  const googleUrl = String(body?.googleUrl ?? "").trim();
  const optimizations = String(body?.optimizations ?? "").trim().slice(0, 2000);

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Email invalid." }, { status: 400 });
  }
  if (!facebookUrl && !googleUrl) {
    return NextResponse.json({ error: "Pune măcar un link (Facebook sau Google)." }, { status: 400 });
  }
  if ((facebookUrl && !isHttpUrl(facebookUrl)) || (googleUrl && !isHttpUrl(googleUrl))) {
    return NextResponse.json({ error: "Linkurile trebuie să înceapă cu https://" }, { status: 400 });
  }

  // Actualizăm datele firmei pe ultimul raport — de aici citesc consultantul și monitorizarea.
  // Emailul TREBUIE să aibă un raport în sistem — altfel e aproape sigur o typo și oprim aici,
  // înainte să plece emailul către o adresă greșită.
  if (hasDb()) {
    try {
      const pool = getPool()!;
      await ensureSchema();
      const patch: Record<string, string> = {};
      if (facebookUrl) patch.facebook = facebookUrl;
      if (googleUrl) patch.googleProfileUrl = googleUrl;
      const upd = await pool.query(
        `UPDATE service_reports SET form_data = COALESCE(form_data, '{}'::jsonb) || $2::jsonb
         WHERE id = (SELECT id FROM service_reports WHERE LOWER(email) = $1 ORDER BY created_at DESC LIMIT 1)`,
        [email, JSON.stringify(patch)]
      );
      if (upd.rowCount === 0) {
        return NextResponse.json(
          { error: `Niciun raport pentru ${email} — verifică emailul (alege-l din listă).` },
          { status: 404 }
        );
      }
      await insertNotification(
        email,
        "delivery",
        "🎉 Paginile tale noi sunt gata!",
        [
          facebookUrl ? `Pagina de Facebook: ${facebookUrl}` : null,
          googleUrl ? `Profilul Google Business: ${googleUrl}` : null,
          optimizations ? `Ce am optimizat: ${optimizations}` : null,
        ].filter(Boolean).join("\n")
      );
    } catch (e) {
      console.error("[deliver-pages] db update failed:", e);
      return NextResponse.json(
        { error: "Baza de date n-a răspuns — livrarea NU a plecat. Încearcă din nou." },
        { status: 500 }
      );
    }
  }

  try {
    await sendSimpleEmail({
      to: email,
      subject: "🎉 Paginile tale noi sunt gata — Imperial Media",
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
        <h2 style="margin:0 0 12px;">Paginile tale sunt live! 🎉</h2>
        <p>Le-am creat, optimizat și predat la cheie:</p>
        <ul>
          ${facebookUrl ? `<li><b>Pagina de Facebook:</b> <a href="${facebookUrl}">${facebookUrl}</a></li>` : ""}
          ${googleUrl ? `<li><b>Profilul Google Business:</b> <a href="${googleUrl}">${googleUrl}</a></li>` : ""}
        </ul>
        ${optimizations ? `<p><b>Ce am optimizat pentru tine:</b><br/>${optimizations.replace(/\n/g, "<br/>")}</p>` : ""}
        <p><b>Ce urmează</b> — ca paginile să lucreze pentru tine, nu doar să existe:</p>
        <ol>
          <li>Intră în contul tău și cere consultantului <b>primele 3 postări</b> — ți le scrie gata de publicat, pe firma ta.</li>
          <li>Când ești gata de clienți noi, tot el te învață <b>pas cu pas reclamele pe Facebook</b> (de la 15-30 lei/zi).</li>
          <li>Monitorizarea ta vede de acum și paginile noi — urmărim lună de lună cum cresc.</li>
        </ol>
        <p><a href="${siteConfig.url}/cont" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Deschide contul tău</a></p>
        <p><b>Vrei ceva schimbat?</b> Scrie-i consultantului din cont exact ce — <b>30 de zile de ajustări incluse</b>, fără costuri și fără telefoane.</p>
        <p style="color:#666;font-size:13px;">Totul prin cont și email — fără telefoane. Răspunzi direct la acest email dacă ai nevoie de ceva.<br/>Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
      </div>`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Emailul nu a plecat: ${String(e?.message ?? e)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, mesaj: `Livrat către ${email} — email trimis + notificare în cont.` });
}
