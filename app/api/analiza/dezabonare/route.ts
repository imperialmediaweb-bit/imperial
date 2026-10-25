// Dezabonarea de la reamintirile analizei — linkul semnat din email.

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { stopToken } from "@/lib/analiza-follow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const email = String(u.searchParams.get("e") ?? "").toLowerCase();
  const ok = email.includes("@") && u.searchParams.get("t") === stopToken(email);
  const pool = getPool();
  if (ok && pool) {
    await pool.query(`CREATE TABLE IF NOT EXISTS ops_markers (key TEXT PRIMARY KEY, value TEXT)`);
    await pool.query(`INSERT INTO ops_markers (key, value) VALUES ($1, 'stop') ON CONFLICT (key) DO NOTHING`, [`analiza-stop:${email}`]);
  }
  return new NextResponse(
    `<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dezabonare</title>
    <body style="font-family:Arial,sans-serif;background:#0d0b12;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px;">
    <div style="max-width:420px;text-align:center;"><h1 style="font-size:22px;">${ok ? "Gata, nu mai primești reamintiri." : "Linkul nu e valid."}</h1>
    <p style="color:#bbb;">${ok ? "Analiza ta rămâne în email. Dacă te răzgândești, ne găsești pe imperial-media.ro." : "Scrie-ne la office@imperial-media.ro și te scoatem noi din listă."}</p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
