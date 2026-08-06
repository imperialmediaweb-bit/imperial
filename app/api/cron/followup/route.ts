// Urmărire automată după cumpărarea raportului — vânzătorul care nu sună nimeni.
// Chemat ZILNIC de cron (Authorization: Bearer CRON_SECRET).
// J+1: hai să implementăm planul (banii se scad din pachet)
// J+3: nu vrei să vezi lună de lună cum evoluezi? (abonamentul)
// J+7: ultima strigare — deducerea celor 299 lei expiră în 30 de zile

import { NextResponse } from "next/server";
import { getPool, ensureSchema } from "@/lib/db";
import { sendSimpleEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const BTN = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">${label}</a>`;

const WRAP = (inner: string) =>
  `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.65;max-width:560px;">${inner}
  <p style="color:#888;font-size:12px;margin-top:28px;">Imperial Media · Botoșani · ${siteConfig.email} · imperial-media.ro</p></div>`;

function emailForStage(stage: number, firm: string, reportUrl: string) {
  if (stage === 1) {
    return {
      subject: `${firm}: planul e gata — hai să-l punem în mișcare`,
      html: WRAP(`
        <h2 style="margin:0 0 12px;">Ai citit planul pentru ${firm}?</h2>
        <p>Raportul tău arată exact ce te costă lunar lipsurile din prezența online — și ce ai de făcut în Faza 1.</p>
        <p><b>Reminder important:</b> cei plătiți pe audit se scad INTEGRAL din orice pachet comanzi în 30 de zile. Practic raportul devine gratuit dacă implementezi cu noi.</p>
        <p>${BTN(`${siteConfig.url}/brief`, "Cere estimarea pentru Faza 1 — 2 minute")}</p>
        <p style="font-size:13px;color:#666;">Raportul tău complet, oricând: <a href="${reportUrl}">${reportUrl}</a></p>
      `),
    };
  }
  if (stage === 2) {
    return {
      subject: `${firm}: nu vrei să vezi lună de lună cum evoluezi?`,
      html: WRAP(`
        <h2 style="margin:0 0 12px;">Raportul a fost poza de moment. Afacerea ta se mișcă în fiecare lună.</h2>
        <p>Competitorii primesc recenzii, Google se schimbă, site-ul poate pica — și tu afli târziu sau deloc.</p>
        <p><b>Monitorizarea lunară (99 lei/lună)</b> îți regenerează raportul automat în fiecare lună: evoluția scorului, recenziile noi ale competitorilor, starea site-ului, acțiunile lunii — plus notificări imediate când se întâmplă ceva important.</p>
        <p>${BTN(`${siteConfig.url}/cont`, "Intră în contul tău și activează monitorizarea")}</p>
        <p style="font-size:13px;color:#666;">În cont ai deja: raportul tău, notificările și consultantul dedicat care îți știe firma.</p>
      `),
    };
  }
  return {
    subject: `${firm}: mai ai câteva zile să-ți recuperezi banii pe audit`,
    html: WRAP(`
      <h2 style="margin:0 0 12px;">Ultima aducere aminte — apoi nu te mai batem la cap.</h2>
      <p>Suma plătită pe audit se scade integral din orice pachet <b>doar în primele 30 de zile</b>. După asta, oferta expiră.</p>
      <p>Faza 1 din planul tău e punctul de pornire — spune-ne că vrei să începem și îți trimitem oferta exactă:</p>
      <p>${BTN(`${siteConfig.url}/brief`, "Vreau să implementăm Faza 1")}</p>
      <p style="font-size:13px;color:#666;">Preferi să vorbim întâi? Răspunde la acest email și revenim noi.</p>
    `),
  };
}

// Acceptă și GET cu ?key=SECRET (pentru UptimeRobot & alte pingere simple)
export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const urlKey = new URL(req.url).searchParams.get("key");
  if (req.headers.get("authorization") !== `Bearer ${secret}` && urlKey !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "no db" }, { status: 503 });
  await ensureSchema();

  // Rapoartele plătite, cu email, care mai au emailuri de primit.
  const res = await pool.query(`
    SELECT token, email, form_data, paid_at, followup_stage
    FROM service_reports
    WHERE paid = TRUE AND email IS NOT NULL AND email <> '' AND followup_stage < 3
    ORDER BY paid_at ASC
    LIMIT 200
  `);

  let sent = 0;
  for (const row of res.rows) {
    const days = (Date.now() - new Date(row.paid_at).getTime()) / 86_400_000;
    // Stagiul următor: 1 după o zi, 2 după 3 zile, 3 după 7 zile
    const dueStage = days >= 7 ? 3 : days >= 3 ? 2 : days >= 1 ? 1 : 0;
    if (dueStage <= row.followup_stage) continue;

    const firm = String(row.form_data?.companyName ?? "afacerea ta");
    const reportUrl = `${siteConfig.url}/service/raport/${row.token}`;
    // Trimitem DOAR emailul stagiului curent scadent (nu recuperăm retroactiv mai multe deodată)
    const mail = emailForStage(dueStage, firm, reportUrl);

    try {
      await sendSimpleEmail({ to: row.email, subject: mail.subject, html: mail.html });
      sent++;
    } catch (e) {
      console.error(`[cron/followup] email failed for ${row.email}:`, e);
      continue; // nu avansăm stagiul dacă emailul nu a plecat
    }

    try {
      await pool.query(`UPDATE service_reports SET followup_stage = $1 WHERE token = $2`, [
        dueStage,
        row.token,
      ]);
    } catch (e) {
      console.error("[cron/followup] stage update failed:", e);
    }
  }

  return NextResponse.json({ ok: true, candidates: res.rows.length, sent });
}
