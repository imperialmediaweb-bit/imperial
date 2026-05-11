import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("q") ?? "";
  const city = url.searchParams.get("city") ?? "";

  if (!query || !city) {
    return NextResponse.json({ error: "q și city obligatorii." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY lipsă." }, { status: 503 });
  }

  try {
    const search = encodeURIComponent(`${query} ${city}`);
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&language=ro&key=${apiKey}`,
      { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();

    const results = (data.results ?? []).map((p: any) => ({
      name: p.name ?? "",
      address: p.formatted_address ?? "",
      rating: p.rating ?? null,
      reviewCount: p.user_ratings_total ?? 0,
      placeId: p.place_id ?? "",
      types: p.types ?? [],
      openNow: p.opening_hours?.open_now ?? null,
    }));

    // Pentru fiecare, verificăm dacă au website (Place Details)
    const detailed = await Promise.all(
      results.slice(0, 20).map(async (r: any) => {
        try {
          const detRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${r.placeId}&fields=website,formatted_phone_number&key=${apiKey}`,
            { signal: AbortSignal.timeout(5000) }
          );
          const det = await detRes.json();
          return {
            ...r,
            website: det.result?.website ?? null,
            phone: det.result?.formatted_phone_number ?? null,
            hasWebsite: !!det.result?.website,
            isLead: !det.result?.website || r.reviewCount < 10,
          };
        } catch {
          return { ...r, website: null, phone: null, hasWebsite: false, isLead: true };
        }
      })
    );

    return NextResponse.json({
      results: detailed,
      total: detailed.length,
      query: `${query} ${city}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Eroare căutare." }, { status: 500 });
  }
}
