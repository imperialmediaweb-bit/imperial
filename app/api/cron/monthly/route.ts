// Scanarea periodică de monitorizare (chemată de un cron extern, ex: Railway cron
// sau cron-job.org, cu Authorization: Bearer CRON_SECRET).
// Pentru fiecare firmă cu raport plătit + email: re-scanează Google + site,
// compară cu snapshot-ul anterior, generează notificări și trimite emailul de evoluție.

import { NextResponse } from "next/server";
import { getPool, ensureSchema } from "@/lib/db";
import {
  insertSnapshot,
  getLatestSnapshot,
  insertNotification,
  type MonitorSnapshot,
} from "@/lib/monitoring";
import { sendSimpleEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function scanFirm(form: any, placesKey: string | undefined): Promise<MonitorSnapshot> {
  const snap: MonitorSnapshot = {
    rating: null,
    reviewCount: 0,
    siteUp: null,
    siteMs: null,
    competitors: [],
  };

  if (placesKey) {
    try {
      if (form.placeId) {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(form.placeId)}&fields=rating,user_ratings_total&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        if (data?.result) {
          snap.rating = data.result.rating ?? null;
          snap.reviewCount = data.result.user_ratings_total ?? 0;
        }
      } else {
        const q = encodeURIComponent(`${form.companyName} ${form.city}`);
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${q}&inputtype=textquery&fields=rating,user_ratings_total&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        const p = data.candidates?.[0];
        if (p) {
          snap.rating = p.rating ?? null;
          snap.reviewCount = p.user_ratings_total ?? 0;
        }
      }
    } catch (e) {
      console.warn("[cron/monthly] place scan failed:", e);
    }

    if (form.businessType !== "online") {
      try {
        const cq = encodeURIComponent(`${form.industry} ${form.city}`);
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cq}&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        snap.competitors = (data.results ?? [])
          .filter((p: any) => p.name?.toLowerCase() !== String(form.companyName ?? "").toLowerCase())
          .slice(0, 4)
          .map((p: any) => ({
            name: String(p.name ?? ""),
            rating: p.rating ?? null,
            reviewCount: p.user_ratings_total ?? 0,
          }));
      } catch (e) {
        console.warn("[cron/monthly] competitor scan failed:", e);
      }
    }
  }

  if (form.website) {
    try {
      const url = /^https?:\/\//i.test(form.website) ? form.website : `https://${form.website}`;
      const start = Date.now();
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        },
      });
      snap.siteUp = res.ok;
      snap.siteMs = Date.now() - start;
    } catch {
      snap.siteUp = false;
    }
  }

  return snap;
}

// Compară două snapshot-uri → lista de notificări de creat.
function diffToNotifications(
  firm: string,
  prev: MonitorSnapshot | null,
  cur: MonitorSnapshot
): Array<{ kind: string; title: string; body?: string }> {
  const out: Array<{ kind: string; title: string; body?: string }> = [];
  if (!prev) return out;

  const newReviews = cur.reviewCount - prev.reviewCount;
  if (newReviews > 0) {
    out.push({
      kind: "review",
      title: `⭐ ${firm}: ${newReviews} ${newReviews === 1 ? "recenzie nouă" : "recenzii noi"} pe Google`,
      body: `Total acum: ${cur.reviewCount} recenzii${cur.rating ? `, rating ${cur.rating}★` : ""}.`,
    });
  }

  if (prev.rating != null && cur.rating != null && cur.rating < prev.rating - 0.05) {
    out.push({
      kind: "review",
      title: `⚠️ ${firm}: ratingul Google a scăzut la ${cur.rating}★`,
      body: `Era ${prev.rating}★. Verifică ultimele recenzii și răspunde-le rapid.`,
    });
  }

  if (prev.siteUp !== false && cur.siteUp === false) {
    out.push({
      kind: "site",
      title: `🔴 ${firm}: site-ul nu răspunde`,
      body: "L-am verificat la scanarea de azi și nu s-a încărcat. Verifică hostingul.",
    });
  }

  // Competitorul care a câștigat cele mai multe recenzii față de scanarea trecută
  let bestGain = 0;
  let bestName = "";
  for (const c of cur.competitors) {
    const before = prev.competitors.find((p) => p.name === c.name);
    if (!before) continue;
    const gain = c.reviewCount - before.reviewCount;
    if (gain > bestGain) {
      bestGain = gain;
      bestName = c.name;
    }
  }
  if (bestGain > 0 && bestGain > Math.max(0, newReviews)) {
    out.push({
      kind: "competitor",
      title: `🥊 ${bestName} a câștigat ${bestGain} recenzii de la ultima scanare`,
      body: `Tu ai câștigat ${Math.max(0, newReviews)}. Cere activ recenzii clienților mulțumiți ca să nu se mărească diferența.`,
    });
  }

  return out;
}

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "no db" }, { status: 503 });
  await ensureSchema();

  // Setul monitorizat: rapoartele plătite cu email (cel mai recent raport per firmă+email).
  const res = await pool.query(`
    SELECT DISTINCT ON (LOWER(email), form_data->>'companyName')
      token, email, form_data
    FROM service_reports
    WHERE paid = TRUE AND email IS NOT NULL AND email <> ''
    ORDER BY LOWER(email), form_data->>'companyName', created_at DESC
    LIMIT 100
  `);

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  let scanned = 0;
  let notified = 0;

  for (const row of res.rows) {
    const form = row.form_data ?? {};
    const firm = String(form.companyName ?? "firma ta");
    try {
      const cur = await scanFirm(form, placesKey);
      const prev = await getLatestSnapshot(row.token);
      const notifs = diffToNotifications(firm, prev, cur);
      await insertSnapshot(row.token, row.email, cur);
      scanned++;

      for (const n of notifs) {
        await insertNotification(row.email, n.kind, n.title, n.body);
      }

      if (notifs.length > 0) {
        notified++;
        try {
          await sendSimpleEmail({
            to: row.email,
            subject: `${firm}: ${notifs.length} ${notifs.length === 1 ? "noutate" : "noutăți"} la monitorizarea afacerii tale`,
            html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
              <h2 style="margin:0 0 12px;">Monitorizarea lunară — ${firm}</h2>
              <ul style="padding-left:18px;">
                ${notifs.map((n) => `<li style="margin-bottom:10px;"><b>${n.title}</b>${n.body ? `<br/><span style="color:#555;font-size:13px;">${n.body}</span>` : ""}</li>`).join("")}
              </ul>
              <p><a href="${siteConfig.url}/cont" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Vezi tot în contul tău</a></p>
              <p style="color:#666;font-size:13px;">Imperial Media · imperial-media.ro</p>
            </div>`,
          });
        } catch (e) {
          console.error("[cron/monthly] email failed:", e);
        }
      }
    } catch (e) {
      console.error(`[cron/monthly] scan failed for ${firm}:`, e);
    }
  }

  return NextResponse.json({ ok: true, monitored: res.rows.length, scanned, notified });
}
