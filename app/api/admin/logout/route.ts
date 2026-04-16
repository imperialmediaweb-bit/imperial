import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
