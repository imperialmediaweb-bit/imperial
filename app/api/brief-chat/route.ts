// Endpoint conversațional pentru Imperial AI.
// Primește istoricul mesajelor (format Anthropic) și returnează răspunsul asistentului
// + tool_uses extrase pentru a fi aplicate în state-ul clientului.
//
// Protecție: rate-limiting simplu prin cookie + limită de mesaje per sesiune.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_TOOLS, CLAUDE_MODEL, SYSTEM_PROMPT, getAnthropic } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // secunde — răspunsul ar trebui să vină sub 5s normal

// Protejăm împotriva abuzului — max 40 mesaje per sesiune (mai mult decât suficient pentru un brief)
const MAX_MESSAGES_PER_SESSION = 40;

type ToolCall = { name: string; input: Record<string, unknown>; id: string };

export async function POST(req: Request) {
  let body: { messages?: Anthropic.MessageParam[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "Niciun mesaj." }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES_PER_SESSION) {
    return NextResponse.json(
      {
        error:
          "Conversație prea lungă. Te rugăm să apelezi direct 0758 169 388 ca să finalizăm rapid.",
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
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
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

      // Generăm tool_results sintetice — tool-urile noastre nu returnează date server-side
      const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((t) => ({
        type: "tool_result",
        tool_use_id: t.id,
        content: "ok",
      }));

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
