"use client";

/**
 * Calculator de estimare LIVE — alegi tipul de site + opțiuni și vezi prețul
 * orientativ instant. Funcționează și în Experiența 3D și în varianta mobilă.
 * Prețurile sunt cele din pachetele existente, afișate „de la".
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { NumberTicker } from "../effects/NumberTicker";
import { Zap, Check } from "lucide-react";

type TypeKey = "start" | "prezentare" | "magazin";

const TYPES: { key: TypeKey; name: string; base: number; cur: "lei" | "€"; note: string }[] = [
  { key: "start", name: "Site Start", base: 1500, cur: "lei", note: "o pagină, gata în câteva zile" },
  { key: "prezentare", name: "Site de prezentare", base: 699, cur: "€", note: "pagini nelimitate, panou propriu" },
  { key: "magazin", name: "Magazin online", base: 1200, cur: "€", note: "plăți card, AWB, facturare" },
];

// adaosuri orientative per monedă [lei, €]; monthly = se plătește lunar
const OPTIONS: { key: string; name: string; lei: number; eur: number; monthly?: boolean }[] = [
  { key: "ai", name: "Consultant AI pe site", lei: 1000, eur: 200 },
  { key: "seo", name: "Campanie SEO + vizibilitate AI", lei: 750, eur: 150, monthly: true },
  { key: "presa", name: "Articole în presă (Media Expres)", lei: 500, eur: 100 },
  { key: "admin", name: "Administrare lunară", lei: 100, eur: 20, monthly: true },
];

export function Estimator({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState<TypeKey>("prezentare");
  const [opts, setOpts] = useState<Record<string, boolean>>({});

  const t = TYPES.find((x) => x.key === type)!;
  const { once, monthly } = useMemo(() => {
    let once = t.base;
    let monthly = 0;
    for (const o of OPTIONS) {
      if (!opts[o.key]) continue;
      const v = t.cur === "lei" ? o.lei : o.eur;
      if (o.monthly) monthly += v;
      else once += v;
    }
    return { once, monthly };
  }, [t, opts]);

  const briefHref = `/brief?tip=${type}&optiuni=${Object.keys(opts).filter((k) => opts[k]).join(",")}`;

  return (
    <div className={`pointer-events-auto rounded-2xl border border-white/[0.08] bg-[#09080e]/85 p-6 backdrop-blur-md sm:p-8 ${compact ? "" : "max-w-2xl"}`}>
      {/* tipul de site */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((x) => (
          <button
            key={x.key}
            onClick={() => setType(x.key)}
            className={`rounded-full px-4 py-2.5 text-[13px] font-semibold transition ${
              type === x.key
                ? "bg-orange-gradient text-white shadow-glow-orange"
                : "border border-white/12 text-white/70 hover:border-brand-orange/50 hover:text-white"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-white/50">{t.note}</p>

      {/* opțiunile */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const on = !!opts[o.key];
          const v = t.cur === "lei" ? o.lei : o.eur;
          return (
            <button
              key={o.key}
              onClick={() => setOpts((s) => ({ ...s, [o.key]: !s[o.key] }))}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                on ? "border-brand-magenta/60 bg-brand-magenta/[0.08]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                  on ? "border-transparent bg-orange-gradient" : "border-white/25"
                }`}
              >
                {on ? <Check className="h-3.5 w-3.5 text-white" /> : null}
              </span>
              <span className="flex-1 text-[13px] font-medium text-white/85">{o.name}</span>
              <span className="font-jmono text-[11px] text-white/50">
                +{v} {t.cur}
                {o.monthly ? "/lună" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* prețul live */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
        <div>
          <div className="font-jmono text-[10px] uppercase tracking-[0.25em] text-white/50">
            Estimare orientativă
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[13px] text-white/60">de la</span>
            <NumberTicker value={once} className="font-display text-4xl font-extrabold text-gradient sm:text-5xl" />
            <span className="font-serifd text-2xl italic text-gradient">{t.cur}</span>
            {monthly > 0 ? (
              <span className="ml-1 text-[13px] text-white/60">
                + {monthly} {t.cur}/lună
              </span>
            ) : null}
          </div>
        </div>
        <Link
          href={briefHref}
          className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[14px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
        >
          <Zap className="h-4 w-4" />
          Primește oferta exactă
        </Link>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Prețul final depinde de cerințele exacte — răspundem cu oferta personalizată în aceeași zi, gratuit.
      </p>
    </div>
  );
}
