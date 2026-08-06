"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  BarChart3,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  TrendingDown,
  Zap,
  Stethoscope,
  MapPin,
  ShieldCheck,
  Store,
  Laptop,
  Shuffle,
  Lock,
  Newspaper,
} from "lucide-react";
import type { ServiceReport, ServiceReportPreview } from "@/app/api/service-report/route";
import { ServiceReportView, ScoreCircle } from "@/components/ServiceReportView";
import { getPartner } from "@/lib/partners";

const BASE_PRICE = 299;
const REF_PRICE = 249;

const INDUSTRIES = [
  "Restaurant / HoReCa", "Salon / Beauty", "Cabinet medical / Stomatologie",
  "Construcții / Instalații", "Magazin / Comerț", "Imobiliare",
  "Auto / Service", "Avocat / Juridic", "Notariat", "Contabilitate",
  "Fitness / Sport", "Educație / Cursuri", "IT / Servicii online", "Altceva",
];

const BUSINESS_TYPES = [
  { key: "local", label: "Local (punct fizic)", icon: Store },
  { key: "online", label: "Online", icon: Laptop },
  { key: "ambele", label: "Ambele", icon: Shuffle },
];

const CLIENTS_OPTS = ["Sub 20 / lună", "20-50 / lună", "50-100 / lună", "Peste 100 / lună"];
const VALUE_OPTS = ["Sub 50€", "50-200€", "200-500€", "Peste 500€"];
const EMPLOYEE_OPTS = ["Doar eu", "2-5", "6-15", "Peste 15"];

const LOADING_STEPS = [
  "Scanez firma pe Google...",
  "Verific firma la ANAF (bilanț, CAEN, TVA)...",
  "Analizez competiția din domeniul tău...",
  "Verific site-ul și prezența online...",
  "Calculez pierderile lunare...",
  "Construiesc planul de acțiune...",
];

// Secțiunile din raportul complet, arătate blurat până la deblocare.
const LOCKED_SECTIONS = [
  { emoji: "⭐", title: "Recomandarea #1", desc: "Dacă faci un singur lucru luna asta — care e și de ce" },
  { emoji: "📋", title: "Diagnosticul complet", desc: "5-8 arii analizate, specifice domeniului tău" },
  { emoji: "🏆", title: "Tu vs competiția", desc: "Comparație directă cu firmele reale din zona ta" },
  { emoji: "📈", title: "Proiecția economică", desc: "Cât investești vs cât scoți — pe 3 luni și pe 12 luni" },
  { emoji: "👑", title: "Ce fac liderii din domeniul tău", desc: "Practicile care îi țin în top + ce-ți lipsește ție" },
  { emoji: "📱", title: "Planul tău de social media", desc: "Câte reeluri, postări și story-uri pe săptămână + idei concrete pentru domeniul tău" },
  { emoji: "🎯", title: "Planul de acțiune pe 12 luni", desc: "4 faze concrete, cu investiție și impact per fază" },
];

export default function ServicePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessType: "", companyName: "", city: "", industry: "", cui: "", placeId: "",
    website: "", facebook: "",
    monthlyClients: "", avgValue: "", employees: "",
    mainProblem: "",
  });
  const [suggestions, setSuggestions] = useState<Array<{ placeId: string; name: string; detail: string }>>([]);
  const [showSug, setShowSug] = useState(false);
  const sugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [preview, setPreview] = useState<{ token: string; data: ServiceReportPreview } | null>(null);
  const [unlockedReport, setUnlockedReport] = useState<ServiceReport | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  // Reduceri din URL: ?partener=bizzclub (partener) sau ?ref=cod (recomandare client)
  const [promo, setPromo] = useState<{ kind: "partner" | "ref"; label: string; price: number; partner?: string; ref?: string } | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const partner = getPartner(sp.get("partener"));
    const refRaw = String(sp.get("ref") ?? "").toLowerCase();
    if (partner) {
      setPromo({ kind: "partner", label: partner.label, price: partner.priceRon, partner: partner.code });
    } else if (/^[a-z0-9]{4,16}$/.test(refRaw)) {
      setPromo({ kind: "ref", label: "recomandare", price: REF_PRICE, ref: refRaw });
    }
  }, []);

  const price = promo?.price ?? BASE_PRICE;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Autocomplete Google Maps pe numele afacerii
  function onNameChange(v: string) {
    setForm((f) => ({ ...f, companyName: v, placeId: "" }));
    if (sugTimer.current) clearTimeout(sugTimer.current);
    if (v.trim().length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    sugTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/place-suggest?q=${encodeURIComponent(v.trim())}&city=${encodeURIComponent(form.city.trim())}`
        );
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setShowSug((data.suggestions ?? []).length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  }

  function pickSuggestion(s: { placeId: string; name: string; detail: string }) {
    setForm((f) => ({ ...f, companyName: s.name, placeId: s.placeId }));
    setSuggestions([]);
    setShowSug(false);
  }

  useEffect(() => () => { if (sugTimer.current) clearTimeout(sugTimer.current); }, []);

  const canNext =
    step === 0 ? form.businessType && form.companyName.trim() && form.city.trim() && form.industry
    : step === 1 ? true
    : step === 2 ? form.monthlyClients && form.avgValue
    : true;

  async function generate() {
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 2500);
    try {
      const res = await fetch("/api/service-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, partner: promo?.partner, ref: promo?.ref }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare la generarea raportului.");
      if (data.locked) {
        setPreview({ token: data.token, data: data.preview });
      } else {
        setUnlockedReport(data.report);
      }
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (e: any) {
      setError(e?.message ?? "Eroare. Încearcă din nou.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  async function unlock() {
    if (!preview) return;
    setUnlocking(true);
    setError(null);
    try {
      const res = await fetch("/api/service-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: preview.token }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Nu am putut porni plata.");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message ?? "Eroare. Încearcă din nou.");
      setUnlocking(false);
    }
  }

  const STEPS = [
    { icon: Building2, label: "Firma ta" },
    { icon: Globe, label: "Online" },
    { icon: BarChart3, label: "Cifre" },
    { icon: MessageSquare, label: "Problema" },
  ];

  const showForm = !preview && !unlockedReport;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* HERO */}
      <section className="container-app pb-8 pt-14 text-center sm:pt-20">
        <span className="chip"><Stethoscope className="h-3 w-3" /> Consultanță de afaceri</span>
        <h1 className="section-title mt-4 mx-auto max-w-3xl">
          Raportul complet al <span className="text-gradient">afacerii tale</span>
        </h1>
        <p className="section-subtitle mx-auto">
          Completează datele firmei și primești pe loc analiza completă:
          prezența online, competiția reală, cifrele oficiale de la ANAF,
          câți clienți pierzi lunar și planul exact de acțiune pe 12 luni —
          adaptat pe domeniul tău, de la imobiliare la service auto sau notariat.
        </p>
        <p className="mt-3 text-sm font-semibold text-brand-orangeLight">
          Audit complet (valoare 299€) + promovare în 50 de ziare online (valoare 300€) — totul pentru{" "}
          {promo ? (
            <>
              <span className="text-text-subtle line-through">{BASE_PRICE} lei</span> {price} lei
            </>
          ) : (
            `${BASE_PRICE} lei`
          )}
        </p>
        {promo && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs font-bold text-green-300">
            🎟️ {promo.kind === "partner" ? `Reducere ${promo.label} aplicată` : "Reducere prin recomandare aplicată"} — plătești {price} lei
          </p>
        )}
        <p className="mx-auto mt-2 max-w-2xl text-xs text-text-subtle">
          <span className="font-semibold text-text-muted">Coach-ul cu date al afacerii tale:</span>{" "}
          Google, ANAF, competiția din zona ta — pași concreți, cu costuri și impact,
          la prețul unei cine.
        </p>
      </section>

      {/* FORM */}
      {showForm && (
        <section className="container-app pb-20">
          <div className="mx-auto max-w-2xl rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
            {/* Step indicator */}
            <div className="mb-8 flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s.label} className={`flex items-center gap-2 text-xs font-medium ${i <= step ? "text-text" : "text-text-subtle"}`}>
                  <span className={`grid h-8 w-8 place-items-center rounded-full transition ${
                    i < step ? "bg-orange-gradient text-white"
                    : i === step ? "border-2 border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border border-bg-border bg-bg-soft text-text-subtle"
                  }`}>
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="grid gap-4">
                  <div>
                    <label className="label">Cum lucrezi cu clienții? *</label>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_TYPES.map((t) => (
                        <button key={t.key} type="button" onClick={() => set("businessType", t.key)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            form.businessType === t.key ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-orange/50"
                          }`}>
                          <t.icon className="h-3.5 w-3.5" /> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Orașul *</label>
                    <input className="input" placeholder="ex: Botoșani" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div className="relative">
                    <label className="label">Numele afacerii *</label>
                    <input className="input" placeholder="ex: Pizzeria La Mario" value={form.companyName}
                      onChange={(e) => onNameChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSug(false), 200)}
                      onFocus={() => suggestions.length > 0 && setShowSug(true)} />
                    {form.placeId ? (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-green-400">
                        <CheckCircle2 className="h-3 w-3" /> Găsit pe Google Maps — analizăm profilul exact
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                        Scrie numele sub care te știu clienții și alege-l din listă. Dacă brandul diferă de firma de la ANAF, scrie brandul.
                      </p>
                    )}
                    {showSug && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-bg-border bg-bg-card shadow-card">
                        {suggestions.map((s) => (
                          <button key={s.placeId} type="button" onClick={() => pickSuggestion(s)}
                            className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left transition hover:bg-brand-orange/10">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" />
                            <span>
                              <span className="block text-sm font-semibold text-text">{s.name}</span>
                              {s.detail && <span className="block text-[11px] text-text-subtle">{s.detail}</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="label">Domeniul de activitate *</label>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button key={ind} type="button" onClick={() => set("industry", ind)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            form.industry === ind ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-orange/50"
                          }`}>
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">CUI / cod fiscal (opțional)</label>
                    <input className="input" placeholder="ex: 12345678 — analizăm firma pe datele oficiale ANAF" inputMode="numeric"
                      value={form.cui} onChange={(e) => set("cui", e.target.value.replace(/[^\dRrOo]/g, ""))} />
                    <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                      Cu CUI-ul verificăm firma la ANAF: cifră de afaceri, profit, CAEN, TVA — raportul se calculează pe cifrele tale oficiale.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="grid gap-4">
                  <div>
                    <label className="label">Site-ul tău (dacă ai)</label>
                    <input className="input" placeholder="ex: firma-mea.ro — sau lasă gol" value={form.website} onChange={(e) => set("website", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Pagina de Facebook (dacă ai)</label>
                    <input className="input" placeholder="link sau nume — sau lasă gol" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
                  </div>
                  <p className="text-xs text-text-subtle">Nu ai? Nicio problemă — exact asta analizăm.</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="grid gap-5">
                  <div>
                    <label className="label">Câți clienți ai pe lună? *</label>
                    <div className="flex flex-wrap gap-2">
                      {CLIENTS_OPTS.map((o) => (
                        <button key={o} type="button" onClick={() => set("monthlyClients", o)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${form.monthlyClients === o ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-soft/60 text-text-muted"}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Cât valorează în medie un client? *</label>
                    <div className="flex flex-wrap gap-2">
                      {VALUE_OPTS.map((o) => (
                        <button key={o} type="button" onClick={() => set("avgValue", o)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${form.avgValue === o ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-soft/60 text-text-muted"}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Câți angajați?</label>
                    <div className="flex flex-wrap gap-2">
                      {EMPLOYEE_OPTS.map((o) => (
                        <button key={o} type="button" onClick={() => set("employees", o)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${form.employees === o ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-soft/60 text-text-muted"}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="grid gap-4">
                  <div>
                    <label className="label">Care e cea mai mare problemă a afacerii tale acum?</label>
                    <textarea className="input min-h-[120px] resize-y" maxLength={1000}
                      placeholder="ex: Am clienți puțini, concurența e peste tot, nu mă găsește nimeni online..."
                      value={form.mainProblem} onChange={(e) => set("mainProblem", e.target.value)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>
            )}

            {/* Loading state */}
            {loading && (
              <div className="mt-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-orange" />
                <AnimatePresence mode="wait">
                  <motion.p key={loadingStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm font-medium text-text">
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            {/* Nav */}
            {!loading && (
              <div className="mt-8 flex items-center justify-between border-t border-bg-border/60 pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">
                    <ArrowLeft className="h-4 w-4" /> Înapoi
                  </button>
                ) : <span className="text-xs text-text-subtle">Pasul {step + 1} din 4</span>}

                {step < 3 ? (
                  <button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)} className="btn-primary">
                    Continuă <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="button" onClick={generate} className="btn-primary">
                    <Zap className="h-4 w-4" /> Generează raportul
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ PREVIEW + DEBLOCARE ═══════════ */}
      {preview && (
        <section ref={reportRef} className="container-app pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">

            {/* Header raport */}
            <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
              <p className="text-xs uppercase tracking-wider text-text-subtle">Raport de consultanță · Imperial Media</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-text sm:text-3xl">{preview.data.companyName}</h2>
              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
                <ScoreCircle score={preview.data.overallScore} />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-text-muted">{preview.data.summary}</p>
                </div>
              </div>
            </div>

            {/* ANAF compact */}
            {preview.data.anafData?.found && (
              <div className="rounded-3xl border border-green-500/25 bg-green-500/5 p-5">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-green-300">
                  <ShieldCheck className="h-4 w-4" /> Firmă verificată la ANAF
                </p>
                <p className="mt-1.5 text-sm text-text">
                  {preview.data.anafData.legalName}
                  {" · "}
                  <span className={preview.data.anafData.active ? "text-green-400" : "font-bold text-red-400"}>
                    {preview.data.anafData.active ? "activă" : "INACTIVĂ"}
                  </span>
                  {preview.data.anafData.turnover != null && (
                    <span className="text-text-muted">
                      {" · "}CA {preview.data.anafData.balanceYear}: <b className="text-text">{preview.data.anafData.turnover.toLocaleString("ro-RO")} lei</b>
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Pierderi */}
            {preview.data.lostClientsPerMonth > 0 && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                <TrendingDown className="mx-auto h-6 w-6 text-red-400" />
                <p className="mt-2 font-display text-3xl font-extrabold text-red-400">
                  ~{preview.data.lostClientsPerMonth} clienți pierduți / lună
                </p>
                {preview.data.lostRevenuePerMonth > 0 && (
                  <p className="mt-1 text-lg font-bold text-text">
                    ≈ {preview.data.lostRevenuePerMonth.toLocaleString("ro-RO")}€ venituri pierdute lunar
                  </p>
                )}
                <p className="mt-2 text-xs text-text-subtle">Estimare bazată pe cifrele tale + datele reale scanate</p>
              </div>
            )}

            {/* Secțiunile blocate (blur pe machetă, datele reale rămân pe server) */}
            <div className="relative">
              <div className="pointer-events-none select-none space-y-4 blur-[6px]" aria-hidden>
                {LOCKED_SECTIONS.map((s) => (
                  <div key={s.title} className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
                    <p className="font-display text-lg font-bold text-text">{s.emoji} {s.title}</p>
                    <p className="mt-1 text-sm text-text-muted">{s.desc}</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-11/12 rounded bg-bg-soft" />
                      <div className="h-3 w-9/12 rounded bg-bg-soft" />
                      <div className="h-3 w-10/12 rounded bg-bg-soft" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card de deblocare peste blur */}
              <div className="absolute inset-0 flex items-start justify-center pt-10">
                <div className="mx-4 w-full max-w-lg rounded-3xl border-2 border-brand-orange/60 bg-bg-card p-6 text-center shadow-card sm:p-8">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-orange-gradient">
                    <Lock className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-extrabold text-text sm:text-2xl">
                    Deblochează raportul complet
                  </h3>
                  <p className="mt-3 font-display text-3xl font-extrabold text-brand-orange">
                    {promo && <span className="mr-2 text-lg font-bold text-text-subtle line-through">{BASE_PRICE} lei</span>}
                    {price} lei
                  </p>
                  <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-text-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                      Raportul complet: diagnostic, competiție, proiecție economică, plan 12 luni
                    </li>
                    <li className="flex items-start gap-2">
                      <Newspaper className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                      <span><b className="text-text">CADOU: promovarea afacerii tale în 50 de ziare online</b> (rețeaua Media Expres — valoare 300€)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                      Cei {price} lei se scad integral din orice pachet comanzi în 30 de zile
                    </li>
                  </ul>
                  <button type="button" onClick={unlock} disabled={unlocking} className="btn-primary mt-5 w-full justify-center">
                    {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {unlocking ? "Se încarcă..." : `Deblochează raportul — ${price} lei`}
                  </button>
                  <p className="mt-3 text-[11px] text-text-subtle">Plată securizată cu cardul · raportul rămâne al tău pe link permanent</p>
                  {error && (
                    <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════ RAPORT COMPLET (mod fără DB) ═══════════ */}
      {unlockedReport && (
        <section ref={reportRef} className="container-app pb-20">
          <ServiceReportView report={unlockedReport} />
        </section>
      )}
    </main>
  );
}
