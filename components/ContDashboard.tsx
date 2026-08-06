"use client";

// Dashboard-ul clientului: evoluția scorului, notificări de monitorizare,
// istoricul rapoartelor, statusul abonamentului.

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  FileText,
  TrendingUp,
  LogOut,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Star,
  Globe,
  Swords,
  Info,
} from "lucide-react";

type ReportItem = {
  token: string;
  createdAt: string;
  companyName: string;
  city: string;
  score: number;
  paid: boolean;
};

type NotificationItem = {
  id: number;
  createdAt: string;
  kind: string;
  title: string;
  body: string;
  seen: boolean;
};

const KIND_ICON: Record<string, any> = {
  review: Star,
  site: Globe,
  competitor: Swords,
  info: Info,
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

export function ContDashboard({
  email,
  reports,
  notifications,
}: {
  email: string;
  reports: ReportItem[];
  notifications: NotificationItem[];
}) {
  const [subSent, setSubSent] = useState(false);
  const scores = reports.filter((r) => r.score > 0);
  const latest = reports[reports.length - 1];

  async function requestSubscription() {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: latest?.companyName || email,
          email,
          selectedPackage: "personalizat",
          message: `Vrea ABONAMENT monitorizare lunară (din /cont). Firma: ${latest?.companyName ?? "?"} (${latest?.city ?? "?"}).`,
          source: "abonament-interes",
        }),
      });
      setSubSent(true);
    } catch {
      setSubSent(true); // nu blocăm UX-ul pe eroare de rețea
    }
  }

  return (
    <section className="container-app py-12 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-text sm:text-3xl">Contul tău</h1>
            <p className="mt-1 text-xs text-text-subtle">{email}</p>
          </div>
          <a href="/api/cont/session?logout=1" className="btn-ghost text-xs">
            <LogOut className="h-3.5 w-3.5" /> Ieși din cont
          </a>
        </div>

        {/* Evoluția scorului */}
        <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <TrendingUp className="h-5 w-5 text-brand-orange" /> Evoluția afacerii tale
          </h2>
          {scores.length >= 2 ? (
            <ScoreChart points={scores.map((r) => ({ date: r.createdAt, score: r.score }))} />
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              {scores.length === 1
                ? `Scorul tău de pornire: ${scores[0].score}/100. De la al doilea raport încolo vezi aici graficul evoluției.`
                : "Aici va apărea graficul evoluției scorului tău, raport după raport."}
            </p>
          )}
        </div>

        {/* Notificări */}
        <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <Bell className="h-5 w-5 text-brand-orange" /> Notificări
            {notifications.some((n) => !n.seen) && (
              <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                {notifications.filter((n) => !n.seen).length} noi
              </span>
            )}
          </h2>
          {notifications.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">
              Nimic nou deocamdată. Când monitorizarea găsește ceva — recenzii noi, site picat,
              mișcări ale competitorilor — apare aici și primești și email.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {notifications.map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Info;
                return (
                  <div key={n.id} className={`flex items-start gap-3 rounded-2xl border p-3.5 ${n.seen ? "border-bg-border bg-bg-soft/40" : "border-brand-orange/40 bg-brand-orange/5"}`}>
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                    <div>
                      <p className="text-sm font-semibold text-text">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-xs text-text-muted">{n.body}</p>}
                      <p className="mt-1 text-[10px] text-text-subtle">{fmtDate(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rapoartele */}
        <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <FileText className="h-5 w-5 text-brand-orange" /> Rapoartele tale
          </h2>
          {reports.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">Nu ai încă niciun raport pe acest email.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {[...reports].reverse().map((r) => (
                <Link key={r.token} href={`/service/raport/${r.token}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-bg-border bg-bg-soft/40 p-4 transition hover:border-brand-orange/50">
                  <div>
                    <p className="text-sm font-semibold text-text">{r.companyName}{r.city ? ` · ${r.city}` : ""}</p>
                    <p className="mt-0.5 text-[11px] text-text-subtle">{fmtDate(r.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-display text-xl font-extrabold ${r.score >= 70 ? "text-green-400" : r.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                      {r.score}
                    </span>
                    <ArrowRight className="h-4 w-4 text-text-subtle" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Abonament */}
        <div className="rounded-3xl border border-brand-purple/30 bg-brand-purple/5 p-6 text-center">
          <p className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-text">
            <RefreshCw className="h-5 w-5 text-brand-purple" /> Monitorizare lunară — 99 lei/lună
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
            Scanare automată în fiecare lună: raport nou, evoluția scorului, recenziile competitorilor,
            starea site-ului + notificări pe email. Afacerea ta, ținută în priză.
          </p>
          {subSent ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
              <CheckCircle2 className="h-4 w-4" /> Te-am notat! Te contactăm când activăm abonamentele.
            </p>
          ) : (
            <button type="button" onClick={requestSubscription} className="btn-primary mt-4">
              Vreau abonamentul <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center">
          <p className="font-display text-lg font-bold text-text">Vrei să lucrăm la planul tău?</p>
          <p className="mt-1 text-sm text-text-muted">Site, promovare, Google Business — implementăm noi.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link href="/brief" className="btn-primary">Cere estimare <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/service" className="btn-ghost">Raport nou</Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Grafic simplu de evoluție a scorului (SVG, fără librării).
function ScoreChart({ points }: { points: Array<{ date: string; score: number }> }) {
  const w = 560, h = 140, pad = 24;
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1));
  const ys = points.map((p) => h - pad - ((p.score / 100) * (h - pad * 2)));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const first = points[0].score;
  const last = points[points.length - 1].score;
  const delta = last - first;

  return (
    <div className="mt-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-extrabold text-text">{last}</span>
        <span className={`text-sm font-bold ${delta >= 0 ? "text-green-400" : "text-red-400"}`}>
          {delta >= 0 ? "+" : ""}{delta} față de primul raport
        </span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[420px]">
          {[25, 50, 75].map((v) => {
            const y = h - pad - ((v / 100) * (h - pad * 2));
            return <line key={v} x1={pad} x2={w - pad} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
          })}
          <path d={path} fill="none" stroke="#FF6B1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r={4} fill="#FF6B1A" />
          ))}
        </svg>
      </div>
    </div>
  );
}
