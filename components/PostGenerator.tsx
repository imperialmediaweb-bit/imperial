"use client";

// Generatorul de postări din cont — exclusiv Abonament Social.
// Alegi tipul, spui ce vrei să comunici, primești 3 postări gata de publicat.

import { useState } from "react";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";

type Post = { text: string; hashtags: string; photoIdea: string; bestTime: string };

const KINDS = [
  { key: "", label: "✨ Mixte" },
  { key: "promotie", label: "🏷️ Promoție" },
  { key: "educativ", label: "🎓 Educativ" },
  { key: "culise", label: "🎬 Din culise" },
  { key: "recenzie", label: "⭐ Recenzie client" },
  { key: "oferta-geam", label: "🪟 Ofertă pentru geam" },
];

export function PostGenerator() {
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/post-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, kind }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "N-a mers — încearcă din nou.");
      setPosts(data.posts ?? []);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  async function copyPost(i: number) {
    const p = posts[i];
    try {
      await navigator.clipboard.writeText(`${p.text}\n\n${p.hashtags}`);
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  return (
    <div className="rounded-3xl border-2 border-brand-purple/40 bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-orange/5 p-6">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
        <Sparkles className="h-5 w-5 text-brand-purple" /> Generatorul tău de postări
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Postări pe firma TA, gata de publicat: alegi tipul, spui ce vrei să comunici (opțional), copiezi și postezi.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button key={k.key} type="button" onClick={() => setKind(k.key)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${kind === k.key ? "border-transparent bg-brand-purple text-white" : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-purple/50"}`}>
            {k.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input className="input flex-1 rounded-xl text-sm" placeholder="ex: avem tort nou cu fistic / program prelungit sâmbătă — sau lasă gol"
          value={topic} onChange={(e) => setTopic(e.target.value)} />
        <button type="button" onClick={generate} disabled={busy} className="btn-primary text-sm">
          {busy ? "Scriu postările..." : "Generează 3 postări"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-400">⚠️ {error}</p>}
      {posts.length > 0 && (
        <div className="mt-5 grid gap-3">
          {posts.map((p, i) => (
            <div key={i} className="rounded-2xl border border-bg-border bg-bg-card/70 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{p.text}</p>
              <p className="mt-2 text-xs font-semibold text-brand-purple">{p.hashtags}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-subtle">
                {p.photoIdea && <span>📷 {p.photoIdea}</span>}
                {p.bestTime && <span>🕐 {p.bestTime}</span>}
              </div>
              <button type="button" onClick={() => copyPost(i)} className="btn-ghost mt-3 text-xs">
                {copied === i ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Copiat!</> : <><Copy className="h-3.5 w-3.5" /> Copiază postarea</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
