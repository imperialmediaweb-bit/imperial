// Autentificarea panoului Finanțe — separată de restul site-ului.
// Parole: scrypt cu sare. Sesiune: cookie semnat HMAC cu FINANTE_SECRET, 12 ore.
// Roluri: admin (Ionuț — tot) și contabil (doar citire + descărcări).

import { createHmac, randomBytes, scryptSync, timingSafeEqual, createCipheriv, createDecipheriv, createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { getPool, ensureSchema } from "@/lib/db";

export type FinRole = "admin" | "contabil";
export type FinUser = { id: number; email: string; name: string | null; role: FinRole };

export const FIN_COOKIE = "finante_sesiune";
const MAX_AGE = 60 * 60 * 12;

function secret(): string {
  const s = process.env.FINANTE_SECRET;
  if (!s || s.length < 24) throw new Error("FINANTE_SECRET lipsește sau e prea scurt (minimum 24 de caractere)");
  return s;
}

export function finanteConfigured(): boolean {
  return !!(process.env.FINANTE_SECRET && process.env.FINANTE_SECRET.length >= 24 && process.env.DATABASE_URL);
}

export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [alg, saltHex, hashHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const got = scryptSync(pw, Buffer.from(saltHex, "hex"), expected.length, { N: 16384, r: 8, p: 1 });
  return got.length === expected.length && timingSafeEqual(got, expected);
}

function sign(v: string): string {
  return createHmac("sha256", secret()).update(v).digest("hex");
}

export function makeSessionToken(userId: number): string {
  const payload = `${userId}.${Math.floor(Date.now() / 1000)}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

function parseToken(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const payload = parts.slice(0, 3).join(".");
  const a = Buffer.from(parts[3], "hex");
  const b = Buffer.from(sign(payload), "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const age = Math.floor(Date.now() / 1000) - Number(parts[1]);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE) return null;
  const id = Number(parts[0]);
  return Number.isFinite(id) ? id : null;
}

export const sessionCookie = (token: string) => ({
  name: FIN_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE,
});

// Primul admin se creează din Railway (FINANTE_ADMIN_EMAIL + FINANTE_ADMIN_PASSWORD), o singură dată
export async function ensureAdmin(): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  const email = process.env.FINANTE_ADMIN_EMAIL?.trim().toLowerCase();
  const pw = process.env.FINANTE_ADMIN_PASSWORD;
  if (!email || !pw) return;
  await pool.query(
    `INSERT INTO finance_users (email, name, role, password_hash) VALUES ($1, 'Administrator', 'admin', $2) ON CONFLICT (email) DO NOTHING`,
    [email, hashPassword(pw)]
  );
}

export async function currentUser(): Promise<FinUser | null> {
  if (!finanteConfigured()) return null;
  const token = (await cookies()).get(FIN_COOKIE)?.value;
  if (!token) return null;
  const id = parseToken(token);
  if (!id) return null;
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const { rows } = await pool.query(`SELECT id, email, name, role FROM finance_users WHERE id = $1 AND active = TRUE`, [id]);
  return rows[0] ?? null;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
}

export async function audit(user: string | null, action: string, detail = ""): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`INSERT INTO finance_audit (user_email, action, detail, ip) VALUES ($1, $2, $3, $4)`, [user, action, detail.slice(0, 500), await clientIp()]).catch(() => {});
}

// Criptare pentru parolele căsuțelor de email (AES-256-GCM, cheie derivată din FINANTE_SECRET)
function key(): Buffer {
  return createHash("sha256").update(`fin-mail:${secret()}`).digest();
}
export function encrypt(text: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return `${iv.toString("hex")}.${c.getAuthTag().toString("hex")}.${enc.toString("hex")}`;
}
export function decrypt(blob: string): string {
  const [iv, tag, data] = blob.split(".");
  const d = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "hex"));
  d.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([d.update(Buffer.from(data, "hex")), d.final()]).toString("utf8");
}

// Pentru rutele API: utilizatorul curent, cu rolul cerut
export async function requireUser(role?: FinRole): Promise<FinUser | null> {
  const u = await currentUser();
  if (!u) return null;
  if (role === "admin" && u.role !== "admin") return null;
  return u;
}

// „state” semnat pentru conectarea la bancă (anti-CSRF pe callback)
export function signState(nonce: string): string {
  return `${nonce}.${createHmac("sha256", secret()).update(`bank:${nonce}`).digest("hex").slice(0, 32)}`;
}
