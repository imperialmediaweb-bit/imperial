// Generatorul de postări Facebook — exclusiv pentru Abonamentul Social.
// Clientul își generează singur, din cont, postări gata de publicat pe firma lui.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getClientEmail } from "@/lib/client-auth";
import { getSubscription } from "@/lib/subscribers";
import { getServiceReportsByEmail } from "@/lib/service-reports";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { hasDb } from "@/lib/db";
import { CLAUDE_MODEL } from "@/lib/ai";
import { isPremiumPlan } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  if (!email || !hasDb()) {
    return NextResponse.json({ error: "Intră întâi în contul tău." }, { status: 401 });
  }

  const sub = await getSubscription(email).catch(() => null);
  if (!sub?.active || !isPremiumPlan(sub.plan)) {
    return NextResponse.json(
      { error: "Generatorul de postări e inclus în abonamentul Premium — îl activezi din cont, secțiunea Abonament.", upgrade: true },
      { status: 403 }
    );
  }

  if (!rateLimit(`post-gen:${getClientIp(req)}`, 15, 60 * 60_000)) {
    return NextResponse.json({ error: "Ai generat multe azi — încearcă peste o oră." }, { status: 429 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Generatorul e temporar indisponibil." }, { status: 503 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const topic = String(body?.topic ?? "").trim().slice(0, 300);
  const kind = ["promotie", "educativ", "culise", "recenzie", "oferta-geam"].includes(body?.kind)
    ? String(body.kind)
    : "";

  const reports = await getServiceReportsByEmail(email).catch(() => []);
  const latest = reports[reports.length - 1];
  const r: any = latest?.report ?? {};
  const f: any = latest?.form_data ?? {};

  const prompt = `Ești social media managerul dedicat al firmei de mai jos. Scrie 3 postări de Facebook GATA DE PUBLICAT, în română, cu diacritice.

FIRMA: ${r.companyName ?? f.companyName ?? "?"} (${r.city ?? f.city ?? "?"}${f.zone ? `, zona ${f.zone}` : ""}) — domeniu: ${f.industry ?? "?"}
${r.socialPlan?.ideas?.length ? `IDEI DIN PLANUL LUI: ${r.socialPlan.ideas.slice(0, 4).join("; ")}` : ""}
${topic ? `CE VREA SĂ COMUNICE ACUM: ${topic}` : ""}
${kind === "promotie" ? "TIP: promoție/ofertă." : kind === "educativ" ? "TIP: educativ (sfaturi din domeniu, poziționare de expert)." : kind === "culise" ? "TIP: din culise (autenticitate, echipa, procesul)." : kind === "recenzie" ? "TIP: valorificarea unei recenzii/mulțumiri de client." : kind === "oferta-geam" ? "TIP: ofertă scurtă, numai bună și de printat pentru geam/vitrină." : "TIP: mixează (o promoție, una educativă, una autentică)."}

REGULI: cârlig puternic în prima linie (fără el, nimeni nu se oprește din scroll); text 40-120 cuvinte; call-to-action clar (sună/scrie/vino); 3-5 hashtag-uri locale+domeniu; NU inventa prețuri sau promoții concrete dacă nu ți-au fost date — lasă [PREȚ]/[DETALIU] de completat; pentru fiecare postare spune și CE POZĂ/VIDEO să pună (filmabil cu telefonul, azi) și CÂND să posteze.

Răspunde DOAR cu JSON: {"posts":[{"text":"...","hashtags":"#...","photoIdea":"...","bestTime":"..."}]}`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("empty");
    const match = textBlock.text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("no json");
    const parsed = JSON.parse(match[0]);
    const posts = Array.isArray(parsed?.posts)
      ? parsed.posts.slice(0, 3).map((p: any) => ({
          text: String(p.text ?? ""),
          hashtags: String(p.hashtags ?? ""),
          photoIdea: String(p.photoIdea ?? ""),
          bestTime: String(p.bestTime ?? ""),
        })).filter((p: any) => p.text)
      : [];
    if (posts.length === 0) throw new Error("no posts");
    return NextResponse.json({ posts });
  } catch (e) {
    console.error("[post-generator] failed:", e);
    return NextResponse.json({ error: "N-a ieșit de data asta — mai apasă o dată." }, { status: 500 });
  }
}
