"use client";

// Login /cont — cere emailul, primește link magic. Fără parole.

import { useState } from "react";
import { Mail, CheckCircle2, KeyRound, Loader2 } from "lucide-react";

export function ContLogin({ expired = false }: { expired?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cont/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Eroare. Încearcă din nou.");
      }
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Eroare. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-app flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-7 text-center shadow-card sm:p-9">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-orange-gradient">
          <KeyRound className="h-5 w-5 text-white" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-text">Contul tău</h1>
        <p className="mt-2 text-sm text-text-muted">
          Rapoartele tale, evoluția afacerii și notificările de monitorizare — toate într-un loc.
        </p>

        {expired && !sent && (
          <p className="mt-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-300">
            Linkul a expirat. Cere unul nou mai jos.
          </p>
        )}

        {sent ? (
          <div className="mt-6 rounded-2xl border border-green-500/40 bg-green-500/10 p-5">
            <CheckCircle2 className="mx-auto h-6 w-6 text-green-400" />
            <p className="mt-2 text-sm font-semibold text-green-300">Verifică-ți emailul!</p>
            <p className="mt-1 text-xs text-text-muted">
              Ți-am trimis linkul de acces (valabil 30 min). Verifică și în Spam.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emailul cu care ai primit raportul"
                className="input pl-10"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Trimite-mi linkul de acces
            </button>
            {error && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</p>
            )}
            <p className="text-[11px] leading-snug text-text-subtle">
              Fără parole — primești un link pe email și intri direct. Nu ai niciun raport încă?{" "}
              <a href="/service" className="text-brand-orange hover:underline">Fă-ți auditul aici</a>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
