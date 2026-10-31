"use client";

// „Nu accept oferta” din emailul cu oferta: clientul spune de ce, iar noi îi arătăm cum ne sună.
// Linkul din email aduce numele, emailul, telefonul și configurația — clientul nu mai scrie nimic de la zero.

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Phone, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { parseConfig, configSummary, configPriceText, configQuery, type Config } from "@/lib/configuratie";

const REASONS = ["Prețul e peste buget", "Vreau alte opțiuni", "Nu acum, mai târziu", "Am ales altă variantă"];

const chip = (on: boolean) =>
  `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
    on ? "bg-orange-gradient text-white" : "border border-white/12 text-white/70 hover:border-brand-orange/50 hover:text-white"
  }`;

export default function OfertaRaspunsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [config, setConfig] = useState<Config | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setName(q.get("n") ?? "");
    setEmail(q.get("e") ?? "");
    setPhone(q.get("t") ?? "");
    setConfig(parseConfig(q.get("tip"), q.get("optiuni")));
  }, []);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/oferta/raspuns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, reason, note,
          ...(config ? { tip: config.type, optiuni: config.lines.map((l) => l.key) } : {}),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ceva n-a mers — încearcă din nou.");
      setDone(true);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="section">
        <div className="container-app max-w-xl text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-orange-gradient shadow-glow-orange">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-text">
            Mulțumim pentru răspuns
          </h1>
          <p className="mt-4 text-text-muted">
            Am notat. Dacă te răzgândești sau vrei altă variantă, oferta rămâne în emailul tău — sună-ne oricând la{" "}
            <a href={`tel:${siteConfig.phoneRaw}`} className="font-semibold text-brand-orange">{siteConfig.phone}</a>.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full border border-white/10 px-6 py-3 text-sm text-text hover:border-brand-orange/70">
            Înapoi pe site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container-app max-w-xl">
        <span className="chip">
          <MessageSquare className="h-3 w-3" />
          Oferta ta
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-text">
          Ce nu s-a potrivit?
        </h1>
        {config ? (
          <p className="mt-3 text-sm text-text-muted">
            {configSummary(config)} — <b className="text-text">{configPriceText(config)}</b>
          </p>
        ) : null}

        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {REASONS.map((x) => (
              <button key={x} type="button" onClick={() => setReason(x)} className={chip(reason === x)}>
                {x}
              </button>
            ))}
          </div>
          {reason === "Prețul e peste buget" || reason === "Vreau alte opțiuni" ? (
            <div className="rounded-2xl border border-brand-magenta/40 bg-brand-magenta/[0.07] p-4 text-[14px] leading-relaxed text-white/85">
              Putem porni cu mai puțin și adăugăm restul mai târziu — Site Start pornește de la 1.500 lei.{" "}
              <Link href={config ? `/estimare?${configQuery(config)}` : "/estimare"} className="font-semibold text-brand-orange hover:underline">
                Recalculează în calculator
              </Link>
              .
            </div>
          ) : null}
          <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
            <p className="text-sm text-text">Vrei să discutăm? Sună-ne și găsim împreună varianta potrivită.</p>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-orange/60 px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-brand-orange/15"
            >
              <Phone className="h-4 w-4" />
              Sună-ne: {siteConfig.phone}
            </a>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Vrei să ne spui mai mult? (opțional)
            </label>
            <textarea className="input min-h-[100px] rounded-2xl" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-gradient py-3.5 text-[15px] font-semibold text-white shadow-glow-orange disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Trimite răspunsul
          </button>
        </div>
      </div>
    </main>
  );
}
