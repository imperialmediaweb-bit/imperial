// Tester Google Places pentru diagnoză — protejat cu sesiunea de admin.
// Deschizi /api/admin/test-places?q=Imperial Media&city=Botoșani (logat în /admin)
// și vezi PE LOC ce răspunde Google la fiecare pas: statusuri, erori, candidați.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return NextResponse.json({ eroare: "❌ GOOGLE_PLACES_API_KEY LIPSEȘTE din env." });
  }

  const { searchParams } = new URL(req.url);
  const q = String(searchParams.get("q") ?? "Imperial Media").trim();
  const city = String(searchParams.get("city") ?? "Botoșani").trim();
  const query = encodeURIComponent(`${q} ${city}`);

  const out: any = {
    cheie: `setată (${key.slice(0, 10)}…)`,
    cautare: `${q} ${city}`,
  };

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    out.findplace = {
      status: data.status,
      eroare: data.error_message ?? null,
      candidati: (data.candidates ?? []).map((c: any) => ({
        nume: c.name, rating: c.rating ?? null, recenzii: c.user_ratings_total ?? 0, place_id: c.place_id,
      })),
    };
  } catch (e: any) {
    out.findplace = { exceptie: String(e?.message ?? e) };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&language=ro&key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    out.textsearch = {
      status: data.status,
      eroare: data.error_message ?? null,
      rezultate: (data.results ?? []).slice(0, 5).map((c: any) => ({
        nume: c.name, rating: c.rating ?? null, recenzii: c.user_ratings_total ?? 0, place_id: c.place_id,
      })),
    };
  } catch (e: any) {
    out.textsearch = { exceptie: String(e?.message ?? e) };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&components=country:ro&language=ro&key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    out.autocomplete = {
      status: data.status,
      eroare: data.error_message ?? null,
      sugestii: (data.predictions ?? []).slice(0, 5).map((p: any) => ({
        nume: p.structured_formatting?.main_text ?? p.description,
        detaliu: p.structured_formatting?.secondary_text ?? "",
        place_id: p.place_id,
      })),
    };
  } catch (e: any) {
    out.autocomplete = { exceptie: String(e?.message ?? e) };
  }

  out.interpretare =
    out.findplace?.status === "REQUEST_DENIED" || out.textsearch?.status === "REQUEST_DENIED"
      ? "❌ Cheia e refuzată de Google — de obicei: facturarea (billing) nu e activată pe proiectul Google Cloud, sau Places API nu e activat, sau cheia are restricții. Intră în console.cloud.google.com → APIs & Services."
      : out.findplace?.candidati?.length || out.textsearch?.rezultate?.length || out.autocomplete?.sugestii?.length
        ? "✅ Google răspunde și găsește rezultate — dacă raportul tot nu vede firma, problema e potrivirea numelui (folosește autocomplete-ul din formular)."
        : "⚠️ Google răspunde dar nu găsește nimic pe căutarea asta — încearcă alt nume/oraș în parametrii ?q= și ?city=";

  return NextResponse.json(out);
}
