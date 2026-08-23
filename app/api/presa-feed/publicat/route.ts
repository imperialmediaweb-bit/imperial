// Confirmarea publicării de la rețeaua Media Expres: POST {id, url_publicat}.
// Ține evidența linkurilor, închide articolul când e publicat și îi trimite
// clientului AUTOMAT emailul cu primul link apărut — zero click-uri de la noi.

import { NextResponse } from "next/server";
import { getPool, ensureSchema, hasDb } from "@/lib/db";
import { sendSimpleEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = process.env.PRESA_FEED_KEY;
  if (!key) return NextResponse.json({ error: "PRESA_FEED_KEY neconfigurat" }, { status: 503 });
  const url = new URL(req.url);
  const given = url.searchParams.get("key") ?? req.headers.get("x-feed-key");
  if (given !== key) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: "no db" }, { status: 503 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalid" }, { status: 400 });
  }
  const token = String(body?.id ?? "").trim();
  const publishedUrl = String(body?.url_publicat ?? "").trim().slice(0, 500);
  if (!token || !/^https?:\/\//i.test(publishedUrl)) {
    return NextResponse.json({ error: "Trebuie id + url_publicat (http/https)" }, { status: 400 });
  }

  await ensureSchema();
  const pool = getPool()!;
  const row = (await pool.query(`SELECT * FROM press_articles WHERE token = $1`, [token])).rows[0];
  if (!row) return NextResponse.json({ error: "Articol necunoscut" }, { status: 404 });

  const urls: string[] = Array.isArray(row.published_urls) ? row.published_urls : [];
  const isFirst = urls.length === 0;
  if (!urls.includes(publishedUrl)) urls.push(publishedUrl);

  // local: gata la prima confirmare; toată rețeaua: gata la 40+ (restul se propagă)
  const done = row.distributie === "toata-reteaua" ? urls.length >= 40 : true;
  await pool.query(
    `UPDATE press_articles SET published_urls = $2, status = $3 WHERE token = $1`,
    [token, JSON.stringify(urls), done ? "published" : row.status]
  );

  // Prima confirmare → clientul află AUTOMAT că a apărut în presă
  if (isFirst && row.client_email) {
    sendSimpleEmail({
      to: row.client_email,
      subject: `🗞️ A apărut în presă: „${row.title}"`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
        <h2 style="margin:0 0 12px;">Articolul tău e publicat! 🎉</h2>
        <p>Primul link a apărut deja:</p>
        <p><a href="${publishedUrl}">${publishedUrl}</a></p>
        ${row.distributie === "toata-reteaua" ? `<p>În următoarele zile articolul se propagă în <b>toată rețeaua de 50 de ziare online</b> — dă-i share pe pagina firmei tale, un articol din presă convinge mai mult decât orice reclamă.</p>` : `<p>Articolul e publicat în ziarul local din județul tău — dă-i share pe pagina firmei tale.</p>`}
        <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
      </div>`,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, linkuri: urls.length, status: done ? "published" : row.status });
}
