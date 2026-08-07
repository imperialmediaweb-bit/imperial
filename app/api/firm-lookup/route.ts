// Verificare CUI live la ANAF — pentru formularul /service.
// Userul tastează CUI-ul → apare instant firma („✓ LEGIO WEB DEVELOPMENT TOOL SRL — activă").

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!rateLimit(`firm-lookup:${getClientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ found: false });
  }

  const { searchParams } = new URL(req.url);
  const cuiRaw = String(searchParams.get("cui") ?? "").replace(/\D/g, "");
  if (cuiRaw.length < 2 || cuiRaw.length > 10) {
    return NextResponse.json({ found: false });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch("https://webservicesp.anaf.ro/PlatitorTvaWs/api/v9/ws/tva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ cui: Number(cuiRaw), data: today }]),
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    const f = data?.found?.[0];
    if (!f?.date_generale?.denumire) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({
      found: true,
      name: String(f.date_generale.denumire),
      active: !(f.stare_inactiv?.statusInactivi === true),
      vatPayer: f.inregistrare_scop_Tva?.scpTVA === true,
      city: f.date_generale.adresa ? String(f.date_generale.adresa).slice(0, 120) : null,
    });
  } catch {
    return NextResponse.json({ found: false, error: "anaf_unavailable" });
  }
}
