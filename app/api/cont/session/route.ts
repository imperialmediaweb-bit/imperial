// Schimbă linkul magic pe o sesiune de 30 de zile (cookie) și intră în /cont.
// ?logout=1 șterge sesiunea.

import { NextResponse } from "next/server";
import { verifyMagicToken, setClientSession, clearClientSession } from "@/lib/client-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  if (searchParams.get("logout")) {
    clearClientSession();
    return NextResponse.redirect(`${origin}/cont`);
  }

  const t = searchParams.get("t") ?? "";
  let email: string | null = null;
  try {
    email = verifyMagicToken(t);
  } catch {
    email = null;
  }

  if (!email) {
    return NextResponse.redirect(`${origin}/cont?expirat=1`);
  }

  setClientSession(email);
  return NextResponse.redirect(`${origin}/cont`);
}
