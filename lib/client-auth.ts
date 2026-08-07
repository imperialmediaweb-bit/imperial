// Autentificare clienți pentru /cont — link magic pe email, fără parole.
// Tokenul din link: base64url(email).exp.hmac — semnat cu AUTH_SECRET/ADMIN_PASSWORD.
// După click, setăm un cookie de sesiune valabil 30 de zile.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "imperial_client";
const LINK_TTL_SEC = 60 * 60 * 24; // linkul din email: 24h — patronii nu deschid emailul în 30 de minute
const SESSION_TTL_SEC = 60 * 60 * 24 * 30; // sesiunea: 30 zile

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("AUTH_SECRET sau ADMIN_PASSWORD trebuie setat");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function b64url(s: string): string {
  return Buffer.from(s, "utf8").toString("base64url");
}

function fromB64url(s: string): string | null {
  try {
    return Buffer.from(s, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function buildToken(email: string, ttlSec: number): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = `${b64url(email.toLowerCase())}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expStr, sig] = parts;
  const payload = `${emailB64}.${expStr}`;
  const expected = sign(payload);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  try {
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  return fromB64url(emailB64);
}

// ─── Link magic ───
export function buildMagicToken(email: string): string {
  return buildToken(email, LINK_TTL_SEC);
}

export function verifyMagicToken(token: string): string | null {
  return verifyToken(token);
}

// ─── Sesiune (cookie) ───
export function setClientSession(email: string) {
  cookies().set(COOKIE_NAME, buildToken(email, SESSION_TTL_SEC), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export function getClientEmail(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function clearClientSession() {
  cookies().delete(COOKIE_NAME);
}
