// Căutare firme după NUME (openapi.ro) — pentru formularul /service.
// Userul scrie „legio" → apar firmele → alege una → CUI-ul se completează singur.
// Fără OPENAPI_RO_KEY setat în env, endpoint-ul răspunde gol (formularul merge normal, doar fără sugestii).

import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FirmSuggestion = { name: string; cui: string; city: string };

// Răspunsul openapi.ro nu e documentat public în detaliu — parsăm defensiv:
// acceptăm mai multe forme de listă și mai multe nume de câmpuri.
function extractList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["data", "results", "companies", "items", "hits"]) {
      const v = d[key];
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") {
        const inner = (v as Record<string, unknown>)["data"];
        if (Array.isArray(inner)) return inner;
      }
    }
  }
  return [];
}

function pickField(item: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

function toSuggestion(raw: unknown): FirmSuggestion | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const name = pickField(item, ["denumire", "nume", "name", "company_name", "companyName", "denumire_firma"]);
  const cui = pickField(item, ["cif", "cui", "fiscal_code", "cod_fiscal", "codFiscal", "vat_code"]).replace(/\D/g, "");
  const city = pickField(item, ["localitate", "oras", "city", "judet", "county", "adresa", "address"]);
  if (!name || !cui || cui.length < 2 || cui.length > 10) return null;
  return { name, cui, city: city.slice(0, 60) };
}

export async function GET(req: Request) {
  if (!rateLimit(`firm-suggest:${getClientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ suggestions: [] });
  }

  const key = process.env.OPENAPI_RO_KEY;
  const { searchParams } = new URL(req.url);
  const q = String(searchParams.get("q") ?? "").trim().slice(0, 60);
  if (!key || q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await fetch("https://api.openapi.ro/v1/companies/search", {
      method: "POST",
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return NextResponse.json({ suggestions: [] });
    const data = await res.json();
    const suggestions = extractList(data)
      .map(toSuggestion)
      .filter((s): s is FirmSuggestion => s !== null)
      .slice(0, 6);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
