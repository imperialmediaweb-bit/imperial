"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, Sparkles, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BriefState } from "@/lib/brief-schema";
import { emptyBrief } from "@/lib/brief-schema";
import { LiveBriefCard } from "./LiveBriefCard";

// Tipuri minime pentru mesajele Anthropic (nu importăm SDK-ul pe client)
type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string };

type AnthropicMsg = {
  role: "user" | "assistant";
  content: AnthropicContentBlock[] | string;
};

type UIMessage = {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
};

const INITIAL_GREETING =
  "Salut! 👋 Sunt Imperial AI. Spune-mi pe scurt: ce proiect ai în minte? (Un site, magazin online, promovare sau altceva?) Poți scrie sau apăsa 🎤 ca să-mi vorbești.";

export function BriefChat() {
  const router = useRouter();
  const [history, setHistory] = useState<AnthropicMsg[]>([]);
  const [uiMessages, setUiMessages] = useState<UIMessage[]>([
    { role: "assistant", text: INITIAL_GREETING },
  ]);
  const [brief, setBrief] = useState<BriefState>(emptyBrief);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-scroll
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
  const applyToolCall = useCallback(
    (tc: { name: string; input: any }) => {
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
    },
    []
  );

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

    const userMsg: AnthropicMsg = {
      role: "user",
      content: [{ type: "text", text }],
    };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setUiMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: "", pending: true },
    ]);
    setInput("");

    try {
      const resp = await fetch("/api/brief-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(
          data?.error || "Asistentul nu răspunde momentan. Încearcă din nou."
        );
      }

      setHistory((prev) => [...prev, ...(data.appendedMessages ?? [])]);
      (data.toolCalls ?? []).forEach((tc: any) => applyToolCall(tc));

      setUiMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (next[lastIdx]?.pending) {
          next[lastIdx] = {
            role: "assistant",
            text: data.assistantText || "…",
          };
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message ?? "Eroare.");
      // Scoate bula "pending" dacă a eșuat
      setUiMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setSending(false);
    }
  };

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
          // Extra: trimitem și estimarea + recomandarea ca parte a mesajului către echipă
          aiEstimateMin: brief.estimate.min,
          aiEstimateMax: brief.estimate.max,
          aiEstimateReason: brief.estimate.reasoning,
          aiRecommendedPackage: brief.recommendedPackage,
          aiRecommendedReason: brief.recommendedReason,
          source: "ai-chat",
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

  return (
    <section id="brief" className="section relative">
      <div className="container-app max-w-6xl">
        <div className="text-center">
          <span className="chip">
            <Sparkles className="h-3 w-3" /> Brief AI conversațional
          </span>
          <h2 className="section-title mt-4 mx-auto">
            Spune-ne <span className="text-gradient">ce vrei</span> — scris sau prin voce
          </h2>
          <p className="section-subtitle mx-auto">
            Imperial AI te ghidează în ~2 minute și-ți dă estimare orientativă pe loc.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
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
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <p className="mx-5 mb-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            {/* Input bar */}
            <div className="border-t border-bg-border/60 p-4">
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
                    {listening ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
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

        {/* Fallback text */}
        <p className="mt-6 text-center text-xs text-text-subtle">
          Preferi formular clasic?{" "}
          <a href="#contact" className="text-brand-orange hover:underline">
            Scrie-ne direct
          </a>
          {"  ·  "}
          Sau sună la{" "}
          <a href="tel:0758169388" className="text-brand-orange hover:underline">
            0758 169 388
          </a>
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────

function MessageBubble({
  role,
  text,
  pending,
}: {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
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
            <p className="whitespace-pre-wrap break-words">{text}</p>
          )}
        </div>
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
