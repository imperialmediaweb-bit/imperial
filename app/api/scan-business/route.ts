import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type BusinessScanResult = {
  found: boolean;
  name?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
  businessStatus?: string;
  placeId?: string;
  mapsUrl?: string;
};

export async function POST(req: Request) {
  let body: { name?: string; city?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const city = String(body?.city ?? "").trim();
  if (!name || !city) {
    return NextResponse.json({ error: "Nume firmă și oraș obligatorii." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      found: false,
      fallback: true,
      message: "Google Places API nu e configurat. AI va întreba manual.",
    });
  }

  try {
    const query = encodeURIComponent(`${name} ${city}`);
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,business_status,place_id&key=${apiKey}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      throw new Error(`Google API: ${res.status}`);
    }

    const data = await res.json();

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({
        found: false,
        message: `Nu am găsit "${name}" în ${city} pe Google Maps. Probabil nu ai Google Business Profile.`,
      });
    }

    const place = data.candidates[0];
    const result: BusinessScanResult = {
      found: true,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      website: place.website,
      phone: place.formatted_phone_number,
      businessStatus: place.business_status,
      placeId: place.place_id,
      mapsUrl: place.place_id
        ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        : undefined,
    };

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[/api/scan-business] error:", e);
    return NextResponse.json({
      found: false,
      error: "Nu am putut căuta pe Google. Vom verifica manual.",
    });
  }
}
