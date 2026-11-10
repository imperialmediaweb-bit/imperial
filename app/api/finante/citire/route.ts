// Citire extras (doar citire) pentru asistent: tranzacțiile băncii pe o lună, ca JSON.
// Fără sesiune de Finanțe: cere antetul x-finante-key egal cu CRON_SECRET.
// Nu modifică nimic. GET /api/finante/citire?luna=2026-11[&firma=<id>]
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getPool } from "@/lib/db";
import { lunaRange } from "@/lib/finante/luna";
import { listCompanies } from "@/lib/finante/companies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cheieBuna(primita: string | null): boolean {
  const asteptata = process.env.CRON_SECRET;
  if (!asteptata || !primita) return false;
  const a = Buffer.from(primita);
  const b = Buffer.from(asteptata);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!cheieBuna(req.headers.get("x-finante-key"))) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "Fără bază de date" }, { status: 500 });

  const sp = new URL(req.url).searchParams;
  const r = lunaRange(sp.get("luna"));
  const firme = await listCompanies();
  const firmaId = sp.get("firma") ? Number(sp.get("firma")) : null;

  const { rows } = await pool.query(
    `SELECT t.booking_date, t.amount, t.currency, t.counterparty, t.description, t.company_id
     FROM bank_transactions t
     WHERE t.booking_date BETWEEN $1 AND $2 AND ($3::int IS NULL OR t.company_id = $3)
     ORDER BY t.booking_date, t.id`,
    [r.from, r.to, firmaId]
  );
  const numeFirma = new Map(firme.map((f) => [f.id, f.name]));

  return NextResponse.json(
    {
      luna: r.luna,
      firme: firme.map((f) => ({ id: f.id, name: f.name })),
      tranzactii: rows.map((t) => ({
        data: new Date(t.booking_date).toISOString().slice(0, 10),
        suma: Number(t.amount),
        moneda: t.currency,
        partener: t.counterparty,
        detalii: t.description,
        firma: numeFirma.get(t.company_id) ?? null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
