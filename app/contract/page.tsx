"use client";

// Semnarea contractului de prestări servicii — la distanță, în 2 minute.
// CUI → datele firmei se trag singure de la ANAF → accepți → copia vine pe email
// (ție și nouă). Linkuit din emailul de confirmare a plății.

import { useEffect, useRef, useState } from "react";
import { parseConfig, configSummary, configPriceText, type Config } from "@/lib/configuratie";
import { PRAG_AVANS, contractHtml } from "@/lib/contract";
import { siteConfig } from "@/lib/site";
import { CheckCircle2, Loader2, FileSignature, FileText, Download } from "lucide-react";

const SERVICES = [
  { key: "Site Start — site de prezentare (5 pagini + blog)", price: "1.500 lei" },
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
  // Venit din emailul cu oferta: /contract?tip=...&optiuni=... — pachetul e exact ce a ales clientul
  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setConfig(parseConfig(q.get("tip"), q.get("optiuni")));
  }, []);
  const [accepted, setAccepted] = useState(false);
  const [showContract, setShowContract] = useState(false);
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

  // Contractul complet, cu datele completate până acum — clientul îl citește sau îl descarcă înainte să semneze
  function previewHtml(): string {
    const svc = SERVICES.find((x) => x.key === service) ?? SERVICES[0];
    return contractHtml({
      clientName: firm?.name || "[denumirea firmei]",
      clientCui: cui || "[CUI]",
      clientAddress: firm?.address || "[sediul firmei]",
      clientRep: rep.trim() || "[numele reprezentantului]",
      clientEmail: email.trim() || "[email]",
      service: config ? configSummary(config) : svc.key,
      price: config ? configPriceText(config) : svc.price,
      acceptedAt: new Date(),
      ip: "—",
      config,
    });
  }

  function download() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Contract Imperial Media</title><style>*{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:14mm}</style></head><body style="margin:0;">${previewHtml()}</body></html>`
    );
    w.document.close();
    w.focus();
    w.print();
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
          ...(config ? { config: { tip: config.type, optiuni: config.lines.map((l) => l.key) } } : {}),
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
            Numărul contractului: <b className="text-text">{done}</b>. Exemplarul tău e pe email — păstrează-l. Îți trimitem factura proformă pe email, iar plata se face prin transfer bancar.
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
          {config ? (
            <div className="rounded-2xl border border-bg-border bg-bg-card/60 px-4 py-3 text-sm leading-relaxed text-text">
              {configSummary(config)} — <b>{configPriceText(config)}</b>
              <p className="mt-2 text-[13px] text-text-muted">
                Plata, prin transfer pe factură proformă:{" "}
                {config.once > PRAG_AVANS
                  ? `50% avans la semnare (${Math.round(config.once / 2).toLocaleString("ro-RO")} lei) și 50% la finalizare, înainte de publicare.`
                  : `integral la semnare (${config.once.toLocaleString("ro-RO")} lei).`}
                {config.monthly > 0 ? ` Administrarea, ${config.monthly} lei/lună, se plătește lunar de la lansare.` : ""}
              </p>
            </div>
          ) : (
            <select className="input rounded-2xl" value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((s) => (
                <option key={s.key} value={s.key}>{s.key} — {s.price}</option>
              ))}
            </select>
          )}
        </div>
        <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
          <p className="text-sm font-semibold text-text">Citește contractul înainte să semnezi</p>
          <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
            Vezi exact ce primești, cum se face plata și care sunt pașii. Datele completate mai sus apar direct în contract.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowContract((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[13px] font-medium text-text transition hover:border-brand-orange/60"
            >
              <FileText className="h-4 w-4" />
              {showContract ? "Ascunde contractul" : "Citește contractul complet"}
            </button>
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[13px] font-medium text-text transition hover:border-brand-orange/60"
            >
              <Download className="h-4 w-4" />
              Descarcă / printează
            </button>
          </div>
          {showContract ? (
            <div
              className="mt-4 max-h-[520px] overflow-y-auto rounded-xl bg-white"
              dangerouslySetInnerHTML={{ __html: previewHtml() }}
            />
          ) : null}
          <p className="mt-3 text-[12px] leading-relaxed text-text-subtle">
            Preferi să-l semnezi de mână? Descarcă-l, semnează-l și trimite-l scanat sau fotografiat la{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-orange hover:underline">{siteConfig.email}</a>.
          </p>
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
