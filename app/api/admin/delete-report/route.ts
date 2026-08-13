// Ștergerea rândurilor moarte din admin (eșuate/zombie). Protecție: rapoartele
// PLĂTITE nu se pot șterge — alea sunt istoricul clienților.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getPool, ensureSchema, hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Fără bază de date." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const raw = String(searchParams.get("token") ?? "");
  const token = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? "";
  if (!token) {
    return NextResponse.json({ folosire: "?token=TOKENUL (sau linkul raportului, lipit întreg)" });
  }

  const pool = getPool()!;
  await ensureSchema();
  const res = await pool.query(
    `DELETE FROM service_reports WHERE token = $1 AND paid = FALSE RETURNING form_data->>'companyName' AS company`,
    [token]
  );
  if ((res.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: "Nu s-a șters nimic — rândul nu există sau e PLĂTIT (protejat)." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, mesaj: `🗑 Șters raportul „${res.rows[0]?.company ?? "?"}". Dă refresh la /admin/rapoarte.` });
}
