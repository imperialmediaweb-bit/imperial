import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 25;

export type AuditCategory = {
  name: string;
  score: number; // 0-100
  emoji: string;
  status: "good" | "warning" | "bad";
  issues: string[];
  suggestions: string[];
};

export type AuditResult = {
  url: string;
  title: string;
  overallScore: number;
  categories: AuditCategory[];
  topProblems: string[];
  summary: string;
};

function cleanHtml(html: string, maxChars: number = 10000): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxChars);
}

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const rawUrl = String(body?.url ?? "").trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "URL lipsă." }, { status: 400 });
  }

  let url: URL;
  try {
    const withProto = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    url = new URL(withProto);
  } catch {
    return NextResponse.json({ error: "URL invalid." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI nu e configurat." }, { status: 503 });
  }

  // ─── Fetch + measure response time ───
  let html: string;
  let loadTimeMs: number;
  let isHttps: boolean;
  let statusCode: number;

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 15000);
    const start = Date.now();
    const res = await fetch(url.toString(), {
      signal: ac.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ro-RO,ro;q=0.9,en;q=0.8",
      },
    });
    loadTimeMs = Date.now() - start;
    clearTimeout(t);
    statusCode = res.status;
    isHttps = url.protocol === "https:";
    const buf = await res.arrayBuffer();
    html = new TextDecoder("utf-8").decode(
      buf.byteLength > 500_000 ? buf.slice(0, 500_000) : buf
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Nu am putut accesa site-ul. Verifică URL-ul." },
      { status: 502 }
    );
  }

  // ─── Quick HTML checks (fără AI) ───
  const hasViewport = /meta[^>]*name=["']viewport["']/i.test(html);
  const hasMetaDesc = /meta[^>]*name=["']description["']/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);
  const hasFavicon =
    /rel=["'](icon|shortcut icon)["']/i.test(html) ||
    /favicon/i.test(html);
  const hasOG = /property=["']og:/i.test(html);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const pageTitle = titleMatch
    ? titleMatch[1].trim().slice(0, 200)
    : url.hostname;

  const cleanedHtml = cleanHtml(html);

  // ─── Claude deep analysis ───
  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch {
    return NextResponse.json({ error: "AI indisponibil." }, { status: 503 });
  }

  const auditPrompt = `Ești un expert web/SEO care auditează site-uri. Analizezi HTML-ul paginii și returnezi un audit structurat.

DATE OBIECTIVE (deja măsurate):
- URL: ${url.toString()}
- Status: ${statusCode}
- Timp de răspuns server: ${loadTimeMs}ms
- HTTPS: ${isHttps ? "DA" : "NU"}
- Viewport meta (mobile): ${hasViewport ? "DA" : "NU"}
- Meta description: ${hasMetaDesc ? "DA" : "NU"}
- Tag H1: ${hasH1 ? "DA" : "NU"}
- Favicon: ${hasFavicon ? "DA" : "NU"}
- OpenGraph tags: ${hasOG ? "DA" : "NU"}

EVALUEAZĂ aceste 5 categorii (scor 0-100 fiecare):

1. **Viteză** — bazat pe: timp răspuns ${loadTimeMs}ms, dimensiune HTML, structură
2. **Mobile** — bazat pe: viewport meta, design responsive (verifică CSS/classes), font-uri citibile
3. **SEO** — bazat pe: meta description, H1, title tag, structură headings, OpenGraph, linkuri interne
4. **Securitate** — bazat pe: HTTPS, headers, formulare securizate
5. **Design & UX** — bazat pe: aspect modern vs învechit, navigare clară, CTAs vizibile, imagini optimizate

Răspunde DOAR cu JSON valid:
{
  "categories": [
    {"name":"Viteză","score":75,"emoji":"⚡","status":"warning","issues":["..."],"suggestions":["..."]},
    {"name":"Mobile","score":90,"emoji":"📱","status":"good","issues":[],"suggestions":["..."]},
    {"name":"SEO","score":40,"emoji":"🔍","status":"bad","issues":["...","..."],"suggestions":["..."]},
    {"name":"Securitate","score":100,"emoji":"🔒","status":"good","issues":[],"suggestions":[]},
    {"name":"Design & UX","score":55,"emoji":"🎨","status":"warning","issues":["..."],"suggestions":["..."]}
  ],
  "topProblems":["Problema #1 cea mai critică","Problema #2","Problema #3"],
  "summary":"O frază rezumat (max 30 cuvinte) despre starea generală a site-ului."
}

REGULI:
- status: "good" (80-100), "warning" (50-79), "bad" (0-49)
- issues: max 3 per categorie, concrete, scurte
- suggestions: max 2, acționabile
- topProblems: exact 3, ordonate după gravitate
- summary: în română, sincer dar constructiv
- NU inventa date — bazează-te pe HTML-ul real + datele obiective`;

  try {
    const resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: auditPrompt,
      messages: [
        { role: "user", content: `HTML:\n${cleanedHtml}` },
      ],
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("Răspuns AI gol.");

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON invalid.");

    const parsed = JSON.parse(jsonMatch[0]);
    const categories: AuditCategory[] = (parsed.categories ?? []).map((c: any) => ({
      name: String(c.name ?? ""),
      score: Math.max(0, Math.min(100, Number(c.score) || 50)),
      emoji: String(c.emoji ?? "📊"),
      status: ["good", "warning", "bad"].includes(c.status) ? c.status : "warning",
      issues: Array.isArray(c.issues) ? c.issues.map(String).slice(0, 3) : [],
      suggestions: Array.isArray(c.suggestions) ? c.suggestions.map(String).slice(0, 2) : [],
    }));

    const overallScore = categories.length > 0
      ? Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)
      : 50;

    const result: AuditResult = {
      url: url.toString(),
      title: pageTitle,
      overallScore,
      categories,
      topProblems: Array.isArray(parsed.topProblems)
        ? parsed.topProblems.map(String).slice(0, 3)
        : [],
      summary: String(parsed.summary ?? "").slice(0, 300),
    };

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[/api/audit] error:", e);
    return NextResponse.json(
      { error: "Nu am putut analiza site-ul. Încearcă din nou." },
      { status: 500 }
    );
  }
}
