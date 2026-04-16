"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Wand2, Info, Send, Plus, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import type { BriefState } from "@/lib/brief-schema";
import { canSubmitBrief, computeBriefProgress, computeLiveEstimate } from "@/lib/brief-schema";
import { getPackageByKey } from "@/lib/packages";
import { LiveMockup } from "./LiveMockup";

type Props = {
  brief: BriefState;
  onSubmit: () => void;
  submitting: boolean;
};

type FieldRow = {
  key: keyof BriefState | string;
  label: string;
  value: string | string[] | null;
};

export function LiveBriefCard({ brief, onSubmit, submitting }: Props) {
  const progress = useMemo(() => computeBriefProgress(brief), [brief]);
  const canSubmit = useMemo(() => canSubmitBrief(brief), [brief]);
  const liveEstimate = useMemo(() => computeLiveEstimate(brief), [brief]);

  const recommendedPkg = brief.recommendedPackage
    ? getPackageByKey(brief.recommendedPackage)
    : null;

  const contactFields: FieldRow[] = [
    { key: "name", label: "Nume", value: brief.name || null },
    { key: "email", label: "Email", value: brief.email || null },
    { key: "phone", label: "Telefon", value: brief.phone || null },
  ];

  const projectFields: FieldRow[] = [
    {
      key: "selectedPackage",
      label: "Pachet",
      value: brief.selectedPackage ? packageLabel(brief.selectedPackage) : null,
    },
    { key: "industry", label: "Domeniu", value: brief.industry || null },
    { key: "currentSite", label: "Site actual", value: brief.currentSite || null },
    { key: "pages", label: "Pagini", value: brief.pages || null },
    { key: "deadline", label: "Termen", value: brief.deadline || null },
  ];

  const designFields: FieldRow[] = [
    { key: "hasLogo", label: "Logo", value: brief.hasLogo ? (brief.hasLogo === "da" ? "Are logo" : "Fără logo") : null },
    { key: "colorsPreference", label: "Culori", value: brief.colorsPreference || null },
    { key: "features", label: "Funcționalități", value: brief.features.length > 0 ? brief.features : null },
    { key: "inspiration", label: "Inspirație", value: brief.inspiration || null },
  ];

  const hasEstimate =
    (brief.estimate.min !== null && brief.estimate.max !== null) &&
    (brief.estimate.min !== 0 || brief.estimate.max !== 0);

  const hasCustomEstimate =
    brief.estimate.min === 0 && brief.estimate.max === 0 && brief.estimate.reasoning;

  return (
    <div className="relative h-full">
      {/* Glow background */}
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 blur-2xl" />

      <div className="relative flex h-full flex-col rounded-3xl border border-bg-border bg-bg-card bg-card-gradient shadow-card">
        {/* Header cu progress circular */}
        <div className="flex items-center gap-4 border-b border-bg-border/60 p-5">
          <CircularProgress value={progress} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text">
                Brief-ul tău
              </h3>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              {progress < 30
                ? "Haide să începem — Imperial AI îți pune câteva întrebări."
                : progress < 70
                  ? "Super, se conturează. Încă puține detalii."
                  : progress < 95
                    ? "Aproape gata! Finalizăm brief-ul."
                    : "Complet ✓ — gata de trimis."}
            </p>
          </div>
        </div>

        {/* Secțiuni cu câmpuri */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Live mockup — apare doar când avem suficiente date */}
          <AnimatePresence>
            {brief.selectedPackage && brief.selectedPackage !== "personalizat" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <LiveMockup brief={brief} />
              </motion.div>
            )}
          </AnimatePresence>

          <BriefSection title="Contact" fields={contactFields} />
          <BriefSection title="Proiect" fields={projectFields} />
          <BriefSection title="Design & detalii" fields={designFields} />

          {/* Pachet recomandat */}
          <AnimatePresence>
            {recommendedPkg && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="gradient-border rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Wand2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                      Pachet recomandat de AI
                    </p>
                    <p className="mt-1 font-display text-base font-bold text-text">
                      {recommendedPkg.name}
                      <span className="ml-2 text-brand-orange">
                        {recommendedPkg.price}
                      </span>
                    </p>
                    {brief.recommendedReason && (
                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        {brief.recommendedReason}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Estimare */}
          <AnimatePresence>
            {hasEstimate && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-4"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/20 blur-2xl" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Estimare orientativă
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-text sm:text-3xl">
                    <span className="text-gradient">
                      {brief.estimate.min} – {brief.estimate.max} €
                    </span>
                  </p>
                  {brief.estimate.reasoning && (
                    <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                      {brief.estimate.reasoning}
                    </p>
                  )}
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-text-subtle">
                    <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    Estimare generată automat. Oferta fermă vine pe email în 24h.
                  </p>
                </div>
              </motion.div>
            )}
            {hasCustomEstimate && !hasEstimate && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-bg-border bg-bg-soft/40 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Ofertă custom
                </p>
                <p className="mt-1 text-sm text-text">{brief.estimate.reasoning}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breakdown LIVE — estimare running cu linii */}
          <AnimatePresence>
            {liveEstimate && !hasEstimate && !hasCustomEstimate && liveEstimate.lines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden rounded-2xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-purple/5 p-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-orange" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Estimare live
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  <AnimatePresence initial={false}>
                    {liveEstimate.lines.map((line, idx) => (
                      <motion.div
                        key={line.label + idx}
                        initial={{ opacity: 0, x: -8, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start justify-between gap-2 overflow-hidden text-[11px]"
                      >
                        <span className="flex items-start gap-1.5 text-text-muted">
                          {idx === 0 ? (
                            <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-orange" />
                          ) : (
                            <Plus className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-orange/60" />
                          )}
                          <span className="break-words">{line.label}</span>
                        </span>
                        <span className="flex-shrink-0 whitespace-nowrap font-mono text-text">
                          {line.priceMin === line.priceMax
                            ? `${line.priceMin}€`
                            : `${line.priceMin}–${line.priceMax}€`}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2 border-t border-brand-orange/20 pt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Total estimat
                  </span>
                  <motion.span
                    key={`${liveEstimate.totalMin}-${liveEstimate.totalMax}`}
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="font-display text-xl font-extrabold sm:text-2xl"
                  >
                    <span className="text-gradient">
                      {liveEstimate.totalMin === liveEstimate.totalMax
                        ? `${liveEstimate.totalMin} €`
                        : `${liveEstimate.totalMin}–${liveEstimate.totalMax} €`}
                    </span>
                  </motion.span>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-snug text-text-subtle">
                  <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  Se actualizează pe măsură ce conversăm. Oferta fermă — pe email în 24h.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer cu submit */}
        <div className="border-t border-bg-border/60 p-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || submitting}
            className="btn-primary w-full"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Se trimite...
              </>
            ) : brief.readyToSubmit ? (
              <>
                <Send className="h-4 w-4" />
                Trimite brief-ul
              </>
            ) : canSubmit ? (
              <>
                <Send className="h-4 w-4" />
                Trimite acum
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Continuă conversația
              </>
            )}
          </button>
          {!canSubmit && (
            <p className="mt-2 text-center text-[11px] text-text-subtle">
              Avem nevoie de: nume, email, tip proiect, domeniu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function BriefSection({ title, fields }: { title: string; fields: FieldRow[] }) {
  const filledCount = fields.filter((f) => f.value !== null && (Array.isArray(f.value) ? f.value.length > 0 : f.value !== "")).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {title}
        </h4>
        <span className="text-[10px] text-text-subtle">
          {filledCount}/{fields.length}
        </span>
      </div>
      <div className="space-y-1.5">
        <AnimatePresence>
          {fields.map((f) => {
            const filled =
              f.value !== null &&
              (Array.isArray(f.value) ? f.value.length > 0 : f.value !== "");
            if (!filled) return null;
            return (
              <motion.div
                key={f.key as string}
                initial={{ opacity: 0, x: -8, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2 overflow-hidden"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" strokeWidth={3} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-subtle">
                    {f.label}
                  </p>
                  <p className="break-words text-sm text-text">
                    {Array.isArray(f.value) ? f.value.join(", ") : f.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filledCount === 0 && (
          <p className="text-xs italic text-text-subtle">Niciun câmp încă.</p>
        )}
      </div>
    </div>
  );
}

function CircularProgress({ value }: { value: number }) {
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
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
          stroke="url(#briefGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="briefGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B1A" />
            <stop offset="100%" stopColor="#7B2FF7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-xs font-bold text-text">{value}%</span>
      </div>
    </div>
  );
}

function packageLabel(key: string): string {
  switch (key) {
    case "website":
      return "Website Prezentare";
    case "shop":
      return "Magazin Online";
    case "promo":
      return "Promovare";
    case "admin":
      return "Administrare";
    case "personalizat":
      return "Personalizat";
    default:
      return key;
  }
}
