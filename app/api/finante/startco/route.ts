// Ce căi oferă API-ul StartCo pentru contul nostru (doar admin) — cheia rămâne pe server.
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/finante/auth";
import { startcoConfigured, startcoPaths } from "@/lib/finante/startco";

export const runtime = "nodejs";

export async function GET() {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  if (!startcoConfigured()) return NextResponse.json({ configured: false, paths: [] });
  return NextResponse.json({ configured: true, paths: await startcoPaths().catch(() => []) });
}
