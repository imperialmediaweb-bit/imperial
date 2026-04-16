// Auth simplu cu parolă pentru panoul admin.
// Parola se verifică server-side; setăm un cookie HMAC-signed cu 24h valabilitate.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "imperial_admin";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24; // 24h

function getSecret(): string {
  // Folosim ADMIN_PASSWORD ca secret HMAC (OK pentru MVP).
  // Pentru producție serioasă, setează separat AUTH_SECRET.
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function buildToken(): string {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const sig = sign(issuedAt);
  return `${issuedAt}.${sig}`;
}

function verifyToken(token: string): boolean {
  const [iat, sig] = token.split(".");
  if (!iat || !sig) return false;
  const issuedAt = parseInt(iat, 10);
  if (!Number.isFinite(issuedAt)) return false;
  const age = Math.floor(Date.now() / 1000) - issuedAt;
  if (age < 0 || age > COOKIE_MAX_AGE_SEC) return false;

  const expected = sign(iat);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAuthed(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function setAuthCookie() {
  cookies().set(COOKIE_NAME, buildToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}
