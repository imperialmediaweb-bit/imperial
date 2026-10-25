"use client";

/**
 * Calculator de estimare LIVE — alegi tipul de site + opțiuni și vezi prețul
 * orientativ instant. Funcționează și în Experiența 3D și în varianta mobilă.
 * Prețurile sunt cele din pachetele existente, afișate „de la".
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NumberTicker } from "../effects/NumberTicker";
import { Zap, Check, Info as InfoIcon } from "lucide-react";
import { InfoModal } from "../InfoModal";
import { ADDON_INFO, INCLUDED, type Info } from "@/lib/addon-info";
import { CONFIG_TYPES, optionsFor, optionPrice, buildConfig, configQuery, parseConfig, type ConfigType } from "@/lib/configuratie";

type TypeKey = ConfigType;

const NOTES: Record<TypeKey, string> = {
  start: "5 pagini + blog, design unic, buton WhatsApp, articol în Botoșani Expres, campanie 5 zile pe Facebook — de la 1.500 lei",
  prezentare: "design unic de la zero, până la 10 pagini, panou propriu, asistent AI inclus — de la 3.500 lei",
  magazin: "Magazin Start: design unic, până la 30 de produse, coș, comenzi, plată ramburs — de la 3.000 lei",
};
const TYPES = (Object.keys(CONFIG_TYPES) as TypeKey[]).map((key) => ({
  key,
  name: CONFIG_TYPES[key].name,
  base: CONFIG_TYPES[key].base,
  cur: "lei" as const,
  note: NOTES[key],
}));

export function Estimator({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState<TypeKey>("start");
  const [opts, setOpts] = useState<Record<string, boolean>>({});
  const [info, setInfo] = useState<Info | null>(null);

  // Revenit din ofertă („Recalculează”): /estimare?tip=...&optiuni=... repune alegerea
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = parseConfig(q.get("tip"), q.get("optiuni"));
    if (!c) return;
    setType(c.type);
    setOpts(Object.fromEntries(c.lines.map((l) => [l.key, true])));
  }, []);

  const t = TYPES.find((x) => x.key === type)!;
  const options = optionsFor(type);
  const config = useMemo(
    () => buildConfig(type, Object.keys(opts).filter((k) => opts[k])),
    [type, opts]
  );
  const { once, monthly } = config;

  const briefHref = `/brief?${configQuery(config)}`;

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
      <p className="mt-1.5 text-[12px] text-white/50">
        Ai nevoie de o aplicație, o platformă SaaS sau alt program la comandă?{" "}
        <Link href="/brief" className="font-medium text-brand-orange hover:underline">
          Descrie proiectul și primești oferta personalizată
        </Link>
      </p>

      {/* ce e inclus în orice site */}
      <div className="mt-5">
        <p className="font-jmono text-[10px] uppercase tracking-[0.22em] text-white/50">Inclus în orice site</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INCLUDED.map((x) => (
            <button
              key={x.key}
              onClick={() => setInfo(x.info)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/75 transition hover:border-brand-magenta/50 hover:text-white"
            >
              <Check className="h-3 w-3 text-brand-magenta" />
              {x.name}
              <InfoIcon className="h-3 w-3 text-white/40" />
            </button>
          ))}
        </div>
      </div>

      {/* opțiunile */}
      <p className="mt-5 font-jmono text-[10px] uppercase tracking-[0.22em] text-white/50">Opțiuni la alegere</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const on = !!opts[o.key];
          const v = optionPrice(o, type, opts);
          return (
            <div
              key={o.key}
              role="checkbox"
              aria-checked={on}
              tabIndex={0}
              onClick={() => setOpts((s) => ({ ...s, [o.key]: !s[o.key] }))}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setOpts((s) => ({ ...s, [o.key]: !s[o.key] }));
                }
              }}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${o.key === "admin" ? "sm:col-span-2" : ""} ${
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
                {v === 0 ? "inclus" : `+${v} ${t.cur}${o.monthly ? "/lună" : ""}`}
              </span>
              {ADDON_INFO[o.key] ? (
                <button
                  type="button"
                  aria-label={`Ce înseamnă: ${o.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfo(ADDON_INFO[o.key]);
                  }}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/50 transition hover:border-brand-magenta/60 hover:text-white"
                >
                  <InfoIcon className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* sugestie: Site Start încărcat cu opțiuni ajunge aproape de Site Custom */}
      {type === "start" && once >= 2300 ? (
        <div className="mt-5 rounded-xl border border-brand-magenta/40 bg-brand-magenta/[0.07] p-4">
          <p className="text-[13.5px] leading-relaxed text-white/85">
            {once < 3500 ? (
              <>
                Mai adaugi doar <b className="text-text">{(3500 - once).toLocaleString("ro-RO")} lei</b> și iei{" "}
                <b className="text-text">Site Custom</b>: design creat de la zero, până la 10 pagini, panou propriu și asistent AI inclus.
              </>
            ) : (
              <>
                Ai ajuns la prețul <b className="text-text">Site Custom</b> (3.500 lei), care îți dă în plus design creat de la zero,
                până la 10 pagini, panou propriu și asistent AI inclus.
              </>
            )}
          </p>
          <button
            onClick={() => {
              setType("prezentare");
              setOpts({});
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-magenta/60 px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-brand-magenta/15"
          >
            Vezi Site Custom
          </button>
        </div>
      ) : null}

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
      <p className="mt-3 text-[12px] leading-relaxed text-white/60">
        Găzduirea și domeniul sunt incluse în administrare, de la 100 lei/lună, plătită lunar de la lansare.
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-white/40">
        Prețul final depinde de cerințele exacte — răspundem cu oferta personalizată în aceeași zi, gratuit.
      </p>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("imperial:open-chat"))}
        className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-brand-magenta hover:underline"
      >
        <InfoIcon className="h-4 w-4" />
        Ai o întrebare despre prețuri sau opțiuni? Întreabă asistentul
      </button>
      <InfoModal info={info} onClose={() => setInfo(null)} />
    </div>
  );
}
