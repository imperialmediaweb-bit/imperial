// Endpoint conversațional pentru Imperial AI.
// Primește istoricul mesajelor (format Anthropic) și returnează răspunsul asistentului
// + tool_uses extrase pentru a fi aplicate în state-ul clientului.
//
// Protecție: rate-limiting simplu prin cookie + limită de mesaje per sesiune.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_TOOLS, CLAUDE_MODEL, SYSTEM_PROMPT, CONSULTANTA_PROMPT, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // secunde — răspunsul ar trebui să vină sub 5s normal

// Protejăm împotriva abuzului — max 60 de mesaje TEXT de la user per sesiune.
// Nu numărăm mesajele sintetice (tool_result) sau răspunsurile AI.
const MAX_USER_TEXT_MESSAGES = 60;

type ToolCall = { name: string; input: Record<string, unknown>; id: string };

// Numără doar mesajele de tip "user cu text real" (nu tool_result-urile sintetice)
function countUserTextMessages(messages: Anthropic.MessageParam[]): number {
  let count = 0;
  for (const m of messages) {
    if (m.role !== "user") continue;
    if (typeof m.content === "string") {
      count++;
      continue;
    }
    // Verificăm dacă în array există un block de tip "text" (vs doar "tool_result")
    if (Array.isArray(m.content)) {
      const hasText = m.content.some((b: any) => b?.type === "text");
      if (hasText) count++;
    }
  }
  return count;
}

export async function POST(req: Request) {
  // Max 30 mesaje AI per IP per 10 minute — protejează costurile Claude
  if (!rateLimit(`chat:${getClientIp(req)}`, 30, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Prea multe mesaje. Ia o pauză scurtă și revino în câteva minute." },
      { status: 429 }
    );
  }

  let body: { messages?: Anthropic.MessageParam[]; mode?: string; clientContext?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const mode = body.mode === "consultanta" ? "consultanta" : "brief";
  // Context despre client (doar consultanță, ex: din /cont — datele firmei lui)
  const clientContext =
    mode === "consultanta" && typeof body.clientContext === "string"
      ? body.clientContext.slice(0, 2200)
      : "";

  if (messages.length === 0) {
    return NextResponse.json({ error: "Niciun mesaj." }, { status: 400 });
  }

  const userTextCount = countUserTextMessages(messages);
  if (userTextCount > MAX_USER_TEXT_MESSAGES) {
    return NextResponse.json(
      {
        error:
          "Am strâns deja multe detalii — hai să finalizăm! Apasă 'Trimite brief-ul' sau sună direct la 0758 169 388.",
      },
      { status: 429 }
    );
  }

  // Verificăm cheia înainte să creăm clientul
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[/api/brief-chat] ANTHROPIC_API_KEY missing");
    return NextResponse.json(
      {
        error:
          "Asistentul AI nu e configurat momentan. Te rugăm să folosești formularul clasic de mai jos sau sună la 0758 169 388.",
      },
      { status: 503 }
    );
  }

  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "AI indisponibil." }, { status: 503 });
  }

  // Loop: Claude poate decide să cheme tool-uri mai multe runde la rând.
  // Pentru tool-urile noastre (side-effects pe client), "tool_result" e mereu "ok".
  const appendedMessages: Anthropic.MessageParam[] = [];
  const allToolCalls: ToolCall[] = [];
  let currentMessages: Anthropic.MessageParam[] = [...messages];
  let finalText = "";
  let loops = 0;
  const MAX_LOOPS = 4;

  try {
    while (loops < MAX_LOOPS) {
      const resp = await client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        // Prompt caching pe system prompt — reduce costul după prima cerere
        system: [
          {
            type: "text",
            text: mode === "consultanta" ? CONSULTANTA_PROMPT : SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
          ...(clientContext
            ? [
                {
                  type: "text" as const,
                  text: `\nDATE REALE DESPRE ACEST CLIENT (din contul lui — folosește-le direct, nu i le mai cere):\n${clientContext}\n\nREGULI SUPLIMENTARE: Ești consultantul LUI dedicat — vorbește-i personal, pe firma lui, nu generic. Dacă NU are site, obiectivul principal al conversației e să-l duci către estimarea rapidă: spune-i să intre pe /brief (estimare gratuită în 2 minute). Valabil pentru orice client, cu sau fără abonament.

EȘTI ȘI PROFESORUL LUI DE MARKETING PRACTIC — două materii pe care le predai la cerere sau când se potrivesc în discuție:
1) POSTĂRI: când cere idei de postări, dă-i postarea GATA DE PUBLICAT, calibrată pe domeniul și firma lui: textul complet (cârlig în prima linie + conținut + call-to-action), ce filmează/fotografiază exact cu telefonul, când o publice. Nu teorie — livrezi conținutul de-a gata, câte 1-3 postări per răspuns.
2) RECLAME FACEBOOK: îl înveți pas cu pas, ca pentru un începător: facebook.com/adsmanager → obiectivul potrivit pentru scopul lui (mesaje/trafic/notorietate locală — explică-i care și de ce), publicul (orașul lui + raza km + vârste relevante domeniului), buget de start mic (15-30 lei/zi, 7 zile test), creativul (folosește reel-urile/pozele din planul lui de social media), și cum citește rezultatele (cost pe mesaj/click — când oprește și când scalează). REGULA DE AUR pe care i-o spui mereu: nu apăsa „Promovează postarea" din butonul albastru — Ads Manager, nu boost, banii se duc de 2-3 ori mai eficient. Un subiect per răspuns, concret, cu cifrele lui.

DACĂ NU ARE PAGINĂ DE FACEBOOK SAU PROFIL GOOGLE BUSINESS (vezi datele de mai sus), sau spune că nu știe / nu are timp să și le facă: NU-l chinui cu tutoriale — oferă-i direct să i le facem NOI: Pachet Start Online, 500 lei — profil Google Business complet + pagină de Facebook cu design profesionist (logo simplu, cover, descriere, primele postări). Totul se comandă AICI, în chat, fără telefoane și fără întâlniri: strângi de la el prin conversație datele necesare (denumire, domeniu, program, telefon public, adresă, ce servicii/produse oferă) plus DOUĂ lucruri pentru predarea accesului: emailul lui de GMAIL (îl punem proprietar pe profilul Google Business) și LINKUL profilului lui personal de Facebook sau emailul contului (îi dăm control total pe pagină — explică-i că pagina va fi A LUI, noi rămânem doar să-l ajutăm). Întreabă-l și de LOGO: dacă are, îl urcă la poze; dacă NU are, liniștește-l — un logo simplu și curat e INCLUS în pachet, îl facem noi (întreabă-l doar ce culori îi plac / cum vrea să se simtă brandul). Pune tot în update_brief (selected_package: "Pachet Start Online 500 lei", detaliile în message) și când confirmă chemi request_submit. IMEDIAT DUPĂ, dă-i pașii finali: 1) plătește cu cardul în 1 minut la imperial-media.ro/plata-start (factura vine automat pe email), 2) urcă pozele firmei din contul lui — cardul „📸 Trimite-ne poze" din /cont. Livrare în câteva zile, totul pe email și în cont — fără telefoane. Dacă vrea să învețe singur în loc să comande, respectă-i alegerea și predă-i pas cu pas.

TRASEELE DE PLATĂ (toate self-service, cu factura automată pe email — nu programa telefoane, nu promite că-l sună cineva):
- Radiografia afacerii (299 lei, cu promovarea în 50 de ziare online inclusă): imperial-media.ro/service — formular de 60 de secunde, raport instant. Recomand-o și când întreabă pentru ALTĂ firmă (prieten/partener): are link de recomandare în cont — prietenul plătește 249 în loc de 299, iar el primește 1 lună de monitorizare gratis.
- Abonamentul de monitorizare (99 lei/lună sau 990/an = 2 luni gratis): se activează singur din /cont, butonul „Activează". Recomandă-l DOAR unde se potrivește natural (vrea urmărire lunară, întreabă des de evoluție) — nu la fiecare mesaj.
- Pachetul Start Online (500 lei): imperial-media.ro/plata-start, după colectarea comenzii ca mai sus.
- Site nou (de la 699€ — site de prezentare; cu funcții 1.400€+; magazin online 1.800€+): îndrumă-l la /brief — estimare gratuită în 2 minute, oferta vine pe email. Spune-i și că suma plătită pe raport (299 lei) se SCADE din site dacă comandă în 30 de zile, iar campania de presă în 50 de ziare e cadou la orice site nou.`,
                },
              ]
            : []),
        ],
        tools: ANTHROPIC_TOOLS,
        messages: currentMessages,
      });

      // Extrage text + tool_uses din răspuns
      const textBlocks: string[] = [];
      const toolUseBlocks: Array<{ id: string; name: string; input: Record<string, unknown> }> = [];

      for (const block of resp.content) {
        if (block.type === "text") {
          textBlocks.push(block.text);
        } else if (block.type === "tool_use") {
          toolUseBlocks.push({
            id: block.id,
            name: block.name,
            input: (block.input as Record<string, unknown>) ?? {},
          });
        }
      }

      // Adaugă assistant message la history (format Anthropic complet — cu tool_use blocks)
      const assistantMsg: Anthropic.MessageParam = {
        role: "assistant",
        content: resp.content,
      };
      currentMessages = [...currentMessages, assistantMsg];
      appendedMessages.push(assistantMsg);

      allToolCalls.push(...toolUseBlocks);
      if (textBlocks.length > 0) {
        finalText = textBlocks.join("\n");
      }

      // Dacă nu mai sunt tool_use-uri, am terminat
      if (resp.stop_reason !== "tool_use") {
        break;
      }

      // Generăm tool_results — scan_business execută server-side, restul sunt sintetice
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (t) => {
          if (t.name === "scan_business") {
            try {
              const scanRes = await fetch(
                new URL("/api/scan-business", req.url).toString(),
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(t.input),
                }
              );
              const scanData = await scanRes.json();
              return {
                type: "tool_result" as const,
                tool_use_id: t.id,
                content: JSON.stringify(scanData),
              };
            } catch {
              return {
                type: "tool_result" as const,
                tool_use_id: t.id,
                content: JSON.stringify({ found: false, error: "Căutare eșuată" }),
              };
            }
          }
          return {
            type: "tool_result" as const,
            tool_use_id: t.id,
            content: "ok",
          };
        })
      );

      const toolResultMsg: Anthropic.MessageParam = {
        role: "user",
        content: toolResults,
      };
      currentMessages = [...currentMessages, toolResultMsg];
      appendedMessages.push(toolResultMsg);

      loops++;
    }
  } catch (e: any) {
    console.error("[/api/brief-chat] Claude error:", e);
    const msg =
      e?.status === 401
        ? "Cheia API nu e validă."
        : e?.status === 429
          ? "Prea multe cereri. Încearcă din nou în câteva secunde."
          : "Eroare la asistent. Te rugăm să încerci din nou sau să folosești formularul clasic.";
    return NextResponse.json({ error: msg }, { status: e?.status ?? 500 });
  }

  return NextResponse.json({
    appendedMessages,
    toolCalls: allToolCalls.map((t) => ({ name: t.name, input: t.input, id: t.id })),
    assistantText: finalText || "…",
  });
}
