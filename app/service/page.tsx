"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Globe,
  BarChart3,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Trophy,
  Zap,
  Mail,
  Stethoscope,
  MapPin,
  ShieldCheck,
  Store,
  Laptop,
  Shuffle,
} from "lucide-react";
import type { ServiceReport } from "@/app/api/service-report/route";

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
  const [report, setReport] = useState<ServiceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare la generarea raportului.");
      setReport(data);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (e: any) {
      setError(e?.message ?? "Eroare. Încearcă din nou.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  async function sendLead(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !report) return;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.companyName,
          email,
          selectedPackage: "personalizat",
          industry: form.industry,
          currentSite: form.website,
          message: `RAPORT SERVICE — Scor: ${report.overallScore}/100 | Pierderi: ~${report.lostClientsPerMonth} clienți/lună ≈ ${report.lostRevenuePerMonth}€/lună\nTip: ${form.businessType} | CUI: ${form.cui || "-"} | Firmă ANAF: ${report.anafData?.legalName || "-"}${report.anafData?.turnover != null ? ` | CA ${report.anafData.balanceYear}: ${report.anafData.turnover.toLocaleString("ro-RO")} lei` : ""}\nProblema: ${form.mainProblem}\nRezumat: ${report.summary}`,
          source: "service-report",
        }),
      });
      if (!res.ok) throw new Error("Nu s-a putut trimite.");
      setEmailSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Eroare la trimitere.");
    }
  }

  const STEPS = [
    { icon: Building2, label: "Firma ta" },
    { icon: Globe, label: "Online" },
    { icon: BarChart3, label: "Cifre" },
    { icon: MessageSquare, label: "Problema" },
  ];

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
          Raport de consultanță în valoare de 299€ — GRATUIT în perioada de lansare
        </p>
      </section>

      {/* FORM */}
      {!report && (
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

      {/* ═══════════ RAPORTUL ═══════════ */}
      {report && (
        <section ref={reportRef} className="container-app pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">

            {/* Header raport */}
            <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
              <p className="text-xs uppercase tracking-wider text-text-subtle">Raport de consultanță · Imperial Media</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-text sm:text-3xl">{report.companyName}</h2>
              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
                <ScoreCircle score={report.overallScore} />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-text-muted">{report.summary}</p>
                </div>
              </div>
            </div>

            {/* Firma verificată ANAF */}
            {report.anafData?.found && (
              <div className="rounded-3xl border border-green-500/25 bg-green-500/5 p-5">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-green-300">
                  <ShieldCheck className="h-4 w-4" /> Firmă verificată la ANAF
                </p>
                <p className="mt-1.5 text-sm text-text">
                  {report.anafData.legalName}
                  {report.anafData.regYear && <span className="text-text-muted"> · din {report.anafData.regYear}</span>}
                  {" · "}
                  <span className={report.anafData.active ? "text-green-400" : "font-bold text-red-400"}>
                    {report.anafData.active ? "activă" : "INACTIVĂ"}
                  </span>
                  {" · "}
                  <span className="text-text-muted">{report.anafData.vatPayer ? "plătitoare de TVA" : "neplătitoare de TVA"}</span>
                </p>
                {report.anafData.caen && (
                  <p className="mt-1 text-xs text-text-muted">
                    CAEN {report.anafData.caen}{report.anafData.caenLabel ? ` — ${report.anafData.caenLabel}` : ""}
                  </p>
                )}
                {report.anafData.turnover != null && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-green-500/15 pt-3 text-xs">
                    <span className="text-text"><b>Bilanț {report.anafData.balanceYear}:</b></span>
                    <span className="text-text-muted">Cifră de afaceri: <b className="text-text">{report.anafData.turnover.toLocaleString("ro-RO")} lei</b></span>
                    {report.anafData.profit != null && (
                      <span className="text-text-muted">Profit net: <b className={report.anafData.profit >= 0 ? "text-green-400" : "text-red-400"}>{report.anafData.profit.toLocaleString("ro-RO")} lei</b></span>
                    )}
                    {report.anafData.employees != null && (
                      <span className="text-text-muted">Angajați: <b className="text-text">{report.anafData.employees}</b></span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Pierderi */}
            {report.lostClientsPerMonth > 0 && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                <TrendingDown className="mx-auto h-6 w-6 text-red-400" />
                <p className="mt-2 font-display text-3xl font-extrabold text-red-400">
                  ~{report.lostClientsPerMonth} clienți pierduți / lună
                </p>
                {report.lostRevenuePerMonth > 0 && (
                  <p className="mt-1 text-lg font-bold text-text">
                    ≈ {report.lostRevenuePerMonth.toLocaleString("ro-RO")}€ venituri pierdute lunar
                  </p>
                )}
                <p className="mt-2 text-xs text-text-subtle">Estimare bazată pe cifrele tale + datele reale scanate</p>
              </div>
            )}

            {/* Diagnostics */}
            <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
              <h3 className="font-display text-lg font-bold text-text">📋 Diagnosticul complet</h3>
              <div className="mt-4 space-y-3">
                {report.diagnostics.map((d) => (
                  <div key={d.area} className="flex items-start gap-3">
                    {d.status === "good" ? <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                      : d.status === "warning" ? <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                      : <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />}
                    <div>
                      <p className="text-sm font-semibold text-text">{d.emoji} {d.area}</p>
                      <p className="text-xs text-text-muted">{d.finding}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competiția */}
            {report.competitors.length > 0 && (
              <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
                <h3 className="font-display text-lg font-bold text-text">
                  <Trophy className="mr-1.5 inline h-5 w-5 text-brand-orange" />
                  Tu vs competiția din {form.city}
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-bg-border text-left text-[10px] uppercase tracking-wider text-text-subtle">
                        <th className="pb-2 pr-2">Firma</th>
                        <th className="pb-2 pr-2">Rating</th>
                        <th className="pb-2">Recenzii</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bg-border/60">
                      <tr className="bg-brand-orange/5">
                        <td className="py-2 pr-2 font-bold text-brand-orange">{report.companyName} (tu)</td>
                        <td className="py-2 pr-2 text-text">{report.googleData.found ? `${report.googleData.rating ?? "—"}★` : "❌ Nu apari"}</td>
                        <td className="py-2 text-text">{report.googleData.found ? report.googleData.reviewCount : "—"}</td>
                      </tr>
                      {report.competitors.map((c) => (
                        <tr key={c.name}>
                          <td className="py-2 pr-2 text-text-muted">{c.name}</td>
                          <td className="py-2 pr-2 text-text-muted">{c.rating ? `${c.rating}★` : "—"}</td>
                          <td className="py-2 text-text-muted">{c.reviewCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Planul de acțiune */}
            <div className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-purple/5 p-6">
              <h3 className="font-display text-lg font-bold text-text">🎯 Planul tău de acțiune (12 luni)</h3>
              <div className="mt-5 space-y-5">
                {report.actionPlan.map((p, i) => (
                  <div key={i} className="relative border-l-2 border-brand-orange/40 pl-5">
                    <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-brand-orange bg-bg" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{p.phase}</p>
                    <p className="mt-0.5 font-display text-base font-bold text-text">{p.title}</p>
                    <ul className="mt-2 space-y-1">
                      {p.actions.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-text-muted">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-orange" /> {a}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                      <span className="font-semibold text-text">💰 {p.investment}</span>
                      <span className="text-green-400">📈 {p.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email + CTA */}
            <div className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center sm:p-8">
              <h3 className="font-display text-xl font-bold text-text">Vrei să implementăm planul împreună?</h3>
              <p className="mt-2 text-sm text-text-muted">
                Lasă emailul și primești raportul + oferta noastră personalizată pentru Faza 1.
              </p>
              {emailSent ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
                  <CheckCircle2 className="h-4 w-4" /> Trimis! Revenim în maxim 24h.
                </p>
              ) : (
                <form onSubmit={sendLead} className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@firma-ta.ro" className="input pl-10" />
                  </div>
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Primește oferta <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
              <p className="mt-4 text-xs text-text-subtle">
                Sau <Link href="/brief" className="text-brand-orange hover:underline">cere estimare direct</Link> pentru Faza 1
              </p>
            </div>
          </motion.div>
        </section>
      )}
    </main>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const size = 110, sw = 9;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  const label = score >= 70 ? "Bine" : score >= 40 ? "Necesită acțiune" : "Critic";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (score / 100) * c }} transition={{ duration: 1.2 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold" style={{ color }}>{score}</span>
        <span className="text-[9px] text-text-subtle">{label}</span>
      </div>
    </div>
  );
}
