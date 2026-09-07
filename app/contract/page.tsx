"use client";

// Semnarea contractului de prestări servicii — la distanță, în 2 minute.
// CUI → datele firmei se trag singure de la ANAF → accepți → copia vine pe email
// (ție și nouă). Linkuit din emailul de confirmare a plății.

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, FileSignature } from "lucide-react";

const SERVICES = [
  { key: "Site Start — site de prezentare (4 pagini)", price: "1.500 lei" },
  { key: "Pachet Start Online (Google Business + Facebook)", price: "500 lei" },
  { key: "Site de prezentare complet — conform ofertei acceptate pe email", price: "conform ofertei" },
  { key: "Magazin online — conform ofertei acceptate pe email", price: "conform ofertei" },
];

export default function ContractPage() {
  const [cui, setCui] = useState("");
  const [firm, setFirm] = useState<{ name: string; address: string } | null>(null);
  const [looking, setLooking] = useState(false);
  const [rep, setRep] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(SERVICES[0].key);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lookTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onCui(v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 10);
    setCui(clean);
    setFirm(null);
    if (lookTimer.current) clearTimeout(lookTimer.current);
    if (clean.length < 4) return;
    lookTimer.current = setTimeout(async () => {
      setLooking(true);
      try {
        const res = await fetch(`/api/firm-lookup?cui=${clean}`);
        const data = await res.json().catch(() => null);
        if (data?.found) setFirm({ name: data.name, address: data.city ?? "" });
      } catch {}
      setLooking(false);
    }, 500);
  }

  async function submit() {
    if (!firm) {
      setError("Pune CUI-ul firmei — datele se completează singure de la ANAF.");
      return;
    }
    if (!rep.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Numele tău complet și emailul sunt obligatorii.");
      return;
    }
    if (!accepted) {
      setError("Bifează acceptarea contractului.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const svc = SERVICES.find((s) => s.key === service) ?? SERVICES[0];
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientCui: cui, clientName: firm.name, clientAddress: firm.address,
          clientRep: rep.trim(), clientEmail: email.trim(), service: svc.key, price: svc.price,
          accepted: true,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ceva n-a mers — încearcă din nou.");
      setDone(data.nr);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="container-app flex min-h-[70vh] items-center justify-center py-14">
        <div className="max-w-md rounded-3xl border border-green-500/40 bg-green-500/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-text">Contract semnat! 📜</h1>
          <p className="mt-2 text-sm text-text-muted">
            Numărul contractului: <b className="text-text">{done}</b>. Exemplarul tău e pe email — păstrează-l.
            O copie identică a ajuns și la noi.
          </p>
          <a href="/site-start/date" className="btn-primary mt-5 inline-flex">Continuă — datele site-ului →</a>
        </div>
      </main>
    );
  }

  return (
    <main className="container-app max-w-xl py-12">
      <span className="chip"><FileSignature className="mr-1 h-3.5 w-3.5" /> Contract de prestări servicii</span>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-text sm:text-3xl">Semnează contractul — 2 minute</h1>
      <p className="mt-2 text-sm text-text-muted">
        Pui CUI-ul, datele firmei se completează singure de la ANAF, accepți — și amândoi primim copia pe email. Fără printat, fără scanat.
      </p>

      <div className="mt-8 grid gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">CUI-ul firmei tale *</label>
          <input className="input rounded-2xl" inputMode="numeric" value={cui} onChange={(e) => onCui(e.target.value)} placeholder="ex: 12345678" />
          {looking && <p className="mt-1.5 text-[11px] text-text-subtle">Caut la ANAF...</p>}
          {firm && (
            <div className="mt-2 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-sm">
              <p className="font-bold text-text">✓ {firm.name}</p>
              {firm.address && <p className="mt-0.5 text-xs text-text-muted">{firm.address}</p>}
            </div>
          )}
          {!looking && cui.length >= 4 && !firm && (
            <p className="mt-1.5 text-[11px] text-yellow-400">Nu am găsit firma — verifică CUI-ul.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">Numele tău complet (reprezentant) *</label>
          <input className="input rounded-2xl" value={rep} onChange={(e) => setRep(e.target.value)} placeholder="ex: Ion Popescu" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">Emailul tău *</label>
          <input className="input rounded-2xl" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aici primești contractul" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">Pachetul contractat *</label>
          <select className="input rounded-2xl" value={service} onChange={(e) => setService(e.target.value)}>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.key}>{s.key} — {s.price}</option>
            ))}
          </select>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-bg-border bg-bg-card/60 p-4 text-sm text-text-muted">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-500" />
          <span>
            Am citit și accept <b className="text-text">contractul de prestări servicii</b> (îl primesc integral pe email),{" "}
            <a href="/termeni" target="_blank" className="text-brand-orange hover:underline">termenii și condițiile</a> și{" "}
            <a href="/confidentialitate" target="_blank" className="text-brand-orange hover:underline">politica de confidențialitate</a>.
            Acceptarea electronică ține loc de semnătură.
          </span>
        </label>

        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">⚠️ {error}</p>}

        <button type="button" onClick={submit} disabled={busy} className="btn-primary justify-center">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}
          Semnez contractul
        </button>
      </div>
    </main>
  );
}
