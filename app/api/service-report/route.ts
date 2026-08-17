// Generator de raport de consultanță pentru afaceri.
// Primește datele firmei → scanează Google + ANAF + site-ul → Claude generează
// raport complet: diagnostic, scoruri, pierderi estimate, plan de acțiune.

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, REPORT_MODEL, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { insertPendingServiceReport, completeServiceReport, failServiceReport } from "@/lib/service-reports";
import { safeExternalUrl } from "@/lib/url-guard";
import { scanSite } from "@/lib/site-scan";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export type Competitor = {
  name: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
  declared?: boolean; // numit chiar de patron în formular — competitor cert, nu ghicit
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
  // Istoricul bilanțurilor (până la 3 ani) — trendul e analiza, nu poza de moment
  history?: Array<{ year: number; turnover?: number; profit?: number; employees?: number }>;
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
    fix?: string;
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
  firstMonthPlan?: Array<{
    week: string;
    focus: string;
    tasks: string[];
    result: string;
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

// Repară un JSON trunchiat (răspuns tăiat de limita de tokeni): închide stringurile
// și parantezele rămase deschise, apoi — dacă tot nu merge — taie înapoi la ultima
// valoare completă și reînchide.
function repairJson(raw: string): string {
  let out = "";
  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  for (const ch of raw) {
    out += ch;
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }
  if (inStr) out += '"';
  out = out.replace(/[,:\s]+$/, "");
  while (stack.length) out += stack.pop();
  out = out.replace(/,\s*([}\]])/g, "$1");
  return out;
}

function parseReportJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {}
  try {
    return JSON.parse(repairJson(raw));
  } catch {}
  let cut = raw;
  for (let i = 0; i < 10; i++) {
    const p = cut.lastIndexOf(",");
    if (p <= 0) break;
    cut = cut.slice(0, p);
    try {
      return JSON.parse(repairJson(cut));
    } catch {}
  }
  throw new Error("unparseable json");
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
  // CUM plătește un client: „Pe vizită / comandă" | „Abonament lunar" |
  // „Abonament / cotizație anuală" | „Proiect / contract unic" — schimbă complet
  // matematica pierderilor (un membru cu cotizație anuală ≠ un client la casă).
  const valueModel = String(body?.valueModel ?? "").trim().slice(0, 60);
  // Competitorii numiți chiar de patron (opțional, separați prin virgulă) —
  // îi scanăm pe NUME, nu ghicim după domeniu.
  const competitorNames = String(body?.competitorNames ?? "").trim().slice(0, 300);
  // Afacerea POVESTITĂ de patron (scris sau dictat cu vocea): ce face, cine-s
  // clienții, cum plătesc — sursa cea mai bună pentru modelul de business.
  const businessDesc = String(body?.businessDesc ?? "").trim().slice(0, 800);
  const employees = String(body?.employees ?? "").trim();
  const mainProblem = String(body?.mainProblem ?? "").trim();
  const zone = String(body?.zone ?? "").trim().slice(0, 120);
  // Poze cu vitrina/produsele — comprimate în browser (max 3 × ~300KB), analizate vizual de AI
  const photos: string[] = Array.isArray(body?.photos)
    ? body.photos
        .slice(0, 3)
        .map(String)
        .filter((p: string) => /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p) && p.length < 1_900_000)
    : [];
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

  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;

  // ─── PIPELINE-UL COMPLET — rulează pe FUNDAL. Browserul primește tokenul imediat
  // și întreabă periodic /api/service-report-status; nicio conexiune lungă pe care
  // proxy-urile (Cloudflare taie la 100s) s-o omoare cu pagina lor HTML de eroare.
  const runPipeline = async (): Promise<ServiceReport> => {
  // ─── 1. Scanare Google (exactă cu place_id, altfel căutare text) ───
  let googleData: any = { found: false };
  let placesError: string | null = null; // eroare TEHNICĂ (cheie/quota) ≠ firma nu există
  if (placesKey) {
    try {
      if (placeId) {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,website,business_status&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        if (data.status && data.status !== "OK") {
          placesError = String(data.status);
          console.error("[service-report] Places details status:", data.status, data.error_message ?? "");
        }
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
        if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          placesError = String(data.status);
          console.error("[service-report] Places findplace status:", data.status, data.error_message ?? "");
        }
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
      // A doua încercare — căutare mai largă (textsearch), acceptată doar dacă
      // numele găsit seamănă cu cel introdus (evităm să luăm alt local).
      if (!googleData.found) {
        const q2 = encodeURIComponent(`${companyName} ${city}`);
        const res2 = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q2}&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data2 = await res2.json();
        if (data2.status && data2.status !== "OK" && data2.status !== "ZERO_RESULTS") {
          placesError = String(data2.status);
          console.error("[service-report] Places textsearch status:", data2.status, data2.error_message ?? "");
        }
        const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const firstWord = norm(companyName).split(/\s+/)[0];
        const hit = (data2.results ?? []).find((p: any) =>
          norm(String(p.name ?? "")).includes(firstWord)
        );
        if (hit) {
          googleData = {
            found: true,
            exact: false,
            name: hit.name,
            rating: hit.rating ?? null,
            reviewCount: hit.user_ratings_total ?? 0,
            hasWebsite: false,
            website: null,
          };
        }
      }
      // A treia încercare — motorul de AUTOCOMPLETE (cel mai bun la potriviri aproximative:
      // nume incomplete, diacritice, ordinea cuvintelor), apoi confirmăm exact pe place_id.
      if (!googleData.found) {
        const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const firstWord = norm(companyName).split(/\s+/)[0];
        const res3 = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(`${companyName} ${city}`)}&types=establishment&components=country:ro&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data3 = await res3.json();
        if (data3.status && data3.status !== "OK" && data3.status !== "ZERO_RESULTS") {
          placesError = String(data3.status);
          console.error("[service-report] Places autocomplete status:", data3.status, data3.error_message ?? "");
        }
        const pred = (data3.predictions ?? []).find((p: any) =>
          norm(String(p.structured_formatting?.main_text ?? p.description ?? "")).includes(firstWord)
        );
        if (pred?.place_id) {
          const res4 = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(pred.place_id)}&fields=name,rating,user_ratings_total,website&language=ro&key=${placesKey}`,
            { signal: AbortSignal.timeout(8000) }
          );
          const data4 = await res4.json();
          const p4 = data4?.result;
          if (p4?.name) {
            googleData = {
              found: true,
              exact: false,
              name: p4.name,
              rating: p4.rating ?? null,
              reviewCount: p4.user_ratings_total ?? 0,
              hasWebsite: !!p4.website,
              website: p4.website ?? null,
            };
          }
        }
      }
    } catch (e) {
      console.warn("[service-report] Places scan failed:", e);
    }
  }

  // ─── 1b. Verificare ANAF pe CUI: firmă + CAEN + cifră de afaceri ───
  let anafData: AnafData = { found: false };
  let anafDown = false; // ANAF picat tehnic ≠ firma nu există
  if (cuiRaw.length >= 2 && cuiRaw.length <= 10) {
    const cui = Number(cuiRaw);
    try {
      const tva = await fetchAnafTva(cui);
      anafData = { ...anafData, ...tva };
    } catch (e) {
      anafDown = true;
      console.warn("[service-report] ANAF TVA failed:", e);
    }
    if (anafData.found) {
      // Istoricul pe până la 3 ani — trendul CA/profit/angajați e adevărata analiză financiară
      const lastYear = new Date().getFullYear() - 1;
      const history: NonNullable<AnafData["history"]> = [];
      for (const year of [lastYear, lastYear - 1, lastYear - 2]) {
        try {
          const bilant = await fetchAnafBilant(cui, year);
          if (bilant?.turnover != null || bilant?.profit != null) {
            history.push({ year, turnover: bilant.turnover, profit: bilant.profit, employees: bilant.employees });
            if (history.length === 1) {
              anafData = { ...anafData, ...bilant }; // cel mai recent an rămâne „principalul"
            }
          }
        } catch (e) {
          console.warn(`[service-report] ANAF bilant ${year} failed:`, e);
        }
      }
      if (history.length > 0) anafData.history = history;
    }
  }

  // ─── 1c. Competiția locală — căutare ȚINTITĂ, nu „domeniu + oraș" pe orb ───
  // Căutarea brută („educație Botoșani") scoate instituții publice și firme înrudite
  // doar cu numele, nu competitori reali. Doi pași: (1) competitorii NUMIȚI de patron
  // se scanează pe nume, cu prioritate; (2) un apel ieftin de AI transformă domeniul
  // în 2-3 căutări pe modelul REAL de business (club de afaceri → „networking
  // antreprenori", nu „educație") și abia alea merg la Google Maps.
  let competitors: Competitor[] = [];
  if (placesKey && businessType !== "online") {
    const seen = new Set<string>();
    const ownName = (googleData.name ?? companyName).toLowerCase();
    const addResult = (p: any, declared = false) => {
      const nm = String(p.name ?? "").trim();
      const key = nm.toLowerCase();
      if (!nm || key === ownName || seen.has(key)) return;
      seen.add(key);
      competitors.push({
        name: nm,
        rating: p.rating ?? null,
        reviewCount: p.user_ratings_total ?? 0,
        hasWebsite: false, // detaliul website cere Place Details; estimăm din prezența pe Maps
        ...(declared ? { declared: true } : {}),
      });
    };

    // (1) Competitorii declarați de patron — certitudine, nu ghicit
    for (const raw of competitorNames.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 4)) {
      try {
        const q = encodeURIComponent(`${raw} ${city}`);
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${q}&inputtype=textquery&fields=name,rating,user_ratings_total&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        if (data.candidates?.[0]) addResult(data.candidates[0], true);
        else addResult({ name: raw }, true); // negăsit pe Maps, dar patronul îl știe — intră în analiză
      } catch {}
    }

    // (2) Interogările țintite scrise de AI pe modelul real de business
    let queries: string[] = [];
    try {
      const qResp = await client.messages.create(
        {
          model: CLAUDE_MODEL,
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `Firma "${companyName}" din ${city}, domeniul "${industry}".${businessDesc ? ` Afacerea, descrisă de patron: ${businessDesc.slice(0, 300)}.` : ""}${mainProblem ? ` Context de la patron: ${mainProblem.slice(0, 200)}.` : ""} Cine sunt competitorii ei REALI — același model de business, care se bat pe ACEIAȘI clienți? Scrie 2-3 interogări de căutare Google Maps care găsesc exact astfel de competitori în ${city}. NU instituții publice, NU domenii doar înrudite ca nume (ex: pentru un club de afaceri → "club de afaceri ${city}" și "networking antreprenori ${city}", NU "educație ${city}"). Răspunde DOAR cu JSON: {"queries":["...","..."]}`,
          }],
        },
        { timeout: 20_000 }
      );
      const qtb = qResp.content.find((b) => b.type === "text");
      const qm = qtb && qtb.type === "text" ? qtb.text.match(/\{[\s\S]*\}/) : null;
      if (qm) {
        const qp = JSON.parse(qm[0]);
        if (Array.isArray(qp.queries)) queries = qp.queries.map(String).filter(Boolean).slice(0, 3);
      }
    } catch (e) {
      console.warn("[service-report] competitor query gen failed:", e);
    }
    if (queries.length === 0) queries = [`${industry} ${city}`];

    for (const q of queries) {
      if (competitors.length >= 6) break;
      try {
        const cq = encodeURIComponent(q);
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cq}&language=ro&key=${placesKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        for (const p of (data.results ?? []).slice(0, 4)) {
          if (competitors.length >= 6) break;
          addResult(p);
        }
      } catch (e) {
        console.warn("[service-report] competitor scan failed:", e);
      }
    }
  }

  // ─── 2. Scanare site MULTI-PAGINĂ (homepage + subpagini cu dovezi) — anti-SSRF ───
  let siteData: any = null;
  const siteUrl = website || googleData.website;
  if (siteUrl) {
    siteData = await scanSite(String(siteUrl));
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
        ? safeExternalUrl(facebook)
        : `https://www.facebook.com/${encodeURIComponent(handle)}`;
      if (!fbUrl) throw new Error("unsafe url");
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

  // ─── 3. Claude generează raportul complet (clientul e inițializat înainte de pipeline) ───

  // ─── 2c. CERCETARE PE INTERNET „LA SÂNGE" — căutare web REALĂ, indiferent de domeniu ───
  // Nu doar testul de vizibilitate AI: presă, platforme sociale, recenzii de pe orice
  // site, semnale pozitive/negative — tot ce există despre firmă online, cu surse.
  // Fail-silent: fără internet ≠ fără raport.
  let aiVisibility: {
    brandVisible: boolean; genericVisible: boolean; note: string; mentions?: string; network?: string;
    press?: string[]; platforms?: string[]; reviewsElsewhere?: string[]; signals?: string[]; negative?: string[];
  } | null = null;
  try {
    const visTools: any = [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }];
    let visMessages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: `Ești un detectiv de reputație online. Fă o cercetare COMPLETĂ pe internet despre firma "${companyName}" din ${city} (domeniul: ${industry}${website ? `, site: ${website}` : ""}). Rulează căutările astea (adaptează formulările dacă ajută):
1) "${industry} ${city} recomandare" — apare firma la căutări generice, fără nume?
2) "${companyName} ${city}" — ce iese la căutarea după nume?
3) "${companyName}" recenzii / păreri / forum
4) "${companyName}" ${city} presă / știri / articol
5) "${companyName}" pe rețele: Facebook, Instagram, LinkedIn, TikTok, YouTube
6) "${companyName}" în alte orașe / rețea / franciză — e cumva FILIALA LOCALĂ a unui brand mai mare (un club dintr-o rețea națională, un service dintr-un lanț, o agenție dintr-o franciză)? Verifică dacă site-ul/brandul central aparține rețelei, nu firmei locale.
7) pentru afaceri cu punct FIZIC (service, magazin, salon...): urma lor practică pe internet — listări în directoare locale, program afișat, poze cu locația, cum îi găsește un client care caută unde să meargă
8) orice altceva promițător ai zărit în rezultate (evenimente, premii, parteneriate, anunțuri de angajare, reclamații)

ATENȚIE LA DEZAMBIGUIZARE: pot exista MAI MULTE branduri cu numele "${companyName}" (în alte orașe/țări). Numără ca relevante DOAR rezultatele legate clar de ACEASTĂ firmă prin: orașul ${city}${website ? `, site-ul ${website}` : ""}, domeniul "${industry}" sau România. Omonimele se IGNORĂ (dar dacă domină rezultatele, spune asta — e o problemă de brand în sine).

Apoi răspunde DOAR cu JSON (liste goale unde chiar n-ai găsit nimic — nu inventa):
{"brandVisible": true/false, "genericVisible": true/false, "note": "o frază concretă: ce imagine își face un străin care caută firma asta pe internet", "mentions": "sursele unde e menționat brandul dincolo de site-ul propriu, pe scurt; «doar site-ul propriu» dacă nu e nicăieri", "network": "dacă e filiala/extensia locală a unui brand mai mare: numele rețelei + ce vine de la centru (site, brand, metodologie); altfel string gol", "press": ["publicație — despre ce era articolul (și anul, dacă se vede)"], "platforms": ["Facebook: ce ai găsit (pagină activă? urmăritori?)", "Instagram/LinkedIn/TikTok/YouTube: la fel, doar ce EXISTĂ"], "reviewsElsewhere": ["platformă: nota/nr recenzii — orice recenzii găsite în afara Google Maps"], "signals": ["semnale pozitive: premii, evenimente, parteneriate, prezență în topuri/directoare, listări locale utile"], "negative": ["semnale negative cu sursa: reclamații, recenzii proaste, articole negative — doar ce ai VĂZUT efectiv"]}`,
      },
    ];
    let visResp = await client.messages.create(
      { model: CLAUDE_MODEL, max_tokens: 2500, tools: visTools, messages: visMessages },
      { timeout: 60_000 }
    );
    // Server tools pot întoarce pause_turn — continuăm bucla serverului
    // (cast: versiunea SDK-ului nu are încă "pause_turn" în tipul stop_reason)
    let visLoops = 0;
    while ((visResp.stop_reason as string) === "pause_turn" && visLoops < 6) {
      visMessages = [...visMessages, { role: "assistant", content: visResp.content as any }];
      visResp = await client.messages.create(
        { model: CLAUDE_MODEL, max_tokens: 2500, tools: visTools, messages: visMessages },
        { timeout: 60_000 }
      );
      visLoops++;
    }
    const visText = visResp.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    const visMatch = visText.match(/\{[\s\S]*\}/);
    if (visMatch) {
      const vp = JSON.parse(visMatch[0]);
      const lst = (v: any, max = 6) => (Array.isArray(v) ? v.map(String).map((s) => s.slice(0, 200)).slice(0, max) : undefined);
      aiVisibility = {
        brandVisible: !!vp.brandVisible,
        genericVisible: !!vp.genericVisible,
        note: String(vp.note ?? "").slice(0, 300),
        mentions: vp.mentions ? String(vp.mentions).slice(0, 400) : undefined,
        network: vp.network ? String(vp.network).slice(0, 300) : undefined,
        press: lst(vp.press),
        platforms: lst(vp.platforms),
        reviewsElsewhere: lst(vp.reviewsElsewhere),
        signals: lst(vp.signals),
        negative: lst(vp.negative),
      };
    }
  } catch (e) {
    console.warn("[service-report] deep web research failed:", e);
  }

  const typeLabel =
    businessType === "online"
      ? "AFACERE ONLINE (fără punct fizic — clienții vin din online, nu din trafic local)"
      : businessType === "ambele"
        ? "AFACERE MIXTĂ (punct fizic + vânzare/clienți online)"
        : "AFACERE LOCALĂ (punct fizic — clienții vin din zonă)";

  // Metrici financiare CALCULATE (deterministe — AI-ul le interpretează, nu le inventează)
  const finLines: string[] = [];
  const hist = anafData.history ?? [];
  if (hist.length > 0) {
    for (const h of hist) {
      finLines.push(`  · ${h.year}: CA ${h.turnover?.toLocaleString("ro-RO") ?? "?"} lei · profit ${h.profit?.toLocaleString("ro-RO") ?? "?"} lei · ${h.employees ?? "?"} salariați`);
    }
    const latest = hist[0];
    const prev = hist[1];
    if (latest?.turnover && prev?.turnover) {
      const yoy = ((latest.turnover - prev.turnover) / prev.turnover) * 100;
      finLines.push(`- TREND CA (calculat): ${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}% față de anul precedent ${yoy < 0 ? "— DECLIN, tratează-l ca prioritate" : yoy < 5 ? "— stagnare practic" : "— creștere"}`);
    }
    if (latest?.turnover && latest?.profit != null) {
      finLines.push(`- MARJĂ NETĂ (calculată): ${((latest.profit / latest.turnover) * 100).toFixed(1)}% — compar-o cu marja tipică domeniului "${industry}" și spune-i dacă lasă bani pe masă`);
    }
    if (latest?.turnover && latest?.employees) {
      finLines.push(`- PRODUCTIVITATE (calculată): ${Math.round(latest.turnover / latest.employees).toLocaleString("ro-RO")} lei CA/angajat/an — raporteaz-o la tipicul domeniului`);
    }
  }

  const anafBlock = anafData.found
    ? `DATE OFICIALE ANAF (verificate acum pe CUI):
- Denumire legală: ${anafData.legalName}
- Stare: ${anafData.active ? "ACTIVĂ" : "INACTIVĂ (red flag major — menționează!)"}
- Plătitor TVA: ${anafData.vatPayer ? "DA" : "NU"}
- CAEN: ${anafData.caen ?? "necunoscut"}${anafData.caenLabel ? ` (${anafData.caenLabel})` : ""}
- Înregistrată din: ${anafData.regYear ?? "necunoscut"}
${hist.length > 0 ? `- ISTORIC BILANȚURI (${hist.length} ${hist.length === 1 ? "an" : "ani"}):
${finLines.join("\n")}
DIRECTIVĂ FINANCIARĂ (obligatorie când există bilanț): include un diagnostic dedicat FINANȚELOR (ex: „Sănătatea financiară & trendul") construit pe cifrele de mai sus — trendul CA, marja, productivitatea pe angajat, raportate la tipicul domeniului. Apoi leagă TOT planul de creșterea cifrei de afaceri: proiecția să spună explicit „de la ${anafData.turnover?.toLocaleString("ro-RO") ?? "?"} lei CA la ~X lei în 12 luni" cu un target realist (nu peste +30% fără motive solide). Pierderile lunare exprimă-le și ca procent din CA reală (1 EUR ≈ 5 lei).` : "- Bilanț: nedepus / indisponibil"}`
    : anafDown
      ? "DATE ANAF: serverele ANAF au fost INDISPONIBILE TEHNIC la momentul scanării — NU e vina firmei și NU concluziona nimic din lipsa datelor financiare. Lucrează cu cifrele declarate de proprietar, fără să pomenești ANAF ca lipsă a firmei."
      : "DATE ANAF: nu s-a dat CUI sau firma nu a fost găsită — lucrează cu cifrele declarate de proprietar.";

  const prompt = `Ești un consultant de afaceri cu 10+ ani de experiență STRICT în domeniul "${industry}" din România. Cunoști în detaliu cum funcționează acest tip de afacere: canalele reale de achiziție de clienți, marjele tipice, sezonalitatea, greșelile clasice ale patronilor din domeniu și ce fac liderii pieței diferit. Generează un raport de consultanță pentru afacerea de mai jos.

REGULI ANTI-ȘABLON (obligatorii):
- INTERZIS sfaturi generice ("e important să ai site", "fii activ pe social media"). Fiecare constatare pleacă de la DATELE REALE de mai jos: cifrele lor, ratingul lor vs competitori, site-ul lor scanat, problema descrisă de ei.
- Scrie ca un consultant din INTERIORUL domeniului "${industry}": cunoști marjele tipice, sezonalitatea, cum vine clientul în acest domeniu, unde se pierde banul de obicei și greșelile clasice ale patronilor din branșă. Fiecare constatare leagă datele lui de mecanismul economic al domeniului („în domeniul ăsta clientul decide pe recenzii + poze, iar tu ai X…").
- Ariile de diagnostic le ALEGI TU: 7-9 arii RELEVANTE pentru domeniul "${industry}" și tipul afacerii (ex: notariat → "Programări & accesibilitate", "Poziția pe «notar + oraș»"; imobiliare → "Calitatea anunțurilor", "Tururi virtuale"; service auto → "Recenzii & încredere", "Apeluri pierdute"; afacere online → "Funnel & conversie", "SEO național", "Încredere & dovezi sociale").
- Folosește benchmarkuri din domeniu: câte recenzii are un lider local tipic, ce canale aduc clienți în acest domeniu, ticket mediu tipic — și compară-i direct ("ai 12 recenzii, un lider local are 200+").
- Planul de acțiune = acțiuni SPECIFICE domeniului, cu cifrele lor, nu pași generici.
- OFFLINE OBLIGATORIU: fiecare fază din actionPlan conține MINIM o acțiune offline pentru afacerea lui — procese, vânzare, oferte, fidelizarea clienților, organizare, upsell, promovare locală (presă locală, parteneriate cu alte firme din zonă, evenimente, materiale la punctul de lucru) — specifică domeniului (ex: service auto → sună clienții la 6 luni pentru revizie; salon → pachete de abonament pentru cliente fidele; restaurant → oferta de prânz pentru firmele din zonă). Nu doar digital.
- AFACERILE CU PUNCT FIZIC (sediu, magazin, salon, cabinet, tarabă în piață/bazar): tratează punctul de vânzare ca pe un canal de marketing în sine. Include cel puțin UN diagnostic dedicat părții fizice (ex: „Punctul de vânzare & zona", „Fidelizare & revenire", „Recomandările din gură în gură") cu rezolvare concretă. Repertoriu de lucru (alege ce se potrivește domeniului, nu le înșira pe toate): vitrină/semnalistică care oprește trecătorul, cardul de fidelitate fizic simplu, oferta „adu un prieten", parteneriate încrucișate cu afaceri complementare din zonă (notarul ↔ agențiile imobiliare și băncile; salonul ↔ fotografii de nuntă și magazinele de rochii; taraba ↔ bundle-uri și degustări la orele de vârf), evenimente mici la punct de lucru, prezența la târgurile locale, materiale cu QR spre recenzii/meniu/programări, uniformă/ecuson care inspiră încredere, scriptul de 1 frază prin care angajatul cere recenzia sau revânzarea. Cifrele contează și aici: estimează cât aduce fiecare acțiune offline (clienți/lună), nu doar cele digitale.
- ANALIZA ZONEI (dacă a dat zona/cartierul): judecă potențialul VADULUI ca un cunoscător al orașelor românești — ce fel de zonă e (centru comercial, cartier rezidențial, lângă piață/gară/școli/instituții), ce clientelă trece pe acolo și la ce ore, cum profită de trafic (vitrină, semnalistică, ofertă de „prins trecătorul") și ce parteneriate are la doi pași (firmele complementare tipice unei astfel de zone). Fii onest: cunoști zona doar din descriere — formulează ca ipoteze de verificat („dacă în zonă e X, atunci..."), nu ca fapte. Leagă recomandările de potențialul REAL al locului: o tarabă lângă piață se crește altfel decât un cabinet în cartier rezidențial.
${photos.length > 0 ? `- POZELE ATAȘATE (${photos.length} — vitrina/produsele/localul lui, făcute de proprietar): analizează-le ca expert în merchandising și amenajare pentru domeniul lui. Include OBLIGATORIU un diagnostic dedicat (ex: „Vitrina & prima impresie" / „Prezentarea produselor") pe ce VEZI concret: prima impresie a trecătorului, lizibilitatea firmei, lumina, ordinea, prețurile vizibile, ce atrage și ce respinge. În fix: 1) ce schimbă AZI cu 0 lei, 2) ce schimbă cu buget mic, 3) O OFERTĂ CONCRETĂ DE PUS PE GEAM/AFARĂ — textul exact, gata de printat, calibrat pe marfa/serviciul lui din poze (ex: „2+1 la orice patiserie după ora 18" / „Verificare gratuită 10 puncte la orice schimb de ulei"). Fii sincer dar constructiv — descrii ce e în poze, nu inventezi ce nu se vede.` : ""}
- Fii SINCER și DIRECT — cifrele contează mai mult decât politeța.
- CLARITATE (obligatorie, în TOT raportul): scrii pentru un patron ocupat, nu pentru alți consultanți. Prima frază a fiecărui finding = concluzia, cu cifra („Ai 7 recenzii; liderul local are 38 — la volumul ăsta Google te afișează sub el."). Fraze scurte, fiecare aduce informație NOUĂ. INTERZIS jargonul („proxy", „ponderează algoritmic", „funnel", „conversie" fără explicație) — spune pe românește ce se întâmplă și cât costă. Zero teorie generală care nu e legată de o cifră de-a lui.
- REGULA DE ONESTITATE (cea mai importantă): afirmă DOAR ce e susținut de datele scanate. Ce NU a putut fi verificat (Facebook blocat, pagini de site nescanate, Google negăsit sub numele dat) se raportează ca „nu am putut verifica" cu status "warning" — NU ca „zero" sau „nu există". Un patron care ARE recenzii și portofoliu și citește în raport că n-are NIMIC își pierde toată încrederea în analiză. Necunoscut ≠ absent.

TIP AFACERE: ${typeLabel}
${businessType === "online" ? "ATENȚIE: fiind afacere online, NU penaliza lipsa unui punct pe Google Maps și NU analiza competiția locală din oraș — analizează prezența în căutări, funnel-ul online, încrederea și competiția din nișă la nivel național." : ""}

DATE FIRMĂ (de la proprietar):
- Brand: ${companyName}
- Oraș: ${city}${zone ? `\n- Zona / cartierul punctului de lucru: ${zone}` : ""}
- Domeniu: ${industry}
- Site declarat: ${website || "NU ARE / nu a dat"}
- Facebook declarat: ${facebook || "NU ARE / nu a dat"}
${businessDesc ? `- AFACEREA, POVESTITĂ DE PATRON (sursa cea mai de încredere pentru modelul de business — ia-o ca reper principal): "${businessDesc}"` : ""}
- Clienți pe lună: ${monthlyClients || "necunoscut"}
- Valoare medie per client: ${avgValue || "necunoscut"}
- Cum plătește un client: ${valueModel || "nespecificat — DEDUCE modelul tipic al domeniului (ex: club/asociație → cotizație anuală; abonament sală/software → lunar; restaurant/frizerie → pe vizită; construcții/web design → proiect unic) și spune în raport ce model ai presupus"}
- Angajați: ${employees || "necunoscut"}
- Problema principală (în cuvintele lui): ${mainProblem || "nespecificată"}

MATEMATICA BANILOR — REGULĂ OBLIGATORIE, după modelul de încasare de mai sus (formula APARE EXPLICIT în raport, în summary sau în diagnosticul financiar, ca să înțeleagă exact de unde vine cifra):
- „Pe vizită / comandă": valoarea declarată e PE TRANZACȚIE. Pierderea lunară = clienți pierduți × valoarea per vizită × frecvența realistă de revenire din domeniu (un client de frizerie revine lunar, unul de service auto de 1-2 ori pe an — folosește frecvența brațului tău de domeniu).
- „Abonament lunar": valoarea declarată e PE LUNĂ. Un client pierdut = valoarea lunară × retenția tipică domeniului în luni (spune ce retenție ai folosit). Pierderea lunară raportată = clienți neconvertiți/lună × valoarea lunară, dar explică și valoarea pe durata de viață.
- „Abonament / cotizație anuală": valoarea declarată e PE AN — INTERZIS s-o tratezi ca încasare lunară sau per vizită. Un membru/client pierdut = întreaga valoare anuală. Exprimă pierderea ca VALOARE ANUALĂ DE CONTRACTE pierdută (ex: „2 membri neconvertiți pe lună × 600€/an = 1.200€ valoare anuală de contracte pierdută în fiecare lună") și seteaz-o pe lostRevenuePerMonth ca membri pierduți/lună × valoarea anuală. Formula scrisă negru pe alb.
- „Proiect / contract unic": pierderea = proiecte/contracte ratate pe lună × valoarea medie a proiectului; menționează și pipeline-ul (câte oferte trebuie date pentru un contract în domeniul lui).
Toate proiecțiile (projection, actionPlan impact) folosesc ACEEAȘI logică — coerență totală între cifre, iar dacă există CA reală de la ANAF, pierderile trebuie să fie plauzibile față de ea.

${anafBlock}

DATE REALE GOOGLE (scanate acum):
${googleData.found ? `- Găsit pe Google Maps: DA${googleData.exact ? " (profil confirmat de utilizator — date exacte)" : ""}\n- Nume profil: ${googleData.name}\n- Rating: ${googleData.rating ?? "fără rating"} (${googleData.reviewCount} recenzii)\n- Are site listat: ${googleData.hasWebsite ? "DA" : "NU"}` : placesError ? `- SCANAREA GOOGLE A EȘUAT TEHNIC (${placesError}) — NU e dovadă că firma lipsește de pe Google! INTERZIS să afirmi că nu are profil, rating sau recenzii. Dacă atingi subiectul Google, spune DOAR că verificarea automată nu a fost posibilă de data asta (status "warning") și tratează prezența pe Google ca necunoscută.` : businessType === "online" ? `- Nu are profil Google Maps (normal pentru afacere online — nu penaliza)` : `- NU a fost găsit pe Google Maps sub numele "${companyName}" în ${city} → fie nu are Google Business Profile (problemă gravă), fie e listat sub alt nume. Formulează constatarea prudent.`}

${competitors.length > 0 ? `COMPETIȚIA LOCALĂ (căutare țintită pe Google Maps${competitorNames ? " + competitorii numiți chiar de patron" : ""}):\n${competitors.map((c) => `- ${c.name}${c.declared ? " ← NUMIT DE PATRON (competitor cert)" : ""}: ${c.rating ?? "fără"} rating, ${c.reviewCount} recenzii`).join("\n")}\nREGULĂ DE RELEVANȚĂ: lista vine dintr-o căutare automată — înainte să compari, judecă fiecare nume: e chiar un competitor (același model de business, se bate pe aceiași clienți)? Instituțiile publice, ONG-urile de alt profil sau firmele cu alt obiect NU sunt repere de comparație — nu le folosi deloc. Competitorii numiți de patron sunt cei mai relevanți. Dacă din scanare nu rămâne niciun competitor real, spune sincer asta și raportează-te la categoriile reale de competiție ale domeniului lui (cine se mai bate pe timpul și banii acelorași clienți).` : ""}

DATE REALE SITE (scanate acum — homepage + subpaginile relevante):
${siteData ? (siteData.reachable ? `- Site funcțional: DA\n- Timp răspuns: ${siteData.loadTimeMs}ms\n- HTTPS: ${siteData.isHttps ? "DA" : "NU"}\n- Mobile viewport: ${siteData.hasViewport ? "DA" : "NU"}\n- Meta description: ${siteData.hasMetaDesc ? "DA" : "NU"}\n- H1: ${siteData.hasH1 ? "DA" : "NU"}\n- Pagini scanate: ${siteData.pagesScanned ?? 1}${siteData.subpages?.length ? ` (homepage + ${siteData.subpages.map((s: any) => s.path).join(", ")})` : " (doar homepage — nu am găsit linkuri interne relevante)"}\n${siteData.subpages?.length ? siteData.subpages.map((s: any) => `  · ${s.path}: ${[s.portfolio ? "PORTOFOLIU/proiecte prezente" : null, s.testimonials ? "TESTIMONIALE/recenzii prezente" : null, `${s.imgCount} imagini`].filter(Boolean).join(", ")}`).join("\n") + "\n" : ""}- Concluzie pe TOATE paginile scanate: portofoliu/proiecte: ${siteData.hasPortfolioHint ? "DA, EXISTĂ — recunoaște-le și evaluează-le calitativ, NU spune că lipsesc" : "nu am detectat în paginile scanate"}; testimoniale/recenzii pe site: ${siteData.hasTestimonialsHint ? "DA, EXISTĂ — recunoaște-le, NU spune că lipsesc" : "nu am detectat în paginile scanate"}; contact vizibil: ${siteData.hasContactHint ? "DA" : "nu am detectat"}` : "- Site-ul NU răspunde / e picat") : "- Nu are site de scanat"}

CERCETARE PE INTERNET (căutare web REALĂ făcută acum — presă, platforme, recenzii, tot ce există despre firmă online):
${aiVisibility ? `- Găsit la căutarea după numele firmei: ${aiVisibility.brandVisible ? "DA" : "NU"}\n- Recomandat la căutări GENERICE („${industry} ${city}", fără nume): ${aiVisibility.genericVisible ? "DA — apare, avantaj rar!" : "NU — clienții care întreabă AI-ul primesc COMPETITORII"}\n- Constatare: ${aiVisibility.note}${aiVisibility.mentions ? `\n- MENȚIUNI PE INTERNET (dezambiguizate — doar despre ACEASTĂ firmă, nu omonime): ${aiVisibility.mentions}` : ""}${aiVisibility.network ? `\n- REȚEA/FILIALĂ: ${aiVisibility.network}` : ""}${aiVisibility.press?.length ? `\n- PRESĂ (articole găsite): ${aiVisibility.press.join(" · ")}` : ""}${aiVisibility.platforms?.length ? `\n- PLATFORME SOCIALE (găsite la căutare): ${aiVisibility.platforms.join(" · ")}` : ""}${aiVisibility.reviewsElsewhere?.length ? `\n- RECENZII ÎN AFARA GOOGLE MAPS: ${aiVisibility.reviewsElsewhere.join(" · ")}` : ""}${aiVisibility.signals?.length ? `\n- SEMNALE POZITIVE: ${aiVisibility.signals.join(" · ")}` : ""}${aiVisibility.negative?.length ? `\n- SEMNALE NEGATIVE (cu sursă — tratează-le OBLIGATORIU într-un diagnostic, cu rezolvare): ${aiVisibility.negative.join(" · ")}` : ""}
FOLOSEȘTE cercetarea asta în tot raportul: ce EXISTĂ (presă, platforme, semnale pozitive) se recunoaște explicit — e muncă de-a lui care merită văzută; ce lipsește devine diagnostic cu rezolvare. Dacă mențiunile sunt sărace („doar site-ul propriu"), tratează asta: fără mențiuni externe, nici Google, nici AI-urile n-au motive să recomande brandul — iar campania de presă din 50 de ziare (inclusă) e fix prima rezolvare. Dacă brandul e greu de distins de omonime, recomandă întărirea semnalelor de identitate: numele+orașul consecvent peste tot, date structurate, profil Google complet.
${aiVisibility.network ? `REGULĂ DE FILIALĂ/EXTENSIE (obligatorie): firma e parte a unei rețele/brand mai mare — analiza se face LA NIVEL LOCAL, corect: NU o penaliza pentru ce vine de la centru (site-ul central, brandul, metodologia rețelei — alea nu-s „lipsurile" ei și nici nu le poate schimba). Evaluează ce ține de EA local: profilul Google Business propriu al filialei, pagina/secțiunea locală, socialul local, recenziile locale, vizibilitatea pe „${city}". Spune explicit în raport ce pârghii are local și ce ține de centru, ca patronul să știe unde poate acționa.` : ""}
Include OBLIGATORIU un diagnostic cu area "Vizibilitate în AI (ChatGPT, Perplexity)" pe baza testului. Dacă NU apare la căutări generice, planul include acțiuni GEO concrete: prezența în topuri/directoare locale (ex: necesit.ro), articole în presa online, date structurate și pagini locale pe site.` : "- Cercetarea nu a putut rula de data asta — nu inventa rezultate; poți menționa vizibilitatea online ca arie de verificat."}

PREZENȚA PE FACEBOOK (scanată acum):
${fbData ? (fbData.reachable ? `- Pagina există: DA${fbData.title ? `\n- Titlu: ${fbData.title}` : ""}${fbData.followers ? `\n- Urmăritori/aprecieri: ~${fbData.followers}` : ""}${fbData.description ? `\n- Descriere: ${fbData.description}` : ""}` : `- Pagina declarată NU a putut fi VERIFICATĂ automat (Facebook blochează des accesul roboților). NU concluziona că pagina nu există sau că e inactivă — spune doar că nu a putut fi verificată, cu status "warning".`) : "- NU are pagină de Facebook declarată de proprietar"}

REGULĂ CANALE LIPSĂ: pentru FIECARE canal absent sau slab (site, Google Business Profile, pagină Facebook), planul de acțiune TREBUIE să includă crearea/refacerea lui la nivel profesionist — concret ce să conțină ca să arate mai bine decât al competitorilor (nu doar „fă-ți pagină").

IMPORTANT — PROFUNZIME: acesta e un raport PLĂTIT — patronul trebuie să simtă că cineva chiar i-a studiat afacerea. Constatările au 3-5 fraze cu substanță (ce am găsit → de ce se întâmplă în domeniul lui → cât îl costă concret), acțiunile sunt specifice și explicate scurt (nu liste telegrafice). NU te repeta între secțiuni și NU umple cu vată — lungimea vine din adâncime, nu din repetiție. Ai spațiu suficient; termină întotdeauna JSON-ul complet.

Generează raportul ca JSON EXACT în acest format. REGULĂ ABSOLUTĂ DE FORMAT: răspunsul tău e DOAR obiectul JSON — fără niciun text înainte, fără text după, fără backticks/markdown, fără comentarii. Primul caracter al răspunsului: { . Ultimul: } .
{
  "overallScore": <0-100, sănătatea digitală+comercială generală>,
  "lostClientsPerMonth": <estimare realistă clienți pierduți lunar>,
  "lostRevenuePerMonth": <în EUR, calculat STRICT după MATEMATICA BANILOR de mai sus, pe modelul lui de încasare>,
  "diagnostics": [
    {"area":"<arie aleasă de tine, specifică domeniului>","emoji":"<emoji potrivit>","status":"good|warning|bad","finding":"constatare concretă cu cifre, 3-5 fraze: ce am găsit, de ce se întâmplă asta în domeniul lui, cât îl costă","fix":"REZOLVAREA concretă, 2-4 fraze: exact ce face, cu ce unelte/pași, cine o face (el în X minute / noi / un angajat) și în cât timp se văd rezultatele. Dacă canalul lipsește complet (fără pagină Facebook / fără profil Google Business) menționează că i le putem face noi cap-coadă (Pachet Start Online 500 lei) — comandă direct din contul lui, în chatul consultantului, fără telefoane. La status good: cum păstrează și crește avantajul."}
  ],
  "firstMonthPlan": [
    {"week":"Săptămâna 1","focus":"<tema săptămânii>","tasks":["<3-4 sarcini concrete, cu detalii de execuție — cine, ce, cum>"],"result":"<ce e gata la finalul săptămânii>"},
    {"week":"Săptămâna 2","focus":"...","tasks":["..."],"result":"..."},
    {"week":"Săptămâna 3","focus":"...","tasks":["..."],"result":"..."},
    {"week":"Săptămâna 4","focus":"...","tasks":["..."],"result":"..."}
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

Prețuri de referință Imperial Media: site prezentare 699-1.500€, site cu funcții 1.400-2.500€, magazin 1.800-4.500€, promovare 50 ziare 300€ (deja INCLUSĂ în acest raport — cititorul o primește cadou; în plan trateaz-o ca resursă existentă, ex. „campania ta de presă din 50 de ziare, inclusă", NU ca achiziție separată), mentenanță 50€/lună, Google Business setup gratuit la orice comandă. Pachet Start Online 500 lei (pentru cine NU vrea încă site): creăm noi Google Business Profile complet + pagină Facebook cu design profesionist (logo simplu, cover, descriere, primele postări) — dacă firma nu are site și pare reticentă la investiție, include-l în FAZA 1 ca prim pas accesibil.

PARTENER: dacă firma e din Botoșani sau județ și i-ar folosi networking-ul, mentoratul antreprenorial sau schimbul de experiență cu alți patroni, include în plan (o singură dată, unde se potrivește natural) recomandarea Bizz Club Botoșani (botosani.bizz.club) — partenerul nostru pentru dezvoltare, o comunitate de antreprenori de calitate din zonă, unde se leagă relații de business reale. Noi acoperim datele și implementarea, ei comunitatea.`;

  try {
    // Pozele vitrinei/produselor intră ca imagini reale în analiză (vision)
    const photoBlocks = photos.map((p) => {
      const [meta, data] = p.split(",");
      const mediaType = meta.match(/data:(image\/\w+);/)?.[1] ?? "image/jpeg";
      return {
        type: "image" as const,
        source: { type: "base64" as const, media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data },
      };
    });

    // Un singur apel către un model anume
    const callOnce = async (model: string, content: any): Promise<string> => {
      const resp = await client.messages.create({
        model,
        max_tokens: 16000,
        messages: [{ role: "user", content }],
      });
      if (resp.stop_reason === "max_tokens") {
        // Răspuns TĂIAT la limită — JSON-ul e trunchiat și secțiunile de la coadă
        // (actionPlan) dispar. Logăm ca să vedem în Railway când se întâmplă.
        console.error(`[service-report] ${model}: răspuns TĂIAT la max_tokens — JSON probabil incomplet`);
      }
      const tb = resp.content.find((b) => b.type === "text");
      if (!tb || tb.type !== "text") throw new Error("empty response");
      return tb.text;
    };

    // Pentru pasul de calitate: modelul mare, cu fallback pe cel mic la 404
    const callModel = async (content: any): Promise<string> => {
      try {
        return await callOnce(REPORT_MODEL, content);
      } catch (e: any) {
        if (e?.status === 404) {
          console.warn(`[service-report] model ${REPORT_MODEL} indisponibil — fallback pe ${CLAUDE_MODEL}`);
          return await callOnce(CLAUDE_MODEL, content);
        }
        throw e;
      }
    };

    // GENERAREA PRINCIPALĂ — 3 încercări în lanț: modelul mare, iar modelul mare,
    // apoi modelul mic (format dovedit stabil). Un răspuns care nu se poate parsa
    // NU mai omoară raportul — trecem la următoarea încercare, cu log de diagnoză.
    const genContent = photoBlocks.length > 0 ? [...photoBlocks, { type: "text" as const, text: prompt }] : prompt;

    // Raport COMPLET = are diagnostice, plan pe 12 luni și rezumat. Un JSON căruia
    // îi lipsește planul (tăiat la max_tokens și „reparat" de repairJson) nu mai
    // trece tăcut — declanșează următoarea încercare. (Bug-ul din 13 aug: raport
    // livrat cu secțiunea „Planul tău de acțiune (12 luni)" complet goală.)
    const sectiuniLipsa = (p: any): string[] => {
      const lipsa: string[] = [];
      if (!Array.isArray(p?.diagnostics) || p.diagnostics.length < 4) lipsa.push("diagnostics");
      if (!Array.isArray(p?.actionPlan) || p.actionPlan.length < 3) lipsa.push("actionPlan");
      if (!p?.summary) lipsa.push("summary");
      return lipsa;
    };

    let parsed: any = null;
    let bestPartial: any = null; // plasa de siguranță: cel mai bogat răspuns incomplet
    const attempts = [REPORT_MODEL, REPORT_MODEL, CLAUDE_MODEL];
    for (let i = 0; i < attempts.length; i++) {
      const model = attempts[i];
      try {
        const text = await callOnce(model, genContent);
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) {
          console.error(`[service-report] ${model} încercarea ${i + 1}: FĂRĂ JSON. Început răspuns: ${text.slice(0, 300)}`);
          throw new Error("no json in output");
        }
        const candidate = parseReportJson(match[0]);
        const lipsa = sectiuniLipsa(candidate);
        if (lipsa.length > 0) {
          if ((candidate?.diagnostics?.length ?? 0) > (bestPartial?.diagnostics?.length ?? 0)) bestPartial = candidate;
          console.error(`[service-report] ${model} încercarea ${i + 1}: JSON INCOMPLET — lipsesc: ${lipsa.join(", ")}. Reîncerc.`);
          throw new Error(`incomplete report: ${lipsa.join(", ")}`);
        }
        parsed = candidate;
        break;
      } catch (e: any) {
        console.error(`[service-report] generare ${model} încercarea ${i + 1} a eșuat:`, e?.message ?? e);
        if (i === attempts.length - 1) {
          // Ultima încercare: decât să pice tot raportul, mai bine cel mai bun
          // răspuns parțial — secțiunea lipsă se completează țintit mai jos.
          if (bestPartial && Array.isArray(bestPartial.diagnostics) && bestPartial.diagnostics.length >= 4) {
            console.warn("[service-report] toate încercările incomplete — folosesc cel mai bun parțial + completare țintită");
            parsed = bestPartial;
          } else {
            throw e;
          }
        }
      }
    }
    if (!parsed) throw new Error("no parsed report");

    // COMPLETARE ȚINTITĂ: dacă (și numai dacă) planul pe 12 luni tot lipsește,
    // un apel scurt îl scrie separat, pe baza diagnosticelor deja generate —
    // mult mai ieftin și mai sigur decât regenerarea întregului raport.
    if (!Array.isArray(parsed.actionPlan) || parsed.actionPlan.length < 3) {
      try {
        const bazaPlan = {
          summary: parsed.summary,
          diagnostics: (parsed.diagnostics ?? []).map((d: any) => ({ area: d.area, finding: d.finding, fix: d.fix })),
          projection: parsed.projection,
        };
        const miniPrompt = `Ești consultantul senior care a scris raportul de mai jos pentru firma "${companyName}" (${industry}, ${city}). Raportului îi lipsește planul de acțiune pe 12 luni. Scrie-l ACUM, în 4 faze (0-3 luni, 3-6 luni, 6-9 luni, 9-12 luni), fiecare cu 3-5 acțiuni concrete derivate direct din diagnosticele raportului, investiție estimată și impact așteptat.

RAPORTUL: ${JSON.stringify(bazaPlan)}

REGULĂ ABSOLUTĂ DE FORMAT: răspunde DOAR cu JSON valid, fără text în jur. Primul caracter: { Ultimul: }
Format exact:
{"actionPlan":[{"phase":"Luna 1-3","title":"...","actions":["..."],"investment":"...","impact":"..."}]}`;
        const planText = await callModel(miniPrompt);
        const planMatch = planText.match(/\{[\s\S]*\}/);
        if (planMatch) {
          const planParsed = parseReportJson(planMatch[0]);
          if (Array.isArray(planParsed?.actionPlan) && planParsed.actionPlan.length >= 3) {
            parsed.actionPlan = planParsed.actionPlan;
            console.log("[service-report] planul pe 12 luni completat prin apel țintit");
          }
        }
      } catch (e: any) {
        console.error("[service-report] completarea planului a eșuat:", e?.message ?? e);
      }
    }

    const toReport = (parsed: any): ServiceReport => {
    const tr = parsed.topRecommendation;
    const pj = parsed.projection;
    const il = parsed.industryLeaders;
    const sp = parsed.socialPlan;

    return {
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
        ? parsed.diagnostics.slice(0, 9).map((d: any) => ({
            area: String(d.area ?? ""),
            emoji: String(d.emoji ?? "📊"),
            status: ["good", "warning", "bad"].includes(d.status) ? d.status : "warning",
            finding: String(d.finding ?? ""),
            fix: d.fix ? String(d.fix) : undefined,
          }))
        : [],
      topRecommendation:
        tr && tr.title
          ? {
              title: String(tr.title).slice(0, 160),
              why: String(tr.why ?? "").slice(0, 700),
              firstStep: String(tr.firstStep ?? "").slice(0, 400),
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
      firstMonthPlan: Array.isArray(parsed.firstMonthPlan)
        ? parsed.firstMonthPlan.slice(0, 5).map((w: any, i: number) => ({
            week: String(w.week ?? `Săptămâna ${i + 1}`),
            focus: String(w.focus ?? ""),
            tasks: Array.isArray(w.tasks) ? w.tasks.map(String).slice(0, 5) : [],
            result: String(w.result ?? ""),
          })).filter((w: any) => w.tasks.length > 0)
        : undefined,
      actionPlan: Array.isArray(parsed.actionPlan)
        ? parsed.actionPlan.slice(0, 4).map((p: any) => ({
            phase: String(p.phase ?? ""),
            title: String(p.title ?? ""),
            actions: Array.isArray(p.actions) ? p.actions.map(String).slice(0, 6) : [],
            investment: String(p.investment ?? ""),
            impact: String(p.impact ?? ""),
          }))
        : [],
      summary: String(parsed.summary ?? "").slice(0, 900),
    };
    }; // ─── sfârșitul toReport ───

    let report = toReport(parsed);

    // ─── PASUL 2: CONTROLUL DE CALITATE — redactorul-șef verifică raportul contra datelor ───
    // A doua trecere: fiecare afirmație confruntată cu datele scanate, sfaturile generice
    // înlocuite cu practica exactă a domeniului, cifrele aduse la coerență. Fail-open:
    // dacă pasul eșuează, livrăm prima versiune (tot validă), nu blocăm raportul.
    try {
      const digest = `DATE SCANATE (adevărul de referință — nimic din raport nu are voie să le contrazică):
- Google: ${googleData.found ? `${googleData.name} — rating ${googleData.rating ?? "?"}, ${googleData.reviewCount} recenzii` : placesError ? `verificare EȘUATĂ TEHNIC (${placesError}) — prezența pe Google e NECUNOSCUTĂ, interzise afirmații negative` : "negăsit la scanare"}
- ANAF: ${anafData.found ? `${anafData.legalName}, ${anafData.active ? "activă" : "INACTIVĂ"}${anafData.turnover != null ? `, CA ${anafData.turnover} lei (${anafData.balanceYear}), profit ${anafData.profit ?? "?"}, ${anafData.employees ?? "?"} salariați` : ""}${(anafData.history?.length ?? 0) > 1 ? `; istoric CA: ${anafData.history!.map((h) => `${h.year}:${h.turnover ?? "?"}`).join(", ")}` : ""}` : anafDown ? "indisponibil TEHNIC — fără concluzii din lipsa datelor" : "fără CUI / negăsit"}
- Site: ${siteData?.reachable ? `${siteData.pagesScanned} pagini scanate; portofoliu: ${siteData.hasPortfolioHint ? "EXISTĂ — trebuie recunoscut" : "nedetectat"}; testimoniale: ${siteData.hasTestimonialsHint ? "EXISTĂ — trebuie recunoscute" : "nedetectate"}` : siteData ? "site picat" : "fără site"}
- Facebook: ${fbData ? (fbData.reachable ? "pagina există" : "NEVERIFICABILĂ tehnic — nu afirma absența") : "nedeclarat"}
- Cercetare internet: ${aiVisibility ? `după nume: ${aiVisibility.brandVisible ? "DA" : "NU"}; generic: ${aiVisibility.genericVisible ? "DA" : "NU"}${aiVisibility.mentions ? `; mențiuni: ${aiVisibility.mentions}` : ""}${aiVisibility.network ? `; FILIALĂ A REȚELEI: ${aiVisibility.network} — nu penaliza ce vine de la centru, evaluează doar pârghiile locale` : ""}${aiVisibility.press?.length ? `; presă: ${aiVisibility.press.join(" | ")}` : ""}${aiVisibility.platforms?.length ? `; platforme: ${aiVisibility.platforms.join(" | ")}` : ""}${aiVisibility.negative?.length ? `; NEGATIVE: ${aiVisibility.negative.join(" | ")}` : ""}` : "netestat — nu inventa rezultate"}
- Competitori scanați (căutare țintită; cei „numiți de patron" sunt cerți, restul îi validezi tu ca relevanți): ${competitors.length ? competitors.map((c) => `${c.name}${c.declared ? " [numit de patron]" : ""} (${c.rating ?? "?"}★/${c.reviewCount})`).join(", ") : "niciunul"}
- Declarat de patron: ~${monthlyClients || "?"} clienți/lună, valoare medie ${avgValue || "?"} (mod de încasare: ${valueModel || "nespecificat"}), ${employees || "?"} angajați${zone ? `, zona: ${zone}` : ""}; problema lui: ${mainProblem || "—"}${businessDesc ? `; afacerea în cuvintele lui: "${businessDesc}"` : ""}
- REGULĂ FINANCIARĂ: dacă modul de încasare e abonament/cotizație ANUALĂ, valoarea clientului e PE AN — pierderile NU se calculează ca vizite lunare; formula pierderilor trebuie scrisă explicit în raport și să fie coerentă cu modelul de încasare.`;

      const criticPrompt = `Ești REDACTORUL-ȘEF al rapoartelor și un consultant senior cu 15 ani STRICT în domeniul "${industry}" din România. Ai mai jos (A) datele reale scanate și (B) raportul scris de un consultant junior, ca JSON.

MISIUNE — fă-l de 10 ori mai bun, păstrând EXACT aceeași structură JSON:
1) ADEVĂR: verifică FIECARE afirmație contra (A). Ce nu e susținut de date → rescrie onest („nu am putut verifica" ≠ „nu are"). Ce EXISTĂ în date (portofoliu, testimoniale, recenzii, rating) → recunoscut explicit, nu ignorat.
2) PRECIZIE DE BRANȘĂ: zero sfaturi generice. Fiecare recomandare = practica exactă a domeniului "${industry}" în România: cifre tipice, unelte cu nume, pași de făcut săptămâna asta, la cifrele LUI.
3) COERENȚĂ NUMERICĂ: pierderile × valoarea medie, proiecția, break-even și scorul să fie consistente între ele și cu CA reală.
4) Fiecare "fix" să fie o rezolvare executabilă, nu reformularea problemei.
5) Taie umplutura; păstrează adâncimea.
6) CLARITATE: prima frază a fiecărui finding = concluzia cu cifra; fraze scurte și directe; scoate jargonul („proxy", „ponderează algoritmic") și spune pe românește.
7) COMPETITORI: compară-l DOAR cu competitori reali (același model de business). Dacă în raport apare ca reper o instituție publică sau o firmă cu alt obiect, scoate-o și înlocuiește comparația cu competiția reală a domeniului.

(A) ${digest}

(B) ${JSON.stringify(report)}

Răspunde DOAR cu JSON-ul complet îmbunătățit, exact același format ca (B).`;

      const text2 = await callModel(criticPrompt);
      const m2 = text2.match(/\{[\s\S]*\}/);
      if (m2) {
        const improved = toReport(parseReportJson(m2[0]));
        // Gardă anti-regres: nu acceptăm o versiune ciuntită
        if (improved.diagnostics.length >= Math.min(4, report.diagnostics.length) && improved.actionPlan.length >= 3 && improved.summary) {
          report = improved;
        }
      }
    } catch (e) {
      console.warn("[service-report] critic pass skipped:", e);
    }

    return report;
  } catch (e) {
    console.error("[service-report] generation error:", e);
    throw new Error("Nu am putut genera raportul. Încearcă din nou.");
  }
  }; // ─── sfârșitul runPipeline ───

  const formData = { companyName, city, zone, industry, businessType, cui: cuiRaw, placeId, website, facebook, monthlyClients, avgValue, valueModel, businessDesc, competitorNames, employees, mainProblem, ref, partner, photosCount: photos.length };
  const token = randomUUID();

  if (hasDb()) {
    // Cu DB: rândul "pending" se creează ACUM, răspunsul pleacă imediat,
    // iar pipeline-ul continuă pe fundal — frontend-ul întreabă de status.
    let pending = false;
    try {
      pending = await insertPendingServiceReport({ token, formData });
    } catch (e) {
      console.error("[service-report] pending insert failed:", e);
    }
    if (!pending) {
      return NextResponse.json(
        { error: "Sistemul e aglomerat momentan. Încearcă din nou în câteva minute." },
        { status: 503 }
      );
    }
    // Pipeline pe fundal, cu RETRY AUTOMAT: la primul eșec sistemul mai încearcă o dată
    // singur (multe erori sunt tranzitorii — ANAF picat, un timeout). Abia al doilea
    // eșec devine „error" + alertă pur informativă către proprietar. Zero muncă manuală.
    // După finalizare: cine a lăsat emailul în timpul scanării primește linkul raportului
    // (pagina lui arată preview + deblocare — leadul poate plăti oricând, de oriunde)
    const notifyReady = async () => {
      try {
        const { getServiceReport } = await import("@/lib/service-reports");
        const row = await getServiceReport(token);
        if (!row?.email || row.paid) return;
        const { sendSimpleEmail } = await import("@/lib/email");
        const { siteConfig } = await import("@/lib/site");
        await sendSimpleEmail({
          to: row.email,
          subject: `${companyName}: radiografia ta e gata — scor și pierderi calculate`,
          html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
            <h2 style="margin:0 0 12px;">Radiografia pentru ${companyName} e gata 🔍</h2>
            <p>Am scanat datele reale — Google, ANAF, site, competiția — și raportul te așteaptă:</p>
            <p><a href="${siteConfig.url}/service/raport/${token}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Vezi scorul și deblochează raportul</a></p>
            <p style="font-size:13px;color:#666;">Linkul e personal și rămâne valabil — poți reveni oricând. Suma se scade integral din orice pachet comanzi în 30 de zile.</p>
            <p style="color:#666;font-size:13px;">Imperial Media · ${siteConfig.email} · imperial-media.ro</p>
          </div>`,
        });
      } catch (e) {
        console.error("[service-report] ready email failed:", e);
      }
    };

    (async () => {
      try {
        const report = await runPipeline();
        await completeServiceReport(token, report);
        await notifyReady();
        return;
      } catch (e1) {
        console.error("[service-report] pipeline attempt 1 failed, retrying:", e1);
      }
      try {
        await new Promise((r) => setTimeout(r, 5000));
        const report = await runPipeline();
        await completeServiceReport(token, report);
        await notifyReady();
        return;
      } catch (e) {
        console.error("[service-report] pipeline attempt 2 failed:", e);
        await failServiceReport(token).catch(() => {});
        // Creditul Anthropic epuizat = alertă DEDICATĂ, imposibil de ratat
        const { maybeAlertCreditIssue } = await import("@/lib/credit-alert");
        await maybeAlertCreditIssue(e, `generarea raportului pentru ${companyName} (${city})`).catch(() => {});
        // Alertă INFORMATIVĂ — nimic de făcut: clientul a primit mesaj prietenos,
        // formularul lui e salvat local și e invitat să reîncerce cu un click.
        try {
          const { sendSimpleEmail, ownerEmail } = await import("@/lib/email");
          await sendSimpleEmail({
            to: ownerEmail(),
            subject: `⚠️ Generare eșuată de 2 ori — ${companyName} (${city})`,
            html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
              <h2>⚠️ Generarea a eșuat (inclusiv reîncercarea automată)</h2>
              <p><b>Firma:</b> ${companyName} (${city})${zone ? ` · zona ${zone}` : ""} · <b>Domeniu:</b> ${industry}</p>
              <p><b>Eroarea:</b> ${String((e as any)?.message ?? e).slice(0, 300)}</p>
              <p><b>Nimic de făcut din partea ta</b> — clientul a văzut un mesaj prietenos, formularul lui e salvat
              și e invitat să reîncerce. Emailul ăsta e doar ca să VEZI dacă erorile se repetă
              (dacă primești mai multe la rând, e semn de problemă de sistem — chei, ANAF, API-uri).</p>
            </div>`,
          });
        } catch (mailErr) {
          console.error("[service-report] failure alert email failed:", mailErr);
        }
        try {
          const { insertBrief } = await import("@/lib/briefs");
          await insertBrief({
            name: companyName,
            email: "necunoscut@eroare-generare.ro",
            selected_package: "⚠️ GENERARE EȘUATĂ (x2)",
            industry,
            message: `Raportul NU s-a generat pentru ${companyName} (${city}), nici la retry automat. Eroare: ${String((e as any)?.message ?? e).slice(0, 200)}. Clientul a fost invitat să reîncerce singur — doar monitorizează frecvența erorilor.`,
            source: "eroare-generare",
          });
        } catch {}
      }
    })();
    return NextResponse.json({ pending: true, token });
  }

  // Fără DATABASE_URL (mediu de dev) — sincron, raportul se dă direct, deblocat.
  try {
    const report = await runPipeline();
    return NextResponse.json({ locked: false, report });
  } catch (e) {
    console.error("[service-report] error:", e);
    return NextResponse.json(
      { error: "Nu am putut genera raportul. Încearcă din nou." },
      { status: 500 }
    );
  }
}
