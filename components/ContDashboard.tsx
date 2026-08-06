"use client";

// Dashboard-ul clientului: evoluția scorului, notificări de monitorizare,
// istoricul rapoartelor, statusul abonamentului.

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NumberTicker } from "@/components/effects/NumberTicker";
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
  Lightbulb,
  MessageCircle,
  Stethoscope,
  SearchCheck,
  Calculator,
  Wrench,
  Gift,
  Copy,
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
  advice: Lightbulb,
  info: Info,
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

export function ContDashboard({
  email,
  reports,
  notifications,
  refCode,
  referralCount = 0,
  subscription,
}: {
  email: string;
  reports: ReportItem[];
  notifications: NotificationItem[];
  refCode?: string;
  referralCount?: number;
  subscription?: { active: boolean; plan: string | null };
}) {
  const [subSent, setSubSent] = useState(false);
  const [subLoading, setSubLoading] = useState<string | null>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [refCopied, setRefCopied] = useState(false);
  const refLink = refCode ? `https://imperial-media.ro/service?ref=${refCode}` : "";

  async function copyRefLink() {
    try {
      await navigator.clipboard.writeText(refLink);
      setRefCopied(true);
      setTimeout(() => setRefCopied(false), 2000);
    } catch {}
  }
  const scores = reports.filter((r) => r.score > 0);
  const latest = reports[reports.length - 1];

  // Activare abonament self-service: cu Stripe → plată recurentă; fără → cerere în admin.
  async function subscribe(plan: "lunar" | "anual") {
    setSubLoading(plan);
    setSubError(null);
    try {
      const res = await fetch("/api/subscribe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Nu am putut porni activarea. Încearcă din nou.");
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.launchMode) {
        setSubSent(true); // mod lansare — cererea a ajuns în admin
        return;
      }
      throw new Error("Răspuns neașteptat. Încearcă din nou.");
    } catch (e: any) {
      setSubError(e?.message ?? "Eroare de rețea. Încearcă din nou.");
    } finally {
      setSubLoading(null);
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

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 to-transparent p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Scor actual</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${!latest || latest.score >= 70 ? "text-green-400" : latest.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
              {latest ? <NumberTicker value={latest.score} /> : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Rapoarte</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-text"><NumberTicker value={reports.length} /></p>
          </div>
          <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Notificări noi</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-text"><NumberTicker value={notifications.filter((n) => !n.seen).length} /></p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Firme aduse</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-green-400"><NumberTicker value={referralCount} /></p>
          </div>
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

        {/* Toolurile hubului */}
        <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <Wrench className="h-5 w-5 text-brand-orange" /> Toolurile tale
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/cont/consultant" className="group rounded-2xl border border-bg-border bg-bg-soft/40 p-4 transition hover:border-brand-orange/50">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-text">
                <MessageCircle className="h-4 w-4 text-brand-orange" /> Consultantul tău
              </p>
              <p className="mt-1 text-xs text-text-muted">Îți știe firma și cifrele — sfaturi pe afacerea ta, oricând</p>
            </Link>
            <Link href="/service" className="group rounded-2xl border border-bg-border bg-bg-soft/40 p-4 transition hover:border-brand-orange/50">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-text">
                <Stethoscope className="h-4 w-4 text-brand-orange" /> Audit de afaceri
              </p>
              <p className="mt-1 text-xs text-text-muted">Raport nou complet: Google, ANAF, competiție, plan 12 luni</p>
            </Link>
            <Link href="/audit" className="group rounded-2xl border border-bg-border bg-bg-soft/40 p-4 transition hover:border-brand-orange/50">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-text">
                <SearchCheck className="h-4 w-4 text-brand-orange" /> Audit de site
              </p>
              <p className="mt-1 text-xs text-text-muted">Scanează-ți site-ul: viteză, SEO, mobil — gratuit</p>
            </Link>
            <Link href="/brief" className="group rounded-2xl border border-bg-border bg-bg-soft/40 p-4 transition hover:border-brand-orange/50">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-text">
                <Calculator className="h-4 w-4 text-brand-orange" /> Estimare site nou
              </p>
              <p className="mt-1 text-xs text-text-muted">Afli în 2 minute cât ar costa site-ul tău — gratuit</p>
            </Link>
          </div>
        </div>

        {/* Consultantul dedicat */}
        <Link href="/cont/consultant"
          className="block rounded-3xl border-2 border-brand-orange/40 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 transition hover:border-brand-orange/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
                <MessageCircle className="h-5 w-5 text-brand-orange" /> Consultantul tău de afaceri
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Îți știe firma, scorul, cifrele și notificările. Spune-i cum ți-a mers luna,
                întreabă-l orice — online sau offline — și primești sfaturi pe afacerea TA.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-brand-orange" />
          </div>
        </Link>

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

        {/* Recomandă și câștigi */}
        {refCode && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
              <Gift className="h-5 w-5 text-green-400" /> Recomandă și câștigi
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Trimite linkul tău unui alt patron: el primește <b className="text-text">reducere (249 în loc de 299 lei)</b>,
              iar tu primești <b className="text-text">1 lună de monitorizare GRATIS</b> pentru fiecare firmă care cumpără.
              Cu cât aduci mai mulți, cu atât mai bine.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input readOnly value={refLink} className="input flex-1 text-xs" onFocus={(e) => e.target.select()} />
              <button type="button" onClick={copyRefLink} className="btn-primary whitespace-nowrap">
                <Copy className="h-4 w-4" /> {refCopied ? "Copiat ✓" : "Copiază linkul"}
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold text-green-300">
              {referralCount > 0
                ? `🎉 Ai adus ${referralCount} ${referralCount === 1 ? "firmă" : "firme"} → ${referralCount} ${referralCount === 1 ? "lună" : "luni"} de monitorizare gratis`
                : "Încă nicio firmă adusă — trimite linkul pe WhatsApp unui patron pe care-l știi."}
            </p>
          </div>
        )}

        {/* Abonament */}
        <div className="rounded-3xl border border-brand-purple/30 bg-brand-purple/5 p-6 text-center">
          <p className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-text">
            <RefreshCw className="h-5 w-5 text-brand-purple" /> Monitorizare lunară — 99 lei/lună
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
            Scanare automată în fiecare lună: raport nou, evoluția scorului, recenziile competitorilor,
            starea site-ului + notificări pe email. Afacerea ta, ținută în priză.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs font-semibold text-brand-purple">
            Lunile câștigate din recomandări se scad din următoarea plată.
          </p>
          {subscription?.active ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
              <CheckCircle2 className="h-4 w-4" /> Abonament ACTIV ({subscription.plan ?? "lunar"}) — afacerea ta e monitorizată
            </p>
          ) : subSent ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300">
              <CheckCircle2 className="h-4 w-4" /> Cererea ta e înregistrată! Activăm abonamentul și te anunțăm.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" disabled={!!subLoading} onClick={() => subscribe("lunar")} className="btn-primary">
                {subLoading === "lunar" ? "Se încarcă..." : "Activează lunar — 99 lei/lună"}
              </button>
              <button type="button" disabled={!!subLoading} onClick={() => subscribe("anual")} className="btn-ghost">
                {subLoading === "anual" ? "Se încarcă..." : "Anual — 990 lei (2 luni gratis)"}
              </button>
            </div>
          )}
          {subError && (
            <p className="mx-auto mt-3 max-w-md rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">
              {subError}{" "}
              <a href="/cont" className="underline">Reîncarcă pagina</a> dacă persistă.
            </p>
          )}
          {!subscription?.active && !subSent && (
            <p className="mt-2 text-[10px] text-text-subtle">
              Abonamentul se reînnoiește automat; îl poți anula oricând. Vezi <Link href="/termeni" className="underline">Termenii</Link>.
            </p>
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
          <defs>
            <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((v) => {
            const y = h - pad - ((v / 100) * (h - pad * 2));
            return <line key={v} x1={pad} x2={w - pad} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />;
          })}
          <path
            d={`${path} L${xs[xs.length - 1]},${h - pad} L${xs[0]},${h - pad} Z`}
            fill="url(#scoreArea)"
          />
          <path d={path} fill="none" stroke="#ea580c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 5.5 : 4} fill="#ea580c" stroke="#0e0617" strokeWidth={2} />
          ))}
          <text x={xs[xs.length - 1]} y={ys[ys.length - 1] - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
            {points[points.length - 1].score}
          </text>
        </svg>
      </div>
    </div>
  );
}
