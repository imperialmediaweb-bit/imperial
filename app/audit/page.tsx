"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  Gift,
  Mail,
  Shield,
} from "lucide-react";
import type { AuditResult, AuditCategory } from "@/app/api/audit/route";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare.");
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (e: any) {
      setError(e?.message ?? "Eroare la scanare.");
    } finally {
      setLoading(false);
    }
  }

  async function sendReport(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !result) return;
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Audit: " + result.url,
          email,
          selectedPackage: "audit",
          industry: "Audit site gratuit",
          message: `Audit result: ${result.overallScore}/100 — ${result.summary}\nURL: ${result.url}\nTop probleme: ${result.topProblems.join("; ")}`,
          source: "audit-page",
        }),
      });
      setEmailSent(true);
    } catch {}
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* ─── HERO ─── */}
      <section className="container-app pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip">
            <Shield className="h-3 w-3" /> Audit gratuit
          </span>
          <h1 className="section-title mt-4 mx-auto">
            Scanează-ți site-ul{" "}
            <span className="text-gradient">gratuit în 30 secunde</span>
          </h1>
          <p className="section-subtitle mx-auto">
            Introdu URL-ul site-ului tău și Imperial AI îl analizează pe loc:
            viteză, mobile, SEO, securitate, design. Primești scor + problemele
            exacte + recomandări concrete.
          </p>
        </div>

        {/* Input URL */}
        <form
          onSubmit={runAudit}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="exemplu.ro"
              className="input w-full py-4 pl-12 text-base"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-primary whitespace-nowrap px-8 py-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scanez...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Scanează gratuit
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-8 max-w-md text-center"
          >
            <div className="mx-auto h-32 w-32 animate-pulse rounded-full border-4 border-brand-orange/30 bg-brand-orange/5 p-8">
              <div className="h-full w-full animate-spin rounded-full border-4 border-transparent border-t-brand-orange" />
            </div>
            <p className="mt-4 text-sm text-text-muted">
              Analizez {url}... viteză, mobile, SEO, securitate, design
            </p>
          </motion.div>
        )}
      </section>

      {/* ─── RESULTS ─── */}
      <AnimatePresence>
        {result && (
          <motion.section
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container-app pb-20"
          >
            {/* Overall score */}
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <ScoreCircle score={result.overallScore} size={120} />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs uppercase tracking-wider text-text-subtle">
                      Audit complet
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold text-text">
                      {result.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted break-all">
                      {result.url}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {result.summary}
                    </p>
                  </div>
                </div>

                {/* Top 3 probleme */}
                {result.topProblems.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-300">
                      Top probleme detectate
                    </p>
                    <ol className="space-y-1.5">
                      {result.topProblems.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-text"
                        >
                          <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-300">
                            {i + 1}
                          </span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Category cards */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.categories.map((cat, i) => (
                  <CategoryCard key={cat.name} cat={cat} delay={i * 0.1} />
                ))}
              </div>

              {/* Email capture */}
              <div className="mt-8 rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center sm:p-8">
                <Gift className="mx-auto h-8 w-8 text-brand-orange" />
                <h3 className="mt-3 font-display text-xl font-bold text-text">
                  Vrei să rezolvăm problemele?
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  Lasă-ne emailul și primești o ofertă personalizată + campanie
                  de promovare GRATUITĂ în 50 ziare la orice site nou.
                </p>

                {emailSent ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-semibold text-green-300"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Trimis! Revenim în max 24h cu ofertă.
                  </motion.div>
                ) : (
                  <form
                    onSubmit={sendReport}
                    className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
                  >
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemplu.ro"
                        className="input pl-10"
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary whitespace-nowrap">
                      Primește ofertă
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* CTA brief */}
              <div className="mt-6 text-center">
                <p className="text-xs text-text-subtle">
                  Sau discută direct cu AI-ul nostru →{" "}
                  <Link
                    href="/brief"
                    className="font-semibold text-brand-orange hover:underline"
                  >
                    Primește estimare în 2 minute
                  </Link>
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─────────────────────────────────────────

function ScoreCircle({ score, size = 100 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 50
        ? "#eab308"
        : "#ef4444";
  const label =
    score >= 80
      ? "Bun"
      : score >= 50
        ? "Necesită îmbunătățiri"
        : "Critic";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-extrabold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-text-subtle">{label}</span>
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  delay,
}: {
  cat: AuditCategory;
  delay: number;
}) {
  const StatusIcon =
    cat.status === "good"
      ? CheckCircle2
      : cat.status === "warning"
        ? AlertTriangle
        : XCircle;

  const statusColor =
    cat.status === "good"
      ? "text-green-400"
      : cat.status === "warning"
        ? "text-yellow-400"
        : "text-red-400";

  const barColor =
    cat.status === "good"
      ? "bg-green-500"
      : cat.status === "warning"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-bg-border bg-bg-card/60 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.emoji}</span>
          <h3 className="font-display text-sm font-bold text-text">
            {cat.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-lg font-bold text-text">
            {cat.score}
          </span>
          <StatusIcon className={`h-4 w-4 ${statusColor}`} />
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-soft">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${cat.score}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />
      </div>

      {/* Issues */}
      {cat.issues.length > 0 && (
        <div className="mt-3 space-y-1">
          {cat.issues.map((issue, i) => (
            <p key={i} className="flex items-start gap-1.5 text-xs text-text-muted">
              <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-400" />
              {issue}
            </p>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {cat.suggestions.length > 0 && (
        <div className="mt-2 space-y-1">
          {cat.suggestions.map((sug, i) => (
            <p
              key={i}
              className="flex items-start gap-1.5 text-xs text-brand-orange"
            >
              <Zap className="mt-0.5 h-3 w-3 flex-shrink-0" />
              {sug}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
