"use client";

// Formularul de livrare din admin: lipești linkurile paginilor create + ce ai optimizat
// → clientul primește automat emailul de predare + notificare în cont. Fără telefoane.

import { useState } from "react";
import { Send } from "lucide-react";

export function DeliverPagesForm({ emails }: { emails: string[] }) {
  const [email, setEmail] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [optimizations, setOptimizations] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/deliver-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, facebookUrl, googleUrl, optimizations }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ ok: true, text: data.mesaj });
        setFacebookUrl("");
        setGoogleUrl("");
        setOptimizations("");
      } else {
        setResult({ ok: false, text: data.error ?? "Ceva n-a mers." });
      }
    } catch {
      setResult({ ok: false, text: "Eroare de rețea — încearcă din nou." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-3xl border border-green-500/30 bg-green-500/5 p-5">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
        <Send className="h-5 w-5 text-green-400" /> Livrează pagini create (Facebook / Google Business)
      </h2>
      <p className="mt-1 text-xs text-text-subtle">
        Ai terminat paginile comandate prin consultant? Lipește linkurile — clientul primește automat
        emailul de predare + notificare în cont, iar consultantul și monitorizarea află de noile pagini.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Emailul clientului</label>
          <input className="input rounded-xl" list="deliver-emails" placeholder="client@email.ro"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <datalist id="deliver-emails">
            {emails.map((e) => <option key={e} value={e} />)}
          </datalist>
        </div>
        <div>
          <label className="label">Link pagină Facebook (dacă ai făcut-o)</label>
          <input className="input rounded-xl" placeholder="https://facebook.com/..."
            value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
        </div>
        <div>
          <label className="label">Link profil Google Business (dacă l-ai făcut)</label>
          <input className="input rounded-xl" placeholder="https://maps.google.com/... sau https://g.page/..."
            value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Ce ai optimizat (intră în emailul clientului)</label>
          <textarea className="input min-h-[70px] rounded-xl" placeholder={"ex: logo + cover cu design nou, descriere SEO, program, 20 poze, primele 3 postări publicate"}
            value={optimizations} onChange={(e) => setOptimizations(e.target.value)} />
        </div>
      </div>
      <button type="button" onClick={submit} disabled={busy} className="btn-primary mt-4">
        {busy ? "Se trimite..." : "Trimite livrarea către client"}
      </button>
      {result && (
        <p className={`mt-3 text-sm font-semibold ${result.ok ? "text-green-400" : "text-red-400"}`}>
          {result.ok ? "✅ " : "⚠️ "}{result.text}
        </p>
      )}
    </div>
  );
}
