// Verificarea site-ului existent din analiza gratuită — fapte măsurate + verdict (îmbunătățire / refacere).

import { NextResponse } from "next/server";
import { checkSite } from "@/lib/site-check";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!rateLimit(`analiza-site:${getClientIp(req)}`, 6, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe verificări. Încearcă din nou în câteva minute." }, { status: 429 });
  }
  let b: any = {};
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  const r = await checkSite(String(b?.url ?? "").slice(0, 300));
  if (!r) return NextResponse.json({ error: "Adresa nu pare validă. Scrie-o ca în exemplu: firma-ta.ro" }, { status: 400 });
  return NextResponse.json(r);
}
