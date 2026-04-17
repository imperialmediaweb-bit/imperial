"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles, MessageSquare, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BriefState, MoodBoard } from "@/lib/brief-schema";
import { emptyBrief, MOODBOARDS } from "@/lib/brief-schema";
import { LiveBriefCard } from "./LiveBriefCard";
import { getPackageByKey } from "@/lib/packages";

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr class="my-2 border-bg-border" />')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 items-start"><span class="text-brand-orange font-bold text-xs mt-0.5">$1.</span><span>$2</span></div>')
    .replace(/^[-•]\s+(.+)$/gm, '<div class="flex gap-2 items-start"><span class="text-brand-orange mt-1.5">•</span><span>$1</span></div>')
    .replace(/([❌✅⚠️🔥💡📊✨🚀📱💰🎯])/g, '<span class="not-italic">$1</span>');
}

// Tipuri minime pentru mesajele Anthropic (nu importăm SDK-ul pe client)
type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string };

type AnthropicMsg = {
  role: "user" | "assistant";
  content: AnthropicContentBlock[] | string;
};

type ChipOptions = {
  list: string[];
  multi: boolean;
  answered?: boolean;
};

type UIMessage = {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
  options?: ChipOptions;
  moodboards?: { answered?: boolean }; // când AI cere mood boards
};

const GREETINGS = {
  brief: "Salut! 👋 Sunt Imperial AI. Spune-mi pe scurt: ce proiect ai în minte? Poți scrie, apăsa 🎤 ca să-mi vorbești, sau bifa rapid mai jos.",
  consultanta:
    "Salut! 👋 Sunt consultantul tău digital. Spune-mi: ce afacere ai și în ce oraș? Analizez prezența ta online și-ți zic exact unde pierzi clienți — gratuit, fără obligații.",
};

const CHIPS: Record<string, ChipOptions> = {
  brief: {
    list: ["Site prezentare", "Magazin online", "Promovare", "Altceva"],
    multi: false,
  },
  consultanta: {
    list: [
      "Am un business mic",
      "Am firmă / SRL",
      "Vreau să încep o afacere",
      "Am site dar nu merge bine",
    ],
    multi: false,
  },
};

type BriefChatProps = {
  mode?: "brief" | "consultanta";
};

export function BriefChat({ mode = "brief" }: BriefChatProps) {
  const greeting = GREETINGS[mode];
  const initialChips = CHIPS[mode];
  const router = useRouter();
  const [history, setHistory] = useState<AnthropicMsg[]>([]);
  const [uiMessages, setUiMessages] = useState<UIMessage[]>([
    { role: "assistant", text: greeting, options: initialChips },
  ]);
  const [brief, setBrief] = useState<BriefState>(emptyBrief);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // State pentru multi-select: { msgIdx: number; selected: Set<string> }
  const [multiDraft, setMultiDraft] = useState<{
    msgIdx: number;
    selected: string[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── Preselecție pachet din URL: /brief?pachet=shop ───
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const pachet = params.get("pachet");
    if (!pachet) return;
    const pkg = getPackageByKey(pachet);
    if (!pkg) return;
    setBrief((b) => ({ ...b, selectedPackage: pachet as any }));
    // Actualizează prima bula AI ca să reflecte pachetul preselectat
    setUiMessages([
      {
        role: "assistant",
        text: `Perfect — văd că te interesează ${pkg.name} 🎯 Ca să-ți pot da o estimare potrivită, zi-mi rapid câteva lucruri. Pentru început: cum te numești și pe ce email să-ți trimitem oferta?`,
      },
    ]);
  }, []);

  // ─── Web Speech API setup (Chrome/Edge/Safari) ───
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    setVoiceSupported(true);

    const recognition = new SR();
    recognition.lang = "ro-RO";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => {
      console.warn("[speech] error:", e?.error);
      setListening(false);
      if (e?.error === "not-allowed") {
        setError("Microfonul e blocat. Permite accesul în browser.");
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Auto-scroll la mesaj nou
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [uiMessages]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  const toggleMic = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    } else {
      setError(null);
      setInput("");
      try {
        rec.start();
        setListening(true);
      } catch (e) {
        console.warn("[speech] start failed:", e);
      }
    }
  }, [listening]);

  // ─── Aplică tool_use-urile AI-ului în state-ul brief-ului ───
  const applyToolCall = useCallback((tc: { name: string; input: any }) => {
    setBrief((prev) => {
      const next: BriefState = { ...prev };
      const inp = tc.input ?? {};

      if (tc.name === "update_brief") {
        const fields: (keyof BriefState)[] = [
          "name",
          "email",
          "phone",
          "selectedPackage",
          "industry",
          "currentSite",
          "pages",
          "deadline",
          "hasLogo",
          "colorsPreference",
          "features",
          "inspiration",
          "message",
        ];
        for (const f of fields) {
          if (inp[f] !== undefined && inp[f] !== null && inp[f] !== "") {
            (next as any)[f] = inp[f];
          }
        }
      } else if (tc.name === "set_recommendation") {
        if (inp.package) next.recommendedPackage = inp.package;
        if (inp.reason) next.recommendedReason = inp.reason;
        if (!next.selectedPackage && inp.package) {
          next.selectedPackage = inp.package;
        }
      } else if (tc.name === "set_estimate") {
        next.estimate = {
          min: typeof inp.min === "number" ? inp.min : null,
          max: typeof inp.max === "number" ? inp.max : null,
          currency: "EUR",
          reasoning: typeof inp.reasoning === "string" ? inp.reasoning : "",
        };
      } else if (tc.name === "request_submit") {
        next.readyToSubmit = true;
      }

      return next;
    });
  }, []);

  const send = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || sending) return;

    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setListening(false);
    }

    setError(null);
    setSending(true);
    setMultiDraft(null); // resetează orice selecție multi în progres

    const userMsg: AnthropicMsg = {
      role: "user",
      content: [{ type: "text", text }],
    };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);

    // Marchează chips-urile / moodboard-urile existente ca "answered" (dezactivează)
    setUiMessages((prev) => {
      const next = prev.map((m) => {
        const updated = { ...m };
        if (m.options && !m.options.answered) {
          updated.options = { ...m.options, answered: true };
        }
        if (m.moodboards && !m.moodboards.answered) {
          updated.moodboards = { answered: true };
        }
        return updated;
      });
      next.push({ role: "user", text });
      next.push({ role: "assistant", text: "", pending: true });
      return next;
    });
    setInput("");

    try {
      const resp = await fetch("/api/brief-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, mode }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(
          data?.error || "Asistentul nu răspunde momentan. Încearcă din nou."
        );
      }

      setHistory((prev) => [...prev, ...(data.appendedMessages ?? [])]);

      const toolCalls: Array<{ name: string; input: any }> = data.toolCalls ?? [];
      // Aplică tool-urile "de state" (update_brief, etc)
      for (const tc of toolCalls) {
        if (tc.name !== "present_options" && tc.name !== "present_moodboards") {
          applyToolCall(tc);
        }
      }
      // Găsește present_options (atașăm la bula AI curentă)
      const optCall = toolCalls.find((tc) => tc.name === "present_options");
      const newOptions: ChipOptions | undefined =
        optCall && Array.isArray(optCall.input?.options)
          ? {
              list: optCall.input.options.slice(0, 10).map((s: any) => String(s)),
              multi: !!optCall.input.multi_select,
            }
          : undefined;

      // Găsește present_moodboards
      const hasMoodboards = toolCalls.some((tc) => tc.name === "present_moodboards");

      setUiMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (next[lastIdx]?.pending) {
          next[lastIdx] = {
            role: "assistant",
            text: data.assistantText || "…",
            options: newOptions,
            moodboards: hasMoodboards ? {} : undefined,
          };
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message ?? "Eroare.");
      setUiMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setSending(false);
    }
  };

  // ─── Handlers pentru chips ───
  const onChipClick = (msgIdx: number, option: string, multi: boolean) => {
    if (sending) return;
    if (!multi) {
      // Single-select: trimite direct
      send(option);
    } else {
      // Multi-select: toggle în draft
      setMultiDraft((curr) => {
        if (!curr || curr.msgIdx !== msgIdx) {
          return { msgIdx, selected: [option] };
        }
        const exists = curr.selected.includes(option);
        return {
          msgIdx,
          selected: exists
            ? curr.selected.filter((x) => x !== option)
            : [...curr.selected, option],
        };
      });
    }
  };

  const sendMultiDraft = () => {
    if (!multiDraft || multiDraft.selected.length === 0) return;
    send(multiDraft.selected.join(", "));
  };

  // ─── Click pe mood board ───
  const onMoodboardPick = (mb: MoodBoard) => {
    if (sending) return;
    // Setăm paleta în state ca user preference
    setBrief((prev) => ({
      ...prev,
      colorsPreference: `${mb.name} (${mb.colors.slice(0, 3).join(", ")})`,
    }));
    // Trimitem ca mesaj user pentru ca AI să știe alegerea
    send(`Îmi place stilul "${mb.name}" (${mb.description})`);
  };

  // ─── Clonez stilul de pe URL ───
  const [analyzing, setAnalyzing] = useState(false);
  const cloneUrlStyle = async (url: string) => {
    if (sending || analyzing) return;
    setError(null);
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare analiză URL.");

      const colors = (data.colors ?? []).slice(0, 4).join(", ");
      const vibe = data.vibe ?? "modern";
      const msg = `Uite un site care îmi place: ${url}
Stilul lui: ${data.style_description ?? vibe}
Culori dominante: ${colors}
Features: ${(data.features_detected ?? []).join(", ")}
Vreau ceva în aceeași direcție.`;

      setBrief((prev) => ({
        ...prev,
        colorsPreference: `Inspiră-te după ${url} (${vibe}, ${colors})`,
        inspiration: prev.inspiration ? `${prev.inspiration}, ${url}` : url,
      }));

      setAnalyzing(false);
      await send(msg);
    } catch (e: any) {
      setError(e?.message ?? "Nu am putut analiza site-ul.");
      setAnalyzing(false);
    }
  };

  // Detectează URL-uri în ultimul mesaj al user-ului (pentru CTA "Clonez stilul")
  const urlInLastUserMsg = useMemo(() => {
    for (let i = uiMessages.length - 1; i >= 0; i--) {
      const m = uiMessages[i];
      if (m.role === "user") {
        const match = m.text.match(/https?:\/\/[\w.-]+\.[a-z]{2,}[^\s]*/i) ||
          m.text.match(/\b(?:www\.)?[\w-]+\.(ro|com|net|org|eu|store|shop|online|io|dev)\b[^\s]*/i);
        return match ? match[0] : null;
      }
    }
    return null;
  }, [uiMessages]);

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brief.name,
          email: brief.email,
          phone: brief.phone,
          selectedPackage: brief.selectedPackage || "personalizat",
          industry: brief.industry,
          currentSite: brief.currentSite,
          pages: brief.pages,
          deadline: brief.deadline,
          hasLogo: brief.hasLogo,
          colorsPreference: brief.colorsPreference,
          features: brief.features,
          inspiration: brief.inspiration,
          message: brief.message,
          aiEstimateMin: brief.estimate.min,
          aiEstimateMax: brief.estimate.max,
          aiEstimateReason: brief.estimate.reasoning,
          aiRecommendedPackage: brief.recommendedPackage,
          aiRecommendedReason: brief.recommendedReason,
          source: mode === "consultanta" ? "consultanta" : "ai-chat",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Nu am putut trimite. Sună la 0758 169 388.");
      }
      router.push("/multumim");
    } catch (e: any) {
      setError(e?.message ?? "Eroare.");
      setSubmitting(false);
    }
  };

  const lastMsgIdx = uiMessages.length - 1;
  const lastMsg = uiMessages[lastMsgIdx];
  const showMultiBar =
    multiDraft !== null &&
    multiDraft.msgIdx === lastMsgIdx &&
    lastMsg?.options?.multi &&
    !lastMsg.options.answered;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* ─── CHAT COLUMN ─── */}
      <div className="flex min-h-[640px] flex-col overflow-hidden rounded-3xl border border-bg-border bg-bg-card bg-card-gradient shadow-card">
        {/* Header mic */}
        <div className="flex items-center gap-3 border-b border-bg-border/60 px-5 py-3.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-gradient shadow-glow-orange">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-text">Imperial AI</p>
            <p className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
              Online · răspunde instant
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {uiMessages.map((m, idx) => (
            <MessageBubble
              key={idx}
              role={m.role}
              text={m.text}
              pending={m.pending}
              options={m.options}
              moodboards={m.moodboards}
              msgIdx={idx}
              multiDraft={multiDraft}
              onChipClick={(opt) =>
                onChipClick(idx, opt, !!m.options?.multi)
              }
              onMoodboardPick={onMoodboardPick}
              disabled={sending}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <p className="mx-5 mb-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Bară "Trimite selecții" pentru multi-select */}
        <AnimatePresence>
          {showMultiBar && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="border-t border-brand-orange/30 bg-brand-orange/10 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-text-muted">
                  Bifat: <span className="font-semibold text-text">{multiDraft?.selected.length}</span>{" "}
                  {multiDraft?.selected.length === 1 ? "selecție" : "selecții"}
                </p>
                <button
                  type="button"
                  onClick={sendMultiDraft}
                  disabled={sending || (multiDraft?.selected.length ?? 0) === 0}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-gradient px-4 py-1.5 text-xs font-semibold text-white shadow-glow-orange transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Trimite
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="border-t border-bg-border/60 p-4">
          {/* Clone URL CTA — apare când user a menționat un URL */}
          <AnimatePresence>
            {urlInLastUserMsg && !analyzing && !sending && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-brand-purple/40 bg-brand-purple/10 px-3 py-2"
              >
                <p className="truncate text-xs text-text">
                  <span className="text-brand-orange">🎨</span> Vrei să clonez stilul de pe{" "}
                  <span className="font-mono text-brand-orange">{urlInLastUserMsg.slice(0, 40)}</span>?
                </p>
                <button
                  type="button"
                  onClick={() => cloneUrlStyle(urlInLastUserMsg)}
                  className="flex-shrink-0 rounded-full bg-brand-purple px-3 py-1 text-[11px] font-semibold text-white hover:bg-brand-glow"
                >
                  Da, analizează
                </button>
              </motion.div>
            )}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-center gap-2 rounded-xl border border-brand-purple/40 bg-brand-purple/10 px-3 py-2"
              >
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-purple/30 border-t-brand-purple" />
                <p className="text-xs text-text">
                  Analizez site-ul... extrag culori, stil, features...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {listening && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex items-center gap-2 rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-3 py-2"
            >
              <AnimatedWave />
              <p className="text-xs text-text">Ascult... vorbește în română.</p>
            </motion.div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={
                listening
                  ? "Te ascult..."
                  : sending
                    ? "Imperial AI se gândește..."
                    : "Scrie aici sau apasă 🎤..."
              }
              className="input max-h-36 min-h-[48px] flex-1 resize-none py-3"
              disabled={sending}
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleMic}
                disabled={sending}
                aria-label={listening ? "Oprește microfon" : "Pornește microfon"}
                className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl transition ${
                  listening
                    ? "bg-brand-orange text-white shadow-glow-orange"
                    : "border border-bg-border bg-bg-soft text-text-muted hover:border-brand-orange hover:text-text"
                }`}
              >
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => send(input)}
              disabled={sending || !input.trim()}
              aria-label="Trimite mesaj"
              className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-orange-gradient text-white shadow-glow-orange transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {!voiceSupported && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-subtle">
              <MessageSquare className="h-3 w-3" />
              Browser-ul tău nu suportă voce — Chrome/Edge/Safari funcționează.
            </p>
          )}
        </div>
      </div>

      {/* ─── LIVE BRIEF CARD ─── */}
      <LiveBriefCard
        brief={brief}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────

type BubbleProps = {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
  options?: ChipOptions;
  moodboards?: { answered?: boolean };
  msgIdx: number;
  multiDraft: { msgIdx: number; selected: string[] } | null;
  onChipClick: (opt: string) => void;
  onMoodboardPick: (mb: MoodBoard) => void;
  disabled?: boolean;
};

function MessageBubble({
  role,
  text,
  pending,
  options,
  moodboards,
  msgIdx,
  multiDraft,
  onChipClick,
  onMoodboardPick,
  disabled,
}: BubbleProps) {
  const isUser = role === "user";

  const selectedSet = useMemo(() => {
    if (!options?.multi || !multiDraft || multiDraft.msgIdx !== msgIdx) {
      return new Set<string>();
    }
    return new Set(multiDraft.selected);
  }, [options, multiDraft, msgIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] flex-col gap-2 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} gap-2`}
        >
          {!isUser && (
            <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-orange-gradient text-[10px] font-bold text-white">
              AI
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "bg-orange-gradient text-white shadow-glow-orange"
                : "border border-bg-border bg-bg-soft/60 text-text"
            }`}
          >
            {pending ? (
              <TypingDots />
            ) : (
              <div className="whitespace-pre-wrap break-words chat-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
            )}
          </div>
        </div>

        {/* Chips clickabile sub bula AI */}
        {!isUser && options && !options.answered && (
          <div className="ml-10 flex flex-wrap gap-1.5">
            {options.list.map((opt) => {
              const selected = selectedSet.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChipClick(opt)}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selected
                      ? "border-brand-orange bg-brand-orange/20 text-text shadow-glow-orange"
                      : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-orange/60 hover:bg-brand-orange/5 hover:text-text"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {selected && (
                    <Check className="h-3 w-3 text-brand-orange" strokeWidth={3} />
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Mood board picker */}
        {!isUser && moodboards && !moodboards.answered && (
          <div className="ml-10 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
            {MOODBOARDS.map((mb) => (
              <button
                key={mb.key}
                type="button"
                onClick={() => onMoodboardPick(mb)}
                disabled={disabled}
                className="group relative overflow-hidden rounded-xl border border-bg-border bg-bg-soft/60 p-2.5 text-left transition hover:border-brand-orange hover:shadow-glow-orange disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Paleta de culori */}
                <div className="flex h-8 w-full gap-0.5 overflow-hidden rounded-md">
                  {mb.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-text">
                    {mb.emoji} {mb.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-text-muted">
                    {mb.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-text-muted"
        />
      ))}
    </div>
  );
}

function AnimatedWave() {
  return (
    <div className="flex items-end gap-0.5" style={{ height: 18 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          animate={{ height: ["8px", "18px", "8px"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          className="w-0.5 rounded-full bg-brand-orange"
          style={{ display: "inline-block" }}
        />
      ))}
    </div>
  );
}
