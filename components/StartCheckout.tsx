"use client";

// Butonul de plată pentru Pachetul Start Online — pagina /plata-start.
// Emailul vine din sesiunea de cont dacă există; altfel îl cere aici.

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function StartCheckout({ initialEmail = "", price }: { initialEmail?: string; price: number }) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/start-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ceva n-a mers — încearcă din nou.");
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setDone(data?.mesaj ?? "Comanda ta e înregistrată!");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
        <CheckCircle2 className="h-4 w-4" /> {done}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      {!initialEmail && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="emailul tău — pe el primești totul"
          className="input rounded-2xl py-3 text-center text-sm"
        />
      )}
      <button type="button" onClick={pay} disabled={busy} className="btn-primary mt-3 w-full justify-center">
        {busy ? "Se încarcă..." : `Plătește ${price} lei — cu cardul, securizat`}
      </button>
      {error && <p className="mt-3 text-sm font-semibold text-red-400">⚠️ {error}</p>}
      <p className="mt-3 text-[11px] text-text-subtle">
        Plată securizată prin Stripe · factura fiscală vine automat pe email · fără telefoane
      </p>
    </div>
  );
}
