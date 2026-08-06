// Generator de raport de consultanță pentru afaceri.
// Primește datele firmei → scanează Google + ANAF + site-ul → Claude generează
// raport complet: diagnostic, scoruri, pierderi estimate, plan de acțiune.

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { insertServiceReport } from "@/lib/service-reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export type Competitor = {
  name: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
};

export type AnafData = {
  found: boolean;
  legalName?: string;
  active?: boolean;
  vatPayer?: boolean;
  caen?: string;
  caenLabel?: string;
  regYear?: string;
  address?: string;
  balanceYear?: number;
  turnover?: number;
  profit?: number;
  employees?: number;
};

export type ServiceReport = {
  companyName: string;
  city: string;
  overallScore: number;
  lostClientsPerMonth: number;
  lostRevenuePerMonth: number;
  googleData: {
    found: boolean;
    rating?: number;
    reviewCount?: number;
    hasWebsite?: boolean;
  };
  anafData: AnafData;
  competitors: Competitor[];
  diagnostics: Array<{
    area: string;
    emoji: string;
    status: "good" | "warning" | "bad";
    finding: string;
  }>;
  topRecommendation?: {
    title: string;
    why: string;
    firstStep: string;
  };
  projection?: {
    invest3m: number;
    return3m: number;
    invest12m: number;
    return12m: number;
    breakEvenMonth: number;
    newClientsPerMonth: number;
  };
  industryLeaders?: {
    practices: string[];
    gap: string;
  };
  socialPlan?: {
    reelsPerWeek: number;
    postsPerWeek: number;
    storiesPerWeek: number;
    ideas: string[];
  };
  actionPlan: Array<{
    phase: string;
    title: string;
    actions: string[];
    investment: string;
    impact: string;
  }>;
  summary: string;
};

// Ce vede vizitatorul ÎNAINTE de plată — restul raportului rămâne pe server.
export type ServiceReportPreview = Pick<
  ServiceReport,
  | "companyName"
  | "city"
  | "overallScore"
  | "lostClientsPerMonth"
  | "lostRevenuePerMonth"
  | "googleData"
  | "anafData"
  | "summary"
>;

// ─── ANAF: registru TVA (nume legal, stare, TVA, CAEN) ───
async function fetchAnafTva(cui: number): Promise<Partial<AnafData>> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch("https://webservicesp.anaf.ro/PlatitorTvaWs/api/v9/ws/tva", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ cui, data: today }]),
    signal: AbortSignal.timeout(6000),
  });
  const data = await res.json();
  const f = data?.found?.[0];
  if (!f?.date_generale?.denumire) return { found: false };
  const dg = f.date_generale;
  return {
    found: true,
    legalName: String(dg.denumire),
    active: !(f.stare_inactiv?.statusInactivi === true),
    vatPayer: f.inregistrare_scop_Tva?.scpTVA === true,
    caen: dg.cod_CAEN ? String(dg.cod_CAEN) : undefined,
    regYear: dg.data_inregistrare ? String(dg.data_inregistrare).slice(0, 4) : undefined,
    address: dg.adresa ? String(dg.adresa).slice(0, 160) : undefined,
  };
}

// ─── ANAF: bilanț publicat (cifră de afaceri, profit, salariați) ───
async function fetchAnafBilant(cui: number, year: number): Promise<Partial<AnafData> | null> {
  const res = await fetch(`https://webservicesp.anaf.ro/bilant?an=${year}&cui=${cui}`, {
    signal: AbortSignal.timeout(6000),
  });
  const data = await res.json();
  const indicators: any[] = Array.isArray(data?.i) ? data.i : [];
  if (indicators.length === 0) return null;
  const find = (needle: string) =>
    indicators.find((x) => String(x.val_den_indicator ?? "").toLowerCase().includes(needle));
  const turnover = find("cifra de afaceri");
  const profit = find("profit sau pierdere net") ?? find("profit");
  const employees = find("salariati") ?? find("salariați");
  return {
    balanceYear: year,
    turnover: turnover ? Number(turnover.val_indicator) : undefined,
    profit: profit ? Number(profit.val_indicator) : undefined,
    employees: employees ? Number(employees.val_indicator) : undefined,
    caenLabel: data?.den_caen ? String(data.den_caen) : undefined,
    caen: data?.caen ? String(data.caen) : undefined,
  };
}

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
  const businessType = ["local", "online", "ambele"].includes(body?.businessType)
    ? (body.businessType as string)
    : "local";
  const placeId = String(body?.placeId ?? "").trim();
  const cuiRaw = String(body?.cui ?? "").replace(/\D/g, "");
  const website = String(body?.website ?? "").trim();
  const facebook = String(body?.facebook ?? "").trim();
  const monthlyClients = String(body?.monthlyClients ?? "").trim();
  const avgValue = String(body?.avgValue ?? "").trim();
  const mainProblem = String(body?.mainProblem ?? "").trim();
  // Atribuire: cod de recomandare / partener (vin din URL, se salvează pe raport)
  const ref = /^[a-z0-9]{4,16}$/i.test(String(body?.ref ?? "")) ? String(body.ref).toLowerCase() : "";
  const partner = /^[a-z0-9-]{2,24}$/i.test(String(body?.partner ?? "")) ? String(body.partner).toLowerCase() : "";

  if (!companyName || !city || !industry) {
    return NextResponse.json(
      { error: "Numele afacerii, orașul și domeniul sunt obligatorii." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;

  // ─── 1. Scanare Google (exactă cu place_id, altfel căutare text) ───
  let googleData: any = { found: false };
  if (placesKey) {
    try {
      if (placeId) {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,website,business_status&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        const p = data?.result;
        if (p?.name) {
          googleData = {
            found: true,
            exact: true,
            name: p.name,
            rating: p.rating ?? null,
            reviewCount: p.user_ratings_total ?? 0,
            hasWebsite: !!p.website,
            website: p.website ?? null,
          };
        }
      }
      if (!googleData.found) {
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
            exact: false,
            name: p.name,
            rating: p.rating ?? null,
            reviewCount: p.user_ratings_total ?? 0,
            hasWebsite: !!p.website,
            website: p.website ?? null,
          };
        }
      }
    } catch (e) {
      console.warn("[service-report] Places scan failed:", e);
    }
  }

  // ─── 1b. Verificare ANAF pe CUI: firmă + CAEN + cifră de afaceri ───
  let anafData: AnafData = { found: false };
  if (cuiRaw.length >= 2 && cuiRaw.length <= 10) {
    const cui = Number(cuiRaw);
    try {
      const tva = await fetchAnafTva(cui);
      anafData = { ...anafData, ...tva };
    } catch (e) {
      console.warn("[service-report] ANAF TVA failed:", e);
    }
    if (anafData.found) {
      const lastYear = new Date().getFullYear() - 1;
      for (const year of [lastYear, lastYear - 1]) {
        try {
          const bilant = await fetchAnafBilant(cui, year);
          if (bilant) {
            anafData = { ...anafData, ...bilant };
            break;
          }
        } catch (e) {
          console.warn(`[service-report] ANAF bilant ${year} failed:`, e);
        }
      }
    }
  }

  // ─── 1c. Competiția locală (doar pentru afaceri cu punct fizic) ───
  let competitors: Competitor[] = [];
  if (placesKey && businessType !== "online") {
    try {
      const cq = encodeURIComponent(`${industry} ${city}`);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cq}&language=ro&key=${placesKey}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      const ownName = (googleData.name ?? companyName).toLowerCase();
      competitors = (data.results ?? [])
        .filter((p: any) => p.name?.toLowerCase() !== ownName)
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

  // ─── 2b. Scanare Facebook (există pagina? ce semnale are?) ───
  let fbData: any = null;
  if (facebook) {
    try {
      const handle = facebook
        .replace(/^https?:\/\/(www\.|m\.)?facebook\.com\//i, "")
        .replace(/^@/, "")
        .split(/[?#]/)[0]
        .trim();
      const fbUrl = /^https?:\/\//i.test(facebook)
        ? facebook
        : `https://www.facebook.com/${encodeURIComponent(handle)}`;
      const res = await fetch(fbUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        },
        redirect: "follow",
      });
      const html = (await res.text()).slice(0, 60000);
      const ogTitle = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1]
        ?? html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1];
      const ogDesc = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]
        ?? html.match(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1];
      const followers = html.match(/([\d.,]+)\s*(?:de\s+)?(?:aprecieri|urm[ăa]ritori|followers|likes)/i)?.[1];
      const looksDead = /page not found|pagina nu a fost g[ăa]sit|content isn'?t available|con[țt]inutul nu (?:mai )?este disponibil/i.test(html);
      fbData = {
        reachable: res.ok && !looksDead,
        title: ogTitle ?? null,
        description: ogDesc ? ogDesc.slice(0, 200) : null,
        followers: followers ?? null,
      };
    } catch {
      fbData = { reachable: false };
    }
  }

  // ─── 3. Claude generează raportul complet ───
  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }

  const typeLabel =
    businessType === "online"
      ? "AFACERE ONLINE (fără punct fizic — clienții vin din online, nu din trafic local)"
      : businessType === "ambele"
        ? "AFACERE MIXTĂ (punct fizic + vânzare/clienți online)"
        : "AFACERE LOCALĂ (punct fizic — clienții vin din zonă)";

  const anafBlock = anafData.found
    ? `DATE OFICIALE ANAF (verificate acum pe CUI):
- Denumire legală: ${anafData.legalName}
- Stare: ${anafData.active ? "ACTIVĂ" : "INACTIVĂ (red flag major — menționează!)"}
- Plătitor TVA: ${anafData.vatPayer ? "DA" : "NU"}
- CAEN: ${anafData.caen ?? "necunoscut"}${anafData.caenLabel ? ` (${anafData.caenLabel})` : ""}
- Înregistrată din: ${anafData.regYear ?? "necunoscut"}
${anafData.turnover != null ? `- BILANȚ ${anafData.balanceYear}: cifră de afaceri ${anafData.turnover.toLocaleString("ro-RO")} lei · ${anafData.profit != null ? `profit net ${anafData.profit.toLocaleString("ro-RO")} lei` : "profit necunoscut"} · ${anafData.employees != null ? `${anafData.employees} salariați` : "salariați necunoscut"}
IMPORTANT: calculează pierderile CA PROCENT din cifra de afaceri reală și exprimă-le și în lei/an (1 EUR ≈ 5 lei).` : "- Bilanț: nedepus / indisponibil"}`
    : "DATE ANAF: nu s-a dat CUI sau firma nu a fost găsită — lucrează cu cifrele declarate de proprietar.";

  const prompt = `Ești un consultant de afaceri cu 10+ ani de experiență STRICT în domeniul "${industry}" din România. Cunoști în detaliu cum funcționează acest tip de afacere: canalele reale de achiziție de clienți, marjele tipice, sezonalitatea, greșelile clasice ale patronilor din domeniu și ce fac liderii pieței diferit. Generează un raport de consultanță pentru afacerea de mai jos.

REGULI ANTI-ȘABLON (obligatorii):
- INTERZIS sfaturi generice ("e important să ai site", "fii activ pe social media"). Fiecare constatare pleacă de la DATELE REALE de mai jos: cifrele lor, ratingul lor vs competitori, site-ul lor scanat, problema descrisă de ei.
- Ariile de diagnostic le ALEGI TU: 5-8 arii RELEVANTE pentru domeniul "${industry}" și tipul afacerii (ex: notariat → "Programări & accesibilitate", "Poziția pe «notar + oraș»"; imobiliare → "Calitatea anunțurilor", "Tururi virtuale"; service auto → "Recenzii & încredere", "Apeluri pierdute"; afacere online → "Funnel & conversie", "SEO național", "Încredere & dovezi sociale").
- Folosește benchmarkuri din domeniu: câte recenzii are un lider local tipic, ce canale aduc clienți în acest domeniu, ticket mediu tipic — și compară-i direct ("ai 12 recenzii, un lider local are 200+").
- Planul de acțiune = acțiuni SPECIFICE domeniului, cu cifrele lor, nu pași generici.
- OFFLINE OBLIGATORIU: fiecare fază din actionPlan conține MINIM o acțiune offline pentru afacerea lui — procese, vânzare, oferte, fidelizarea clienților, organizare, upsell, promovare locală (presă locală, parteneriate cu alte firme din zonă, evenimente, materiale la punctul de lucru) — specifică domeniului (ex: service auto → sună clienții la 6 luni pentru revizie; salon → pachete de abonament pentru cliente fidele; restaurant → oferta de prânz pentru firmele din zonă). Nu doar digital.
- Fii SINCER și DIRECT — cifrele contează mai mult decât politețea.

TIP AFACERE: ${typeLabel}
${businessType === "online" ? "ATENȚIE: fiind afacere online, NU penaliza lipsa unui punct pe Google Maps și NU analiza competiția locală din oraș — analizează prezența în căutări, funnel-ul online, încrederea și competiția din nișă la nivel național." : ""}

DATE FIRMĂ (de la proprietar):
- Brand: ${companyName}
- Oraș: ${city}
- Domeniu: ${industry}
- Site declarat: ${website || "NU ARE / nu a dat"}
- Facebook declarat: ${facebook || "NU ARE / nu a dat"}
- Clienți pe lună: ${monthlyClients || "necunoscut"}
- Valoare medie per client: ${avgValue || "necunoscut"}
- Problema principală (în cuvintele lui): ${mainProblem || "nespecificată"}

${anafBlock}

DATE REALE GOOGLE (scanate acum):
${googleData.found ? `- Găsit pe Google Maps: DA${googleData.exact ? " (profil confirmat de utilizator — date exacte)" : ""}\n- Nume profil: ${googleData.name}\n- Rating: ${googleData.rating ?? "fără rating"} (${googleData.reviewCount} recenzii)\n- Are site listat: ${googleData.hasWebsite ? "DA" : "NU"}` : businessType === "online" ? `- Nu are profil Google Maps (normal pentru afacere online — nu penaliza)` : `- NU a fost găsit pe Google Maps sub numele "${companyName}" în ${city} → fie nu are Google Business Profile (problemă gravă), fie e listat sub alt nume. Formulează constatarea prudent.`}

${competitors.length > 0 ? `COMPETIȚIA LOCALĂ REALĂ (scanată acum — top firme din "${industry} ${city}" pe Google):\n${competitors.map((c) => `- ${c.name}: ${c.rating ?? "fără"} rating, ${c.reviewCount} recenzii`).join("\n")}` : ""}

DATE REALE SITE (scanate acum):
${siteData ? (siteData.reachable ? `- Site funcțional: DA\n- Timp răspuns: ${siteData.loadTimeMs}ms\n- HTTPS: ${siteData.isHttps ? "DA" : "NU"}\n- Mobile viewport: ${siteData.hasViewport ? "DA" : "NU"}\n- Meta description: ${siteData.hasMetaDesc ? "DA" : "NU"}\n- H1: ${siteData.hasH1 ? "DA" : "NU"}` : "- Site-ul NU răspunde / e picat") : "- Nu are site de scanat"}

PREZENȚA PE FACEBOOK (scanată acum):
${fbData ? (fbData.reachable ? `- Pagina există: DA${fbData.title ? `\n- Titlu: ${fbData.title}` : ""}${fbData.followers ? `\n- Urmăritori/aprecieri: ~${fbData.followers}` : ""}${fbData.description ? `\n- Descriere: ${fbData.description}` : ""}` : `- Pagina declarată NU a putut fi accesată — posibil inexistentă, ștearsă sau scrisă greșit`) : "- NU are pagină de Facebook declarată"}

REGULĂ CANALE LIPSĂ: pentru FIECARE canal absent sau slab (site, Google Business Profile, pagină Facebook), planul de acțiune TREBUIE să includă crearea/refacerea lui la nivel profesionist — concret ce să conțină ca să arate mai bine decât al competitorilor (nu doar „fă-ți pagină").

Generează raportul ca JSON EXACT în acest format (doar JSON, nimic altceva):
{
  "overallScore": <0-100, sănătatea digitală+comercială generală>,
  "lostClientsPerMonth": <estimare realistă clienți pierduți lunar>,
  "lostRevenuePerMonth": <lostClients × valoarea medie (reală sau tipică industriei) în EUR>,
  "diagnostics": [
    {"area":"<arie aleasă de tine, specifică domeniului>","emoji":"<emoji potrivit>","status":"good|warning|bad","finding":"constatare concretă cu cifre, 1-2 fraze"}
  ],
  "topRecommendation": {"title":"<dacă face UN SINGUR lucru luna asta, care e? scurt, imperativ>","why":"<motivul în cifre, din datele lui reale>","firstStep":"<primul pas concret, de făcut azi>"},
  "projection": {"invest3m":<EUR investiție primele 3 luni>,"return3m":<EUR venit suplimentar estimat în primele 3 luni>,"invest12m":<EUR investiție totală 12 luni>,"return12m":<EUR venit suplimentar estimat pe 12 luni>,"breakEvenMonth":<luna 1-12 în care investiția e recuperată>,"newClientsPerMonth":<clienți în plus/lună la finalul planului>},
  "industryLeaders": {"practices":["<3-4 lucruri concrete pe care le fac liderii din domeniul lui ca să domine>"],"gap":"<diferența principală dintre el și lideri, o frază directă>"},
  "socialPlan": {"reelsPerWeek":<nr realist de reels/săptămână pentru domeniul lui>,"postsPerWeek":<nr postări>,"storiesPerWeek":<nr story-uri>,"ideas":["<4-6 idei CONCRETE de conținut specifice domeniului — ce filmează/postează exact, nu generalități; ex salon: transformare înainte/după cu acordul clientei; restaurant: felul zilei filmat la 12:00">"]},
  "actionPlan": [
    {"phase":"FAZA 1 — URGENT (luna 1)","title":"...","actions":["acțiune specifică domeniului","..."],"investment":"X-Y€","impact":"+N clienți/lună estimat"},
    {"phase":"FAZA 2 — CREȘTERE (lunile 2-3)","title":"...","actions":["..."],"investment":"...","impact":"..."},
    {"phase":"FAZA 3 — CONSOLIDARE (lunile 4-6)","title":"...","actions":["..."],"investment":"...","impact":"..."},
    {"phase":"FAZA 4 — DOMINARE (lunile 6-12)","title":"...","actions":["..."],"investment":"...","impact":"poziție de lider"}
  ],
  "summary": "2-3 fraze sincere: starea actuală + ce se întâmplă dacă implementează planul${anafData.turnover != null ? " + raportează pierderile la cifra de afaceri reală" : ""}"
}

Reguli pentru projection: estimări REALISTE și CONSERVATOARE (mai bine sub-promiți decât să exagerezi), coerente cu investițiile din actionPlan și cu prețurile Imperial Media de mai jos.${anafData.turnover != null ? " Raportează return12m și la cifra de afaceri reală din bilanț." : ""}

Prețuri de referință Imperial Media: site prezentare 699-1.500€, site cu funcții 1.400-2.500€, magazin 1.800-4.500€, promovare 50 ziare 300€ (GRATUIT la site nou), mentenanță 50€/lună, Google Business setup gratuit la orice comandă. Pachet Start Online 500 lei (pentru cine NU vrea încă site): creăm noi Google Business Profile complet + pagină Facebook cu design profesionist (logo simplu, cover, descriere, primele postări) — dacă firma nu are site și pare reticentă la investiție, include-l în FAZA 1 ca prim pas accesibil.

PARTENER: dacă firma e din Botoșani sau județ și i-ar folosi networking-ul, mentoratul antreprenorial sau schimbul de experiență cu alți patroni, include în plan (o singură dată, unde se potrivește natural) recomandarea Bizz Club Botoșani (botosani.bizz.club) — partenerul nostru pentru dezvoltare, o comunitate de antreprenori de calitate din zonă, unde se leagă relații de business reale. Noi acoperim datele și implementarea, ei comunitatea.`;

  try {
    const resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 3500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("empty");
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no json");
    const parsed = JSON.parse(jsonMatch[0]);

    const tr = parsed.topRecommendation;
    const pj = parsed.projection;
    const il = parsed.industryLeaders;
    const sp = parsed.socialPlan;

    const report: ServiceReport = {
      companyName,
      city,
      overallScore: Math.max(0, Math.min(100, Number(parsed.overallScore) || 40)),
      lostClientsPerMonth: Math.max(0, Number(parsed.lostClientsPerMonth) || 0),
      lostRevenuePerMonth: Math.max(0, Number(parsed.lostRevenuePerMonth) || 0),
      googleData: {
        found: !!googleData.found,
        rating: googleData.rating ?? undefined,
        reviewCount: googleData.reviewCount ?? undefined,
        hasWebsite: googleData.hasWebsite ?? undefined,
      },
      anafData,
      competitors,
      diagnostics: Array.isArray(parsed.diagnostics)
        ? parsed.diagnostics.slice(0, 8).map((d: any) => ({
            area: String(d.area ?? ""),
            emoji: String(d.emoji ?? "📊"),
            status: ["good", "warning", "bad"].includes(d.status) ? d.status : "warning",
            finding: String(d.finding ?? ""),
          }))
        : [],
      topRecommendation:
        tr && tr.title
          ? {
              title: String(tr.title).slice(0, 160),
              why: String(tr.why ?? "").slice(0, 400),
              firstStep: String(tr.firstStep ?? "").slice(0, 300),
            }
          : undefined,
      projection:
        pj && Number.isFinite(Number(pj.return12m))
          ? {
              invest3m: Math.max(0, Number(pj.invest3m) || 0),
              return3m: Math.max(0, Number(pj.return3m) || 0),
              invest12m: Math.max(0, Number(pj.invest12m) || 0),
              return12m: Math.max(0, Number(pj.return12m) || 0),
              breakEvenMonth: Math.min(24, Math.max(1, Number(pj.breakEvenMonth) || 6)),
              newClientsPerMonth: Math.max(0, Number(pj.newClientsPerMonth) || 0),
            }
          : undefined,
      industryLeaders:
        il && Array.isArray(il.practices) && il.practices.length > 0
          ? {
              practices: il.practices.map(String).slice(0, 4),
              gap: String(il.gap ?? "").slice(0, 300),
            }
          : undefined,
      socialPlan:
        sp && Array.isArray(sp.ideas) && sp.ideas.length > 0
          ? {
              reelsPerWeek: Math.max(0, Math.min(14, Number(sp.reelsPerWeek) || 0)),
              postsPerWeek: Math.max(0, Math.min(14, Number(sp.postsPerWeek) || 0)),
              storiesPerWeek: Math.max(0, Math.min(21, Number(sp.storiesPerWeek) || 0)),
              ideas: sp.ideas.map(String).slice(0, 6),
            }
          : undefined,
      actionPlan: Array.isArray(parsed.actionPlan)
        ? parsed.actionPlan.slice(0, 4).map((p: any) => ({
            phase: String(p.phase ?? ""),
            title: String(p.title ?? ""),
            actions: Array.isArray(p.actions) ? p.actions.map(String).slice(0, 5) : [],
            investment: String(p.investment ?? ""),
            impact: String(p.impact ?? ""),
          }))
        : [],
      summary: String(parsed.summary ?? "").slice(0, 600),
    };

    // ─── 4. Salvăm raportul complet cu token; vizitatorul primește doar preview-ul ───
    const token = randomUUID();
    let saved = false;
    try {
      saved = await insertServiceReport({
        token,
        formData: { companyName, city, industry, businessType, cui: cuiRaw, website, facebook, monthlyClients, avgValue, mainProblem, ref, partner },
        report,
      });
    } catch (e) {
      console.error("[service-report] DB save failed:", e);
    }

    if (!saved) {
      // Fără DB — nu putem ține raportul „sub cheie", îl dăm direct (degradare grațioasă).
      return NextResponse.json({ locked: false, report });
    }

    const preview: ServiceReportPreview = {
      companyName: report.companyName,
      city: report.city,
      overallScore: report.overallScore,
      lostClientsPerMonth: report.lostClientsPerMonth,
      lostRevenuePerMonth: report.lostRevenuePerMonth,
      googleData: report.googleData,
      anafData: report.anafData,
      summary: report.summary,
    };
    return NextResponse.json({ locked: true, token, preview });
  } catch (e) {
    console.error("[service-report] error:", e);
    return NextResponse.json(
      { error: "Nu am putut genera raportul. Încearcă din nou." },
      { status: 500 }
    );
  }
}
