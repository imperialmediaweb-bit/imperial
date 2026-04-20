"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, TrendingDown, Target, Zap } from "lucide-react";
import { useMemo } from "react";
import type { BriefState } from "@/lib/brief-schema";

type Props = {
  brief: BriefState;
  onSubmit: () => void;
  submitting: boolean;
};

type CheckItem = {
  key: string;
  label: string;
  status: "unknown" | "good" | "warning" | "bad";
  detail?: string;
};

export function ConsultantaPanel({ brief, onSubmit, submitting }: Props) {
  const checks = useMemo(() => buildChecks(brief), [brief]);
  const hasAnyData = brief.industry || brief.name;
  const score = useMemo(() => computeScore(checks), [checks]);
  const lostClients = useMemo(() => estimateLostClients(brief, checks), [brief, checks]);
  const step = useMemo(() => detectStep(brief, checks), [brief, checks]);

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-orange/10 blur-2xl" />

      <div className="relative flex h-full flex-col rounded-3xl border border-bg-border bg-bg-card bg-card-gradient shadow-card">
        {/* Header */}
        <div className="border-b border-bg-border/60 p-5">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-brand-orange" />
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text">
                Diagnosticul tău
              </h3>
              <p className="text-[11px] text-text-muted">
                {!hasAnyData
                  ? "Răspunde la întrebări — diagnosticul se construiește live"
                  : step < 4
                    ? "Strângem date..."
                    : "Diagnostic complet"}
              </p>
            </div>
          </div>

          {/* Score circle */}
          {hasAnyData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-center gap-4"
            >
              <ScoreMini score={score} />
              <div>
                <p className="text-xs text-text-muted">Sănătate digitală</p>
                <p className="font-display text-lg font-extrabold text-text">
                  {score}/100
                </p>
                <p className="text-[10px] text-text-subtle">
                  {score >= 70 ? "Bine" : score >= 40 ? "Necesită atenție" : "Critic"}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Checklist */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Lost clients counter */}
          <AnimatePresence>
            {lostClients > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-center"
              >
                <TrendingDown className="mx-auto h-5 w-5 text-red-400" />
                <motion.p
                  key={lostClients}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="mt-1 font-display text-2xl font-extrabold text-red-400"
                >
                  ~{lostClients}
                </motion.p>
                <p className="text-[11px] text-text-muted">
                  clienți pierduți estimat / lună
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Digital health checks */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-subtle">
              Prezență digitală
            </p>
            <div className="space-y-2">
              <AnimatePresence>
                {checks.map((c) => (
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    {c.status === "good" && (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                    )}
                    {c.status === "warning" && (
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                    )}
                    {c.status === "bad" && (
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                    )}
                    {c.status === "unknown" && (
                      <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full border-2 border-text-subtle" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium ${
                        c.status === "unknown" ? "text-text-subtle" : "text-text"
                      }`}>
                        {c.label}
                      </p>
                      {c.detail && (
                        <p className="mt-0.5 text-[10px] text-text-muted">
                          {c.detail}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Step indicator */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-subtle">
              Progres consultanță
            </p>
            <div className="space-y-1.5">
              {["Cunoaștere business", "Sistem & flux", "Audit digital", "Diagnostic", "Plan acțiune", "Ofertă"].map(
                (s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        i < step
                          ? "bg-brand-orange"
                          : i === step
                            ? "bg-brand-orange animate-pulse"
                            : "bg-bg-soft"
                      }`}
                    />
                    <p
                      className={`text-[11px] ${
                        i < step
                          ? "font-medium text-text"
                          : i === step
                            ? "font-medium text-brand-orange"
                            : "text-text-subtle"
                      }`}
                    >
                      {s}
                      {i < step && " ✓"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-bg-border/60 p-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!brief.email || submitting}
            className="btn-primary w-full"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Se trimite...
              </>
            ) : brief.readyToSubmit ? (
              <>
                <Zap className="h-4 w-4" />
                Primește planul pe email
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Continuă diagnosticul
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreMini({ score }: { score: number }) {
  const size = 48;
  const sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 0.6 }}
        />
      </svg>
    </div>
  );
}

function buildChecks(b: BriefState): CheckItem[] {
  const checks: CheckItem[] = [
    { key: "site", label: "Site web", status: "unknown" },
    { key: "google", label: "Google Business", status: "unknown" },
    { key: "facebook", label: "Pagină Facebook", status: "unknown" },
    { key: "reviews", label: "Review-uri Google", status: "unknown" },
    { key: "logo", label: "Logo profesional", status: "unknown" },
    { key: "seo", label: "SEO / vizibilitate", status: "unknown" },
  ];

  const msg = (b.message || "").toLowerCase();
  const industry = (b.industry || "").toLowerCase();
  const features = b.features.map((f) => f.toLowerCase()).join(" ");

  if (b.currentSite) {
    checks[0] = { ...checks[0], status: "warning", detail: b.currentSite };
  } else if (msg.includes("nu am site") || msg.includes("fara site") || msg.includes("nu") && industry) {
    checks[0] = { ...checks[0], status: "bad", detail: "Lipsește — pierzi 87% din clienți" };
  }

  if (msg.includes("google business") || msg.includes("maps")) {
    checks[1] = msg.includes("nu") || msg.includes("fara")
      ? { ...checks[1], status: "bad", detail: "Nu apari pe Google Maps" }
      : { ...checks[1], status: "good", detail: "Activ" };
  }

  if (msg.includes("facebook") || msg.includes("fb")) {
    if (msg.includes("nu postez") || msg.includes("inactiv") || msg.includes("mort")) {
      checks[2] = { ...checks[2], status: "warning", detail: "Pagină inactivă" };
    } else if (msg.includes("nu am") || msg.includes("fara")) {
      checks[2] = { ...checks[2], status: "bad", detail: "Lipsește" };
    } else {
      checks[2] = { ...checks[2], status: "good", detail: "Activ" };
    }
  }

  if (msg.includes("review") || msg.includes("recenzii")) {
    checks[3] = msg.includes("nu") || msg.includes("0") || msg.includes("deloc")
      ? { ...checks[3], status: "bad", detail: "0 review-uri" }
      : { ...checks[3], status: "good" };
  }

  if (b.hasLogo === "da") {
    checks[4] = { ...checks[4], status: "good", detail: "Are logo" };
  } else if (b.hasLogo === "nu") {
    checks[4] = { ...checks[4], status: "bad", detail: "Lipsește — primă impresie slabă" };
  }

  return checks;
}

function computeScore(checks: CheckItem[]): number {
  const known = checks.filter((c) => c.status !== "unknown");
  if (known.length === 0) return 0;
  const pts = known.reduce((s, c) => {
    if (c.status === "good") return s + 100;
    if (c.status === "warning") return s + 50;
    return s + 10;
  }, 0);
  return Math.round(pts / known.length);
}

function estimateLostClients(b: BriefState, checks: CheckItem[]): number {
  const badCount = checks.filter((c) => c.status === "bad").length;
  if (badCount === 0) return 0;
  const base = b.pages === "50-100 clienți/lună" ? 75 : b.pages === "20-50 clienți/lună" ? 35 : 15;
  return Math.round(base * (badCount / checks.length) * 1.5);
}

function detectStep(b: BriefState, checks: CheckItem[]): number {
  const knownChecks = checks.filter((c) => c.status !== "unknown").length;
  if (!b.industry) return 0;
  if (!b.message && knownChecks < 2) return 1;
  if (knownChecks < 3) return 2;
  if (knownChecks >= 3 && !b.readyToSubmit) return 3;
  if (b.estimate.min || b.readyToSubmit) return 5;
  return 4;
}
