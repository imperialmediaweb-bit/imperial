// Conturile din panou (doar admin): creează contul contabilei (doar citire) sau îl dezactivează.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, hashPassword, requireUser } from "@/lib/finante/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const email = String(b?.email ?? "").trim().toLowerCase();
  const password = String(b?.password ?? "");
  const role = b?.role === "admin" ? "admin" : "contabil";
  const companyIds = Array.isArray(b?.companyIds) ? b.companyIds.map(Number).filter((n: number) => n > 0) : [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Email invalid." }, { status: 400 });
  if (password.length < 12) return NextResponse.json({ error: "Parola trebuie să aibă minimum 12 caractere." }, { status: 400 });
  await getPool()!.query(
    `INSERT INTO finance_users (email, name, role, password_hash, company_ids) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, name = EXCLUDED.name, company_ids = EXCLUDED.company_ids, active = TRUE`,
    [email, String(b?.name ?? "").slice(0, 80) || null, role, hashPassword(password), companyIds.length ? companyIds : null]
  );
  await audit(u.email, "utilizator-salvat", `${email} (${role})`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id || id === u.id) return NextResponse.json({ error: "Nu îți poți dezactiva propriul cont." }, { status: 400 });
  await getPool()!.query(`UPDATE finance_users SET active = FALSE WHERE id = $1`, [id]);
  await audit(u.email, "utilizator-dezactivat", String(id));
  return NextResponse.json({ ok: true });
}
