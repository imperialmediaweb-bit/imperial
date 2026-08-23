// Coada de presă din admin — vezi tot, aprobi sau ștergi cu un click.
// GET  /api/admin/presa-coada                    → lista întreagă
// GET  /api/admin/presa-coada?aproba=TOKEN       → draft devine „ready" (intră în feed)
// GET  /api/admin/presa-coada?sterge=TOKEN       → șters (doar draft/ready)

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getPool, ensureSchema, hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: "Fără bază de date." }, { status: 503 });
  await ensureSchema();
  const pool = getPool()!;
  const { searchParams } = new URL(req.url);

  const aproba = String(searchParams.get("aproba") ?? "").trim();
  if (aproba) {
    const r = await pool.query(
      `UPDATE press_articles SET status = 'ready' WHERE token = $1 AND status = 'draft' RETURNING title`,
      [aproba]
    );
    return NextResponse.json(
      r.rows[0]
        ? { ok: true, mesaj: `✅ „${r.rows[0].title}" e APROBAT — intră în feed, rețeaua îl publică la următoarea citire (max 24h).` }
        : { error: "Nu am găsit ciorna (poate e deja aprobată)." }
    );
  }

  const sterge = String(searchParams.get("sterge") ?? "").trim();
  if (sterge) {
    const r = await pool.query(
      `DELETE FROM press_articles WHERE token = $1 AND status IN ('draft','ready') RETURNING title`,
      [sterge]
    );
    return NextResponse.json(
      r.rows[0] ? { ok: true, mesaj: `🗑 Șters: „${r.rows[0].title}"` } : { error: "Nu am găsit articolul (sau e deja publicat)." }
    );
  }

  const res = await pool.query(
    `SELECT token, created_at, title, judet, distributie, publica_dupa, client_email, status,
            jsonb_array_length(published_urls) AS linkuri
     FROM press_articles ORDER BY created_at DESC LIMIT 100`
  );
  return NextResponse.json({
    folosire: "?aproba=TOKEN pentru publicare · ?sterge=TOKEN pentru ștergere",
    articole: res.rows,
  });
}
