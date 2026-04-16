// Analizează un URL dat de user — extrage paletă culori, stil, features vizibile.
// Folosește Claude Haiku pe HTML-ul fetchat ca să identifice estetica.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

type AnalysisResult = {
  url: string;
  title?: string;
  colors: string[];
  vibe: string; // "corporate" | "playful" | "minimal" | "bold" etc
  style_description: string;
  features_detected: string[];
};

function cleanHtml(html: string, maxChars: number = 8000): string {
  // Scoatem script-uri și stiluri externe, păstrăm ce e relevant: meta, link, h1-h6, inline styles
  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ");
  // Normalizăm și prindem doar primele maxChars caractere
  return cleaned.slice(0, maxChars);
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

  // Validare URL de bază + adaugă https:// dacă lipsește
  let url: URL;
  try {
    const withProto = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    url = new URL(withProto);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Protocol invalid");
    }
  } catch {
    return NextResponse.json({ error: "URL invalid." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI nu e configurat (ANTHROPIC_API_KEY missing)." },
      { status: 503 }
    );
  }

  // ─── Fetch URL-ul cu timeout și limită de dimensiune ───
  let html: string;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);
    const res = await fetch(url.toString(), {
      signal: ac.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ImperialMediaBot/1.0; +https://imperial-media.ro)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(t);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Site-ul a returnat ${res.status}. Verifică URL-ul.` },
        { status: 400 }
      );
    }
    const buf = await res.arrayBuffer();
    // Limită 500KB
    const limited = buf.byteLength > 500_000 ? buf.slice(0, 500_000) : buf;
    html = new TextDecoder("utf-8").decode(limited);
  } catch (e: any) {
    console.error("[/api/analyze-url] fetch failed:", e?.message);
    return NextResponse.json(
      { error: "Nu am putut accesa site-ul. Verifică URL-ul și încearcă din nou." },
      { status: 502 }
    );
  }

  const cleanedHtml = cleanHtml(html);

  // ─── Întreabă Claude să extragă stilul ───
  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "AI indisponibil." }, { status: 503 });
  }

  const systemPrompt = `Ești un expert UX/UI care analizează rapid site-uri web.
Ți se dă HTML-ul unei pagini. Extrage:
1. colors: 3-5 culori dominante (hex)
2. vibe: un cuvânt/sintagmă (corporate, playful, minimal, bold, elegant, tech, organic, luxurios, etc)
3. style_description: o frază scurtă despre estetica site-ului (max 20 cuvinte)
4. features_detected: listă cu features identificate (max 6 — ex: "meniu hamburger", "hero video", "rezervări online", "plăți card")
5. title: titlul paginii (din <title>)

Răspunzi DOAR cu JSON valid, nimic altceva. Format exact:
{"title":"...","colors":["#xxxxxx",...],"vibe":"...","style_description":"...","features_detected":["...",...]}`;

  try {
    const resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `URL: ${url.toString()}\n\nHTML:\n${cleanedHtml}`,
        },
      ],
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Răspuns AI gol.");
    }

    // Parsează JSON-ul
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI nu a returnat JSON valid.");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    const result: AnalysisResult = {
      url: url.toString(),
      title: typeof parsed.title === "string" ? parsed.title.slice(0, 200) : undefined,
      colors: Array.isArray(parsed.colors)
        ? parsed.colors
            .map(String)
            .filter((c: string) => /^#[0-9a-fA-F]{3,8}$/.test(c))
            .slice(0, 6)
        : [],
      vibe: typeof parsed.vibe === "string" ? parsed.vibe.slice(0, 50) : "modern",
      style_description:
        typeof parsed.style_description === "string"
          ? parsed.style_description.slice(0, 200)
          : "",
      features_detected: Array.isArray(parsed.features_detected)
        ? parsed.features_detected.map(String).slice(0, 8)
        : [],
    };

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[/api/analyze-url] Claude error:", e);
    return NextResponse.json(
      { error: "Nu am putut analiza site-ul. Încearcă alt URL." },
      { status: 500 }
    );
  }
}
