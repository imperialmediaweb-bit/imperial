// Firmele din panou (doar admin): adaugă sau modifică numele, CUI-ul și cuvintele după care se recunoaște.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";
import { listCompanies } from "@/lib/finante/companies";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  await listCompanies();
  const b = await req.json().catch(() => ({}));
  const name = String(b?.name ?? "").trim().slice(0, 120);
  const cui = String(b?.cui ?? "").replace(/\D/g, "").slice(0, 12) || null;
  const aliases = String(b?.aliases ?? "").slice(0, 300) || null;
  if (!name) return NextResponse.json({ error: "Numele firmei e obligatoriu." }, { status: 400 });
  const pool = getPool()!;
  if (Number(b?.id)) await pool.query(`UPDATE fin_companies SET name = $2, cui = $3, aliases = $4 WHERE id = $1`, [Number(b.id), name, cui, aliases]);
  else await pool.query(`INSERT INTO fin_companies (name, cui, aliases) VALUES ($1, $2, $3)`, [name, cui, aliases]);
  await audit(u.email, "firma-salvata", `${name} ${cui ?? ""}`);
  return NextResponse.json({ ok: true });
}
