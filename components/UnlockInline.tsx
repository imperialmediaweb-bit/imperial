"use client";

// Deblocarea raportului direct de pe pagina lui (linkul din email) —
// leadul care a plecat fără să plătească se poate întoarce oricând și plăti.

import { useState } from "react";
import { CheckCircle2, Newspaper } from "lucide-react";
import { fbTrack } from "@/lib/fbq";

export function UnlockInline({ token, price, initialEmail = "" }: { token: string; price: number; initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
      setError("Lasă un email valid — pe el primești raportul.");
      return;
    }
    setBusy(true);
    setError(null);
    fbTrack("InitiateCheckout", { value: price, currency: "RON" });
    try {
      const res = await fetch("/api/service-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: clean }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ceva n-a mers — încearcă din nou.");
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      window.location.reload(); // mod lansare / VIP: raportul e deblocat pe loc
    } catch (e: any) {
      setError(String(e?.message ?? e));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border-2 border-brand-orange/50 bg-bg-card bg-card-gradient p-7 text-center shadow-card">
      <h2 className="font-display text-xl font-extrabold text-text">Deblochează raportul complet</h2>
      <p className="mt-2 font-display text-3xl font-extrabold text-brand-orange">{price === 0 ? "GRATUIT" : `${price} lei`}</p>
      <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-text-muted">
        <li className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
          Diagnostic complet cu rezolvări, competiție, proiecție, planul primei luni + 12 luni
        </li>
        <li className="flex items-start gap-2">
          <Newspaper className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
          <span><b className="text-text">CADOU: articolul tău de promovare în 50 de ziare online</b> (pachetul de 300€)</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
          Suma se scade integral din orice pachet comanzi în 30 de zile — practic raportul devine gratuit
        </li>
      </ul>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="emailul tău — aici primești raportul"
        className="input mt-5 rounded-2xl py-3 text-center text-sm" />
      <button type="button" onClick={unlock} disabled={busy} className="btn-primary mt-3 w-full justify-center">
        {busy ? "Se încarcă..." : price === 0 ? "Deblochează gratuit" : `Deblochează — ${price} lei`}
      </button>
      {error && <p className="mt-3 text-sm font-semibold text-red-400">⚠️ {error}</p>}
      <p className="mt-3 text-[11px] text-text-subtle">Plată securizată prin Stripe · factura vine automat pe email</p>
    </div>
  );
}
