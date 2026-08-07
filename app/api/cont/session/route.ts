// Schimbă linkul magic pe o sesiune de 30 de zile (cookie) și intră în /cont.
// ?logout=1 șterge sesiunea.

import { NextResponse } from "next/server";
import { verifyMagicToken, setClientSession, clearClientSession } from "@/lib/client-auth";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Redirect pe DOMENIUL PUBLIC, nu pe originea cererii — în spatele proxy-ului (Railway),
// originea e adresa internă (0.0.0.0:8080) și browserul ar ateriza în gol.
const base = process.env.NODE_ENV === "production" ? siteConfig.url : "";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const home = `${base || origin}/cont`;

  if (searchParams.get("logout")) {
    clearClientSession();
    return NextResponse.redirect(home);
  }

  const t = searchParams.get("t") ?? "";
  let email: string | null = null;
  try {
    email = verifyMagicToken(t);
  } catch {
    email = null;
  }

  if (!email) {
    return NextResponse.redirect(`${home}?expirat=1`);
  }

  setClientSession(email);
  return NextResponse.redirect(home);
}
