// Generator de raport digital pentru afaceri.
// Primește datele firmei → scanează Google + site-ul → Claude generează
// raport complet: diagnostic, scoruri, pierderi estimate, plan de acțiune.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export type Competitor = {
  name: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
};

export type ServiceReport = {
  companyName: string;
  overallScore: number;
  lostClientsPerMonth: number;
  lostRevenuePerMonth: number;
  googleData: {
    found: boolean;
    rating?: number;
    reviewCount?: number;
    hasWebsite?: boolean;
  };
  competitors: Competitor[];
  diagnostics: Array<{
    area: string;
    emoji: string;
    status: "good" | "warning" | "bad";
    finding: string;
  }>;
  actionPlan: Array<{
    phase: string;
    title: string;
    actions: string[];
    investment: string;
    impact: string;
  }>;
  summary: string;
};

export async function POST(req: Request) {
  if (!rateLimit(`service-report:${getClientIp(req)}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Prea multe rapoarte generate. Revino în câteva minute." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const companyName = String(body?.companyName ?? "").trim();
  const city = String(body?.city ?? "").trim();
  const industry = String(body?.industry ?? "").trim();
  const website = String(body?.website ?? "").trim();
  const facebook = String(body?.facebook ?? "").trim();
  const monthlyClients = String(body?.monthlyClients ?? "").trim();
  const avgValue = String(body?.avgValue ?? "").trim();
  const mainProblem = String(body?.mainProblem ?? "").trim();

  if (!companyName || !city || !industry) {
    return NextResponse.json(
      { error: "Numele firmei, orașul și domeniul sunt obligatorii." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }

  // ─── 1. Scanare Google Places (date reale) ───
  let googleData: any = { found: false };
  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  if (placesKey) {
    try {
      const q = encodeURIComponent(`${companyName} ${city}`);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${q}&inputtype=textquery&fields=name,rating,user_ratings_total,website,business_status&key=${placesKey}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      if (data.candidates?.length > 0) {
        const p = data.candidates[0];
        googleData = {
          found: true,
          name: p.name,
          rating: p.rating ?? null,
          reviewCount: p.user_ratings_total ?? 0,
          hasWebsite: !!p.website,
          website: p.website ?? null,
        };
      }
    } catch (e) {
      console.warn("[service-report] Places scan failed:", e);
    }
  }

  // ─── 1b. Scanare COMPETIȚIE locală (top 5 din domeniu + oraș) ───
  let competitors: Competitor[] = [];
  if (placesKey) {
    try {
      const cq = encodeURIComponent(`${industry} ${city}`);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cq}&language=ro&key=${placesKey}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      competitors = (data.results ?? [])
        .filter((p: any) => p.name?.toLowerCase() !== companyName.toLowerCase())
        .slice(0, 4)
        .map((p: any) => ({
          name: String(p.name ?? ""),
          rating: p.rating ?? null,
          reviewCount: p.user_ratings_total ?? 0,
          hasWebsite: false, // detaliul website cere Place Details; estimăm din prezența pe Maps
        }));
    } catch (e) {
      console.warn("[service-report] competitor scan failed:", e);
    }
  }

  // ─── 2. Scanare site (dacă a dat URL) ───
  let siteData: any = null;
  const siteUrl = website || googleData.website;
  if (siteUrl) {
    try {
      const withProto = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
      const start = Date.now();
      const res = await fetch(withProto, {
        signal: AbortSignal.timeout(10000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        },
      });
      const loadMs = Date.now() - start;
      const html = (await res.text()).slice(0, 6000);
      siteData = {
        reachable: res.ok,
        loadTimeMs: loadMs,
        isHttps: withProto.startsWith("https"),
        hasViewport: /name=["']viewport["']/i.test(html),
        hasMetaDesc: /name=["']description["']/i.test(html),
        hasH1: /<h1[\s>]/i.test(html),
      };
    } catch {
      siteData = { reachable: false };
    }
  }

  // ─── 3. Claude generează raportul complet ───
  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }

  const prompt = `Ești consultant digital senior. Generează un raport de diagnostic digital pentru această afacere din România. Fii SINCER, DIRECT și CONCRET — cifrele reale contează mai mult decât politețea.

DATE FIRMĂ (de la proprietar):
- Nume: ${companyName}
- Oraș: ${city}
- Domeniu: ${industry}
- Site declarat: ${website || "NU ARE / nu a dat"}
- Facebook declarat: ${facebook || "NU ARE / nu a dat"}
- Clienți pe lună: ${monthlyClients || "necunoscut"}
- Valoare medie per client: ${avgValue || "necunoscut"}
- Problema principală (în cuvintele lui): ${mainProblem || "nespecificată"}

DATE REALE GOOGLE (scanate acum):
${googleData.found ? `- Găsit pe Google Maps: DA\n- Rating: ${googleData.rating ?? "fără rating"} (${googleData.reviewCount} recenzii)\n- Are site listat: ${googleData.hasWebsite ? "DA" : "NU"}` : `- NU a fost găsit pe Google Maps → NU are Google Business Profile (problemă gravă)`}

COMPETIȚIA LOCALĂ REALĂ (scanată acum — top firme din "${industry} ${city}" pe Google):
${competitors.length > 0 ? competitors.map((c) => `- ${c.name}: ${c.rating ?? "fără"} rating, ${c.reviewCount} recenzii`).join("\n") : "- Nu s-au putut scana competitorii"}

DATE REALE SITE (scanate acum):
${siteData ? (siteData.reachable ? `- Site funcțional: DA\n- Timp răspuns: ${siteData.loadTimeMs}ms\n- HTTPS: ${siteData.isHttps ? "DA" : "NU"}\n- Mobile viewport: ${siteData.hasViewport ? "DA" : "NU"}\n- Meta description: ${siteData.hasMetaDesc ? "DA" : "NU"}\n- H1: ${siteData.hasH1 ? "DA" : "NU"}` : "- Site-ul NU răspunde / e picat") : "- Nu are site de scanat"}

Generează raportul ca JSON EXACT în acest format (doar JSON, nimic altceva):
{
  "overallScore": <0-100, sănătatea digitală generală>,
  "lostClientsPerMonth": <estimare realistă clienți pierduți lunar din lipsa prezenței online>,
  "lostRevenuePerMonth": <lostClients × valoarea medie (dacă știută, altfel estimează pentru industrie) în EUR>,
  "diagnostics": [
    {"area":"Site web","emoji":"🌐","status":"good|warning|bad","finding":"constatare concretă 1 frază"},
    {"area":"Google Business","emoji":"📍","status":"...","finding":"..."},
    {"area":"Recenzii","emoji":"⭐","status":"...","finding":"... (compară cu competiția!)"},
    {"area":"Social Media","emoji":"📱","status":"...","finding":"..."},
    {"area":"Vizibilitate SEO","emoji":"🔍","status":"...","finding":"..."},
    {"area":"Procese & vânzare (offline)","emoji":"🏪","status":"...","finding":"analiza fluxului de clienți/organizării — dedusă din problema descrisă + industrie"}
  ],
  "actionPlan": [
    {"phase":"FAZA 1 — URGENT (luna 1)","title":"...","actions":["...","..."],"investment":"X-Y€","impact":"+N clienți/lună estimat"},
    {"phase":"FAZA 2 — CREȘTERE (lunile 2-3)","title":"...","actions":["..."],"investment":"...","impact":"..."},
    {"phase":"FAZA 3 — CONSOLIDARE (lunile 4-6)","title":"...","actions":["..."],"investment":"...","impact":"..."},
    {"phase":"FAZA 4 — DOMINARE (lunile 6-12)","title":"...","actions":["..."],"investment":"...","impact":"poziție de lider local"}
  ],
  "summary": "2-3 fraze sincere: starea actuală + ce se întâmplă dacă implementează planul"
}

Prețuri de referință Imperial Media: site prezentare 699-1.500€, site cu funcții 1.400-2.500€, magazin 1.800-4.500€, promovare 50 ziare 300€ (GRATUIT la site nou), mentenanță 50€/lună, Google Business setup gratuit la orice comandă.`;

  try {
    const resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("empty");
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no json");
    const parsed = JSON.parse(jsonMatch[0]);

    const report: ServiceReport = {
      companyName,
      overallScore: Math.max(0, Math.min(100, Number(parsed.overallScore) || 40)),
      lostClientsPerMonth: Math.max(0, Number(parsed.lostClientsPerMonth) || 0),
      lostRevenuePerMonth: Math.max(0, Number(parsed.lostRevenuePerMonth) || 0),
      googleData: {
        found: !!googleData.found,
        rating: googleData.rating ?? undefined,
        reviewCount: googleData.reviewCount ?? undefined,
        hasWebsite: googleData.hasWebsite ?? undefined,
      },
      competitors,
      diagnostics: Array.isArray(parsed.diagnostics)
        ? parsed.diagnostics.slice(0, 7).map((d: any) => ({
            area: String(d.area ?? ""),
            emoji: String(d.emoji ?? "📊"),
            status: ["good", "warning", "bad"].includes(d.status) ? d.status : "warning",
            finding: String(d.finding ?? ""),
          }))
        : [],
      actionPlan: Array.isArray(parsed.actionPlan)
        ? parsed.actionPlan.slice(0, 4).map((p: any) => ({
            phase: String(p.phase ?? ""),
            title: String(p.title ?? ""),
            actions: Array.isArray(p.actions) ? p.actions.map(String).slice(0, 5) : [],
            investment: String(p.investment ?? ""),
            impact: String(p.impact ?? ""),
          }))
        : [],
      summary: String(parsed.summary ?? "").slice(0, 500),
    };

    return NextResponse.json(report);
  } catch (e) {
    console.error("[service-report] error:", e);
    return NextResponse.json(
      { error: "Nu am putut genera raportul. Încearcă din nou." },
      { status: 500 }
    );
  }
}
