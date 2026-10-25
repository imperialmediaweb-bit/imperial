// Analiza „Ai nevoie de un site?" scrisă de Claude, personalizată pe domeniu, oraș și
// prezența online a firmei. Prețul și pachetul recomandat se calculează în client
// (sursă unică de prețuri); aici generăm doar textul. Fără statistici inventate.

import { NextRequest, NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { DOMENII, PREZENTA } from "@/lib/analiza-domenii";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { insertBrief } from "@/lib/briefs";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";

type Body = {
  firma?: string;
  domeniu?: string;
  oras?: string;
  descriere?: string;
  valoare?: number;
  prezenta?: string;
  pachet?: string;
  total?: number;
  site?: string; // faptele măsurate pe site-ul lui existent + verdictul
};

const SYSTEM = `Ești consultantul Imperial Media, studio de web design din România (site-uri construite de la zero, promovare prin rețeaua parteneră Media Expres — 50 de ziare online, Botoșani Expres inclus).
Scrii o analiză scurtă, concretă și caldă pentru patronul unei afaceri mici, ca să înțeleagă ce i-ar aduce un site.
REGULI STRICTE:
- Română corectă, cu diacritice, ton profesionist dar prietenos, fără sloganuri și fără superlative goale.
- NU inventa statistici, procente sau cifre de piață. Singurele cifre permise sunt cele primite în date.
- Concret pe domeniul și orașul lui (ex. ce caută clienții unui salon din acel oraș, ce îi convinge).
- Nu promite poziții în Google și nu garanta rezultate.
- Dacă primești faptele verificate pe site-ul lui și un verdict (REFACERE sau ÎMBUNĂTĂȚIRE), sprijină-te pe ele: explică pe înțelesul lui ce merge, ce nu și de ce verdictul e acela. Nu adăuga probleme pe care nu le-ai primit. Nu numi tehnologii moderne; spune „tehnologii de ultimă generație”.
- Dacă patronul spune că ARE DEJA un site care merge bine, NU-i recomanda un site nou: analiza e despre cum îl faci găsit (Google, răspunsurile asistenților AI precum ChatGPT, presa locală, un asistent care răspunde clienților). Dacă are un site vechi, vorbește despre refacerea lui.
Răspunzi DOAR cu JSON valid, fără alt text:
{"gasit": "dacă ai primit numele firmei: 1-2 propoziții cu ce ai găsit EFECTIV despre ea pe internet (are site? pagină Facebook activă? apare pe Google Maps, cu ce notă și câte recenzii?). Dacă n-ai găsit nimic sigur, spune sincer că nu ai găsit-o online — și asta e un semnal că pierde clienți. String gol dacă nu ai nume.", "intro": "2-3 propoziții personalizate despre situația lui", "beneficii": ["4 beneficii concrete, câte o propoziție"], "crestere": ["3-4 pași concreți prin care site-ul îi face afacerea cunoscută în orașul lui"], "concluzie": "1-2 propoziții care leagă pachetul recomandat de nevoile lui"}`;

export async function POST(req: NextRequest) {
  if (!rateLimit(`analiza:${getClientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ai-indisponibil" }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const dom = DOMENII.find((d) => d.key === body.domeniu);
  const prez = PREZENTA.find((p) => p.key === body.prezenta);
  const oras = String(body.oras ?? "").slice(0, 60).trim();
  const descriere = String(body.descriere ?? "").slice(0, 300).trim();
  const firma = String(body.firma ?? "").slice(0, 80).trim();
  if (!dom || !oras) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
  }

  const date = [
    firma
      ? `Numele firmei: „${firma}”. Caută-o pe internet (maximum 3 căutări: „${firma} ${oras}”, „${firma}” Facebook, „${firma}” Google Maps / recenzii). Ia în calcul DOAR rezultatele legate clar de orașul ${oras} sau de domeniul ei; ignoră omonimele.`
      : `Nu a dat numele firmei — nu căuta pe internet.`,
    `Domeniu: ${dom.name}`,
    descriere ? `Ce face firma, în cuvintele patronului: ${descriere}` : null,
    `Oraș: ${oras}`,
    `Valoarea medie a unui client: ${body.valoare} lei`,
    `Cum îl găsesc clienții acum: ${prez?.label ?? "nespecificat"}`,
    body.pachet ? `Pachet recomandat: ${body.pachet}, total orientativ ${body.total} lei` : null,
    body.site ? String(body.site).slice(0, 2500) : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const tools: any = firma ? [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }] : undefined;
    let messages: Anthropic.MessageParam[] = [{ role: "user", content: date }];
    let resp = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1400,
      system: SYSTEM,
      messages,
      ...(tools ? { tools } : {}),
    });
    // căutarea web poate cere continuarea turei
    for (let i = 0; i < 2 && (resp.stop_reason as string) === "pause_turn"; i++) {
      messages = [...messages, { role: "assistant", content: resp.content }];
      resp = await getAnthropic().messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1400,
        system: SYSTEM,
        messages,
        ...(tools ? { tools } : {}),
      });
    }
    const text = resp.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { text: string }).text)
      .join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const clean = (a: unknown, n: number) =>
      Array.isArray(a) ? a.filter((x) => typeof x === "string").slice(0, n) : [];
    const out = {
      gasit: typeof json.gasit === "string" ? json.gasit : "",
      intro: typeof json.intro === "string" ? json.intro : "",
      beneficii: clean(json.beneficii, 4),
      crestere: clean(json.crestere, 4),
      concluzie: typeof json.concluzie === "string" ? json.concluzie : "",
    };

    // Imperial află de fiecare analiză, chiar dacă omul nu cere ofertă
    const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rezumat = `${firma || "Firmă nespecificată"} — ${dom.name}, ${oras}. Prezența acum: ${prez?.label ?? "—"}.`;
    sendSimpleEmail({
      to: ownerEmail(),
      subject: `📊 Analiză nouă: ${firma || dom.name} — ${oras}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111;">
        <p><b>${esc(rezumat)}</b></p>
        ${descriere ? `<p>Ce face firma: ${esc(descriere)}</p>` : ""}
        ${body.site ? `<p><b>Site verificat:</b> ${esc(String(body.site).slice(0, 2500))}</p>` : ""}
        ${out.gasit ? `<p><b>Găsit online:</b> ${esc(out.gasit)}</p>` : ""}
        <p>Nu a lăsat încă un contact. Dacă cere analiza pe email, primești separat adresa lui.</p>
      </div>`,
    }).catch(() => {});
    if (hasDb()) {
      insertBrief({
        name: firma || dom.name,
        email: "",
        industry: dom.name,
        message: `Analiză gratuită (fără contact): ${rezumat}${body.site ? `\n${String(body.site).slice(0, 1500)}` : ""}`,
        source: "analiza",
      }).catch(() => {});
    }

    return NextResponse.json({
      gasit: out.gasit,
      intro: typeof json.intro === "string" ? json.intro : "",
      beneficii: clean(json.beneficii, 4),
      crestere: clean(json.crestere, 4),
      concluzie: typeof json.concluzie === "string" ? json.concluzie : "",
    });
  } catch (e) {
    console.error("[/api/analiza]", e);
    return NextResponse.json({ error: "ai-eroare" }, { status: 502 });
  }
}
