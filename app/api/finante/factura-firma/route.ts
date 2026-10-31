// Alocă manual o factură unei firme (pentru facturile „Nealocate”). Doar admin.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const inv = Number(b?.invoiceId);
  const firma = b?.companyId == null ? null : Number(b.companyId);
  if (!inv) return NextResponse.json({ error: "Factură lipsă" }, { status: 400 });
  await getPool()!.query(`UPDATE fin_invoices SET company_id = $2 WHERE id = $1`, [inv, firma]);
  await audit(u.email, "factura-alocata", `${inv} → firma ${firma ?? "-"}`);
  return NextResponse.json({ ok: true });
}
