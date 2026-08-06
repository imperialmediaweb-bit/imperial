"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import type { ServiceReport } from "@/app/api/service-report/route";

const INDUSTRIES = [
  "Restaurant / HoReCa", "Salon / Beauty", "Cabinet medical / Stomatologie",
  "Construcții / Instalații", "Magazin / Comerț", "Imobiliare",
  "Auto / Service", "Fitness / Sport", "Educație / Cursuri", "Altceva",
];
const CLIENTS_OPTS = ["Sub 20 / lună", "20-50 / lună", "50-100 / lună", "Peste 100 / lună"];
const VALUE_OPTS = ["Sub 50€", "50-200€", "200-500€", "Peste 500€"];
const EMPLOYEE_OPTS = ["Doar eu", "2-5", "6-15", "Peste 15"];

const LOADING_STEPS = [
  "Scanez firma pe Google...",
  "Analizez competiția din orașul tău...",
  "Verific site-ul și prezența online...",
  "Calculez pierderile lunare...",
  "Construiesc planul de acțiune...",
];

export default function ServicePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    companyName: "", city: "", industry: "",
    website: "", facebook: "",
    monthlyClients: "", avgValue: "", employees: "",
    mainProblem: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<ServiceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    step === 0 ? form.companyName.trim() && form.city.trim() && form.industry
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
          message: `RAPORT SERVICE — Scor: ${report.overallScore}/100 | Pierderi: ~${report.lostClientsPerMonth} clienți/lună ≈ ${report.lostRevenuePerMonth}€/lună\nProblema: ${form.mainProblem}\nRezumat: ${report.summary}`,
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
          prezența online, competiția din orașul tău, câți clienți pierzi lunar
          și planul exact de acțiune pe 12 luni.
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
                    <label className="label">Numele firmei *</label>
                    <input className="input" placeholder="ex: Pizzeria La Mario" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Orașul *</label>
                    <input className="input" placeholder="ex: Botoșani" value={form.city} onChange={(e) => set("city", e.target.value)} />
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
