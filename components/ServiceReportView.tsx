"use client";

// Randarea raportului /service COMPLET (deblocat) — layout lat, carduri vizuale,
// bare de progres și animații. Folosită inline pe /service (mod fără DB) și pe
// pagina permanentă /service/raport/[token]. Clasa service-report-print + print:hidden
// controlează varianta PDF (globals.css).

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  Share2,
  Link2,
  FileDown,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { ServiceReport } from "@/app/api/service-report/route";
import { ShineCard } from "@/components/effects/ShineCard";
import { NumberTicker } from "@/components/effects/NumberTicker";

// ─── Animații ───
const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ─── Culori diagrame — validate CVD + contrast pe dark și pe print alb ───
const VIZ = {
  you: "#ea580c",
  other: "#6366f1",
  gain: "#16a34a",
};

const STATUS = {
  good: { pct: 88, color: "#22c55e", label: "Bine", Icon: CheckCircle2, text: "text-green-400" },
  warning: { pct: 52, color: "#eab308", label: "De îmbunătățit", Icon: AlertTriangle, text: "text-yellow-400" },
  bad: { pct: 22, color: "#ef4444", label: "Critic", Icon: XCircle, text: "text-red-400" },
} as const;

export function ServiceReportView({
  report,
  initialEmail = "",
  token,
}: {
  report: ServiceReport;
  initialEmail?: string;
  token?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    try {
      if (token) {
        fetch("/api/service-report/attach-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        }).catch(() => {});
      }
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: report.companyName,
          email,
          selectedPackage: "personalizat",
          industry: "",
          message: `RAPORT SERVICE — Scor: ${report.overallScore}/100 | Pierderi: ~${report.lostClientsPerMonth} clienți/lună ≈ ${report.lostRevenuePerMonth}€/lună${report.topRecommendation ? `\nRecomandarea #1: ${report.topRecommendation.title}` : ""}${report.projection ? `\nProiecție 12 luni: +${report.projection.return12m}€` : ""}\nRezumat: ${report.summary}`,
          source: "service-report",
        }),
      });
      if (!res.ok) throw new Error("Nu s-a putut trimite.");
      setEmailSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Eroare la trimitere.");
    }
  }

  return (
    <div className="service-report-print mx-auto max-w-5xl space-y-6">
      {/* ═══ ANTET OFICIAL ═══ */}
      <motion.div {...fadeUp} className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bg-border/60 pb-4">
          <Image src="/logo.png" alt="Imperial Media" width={880} height={352} quality={90} className="h-12 w-auto object-contain sm:h-14" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Raport de consultanță</p>
              <p className="mt-0.5 text-[10px] text-text-subtle">
                {new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })} · Confidențial
              </p>
            </div>
            <button type="button" onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/50 bg-brand-orange/10 px-4 py-2 text-xs font-bold text-brand-orange transition hover:bg-brand-orange/20 print:hidden">
              <FileDown className="h-4 w-4" /> Descarcă PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreCircle score={report.overallScore} size={136} />
          <div className="flex-1">
            <h2 className="font-display text-2xl font-extrabold text-text sm:text-3xl">{report.companyName}</h2>
            <p className="mt-0.5 text-xs text-text-subtle">{report.city} · analiză completă: online · social · offline · competiție · financiar</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{report.summary}</p>
          </div>
        </div>

        {/* Stat chips — datele reale, dintr-o privire */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatChip label="Rating Google" value={report.googleData.found ? `${report.googleData.rating ?? "—"}★` : "Nu apari"} tone={report.googleData.found ? "good" : "bad"} />
          <StatChip label="Recenzii" value={report.googleData.found ? String(report.googleData.reviewCount ?? 0) : "—"} tone={report.googleData.found && (report.googleData.reviewCount ?? 0) > 50 ? "good" : "warn"} />
          <StatChip label="Cifră de afaceri" value={report.anafData?.turnover != null ? `${Math.round(report.anafData.turnover / 1000)}k lei` : "—"} tone="neutral" />
          <StatChip label="Competitori scanați" value={String(report.competitors.length)} tone="neutral" />
        </div>

        <ShareRow score={report.overallScore} />
      </motion.div>

      {/* ═══ PIERDERI + ANAF — una lângă alta ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {report.lostClientsPerMonth > 0 && (
          <motion.div {...fadeUp} className="flex flex-col justify-center rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-center">
            <TrendingDown className="mx-auto h-7 w-7 text-red-400" />
            <p className="mt-2 font-display text-4xl font-extrabold text-red-400">
              ~<NumberTicker value={report.lostClientsPerMonth} />
            </p>
            <p className="text-sm font-bold text-red-300">clienți pierduți în fiecare lună</p>
            {report.lostRevenuePerMonth > 0 && (
              <p className="mt-2 font-display text-2xl font-extrabold text-text">
                ≈ <NumberTicker value={report.lostRevenuePerMonth} />€ <span className="text-sm font-semibold text-text-muted">/ lună</span>
              </p>
            )}
            <p className="mt-2 text-[11px] text-text-subtle">Estimare pe cifrele tale + datele reale scanate</p>
          </motion.div>
        )}

        {report.anafData?.found && (
          <motion.div {...fadeUp} className="rounded-3xl border border-green-500/25 bg-green-500/5 p-6">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-green-300">
              <ShieldCheck className="h-4 w-4" /> Firmă verificată la ANAF
            </p>
            <p className="mt-2 text-sm font-semibold text-text">{report.anafData.legalName}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniStat label="Stare" value={report.anafData.active ? "Activă ✓" : "INACTIVĂ"} bad={!report.anafData.active} />
              <MiniStat label="TVA" value={report.anafData.vatPayer ? "Plătitoare" : "Neplătitoare"} />
              {report.anafData.turnover != null && (
                <MiniStat label={`Cifră de afaceri ${report.anafData.balanceYear ?? ""}`} value={`${report.anafData.turnover.toLocaleString("ro-RO")} lei`} />
              )}
              {report.anafData.profit != null && (
                <MiniStat label="Profit net" value={`${report.anafData.profit.toLocaleString("ro-RO")} lei`} bad={report.anafData.profit < 0} />
              )}
              {report.anafData.employees != null && <MiniStat label="Angajați" value={String(report.anafData.employees)} />}
              {report.anafData.caen && <MiniStat label="CAEN" value={report.anafData.caen} />}
            </div>
          </motion.div>
        )}
      </div>

      {/* ═══ RECOMANDAREA #1 ═══ */}
      {report.topRecommendation && (
        <motion.div {...fadeUp}>
          <ShineCard className="rounded-3xl border-2 border-brand-orange/50 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 sm:p-8">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
              <Star className="h-4 w-4 fill-brand-orange" /> Recomandarea #1 — dacă faci un singur lucru luna asta
            </p>
            <p className="mt-2 font-display text-xl font-extrabold text-text sm:text-2xl">{report.topRecommendation.title}</p>
            {report.topRecommendation.why && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">{report.topRecommendation.why}</p>}
            {report.topRecommendation.firstStep && (
              <p className="mt-4 inline-block rounded-2xl border border-brand-orange/30 bg-bg-soft/60 px-4 py-2.5 text-sm text-text">
                🚀 <b>Primul pas (azi):</b> {report.topRecommendation.firstStep}
              </p>
            )}
          </ShineCard>
        </motion.div>
      )}

      {/* ═══ DIAGNOSTICUL — dosare late: banda ariei în stânga, analiza + rezolvarea pe coloane ═══ */}
      <div>
        <motion.h3 {...fadeUp} className="mb-4 font-display text-xl font-extrabold text-text">📋 Diagnosticul complet</motion.h3>
        <div className="space-y-4">
          {report.diagnostics.map((d, i) => {
            const s = STATUS[d.status] ?? STATUS.warning;
            return (
              <motion.div key={d.area} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.04 }}
                className="overflow-hidden rounded-2xl border border-bg-border bg-bg-card/60 transition hover:border-brand-orange/40">
                <div className="grid lg:grid-cols-[230px_minmax(0,1fr)]">
                  {/* Banda ariei — nr, titlu, verdict, bara */}
                  <div className="relative border-b border-bg-border/60 bg-bg-soft/30 p-5 lg:border-b-0 lg:border-r">
                    <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: s.color }} />
                    <p className="font-display text-[11px] font-bold tracking-widest text-text-subtle">
                      {String(i + 1).padStart(2, "0")}<span className="opacity-50"> / {String(report.diagnostics.length).padStart(2, "0")}</span>
                    </p>
                    <p className="mt-1.5 text-sm font-bold leading-snug text-text">{d.emoji} {d.area}</p>
                    <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.text}`}
                      style={{ background: `${s.color}1a`, border: `1px solid ${s.color}55` }}>
                      <s.Icon className="h-3 w-3" /> {s.label}
                    </span>
                    <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-bg-soft/70">
                      <motion.div className="viz-bar h-full rounded-full"
                        style={{ ["--bar-color" as any]: s.color, ["--bar-w" as any]: `${s.pct}%` }}
                        initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} />
                    </div>
                  </div>
                  {/* Analiza + rezolvarea — două coloane pe ecran lat, lățime de citit confortabilă */}
                  <div className={`grid gap-4 p-5 ${d.fix ? "lg:grid-cols-2" : ""}`}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">🔎 Ce am găsit</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{d.finding}</p>
                    </div>
                    {d.fix && (
                      <div className="rounded-xl border border-green-500/25 bg-green-500/[0.06] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">🔧 Cum o rezolvi</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{d.fix}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ COMPETIȚIA + PROIECȚIA — una lângă alta ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {report.competitors.length > 0 && (
          <motion.div {...fadeUp} className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
            <h3 className="font-display text-lg font-bold text-text">
              <Trophy className="mr-1.5 inline h-5 w-5 text-brand-orange" /> Tu vs competiția din {report.city}
            </h3>
            <CompetitorChart report={report} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bg-border text-left text-[10px] uppercase tracking-wider text-text-subtle">
                    <th className="pb-2 pr-2">Firma</th><th className="pb-2 pr-2">Rating</th><th className="pb-2">Recenzii</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border/60">
                  <tr className="bg-brand-orange/5">
                    <td className="py-2 pr-2 font-bold text-brand-orange">{report.companyName} (tu)</td>
                    <td className="py-2 pr-2 text-text">{report.googleData.found ? `${report.googleData.rating ?? "—"}★` : "❌"}</td>
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
          </motion.div>
        )}

        {report.projection && (
          <motion.div {...fadeUp} className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6">
            <h3 className="font-display text-lg font-bold text-text">
              <TrendingUp className="mr-1.5 inline h-5 w-5 text-green-400" /> Proiecția economică
            </h3>
            <ProjectionChart projection={report.projection} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
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
          </motion.div>
        )}
      </div>

      {/* ═══ LIDERII + SOCIAL — una lângă alta ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {report.industryLeaders && (
          <motion.div {...fadeUp} className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
            <h3 className="font-display text-lg font-bold text-text">
              <Crown className="mr-1.5 inline h-5 w-5 text-yellow-400" /> Ce fac liderii din domeniul tău
            </h3>
            <ul className="mt-4 space-y-2.5">
              {report.industryLeaders.practices.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-bg-soft/40 px-3.5 py-2.5 text-sm text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" /> {p}
                </li>
              ))}
            </ul>
            {report.industryLeaders.gap && (
              <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-2.5 text-sm text-text">
                ⚡ <b>Diferența față de tine:</b> {report.industryLeaders.gap}
              </p>
            )}
          </motion.div>
        )}

        {report.socialPlan && (
          <motion.div {...fadeUp} className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
            <h3 className="font-display text-lg font-bold text-text">📱 Planul tău de social media</h3>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <SocialStat emoji="🎬" n={report.socialPlan.reelsPerWeek} label="reeluri/săpt." />
              <SocialStat emoji="🖼️" n={report.socialPlan.postsPerWeek} label="postări/săpt." />
              <SocialStat emoji="⚡" n={report.socialPlan.storiesPerWeek} label="story/săpt." />
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-text-subtle">Ce postezi, concret:</p>
            <ul className="mt-2 space-y-2">
              {report.socialPlan.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" /> {idea}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* ═══ PLANUL PRIMEI LUNI — săptămână cu săptămână ═══ */}
      {report.firstMonthPlan && report.firstMonthPlan.length > 0 && (
        <div>
          <motion.h3 {...fadeUp} className="mb-1 font-display text-xl font-extrabold text-text">📆 Prima ta lună — săptămână cu săptămână</motion.h3>
          <motion.p {...fadeUp} className="mb-4 text-xs text-text-subtle">Planul detaliat de execuție: ce faci concret în fiecare săptămână, ca luna 1 să nu rămână pe hârtie.</motion.p>
          <div className="grid gap-4 sm:grid-cols-2">
            {report.firstMonthPlan.map((w, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 2) * 0.08 }}
                className="flex flex-col rounded-2xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/[0.07] via-transparent to-brand-orange/[0.05] p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-brand-purple/80 font-display text-sm font-extrabold text-white">
                    S{i + 1}
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-purple">{w.week}</p>
                    <p className="font-display text-sm font-bold leading-tight text-text">{w.focus}</p>
                  </div>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {w.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-text-muted">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-purple" /> {t}
                    </li>
                  ))}
                </ul>
                {w.result && (
                  <p className="mt-3 border-t border-bg-border/50 pt-3 text-[11px] font-semibold text-green-400">
                    ✅ La final: {w.result}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ PLANUL PE 12 LUNI — carduri de fază ═══ */}
      <div>
        <motion.h3 {...fadeUp} className="mb-4 font-display text-xl font-extrabold text-text">🎯 Planul tău de acțiune (12 luni)</motion.h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {report.actionPlan.map((p, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 2) * 0.08 }}
              className="flex flex-col rounded-2xl border border-brand-orange/25 bg-gradient-to-br from-brand-orange/[0.06] via-transparent to-brand-purple/[0.06] p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-orange-gradient font-display text-sm font-extrabold text-white shadow-glow-orange">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{p.phase}</p>
                  <p className="font-display text-sm font-bold leading-tight text-text">{p.title}</p>
                </div>
              </div>
              {/* progresul fazei în cele 12 luni */}
              <div className="mt-3 flex gap-1">
                {[0, 1, 2, 3].map((seg) => (
                  <div key={seg} className={`h-[5px] flex-1 rounded-full ${seg <= i ? "bg-orange-gradient" : "bg-bg-soft/70"}`} />
                ))}
              </div>
              <ul className="mt-3 flex-1 space-y-1.5">
                {p.actions.map((a, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-text-muted">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" /> {a}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-bg-border/50 pt-3 text-[11px]">
                <span className="rounded-full bg-bg-soft/60 px-3 py-1 font-semibold text-text">💰 {p.investment}</span>
                <span className="rounded-full bg-green-500/10 px-3 py-1 font-semibold text-green-400">📈 {p.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ ABONAMENT ═══ */}
      <motion.div {...fadeUp} className="rounded-3xl border border-brand-purple/30 bg-brand-purple/5 p-6 text-center sm:p-7 print:hidden">
        <p className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-text">
          <RefreshCw className="h-5 w-5 text-brand-purple" /> Monitorizare lunară — 99 lei/lună
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
          Afacerea ta monitorizată lună de lună: scorul, recenziile, competiția, site-ul + sfaturile
          lunii + <b className="text-text">consultantul tău dedicat</b>, care îți știe firma și te învață
          inclusiv ce postări și reclame să faci pe Facebook.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs font-semibold text-brand-purple">Sau 990 lei/an — plătești 10 luni, primești 12. Iar pe <b>Premium (199 lei/lună)</b> ai și generatorul de postări + analiza AI a pozelor tale, nelimitat.</p>
        <Link href="/cont" className="btn-primary mt-4 inline-flex">
          Activează din contul tău <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-2 text-[11px] text-text-subtle">Intri cu emailul, fără parolă — activezi cu cardul în 1 minut.</p>
      </motion.div>

      {/* ═══ CTA OFERTĂ ═══ */}
      <motion.div {...fadeUp} className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center sm:p-8 print:hidden">
        <h3 className="font-display text-xl font-bold text-text">Vrei să implementăm planul împreună?</h3>
        <p className="mt-2 text-sm text-text-muted">Lasă emailul și primești oferta noastră personalizată pentru Faza 1.</p>
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
      </motion.div>

      <p className="text-center text-xs text-text-subtle print:hidden">
        <MessageCircle className="mr-1 inline h-3.5 w-3.5" />
        Toate rapoartele + notificările tale de monitorizare + consultantul dedicat:{" "}
        <Link href="/cont" className="text-brand-orange hover:underline">intră în contul tău</Link>
      </p>

      {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>}

      {/* ═══ FOOTER OFICIAL ═══ */}
      <div className="rounded-3xl border border-bg-border bg-bg-card/40 p-5 text-center">
        <Image src="/logo.png" alt="Imperial Media" width={880} height={352} quality={90} className="mx-auto h-10 w-auto object-contain opacity-90" />
        <p className="mt-2 text-[11px] text-text-subtle">
          Raport realizat de Imperial Media · Botoșani · office@imperial-media.ro · imperial-media.ro
        </p>
        <p className="mt-1 text-[10px] text-text-subtle">
          Date: Google, ANAF (bilanțuri publice), test de vizibilitate AI, scanare proprie. Estimările sunt orientative și calculate conservator.
        </p>
      </div>
    </div>
  );
}

// ─── Piese mici ───

function StatChip({ label, value, tone }: { label: string; value: string; tone: "good" | "warn" | "bad" | "neutral" }) {
  const color =
    tone === "good" ? "text-green-400" : tone === "bad" ? "text-red-400" : tone === "warn" ? "text-yellow-400" : "text-text";
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-soft/40 px-4 py-3 text-center">
      <p className={`font-display text-lg font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle">{label}</p>
    </div>
  );
}

function MiniStat({ label, value, bad = false }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="rounded-xl bg-bg-soft/40 px-3 py-2">
      <p className="text-[9px] font-bold uppercase tracking-wider text-text-subtle">{label}</p>
      <p className={`text-sm font-bold ${bad ? "text-red-400" : "text-text"}`}>{value}</p>
    </div>
  );
}

function SocialStat({ emoji, n, label }: { emoji: string; n: number; label: string }) {
  return (
    <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-2 py-3 text-center">
      <p className="text-lg">{emoji}</p>
      <p className="font-display text-xl font-extrabold text-text"><NumberTicker value={n} /></p>
      <p className="text-[9px] font-semibold uppercase tracking-wide text-text-subtle">{label}</p>
    </div>
  );
}

// Bară orizontală cu etichetă directă — refolosită de diagrame.
function VizBar({ label, value, max, color, valueLabel, bold = false }: {
  label: string; value: number; max: number; color: string; valueLabel: string; bold?: boolean;
}) {
  const pct = Math.max(2, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className={`truncate text-xs ${bold ? "font-bold text-text" : "text-text-muted"}`}>{label}</span>
        <span className={`flex-shrink-0 text-xs tabular-nums ${bold ? "font-bold text-text" : "text-text-muted"}`}>{valueLabel}</span>
      </div>
      <div className="h-[14px] w-full overflow-hidden rounded-r border-l-2 border-bg-border/80 bg-bg-soft/50">
        <motion.div className="viz-bar h-full rounded-r"
          style={{ ["--bar-color" as any]: color, ["--bar-w" as any]: `${pct}%` }}
          initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

// Diagramă: recenziile tale vs competitorii reali.
function CompetitorChart({ report }: { report: ServiceReport }) {
  const youReviews = report.googleData.found ? (report.googleData.reviewCount ?? 0) : 0;
  const rows = [
    { name: `${report.companyName} (tu)`, reviews: youReviews, you: true },
    ...report.competitors.map((c) => ({ name: c.name, reviews: c.reviewCount, you: false })),
  ];
  const max = Math.max(1, ...rows.map((r) => r.reviews));
  return (
    <div className="mt-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Recenzii pe Google</p>
      <div className="mt-2 space-y-2.5">
        {rows.map((r) => (
          <VizBar key={r.name} label={r.name} value={r.reviews} max={max}
            color={r.you ? VIZ.you : VIZ.other}
            valueLabel={r.you && !report.googleData.found ? "nu apari" : String(r.reviews)} bold={r.you} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: VIZ.you }} /> Firma ta</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: VIZ.other }} /> Competitori</span>
      </div>
    </div>
  );
}

// Diagramă: investiție vs venit suplimentar, pe 3 și 12 luni.
function ProjectionChart({ projection }: { projection: NonNullable<ServiceReport["projection"]> }) {
  const max = Math.max(1, projection.invest3m, projection.return3m, projection.invest12m, projection.return12m);
  const eur = (v: number) => `${v.toLocaleString("ro-RO")}€`;
  return (
    <div className="mt-4 space-y-5">
      {[
        { title: "Primele 3 luni", invest: projection.invest3m, ret: projection.return3m },
        { title: "12 luni", invest: projection.invest12m, ret: projection.return12m },
      ].map((p) => (
        <div key={p.title}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-subtle">{p.title}</p>
          <div className="space-y-2">
            <VizBar label="Investiție" value={p.invest} max={max} color={VIZ.other} valueLabel={eur(p.invest)} />
            <VizBar label="Venit suplimentar" value={p.ret} max={max} color={VIZ.gain} valueLabel={`+${eur(p.ret)}`} bold />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-4 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: VIZ.other }} /> Investiție</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: VIZ.gain }} /> Venit suplimentar</span>
      </div>
    </div>
  );
}

// Butoane de distribuire — omul se laudă cu scorul.
function ShareRow({ score }: { score: number }) {
  const [copied, setCopied] = useState(false);
  const shareText = `Mi-am făcut Radiografia Afacerii 📊 Scorul firmei mele: ${score}/100. Fă-ți și tu testul (Google + ANAF + competiția reală): https://imperial-media.ro/service`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://imperial-media.ro/service")}&quote=${encodeURIComponent(shareText)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-bg-border/60 pt-4 print:hidden">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted">
        <Share2 className="h-3.5 w-3.5" /> Laudă-te cu scorul:
      </span>
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
        className="rounded-full border border-green-500/40 bg-green-500/10 px-3.5 py-1.5 text-xs font-semibold text-green-300 transition hover:bg-green-500/20">
        WhatsApp
      </a>
      <a href={fbUrl} target="_blank" rel="noopener noreferrer"
        className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20">
        Facebook
      </a>
      <button type="button" onClick={copy}
        className="inline-flex items-center gap-1 rounded-full border border-bg-border bg-bg-soft/60 px-3.5 py-1.5 text-xs font-semibold text-text-muted transition hover:border-brand-orange/50">
        <Link2 className="h-3 w-3" /> {copied ? "Copiat ✓" : "Copiază"}
      </button>
      <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-text-subtle">
        <MapPin className="h-3 w-3" /> Date scanate live la generarea raportului
      </span>
    </div>
  );
}

export function ScoreCircle({ score, size = 110 }: { score: number; size?: number }) {
  const sw = Math.round(size * 0.085);
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  const label = score >= 70 ? "Bine" : score >= 40 ? "Necesită acțiune" : "Critic";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (score / 100) * c }} transition={{ duration: 1.4, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold" style={{ color, fontSize: size * 0.3 }}>
          <NumberTicker value={score} />
        </span>
        <span className="text-[9px] text-text-subtle">{label}</span>
      </div>
    </div>
  );
}
