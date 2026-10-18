"use client";

import { useState } from "react";
import { Send, Loader2, Bot } from "lucide-react";

const BUSINESSES = [
  { id: "salon", label: "Salon", first: "Bună! Cât costă un vopsit și aveți loc sâmbătă?" },
  { id: "dentist", label: "Dentist", first: "Bună ziua, cât costă un detartraj?" },
  { id: "restaurant", label: "Restaurant", first: "Ce aveți azi la meniul zilei?" },
  { id: "service", label: "Service auto", first: "Vreau schimb de ulei la un Golf, când aveți loc?" },
];

type Turn = { role: "user" | "assistant"; content: string };

/** Demo live: patronul vede cum răspunde asistentul pe care îl primește cadou la site. */
export function DemoAssistant() {
  const [business, setBusiness] = useState(BUSINESSES[0]);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState(BUSINESSES[0].first);
  const [busy, setBusy] = useState(false);

  function pick(b: (typeof BUSINESSES)[number]) {
    setBusiness(b);
    setMessages([]);
    setInput(b.first);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Turn[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/demo-asistent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: business.id, messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || data.error || "Încearcă din nou." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Încearcă din nou." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-bg-border bg-bg-card/80 shadow-xl">
      <div className="flex flex-wrap gap-2 border-b border-bg-border/60 p-3">
        {BUSINESSES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => pick(b)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              business.id === b.id
                ? "bg-orange-gradient text-white"
                : "border border-bg-border text-text-muted hover:text-text"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="h-72 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="pt-16 text-center text-sm text-text-muted">
            <Bot className="mx-auto mb-2 h-6 w-6 text-brand-orange" />
            Scrie ca un client al unui {business.label.toLowerCase()} și vezi cum răspunde asistentul.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user" ? "ml-auto bg-brand-orange text-white" : "bg-bg-soft text-text"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="flex w-fit items-center gap-2 rounded-2xl bg-bg-soft px-3 py-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> scrie…
          </div>
        )}
      </div>
      <form
        className="flex items-center gap-2 border-t border-bg-border/60 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Scrie o întrebare de client…"
          className="flex-1 rounded-full border border-bg-border bg-transparent px-4 py-2 text-sm text-text outline-none focus:border-brand-orange/60"
        />
        <button
          type="submit"
          aria-label="Trimite"
          disabled={busy || !input.trim()}
          className="rounded-full bg-orange-gradient p-2 text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
