// Ce căi oferă API-ul StartCo pentru contul nostru (doar admin) — cheia rămâne pe server.
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/finante/auth";
import { startcoConfigured, startcoPaths, startcoSample } from "@/lib/finante/startco";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  if (!startcoConfigured()) return NextResponse.json({ configured: false, paths: [] });
  const url = new URL(req.url);
  if (url.searchParams.get("mostra")) return NextResponse.json(await startcoSample(url.searchParams.get("de") ?? "2026-10-01", url.searchParams.get("pana") ?? "2026-10-31").catch((e) => ({ error: String(e?.message ?? e) })));
  return NextResponse.json({ configured: true, paths: await startcoPaths().catch(() => []) });
}
