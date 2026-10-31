// Notă pe o tranzacție sau „nu are factură” (comision bancar, transfer între conturi, salariu). Doar admin.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const id = Number(b?.id);
  if (!id) return NextResponse.json({ error: "Tranzacție lipsă" }, { status: 400 });
  await getPool()!.query(`UPDATE bank_transactions SET note = COALESCE($2, note), fara_factura = COALESCE($3, fara_factura) WHERE id = $1`, [
    id,
    typeof b.note === "string" ? b.note.slice(0, 300) : null,
    typeof b.fara_factura === "boolean" ? b.fara_factura : null,
  ]);
  await audit(u.email, "tranzactie-nota", String(id));
  return NextResponse.json({ ok: true });
}
