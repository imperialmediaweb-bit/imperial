"use client";

/**
 * „Ai nevoie de un site? Află în 2 minute" — test în 4 pași care se termină cu o
 * analiză personalizată (domeniu + oraș) și pachetul recomandat, cu preț.
 * Calculul de rentabilitate folosește valoarea medie a unui client dată de vizitator.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, Search, Zap } from "lucide-react";
import { DOMENII, PREZENTA, type Prezenta } from "@/lib/analiza-domenii";
import { SITE_START_ADDONS } from "@/lib/site-start-addons";
import { SHOP_ADDONS, SHOP_BASE } from "@/lib/shop-addons";
import { siteConfig } from "@/lib/site";

const STEPS = ["Domeniul", "Firma", "Clienții", "Prezența online"] as const;

type AiResult = { gasit: string; intro: string; beneficii: string[]; crestere: string[]; concluzie: string };

function lei(n: number) {
  return `${n.toLocaleString("ro-RO")} lei`;
}

export function AnalizaSite() {
  const [step, setStep] = useState(0);
  const [domKey, setDomKey] = useState<string | null>(null);
  const [oras, setOras] = useState("Botoșani");
  const [firma, setFirma] = useState("");
  const [ai, setAi] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [valoare, setValoare] = useState(150);
  const [prezenta, setPrezenta] = useState<Prezenta | null>(null);

  const dom = DOMENII.find((d) => d.key === domKey);
  const done = step === 4;

  const rezultat = useMemo(() => {
    if (!dom) return null;
    const base = dom.custom ? SHOP_BASE : 1500;
    const pachet = dom.custom ? "Magazin online" : "Site Start";
    const addons = (dom.custom ? SHOP_ADDONS : SITE_START_ADDONS).filter((a) => dom.addons.includes(a.key));
    const total = base + addons.reduce((s, a) => s + a.price, 0);
    const clientiPtSite = Math.max(1, Math.ceil(total / Math.max(1, valoare)));
    return { base, pachet, addons, total, clientiPtSite };
  }, [dom, valoare]);

  useEffect(() => {
    if (step !== 4 || !dom || !rezultat) return;
    let cancelled = false;
    setAi(null);
    setAiLoading(true);
    fetch("/api/analiza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firma,
        domeniu: dom.key,
        oras,
        valoare,
        prezenta,
        pachet: rezultat.pachet + (rezultat.addons.length ? " + " + rezultat.addons.map((a) => a.name).join(", ") : ""),
        total: rezultat.total,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j && !j.error) setAi(j);
      })
      .catch(() => {})
      .finally(() => !cancelled && setAiLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canNext =
    (step === 0 && !!dom) || (step === 1 && oras.trim().length > 1) || step === 2 || (step === 3 && !!prezenta);

  const next = () => {
    if (step === 0 && dom) setValoare(dom.clientValue);
    setStep((s) => Math.min(4, s + 1));
  };

  const waText = dom && rezultat
    ? encodeURIComponent(
        `Bună! Am făcut analiza pe imperial-media.ro: ${firma ? firma + ", " : ""}${dom.name}, ${oras}. Pachet recomandat: ${rezultat.pachet}` +
          (rezultat.addons.length ? ` + ${rezultat.addons.map((a) => a.name.toLowerCase()).join(", ")}` : "") +
          ` — ${lei(rezultat.total)}. Aș vrea o ofertă.`
      )
    : "";
  const phone = (siteConfig as { phone?: string }).phone?.replace(/[^0-9]/g, "") ?? "";
  const waHref = phone ? `https://wa.me/${phone.startsWith("0") ? "4" + phone : phone}?text=${waText}` : "/contact";

  return (
    <div className="pointer-events-auto rounded-2xl border border-white/[0.08] bg-[#09080e]/90 p-6 backdrop-blur-md sm:p-9">
      {/* progres */}
      {!done ? (
        <div className="mb-8">
          <div className="flex items-center justify-between font-jmono text-[10px] uppercase tracking-[0.25em] text-white/50">
            <span>
              Pasul {step + 1} din {STEPS.length} — {STEPS[step]}
            </span>
            <span>~2 minute</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/[0.07]">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-brand-orange via-brand-magenta to-brand-purple transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 ? (
            <>
              <h3 className="font-display text-xl font-bold text-text sm:text-2xl">Cu ce se ocupă afacerea ta?</h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DOMENII.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDomKey(d.key)}
                    className={`rounded-xl border p-4 text-left transition ${
                      domKey === d.key
                        ? "border-brand-magenta/70 bg-brand-magenta/[0.1]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <span className="text-2xl">{d.emoji}</span>
                    <p className="mt-2 text-[13.5px] font-semibold leading-snug text-white/90">{d.name}</p>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h3 className="font-display text-xl font-bold text-text sm:text-2xl">Cum se numește firma și unde lucrezi?</h3>
              <p className="mt-2 text-sm text-white/60">
                Cu numele firmei, verificăm ce găsește un client despre tine pe internet. E opțional.
              </p>
              <input
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                placeholder="Numele firmei (opțional), ex. Salon Bella"
                className="mt-6 w-full rounded-xl border border-white/12 bg-white/[0.04] px-5 py-4 text-lg text-text outline-none transition focus:border-brand-magenta"
              />
              <input
                value={oras}
                onChange={(e) => setOras(e.target.value)}
                placeholder="Orașul, ex. Botoșani"
                className="mt-3 w-full rounded-xl border border-white/12 bg-white/[0.04] px-5 py-4 text-lg text-text outline-none transition focus:border-brand-magenta"
              />
            </>
          ) : null}

          {step === 2 && dom ? (
            <>
              <h3 className="font-display text-xl font-bold text-text sm:text-2xl">
                Cât lasă, în medie, un client la tine?
              </h3>
              <p className="mt-2 text-sm text-white/60">
                O estimare e suficientă — valoarea medie a unei {dom.clientLabel}.
              </p>
              <div className="mt-8 text-center font-display text-4xl font-extrabold text-gradient">{lei(valoare)}</div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={valoare}
                onChange={(e) => setValoare(Number(e.target.value))}
                className="mt-6 w-full accent-[#FF2E9A]"
              />
              <div className="mt-1 flex justify-between font-jmono text-[10px] text-white/40">
                <span>50 lei</span>
                <span>5.000 lei</span>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h3 className="font-display text-xl font-bold text-text sm:text-2xl">Cum te găsesc clienții acum?</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PREZENTA.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPrezenta(p.key)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                      prezenta === p.key
                        ? "border-brand-magenta/70 bg-brand-magenta/[0.1]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        prezenta === p.key ? "border-transparent bg-orange-gradient" : "border-white/25"
                      }`}
                    >
                      {prezenta === p.key ? <Check className="h-3 w-3 text-white" /> : null}
                    </span>
                    <span className="text-[14px] font-medium text-white/85">{p.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {done && dom && rezultat ? (
            <div>
              <span className="font-jmono text-[10px] uppercase tracking-[0.3em] text-brand-magenta">
                Analiza ta — {firma ? `${firma}, ` : ""}{dom.name}, {oras}
              </span>
              {aiLoading ? (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-[14px] text-white/70">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-magenta" />
                  {firma ? `Căutăm „${firma}” pe internet și pregătim analiza...` : "Pregătim analiza personalizată..."}
                </div>
              ) : null}
              {ai?.gasit ? (
                <div className="mt-4 flex gap-3 rounded-xl border border-brand-purple/30 bg-brand-purple/[0.07] p-4 text-[14px] leading-relaxed text-white/85">
                  <Search className="mt-0.5 h-4 w-4 shrink-0 text-brand-glow" />
                  <span>
                    <b className="text-text">Ce am găsit despre tine online: </b>
                    {ai.gasit}
                  </span>
                </div>
              ) : null}
              {ai?.intro ? <p className="mt-4 text-[15px] leading-relaxed text-white/80">{ai.intro}</p> : null}
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-text sm:text-3xl">
                Site-ul se plătește din{" "}
                <span className="text-gradient">
                  {rezultat.clientiPtSite} {rezultat.clientiPtSite === 1 ? "client" : "clienți"}
                </span>
                .
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
                La o valoare medie de {lei(valoare)} pe {dom.clientLabel}, investiția de {lei(rezultat.total)} se
                recuperează din primii {rezultat.clientiPtSite} clienți noi aduși de site. Tot ce vine după e câștig.
              </p>

              <h4 className="mt-8 font-display text-lg font-bold text-text">Cât ar putea crește afacerea:</h4>
              <p className="mt-1 text-[12.5px] text-white/50">
                Scenarii calculate din valoarea ta medie pe client ({lei(valoare)}). Nu sunt promisiuni, ci un mod de a vedea ce înseamnă fiecare client nou adus de site.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { n: 2, t: "Prudent" },
                  { n: 5, t: "Realist" },
                  { n: 10, t: "Activ, cu promovare" },
                ].map((sc) => (
                  <div key={sc.n} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <p className="font-jmono text-[10px] uppercase tracking-[0.2em] text-white/50">{sc.t}</p>
                    <p className="mt-2 text-[13px] text-white/70">
                      +{sc.n} clienți noi / lună
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-text">+{lei(sc.n * valoare)}</p>
                    <p className="text-[12px] text-white/50">pe lună · {lei(sc.n * valoare * 12)} pe an</p>
                  </div>
                ))}
              </div>

              {prezenta ? (
                <div className="mt-6 rounded-xl border border-brand-orange/25 bg-brand-orange/[0.06] p-4 text-[14px] leading-relaxed text-white/80">
                  <b className="text-text">Unde pierzi acum clienți: </b>
                  {PREZENTA.find((p) => p.key === prezenta)!.gap}
                </div>
              ) : null}

              <h4 className="mt-8 font-display text-lg font-bold text-text">
                Ce ți-ar aduce un site, pentru o afacere ca a ta din {oras}:
              </h4>
              <ul className="mt-4 space-y-3">
                {(ai?.beneficii?.length ? ai.beneficii : dom.benefits).map((b) => (
                  <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-white/75">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand-magenta" />
                    {b}
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 font-display text-lg font-bold text-text">
                Cum te face cunoscut în {oras}:
              </h4>
              <ol className="mt-4 space-y-3">
                {(ai?.crestere?.length
                  ? ai.crestere.map((d) => ["", d])
                  : [
                      ["Google", `Site-ul apare când cineva caută ce oferi tu în ${oras} — clienți noi care nu te cunoșteau.`],
                      ["Google Maps", "Profilul complet, cu poze și recenzii, te pune pe hartă în fața concurenței."],
                      ["Presă", "Un articol despre firma ta în Botoșani Expres, inclus în pachet, îți aduce vizibilitate și încredere."],
                      ["Recenzii", "Clienții mulțumiți lasă recenzii, iar fiecare recenzie aduce alți clienți."],
                    ]
                ).map(([t, d], i) => (
                  <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-white/75">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-gradient font-jmono text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>
                      {t ? <b className="text-text">{t}. </b> : null}
                      {d}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-2xl border border-brand-magenta/40 bg-gradient-to-b from-brand-magenta/[0.08] to-transparent p-6">
                <span className="font-jmono text-[10px] uppercase tracking-[0.25em] text-white/55">Recomandarea noastră</span>
                {ai?.concluzie ? <p className="mt-2 text-[14px] leading-relaxed text-white/75">{ai.concluzie}</p> : null}
                <p className="mt-2 font-display text-xl font-bold text-text">
                  {rezultat.pachet} — {lei(rezultat.base)}
                </p>
                {rezultat.addons.length ? (
                  <ul className="mt-3 space-y-1.5 text-[13.5px] text-white/70">
                    {rezultat.addons.map((a) => (
                      <li key={a.key} className="flex justify-between gap-4">
                        <span>+ {a.name}</span>
                        <span className="font-jmono text-white/55">{lei(a.price)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-4 flex items-baseline justify-between border-t border-white/[0.08] pt-4">
                  <span className="text-sm text-white/60">Total orientativ</span>
                  <span className="font-display text-3xl font-extrabold text-gradient">{lei(rezultat.total)}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/brief?sursa=analiza&domeniu=${dom.key}&oras=${encodeURIComponent(oras)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[14px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
                  >
                    <Zap className="h-4 w-4" />
                    Primește oferta exactă
                  </Link>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[13.5px] font-medium text-white/85 transition hover:border-[#25D366]/70"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    Scrie-ne pe WhatsApp
                  </a>
                </div>
              </div>
              <button
                onClick={() => {
                  setStep(0);
                  setPrezenta(null);
                }}
                className="mt-6 text-xs text-white/45 underline-offset-4 hover:text-white/70 hover:underline"
              >
                Refă analiza
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {!done ? (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[14px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {step === 3 ? "Vezi analiza" : "Continuă"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
