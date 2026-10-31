import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getClientIp } from "@/lib/rate-limit";
import { audit, ensureAdmin, finanteConfigured, makeSessionToken, sessionCookie, verifyPassword } from "@/lib/finante/auth";

export const runtime = "nodejs";

// doar încercările GREȘITE se numără: 5 la 15 minute pe IP, apoi blocare
const fails = new Map<string, number[]>();
const WINDOW = 15 * 60_000;
const recentFails = (ip: string) => (fails.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW);
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!finanteConfigured()) return NextResponse.json({ error: "Panoul nu e configurat." }, { status: 503 });
  const ip = getClientIp(req);
  if (recentFails(ip).length >= 5) {
    return NextResponse.json({ error: "Prea multe încercări. Așteaptă 15 minute." }, { status: 429 });
  }
  let b: any = {};
  try {
    b = await req.json();
  } catch {}
  const email = String(b?.email ?? "").trim().toLowerCase();
  const password = String(b?.password ?? "");
  await ensureAdmin();
  const pool = getPool()!;
  const { rows } = await pool.query(`SELECT id, email, password_hash FROM finance_users WHERE email = $1 AND active = TRUE`, [email]);
  const u = rows[0];
  if (!u || !verifyPassword(password, u.password_hash)) {
    fails.set(ip, [...recentFails(ip), Date.now()]);
    await audit(email || null, "login-esuat");
    return NextResponse.json({ error: "Email sau parolă greșite." }, { status: 401 });
  }
  fails.delete(ip);
  await pool.query(`UPDATE finance_users SET last_login = NOW() WHERE id = $1`, [u.id]);
  await audit(u.email, "login");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(makeSessionToken(u.id)));
  return res;
}
