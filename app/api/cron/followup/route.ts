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
  // Invitațiile VIP (partener vip-imperial) sunt excluse — sunt gesturi de parteneriat, nu lead-uri.
  const res = await pool.query(`
    SELECT token, email, form_data, paid_at, followup_stage
    FROM service_reports
    WHERE paid = TRUE AND email IS NOT NULL AND email <> '' AND followup_stage < 3
      AND COALESCE(form_data->>'partner', '') <> 'vip-imperial'
    ORDER BY paid_at ASC
    LIMIT 200
  `);

  // GENERĂRILE BLOCATE: un restart de server (deploy) omoară pipeline-urile în zbor,
  // iar rândul rămâne „pending" pe veci, fără alertă. Le închidem și anunțăm proprietarul.
  let stuckClosed = 0;
  try {
    const stuck = await pool.query(`
      UPDATE service_reports SET status = 'error'
      WHERE status = 'pending' AND created_at < NOW() - INTERVAL '30 minutes'
      RETURNING form_data->>'companyName' AS company, email
    `);
    stuckClosed = stuck.rowCount ?? 0;
    if (stuckClosed > 0) {
      const list = stuck.rows.map((r: any) => `${r.company ?? "?"}${r.email ? ` (${r.email})` : ""}`).join(", ");
      sendSimpleEmail({
        to: (await import("@/lib/email")).ownerEmail(),
        subject: `⚠️ ${stuckClosed} generări blocate au fost închise — probabil un deploy le-a întrerupt`,
        html: `<p>Rapoartele astea au rămas „în lucru" peste 30 min și au fost marcate eșuate: <b>${list}</b>.</p>
          <p>Cauza tipică: un redeploy în timpul generării. Clienții respectivi pot apăsa din nou „Generează" — formularul lor e salvat. Dacă ai emailul lor, scrie-le o frază.</p>`,
      }).catch(() => {});
    }
  } catch (e) {
    console.error("[cron/followup] stuck sweep failed:", e);
  }

  // REMINDER LUNAR CĂTRE PROPRIETAR: abonamentul include 1 articol de presă/lună
  // în ziarul local al fiecărui abonat — pe 1 ale lunii primești lista de publicat.
  // Marker în DB ca emailul să plece O SINGURĂ DATĂ pe lună, oricâte pinguri vin.
  try {
    const monthKey = new Date().toISOString().slice(0, 7); // ex: "2026-09"
    await pool.query(`CREATE TABLE IF NOT EXISTS ops_markers (key TEXT PRIMARY KEY, value TEXT)`);
    const claimed = await pool.query(
      `INSERT INTO ops_markers (key, value) VALUES ('press-monthly', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value WHERE ops_markers.value IS DISTINCT FROM EXCLUDED.value
       RETURNING key`,
      [monthKey]
    );
    if ((claimed.rowCount ?? 0) > 0) {
      const subs = await pool.query(`SELECT email, plan FROM subscribers WHERE active = TRUE ORDER BY created_at ASC`);
      if (subs.rows.length > 0) {
        // Firma și orașul fiecărui abonat — din cel mai recent raport pe emailul lui
        const emails = subs.rows.map((s: any) => String(s.email).toLowerCase());
        const firms = await pool.query(
          `SELECT DISTINCT ON (LOWER(email)) LOWER(email) AS email,
                  form_data->>'companyName' AS company, form_data->>'city' AS city
           FROM service_reports WHERE LOWER(email) = ANY($1)
           ORDER BY LOWER(email), created_at DESC`,
          [emails]
        );
        const byEmail = new Map(firms.rows.map((r: any) => [r.email, r]));
        const rowsHtml = subs.rows
          .map((s: any) => {
            const f = byEmail.get(String(s.email).toLowerCase());
            return `<li><b>${f?.company ?? "?"}</b>${f?.city ? ` — ${f.city}` : ""} · ${s.email} · plan: ${s.plan ?? "lunar"}</li>`;
          })
          .join("");
        sendSimpleEmail({
          to: (await import("@/lib/email")).ownerEmail(),
          subject: `🗞️ Articolele de presă ale lunii — ${subs.rows.length} ${subs.rows.length === 1 ? "abonat" : "abonați"} de publicat`,
          html: `<p>Abonamentul include 1 articol de presă pe lună în ziarul local al fiecărui abonat. De publicat luna asta:</p>
            <ul>${rowsHtml}</ul>
            <p style="font-size:13px;color:#666;">Publici articolul în ziarul județului fiecăruia (rețeaua Media Expres) cu link spre site-ul/profilul firmei. Reminder automat, 1/lună.</p>`,
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("[cron/followup] press reminder failed:", e);
  }

  // SITE START — plasa anti-abandon: (a) a plătit dar nu a trimis datele în 48h →
  // un singur reminder; (b) la 11 luni de la plată → oferta de Administrare, fix
  // înainte să-i expire domeniul și găzduirea gratuite. Marker în ops_markers = o
  // singură dată per client, oricâte rulări.
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS ops_markers (key TEXT PRIMARY KEY, value TEXT)`);

    const paidNoData = await pool.query(`
      SELECT DISTINCT ON (LOWER(b.email)) b.email, b.name
      FROM briefs b
      WHERE b.source = 'site-start-paid' AND b.email LIKE '%@%' AND b.created_at < NOW() - INTERVAL '48 hours'
        AND NOT EXISTS (SELECT 1 FROM briefs c WHERE c.source = 'site-start-continut' AND LOWER(c.email) = LOWER(b.email))
        AND NOT EXISTS (SELECT 1 FROM ops_markers m WHERE m.key = 'ss-datereminder:' || LOWER(b.email))
      ORDER BY LOWER(b.email), b.created_at DESC LIMIT 50
    `);
    for (const r of paidNoData.rows) {
      try {
        await sendSimpleEmail({
          to: r.email,
          subject: `${r.name ?? "Firma ta"}: site-ul tău așteaptă doar datele — 5 minute`,
          html: WRAP(`
            <h2 style="margin:0 0 12px;">Suntem gata să-ți construim site-ul! 🏗️</h2>
            <p>Am primit plata (mulțumim!) — ne lipsesc doar informațiile despre firmă ca să ne apucăm. Durează 5 minute:</p>
            <p>${BTN(`${siteConfig.url}/site-start/date`, "Completează datele site-ului")}</p>
            <p style="font-size:13px;color:#666;">Textele le scriem noi din ce ne povestești. Pozele le urci din contul tău (${siteConfig.url}/cont) — sau folosim imagini profesionale de stock, incluse. Livrăm în câteva zile de la primirea datelor.</p>
            <p style="font-size:13px;color:#666;">Ai o întrebare? Scrie-i consultantului tău din cont — îți răspunde pe loc.</p>
          `),
        });
        await pool.query(`INSERT INTO ops_markers (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
          [`ss-datereminder:${String(r.email).toLowerCase()}`, new Date().toISOString()]);
      } catch (e) {
        console.error(`[cron/followup] site-start data reminder failed for ${r.email}:`, e);
      }
    }

    const elevenMonths = await pool.query(`
      SELECT DISTINCT ON (LOWER(b.email)) b.email, b.name
      FROM briefs b
      WHERE b.source = 'site-start-paid' AND b.email LIKE '%@%' AND b.created_at < NOW() - INTERVAL '11 months'
        AND NOT EXISTS (SELECT 1 FROM ops_markers m WHERE m.key = 'ss-admin:' || LOWER(b.email))
      ORDER BY LOWER(b.email), b.created_at DESC LIMIT 50
    `);
    for (const r of elevenMonths.rows) {
      try {
        await sendSimpleEmail({
          to: r.email,
          subject: `${r.name ?? "Site-ul tău"}: anul gratuit de domeniu și găzduire se apropie de final`,
          html: WRAP(`
            <h2 style="margin:0 0 12px;">Site-ul tău împlinește un an în curând 🎂</h2>
            <p>Domeniul și găzduirea incluse GRATUIT expiră peste aproximativ o lună. Ai două variante, ambele simple:</p>
            <p><b>🔧 Administrare Start — 100 lei/lună:</b> găzduirea + domeniul + 1-2 modificări mici pe lună + backup. Site-ul merge fără să te gândești la el.</p>
            <p><b>⭐ Administrare Complet — 300 lei/lună:</b> tot ce e mai sus + mentenanță deplină + <b>un articol de presă despre firma ta, în fiecare lună, în ziarul județului</b> + monitorizarea afacerii (scorul, recenziile, competiția — lunar).</p>
            <p>${BTN(`${siteConfig.url}/cont`, "Alege din contul tău")}</p>
            <p style="font-size:13px;color:#666;">Preferi doar reînnoirea simplă (fără abonament)? Răspunde la acest email și îți trimitem factura pentru domeniu + găzduire (~350 lei/an). Site-ul tău nu se oprește în niciun caz fără să te anunțăm.</p>
          `),
        });
        await pool.query(`INSERT INTO ops_markers (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
          [`ss-admin:${String(r.email).toLowerCase()}`, new Date().toISOString()]);
        sendSimpleEmail({
          to: (await import("@/lib/email")).ownerEmail(),
          subject: `🎂 Site Start la 11 luni — ${r.name ?? r.email}: i-am trimis oferta de Administrare`,
          html: `<p>${r.email} a primit automat emailul cu Administrare Start/Complet (domeniul îi expiră în ~1 lună). Dacă răspunde, alege și facturezi.</p>`,
        }).catch(() => {});
      } catch (e) {
        console.error(`[cron/followup] site-start admin offer failed for ${r.email}:`, e);
      }
    }
  } catch (e) {
    console.error("[cron/followup] site-start nets failed:", e);
  }

  // NEPLĂTIȚII cu email (au lăsat emailul la scanare dar nu au deblocat):
  // O SINGURĂ reamintire după ~1 zi, apoi îi lăsăm în pace. Marcaj: followup_stage = -1
  // (negativ nu încurcă dripul plătit: dacă plătesc ulterior, -1 < 1 și dripul pornește normal).
  const unpaidRes = await pool.query(`
    SELECT token, email, form_data
    FROM service_reports
    WHERE paid = FALSE AND email IS NOT NULL AND email <> '' AND followup_stage = 0
      AND status = 'done' AND created_at <= NOW() - INTERVAL '20 hours'
      AND COALESCE(form_data->>'partner', '') <> 'vip-imperial'
    ORDER BY created_at ASC
    LIMIT 100
  `);
  let sentUnpaid = 0;
  for (const row of unpaidRes.rows) {
    const firm = String(row.form_data?.companyName ?? "afacerea ta");
    const reportUrl = `${siteConfig.url}/service/raport/${row.token}`;
    try {
      await sendSimpleEmail({
        to: row.email,
        subject: `${firm}: raportul tău stă deblocat la un pas — nu-l lăsa să expire în sertar`,
        html: WRAP(`
          <h2 style="margin:0 0 12px;">Radiografia pentru ${firm} e generată și te așteaptă.</h2>
          <p>Ai văzut scorul și pierderile estimate — partea cu adevărat valoroasă e DUPĂ deblocare: diagnosticul complet cu rezolvări pas cu pas, planul primei luni și articolul tău de promovare în <b>50 de ziare online</b> (inclus).</p>
          <p><b>Bonus:</b> suma se scade integral din orice pachet comanzi în 30 de zile — practic raportul devine gratuit dacă implementezi cu noi.</p>
          <p>${BTN(reportUrl, "Deschide raportul tău")}</p>
          <p style="font-size:13px;color:#666;">E singurul reminder pe care ți-l trimitem — linkul rămâne valabil oricând.</p>
        `),
      });
      sentUnpaid++;
      await pool.query(`UPDATE service_reports SET followup_stage = -1 WHERE token = $1`, [row.token]);
    } catch (e) {
      console.error(`[cron/followup] unpaid reminder failed for ${row.email}:`, e);
    }
  }

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

  return NextResponse.json({ ok: true, candidates: res.rows.length, sent, unpaidReminders: sentUnpaid });
}
