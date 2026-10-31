// Pornește conectarea la Banca Transilvania (doar admin): întoarce linkul spre autentificarea în BT.
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { audit, requireUser, signState } from "@/lib/finante/auth";
import { bankingConfigured, startAuth } from "@/lib/finante/enablebanking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  if (!bankingConfigured()) return NextResponse.json({ error: "Lipsesc ENABLEBANKING_APP_ID / ENABLEBANKING_PRIVATE_KEY în Railway." }, { status: 503 });
  const origin = new URL(req.url).origin.replace("http://", "https://");
  const b = await req.json().catch(() => ({}));
  const firma = Number(b?.firma) || 0;
  const state = signState(`${Date.now()}-${firma}-${randomBytes(6).toString("hex")}`);
  try {
    const url = await startAuth(`${origin}/api/finante/banca/callback`, state);
    await audit(u.email, "banca-conectare-start");
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e).slice(0, 300) }, { status: 502 });
  }
}
