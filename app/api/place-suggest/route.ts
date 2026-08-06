// Autocomplete firme de pe Google Maps — pentru câmpul de nume din /service.
// Userul tastează → sugestii cu firmele reale → alege una → avem place_id exact.

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!rateLimit(`place-suggest:${getClientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ suggestions: [] });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const city = (searchParams.get("city") ?? "").trim().slice(0, 40);

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const input = encodeURIComponent(city ? `${q} ${city}` : q);
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=establishment&components=country:ro&language=ro&key=${key}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();
    const suggestions = (data.predictions ?? []).slice(0, 5).map((p: any) => ({
      placeId: String(p.place_id ?? ""),
      name: String(p.structured_formatting?.main_text ?? p.description ?? ""),
      detail: String(p.structured_formatting?.secondary_text ?? ""),
    }));
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
