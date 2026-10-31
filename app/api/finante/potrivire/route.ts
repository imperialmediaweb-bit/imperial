// Leagă manual o factură de o tranzacție (sau o dezleagă cu transactionId = null). Doar admin.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const inv = Number(b?.invoiceId);
  const tx = b?.transactionId == null ? null : Number(b.transactionId);
  if (!inv) return NextResponse.json({ error: "Factură lipsă" }, { status: 400 });
  await getPool()!.query(`UPDATE fin_invoices SET transaction_id = $2, match_kind = $3 WHERE id = $1`, [inv, tx, tx ? "manual" : null]);
  await audit(u.email, tx ? "potrivire" : "dezlegare", `${inv} ↔ ${tx ?? "-"}`);
  return NextResponse.json({ ok: true });
}
