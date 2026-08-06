"use client";

// Randarea raportului /service COMPLET (deblocat) — folosită și inline pe
// /service (mod fără DB) și pe pagina permanentă /service/raport/[token].

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Trophy,
  Mail,
  ArrowRight,
  ShieldCheck,
  Star,
  Crown,
  RefreshCw,
} from "lucide-react";
import type { ServiceReport } from "@/app/api/service-report/route";

export function ServiceReportView({
  report,
  initialEmail = "",
}: {
  report: ServiceReport;
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [emailSent, setEmailSent] = useState(false);
  const [subEmail, setSubEmail] = useState(initialEmail);
  const [subSent, setSubSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postLead(opts: { email: string; source: string; message: string }) {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: report.companyName,
        email: opts.email,
        selectedPackage: "personalizat",
        industry: "",
        message: opts.message,
        source: opts.source,
      }),
    });
    if (!res.ok) throw new Error("Nu s-a putut trimite.");
  }

  async function sendOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    try {
      await postLead({
        email,
        source: "service-report",
        message: `RAPORT SERVICE — Scor: ${report.overallScore}/100 | Pierderi: ~${report.lostClientsPerMonth} clienți/lună ≈ ${report.lostRevenuePerMonth}€/lună${report.topRecommendation ? `\nRecomandarea #1: ${report.topRecommendation.title}` : ""}${report.projection ? `\nProiecție 12 luni: +${report.projection.return12m}€` : ""}\nRezumat: ${report.summary}`,
      });
      setEmailSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Eroare la trimitere.");
    }
  }

  async function sendSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subEmail) return;
    setError(null);
    try {
      await postLead({
        email: subEmail,
        source: "abonament-interes",
        message: `Vrea ABONAMENT monitorizare lunară pentru ${report.companyName} (${report.city}). Scor actual: ${report.overallScore}/100.`,
      });
      setSubSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Eroare la trimitere.");
    }
  }

  return (
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

      {/* Recomandarea #1 */}
      {report.topRecommendation && (
        <div className="rounded-3xl border-2 border-brand-orange/50 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 sm:p-7">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Star className="h-4 w-4 fill-brand-orange" /> Recomandarea #1 — dacă faci un singur lucru luna asta
          </p>
          <p className="mt-2 font-display text-xl font-extrabold text-text sm:text-2xl">{report.topRecommendation.title}</p>
          {report.topRecommendation.why && (
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{report.topRecommendation.why}</p>
          )}
          {report.topRecommendation.firstStep && (
            <p className="mt-3 rounded-xl border border-brand-orange/30 bg-bg-soft/60 px-4 py-2.5 text-sm text-text">
              <b>Primul pas (azi):</b> {report.topRecommendation.firstStep}
            </p>
          )}
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
            Tu vs competiția din {report.city}
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

      {/* Proiecția economică */}
      {report.projection && (
        <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-display text-lg font-bold text-text">
            <TrendingUp className="mr-1.5 inline h-5 w-5 text-green-400" />
            Proiecția economică — bagi vs. scoți
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-bg-border bg-bg-soft/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Primele 3 luni</p>
              <p className="mt-2 text-sm text-text-muted">Investiție: <b className="text-text">{report.projection.invest3m.toLocaleString("ro-RO")}€</b></p>
              <p className="mt-1 text-sm text-text-muted">Venit suplimentar: <b className="text-green-400">+{report.projection.return3m.toLocaleString("ro-RO")}€</b></p>
            </div>
            <div className="rounded-2xl border border-bg-border bg-bg-soft/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">12 luni</p>
              <p className="mt-2 text-sm text-text-muted">Investiție totală: <b className="text-text">{report.projection.invest12m.toLocaleString("ro-RO")}€</b></p>
              <p className="mt-1 text-sm text-text-muted">Venit suplimentar: <b className="text-green-400">+{report.projection.return12m.toLocaleString("ro-RO")}€</b></p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3.5 py-1.5 text-xs font-bold text-green-300">
              ✓ Investiția recuperată în luna {report.projection.breakEvenMonth}
            </span>
            {report.projection.newClientsPerMonth > 0 && (
              <span className="rounded-full border border-bg-border bg-bg-soft/60 px-3.5 py-1.5 text-xs font-semibold text-text">
                +{report.projection.newClientsPerMonth} clienți/lună la finalul planului
              </span>
            )}
          </div>
          <p className="mt-3 text-[11px] text-text-subtle">Estimare conservatoare, calculată pe cifrele tale reale.</p>
        </div>
      )}

      {/* Liderii din domeniu */}
      {report.industryLeaders && (
        <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
          <h3 className="font-display text-lg font-bold text-text">
            <Crown className="mr-1.5 inline h-5 w-5 text-yellow-400" />
            Ce fac liderii din domeniul tău
          </h3>
          <ul className="mt-4 space-y-2">
            {report.industryLeaders.practices.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" /> {p}
              </li>
            ))}
          </ul>
          {report.industryLeaders.gap && (
            <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-2.5 text-sm text-text">
              <b>Diferența față de tine:</b> {report.industryLeaders.gap}
            </p>
          )}
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

      {/* Abonament monitorizare lunară */}
      <div className="rounded-3xl border border-brand-purple/30 bg-brand-purple/5 p-6 text-center sm:p-7">
        <p className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-text">
          <RefreshCw className="h-5 w-5 text-brand-purple" /> Monitorizare lunară — 99 lei/lună
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
          Raportul tău, regenerat automat în fiecare lună: evoluția scorului, recenziile noi
          ale competitorilor, starea site-ului și acțiunile lunii. Afacerea ta, ținută în priză.
        </p>
        {subSent ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
            <CheckCircle2 className="h-4 w-4" /> Te-am notat! Te contactăm când pornim abonamentele.
          </p>
        ) : (
          <form onSubmit={sendSubscribe} className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
            <input type="email" required value={subEmail} onChange={(e) => setSubEmail(e.target.value)}
              placeholder="email@firma-ta.ro" className="input flex-1" />
            <button type="submit" className="btn-primary whitespace-nowrap">Vreau abonamentul</button>
          </form>
        )}
      </div>

      {/* Email + CTA */}
      <div className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center sm:p-8">
        <h3 className="font-display text-xl font-bold text-text">Vrei să implementăm planul împreună?</h3>
        <p className="mt-2 text-sm text-text-muted">
          Lasă emailul și primești oferta noastră personalizată pentru Faza 1.
        </p>
        {emailSent ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
            <CheckCircle2 className="h-4 w-4" /> Trimis! Revenim în maxim 24h.
          </p>
        ) : (
          <form onSubmit={sendOffer} className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
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

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>
      )}
    </motion.div>
  );
}

export function ScoreCircle({ score }: { score: number }) {
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
