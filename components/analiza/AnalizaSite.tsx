"use client";

/**
 * „Ai nevoie de un site? Află în 2 minute" — test în 4 pași care se termină cu o
 * analiză personalizată (domeniu + oraș) și pachetul recomandat, cu preț.
 * Calculul de rentabilitate folosește valoarea medie a unui client dată de vizitator.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Download, Loader2, Mail, MessageCircle, Search, Zap } from "lucide-react";
import { DOMENII, PREZENTA, type Prezenta } from "@/lib/analiza-domenii";
import { SITE_START_ADDONS } from "@/lib/site-start-addons";
import { SHOP_ADDONS, SHOP_BASE } from "@/lib/shop-addons";
import { siteConfig } from "@/lib/site";
import { reparatiiNecesare, REPARATIE_PLAFON, type SiteCheck } from "@/lib/site-check";
import { raportHtml, sanitizeRaport } from "@/lib/analiza-raport";

const STEPS = ["Domeniul", "Firma", "Clienții", "Prezența online"] as const;

type AiResult = {
  gasit: string;
  intro: string;
  beneficii: string[];
  crestere: string[];
  concluzie: string;
  concurenta?: { nume: string; observatie: string }[];
  puncteForte?: string[];
  deImbunatatit?: string[];
  plan30?: string[];
};

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
  // Site-ul existent: îl verificăm cu fapte măsurate și decidem îmbunătățire sau refacere
  const [siteUrl, setSiteUrl] = useState("");
  const [siteCheck, setSiteCheck] = useState<SiteCheck | null>(null);
  const areSiteAles = prezenta === "site-bun" || prezenta === "site-vechi";
  // Raportul: PDF descărcat sau trimis pe email (cu reamintiri, doar dacă le cere)
  const [emailRaport, setEmailRaport] = useState("");
  const [reamintiri, setReamintiri] = useState(false);
  const [trimis, setTrimis] = useState<"idle" | "busy" | "ok" | string>("idle");

  const dom = DOMENII.find((d) => d.key === domKey);
  const done = step === 4;

  // Are deja un site bun: nu-i recomandăm alt site, ci să-l facem găsit (AI, presă, asistent)
  const areSite =
    (prezenta === "site-bun" && siteCheck?.verdict !== "refacere") ||
    (prezenta === "site-vechi" && siteCheck?.verdict === "imbunatatire");
  const rezultat = useMemo(() => {
    if (!dom) return null;
    // are site bun, dar verificarea a găsit probleme: reparații, plătite după ce le facem
    const reparatii = areSite && siteCheck?.reachable ? reparatiiNecesare(siteCheck) : [];
    if (reparatii.length) {
      const suma = reparatii.reduce((t, r) => t + r.price, 0);
      const total = Math.min(suma, REPARATIE_PLAFON);
      const clientiPtSite = Math.max(1, Math.ceil(total / Math.max(1, valoare)));
      return { base: 0, pachet: suma > REPARATIE_PLAFON ? `Reparație completă (plafon ${lei(REPARATIE_PLAFON)})` : "Reparațiile site-ului tău", addons: reparatii, total, clientiPtSite, reparatii: true };
    }
    if (areSite) {
      const addons = SITE_START_ADDONS.filter((a) => ["geo", "ai", "presa"].includes(a.key));
      const total = addons.reduce((s, a) => s + a.price, 0);
      const clientiPtSite = Math.max(1, Math.ceil(total / Math.max(1, valoare)));
      return { base: 0, pachet: "Creștere pentru site-ul tău", addons, total, clientiPtSite, reparatii: false };
    }
    const base = dom.custom ? SHOP_BASE : 1500;
    const pachet = dom.custom ? "Magazin online" : areSiteAles ? "Site Start (refacerea site-ului)" : "Site Start";
    const addons = (dom.custom ? SHOP_ADDONS : SITE_START_ADDONS).filter((a) => dom.addons.includes(a.key) && !a.onlyOnPage);
    const total = base + addons.reduce((s, a) => s + a.price, 0);
    const clientiPtSite = Math.max(1, Math.ceil(total / Math.max(1, valoare)));
    return { base, pachet, addons, total, clientiPtSite, reparatii: false };
  }, [dom, valoare, areSite, areSiteAles, siteCheck]);

  useEffect(() => {
    if (step !== 4 || !dom) return;
    let cancelled = false;
    setAi(null);
    setSiteCheck(null);
    setAiLoading(true);
    (async () => {
      let check: SiteCheck | null = null;
      if (areSiteAles && siteUrl.trim()) {
        check = await fetch("/api/analiza/site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: siteUrl }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (cancelled) return;
        setSiteCheck(check);
      }
      const r = await fetch("/api/analiza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firma,
          domeniu: dom.key,
          oras,
          valoare,
          prezenta,
          site: check?.reachable
            ? `Site-ul lui (${check.url}) verificat acum: ${check.checks.map((c) => `${c.label}: ${c.ok ? "da" : "nu"} (${c.detail})`).join("; ")}${check.tech ? `; făcut pe ${check.tech}` : ""}. Verdict: ${check.verdict === "refacere" ? "REFACERE pe tehnologii noi" : "ÎMBUNĂTĂȚIRE a site-ului existent"} — ${check.reasons.join("; ")}.\nCe scrie pe site:\n${check.continut ?? ""}`
            : undefined,
        }),
      })
        .then((x) => (x.ok ? x.json() : null))
        .catch(() => null);
      if (!cancelled && r && !r.error) setAi(r);
      if (!cancelled) setAiLoading(false);
    })();
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
  const ofertaHref =
    dom && rezultat
      ? areSite
        ? `/brief?sursa=analiza&domeniu=${dom.key}&oras=${encodeURIComponent(oras)}`
        : `/estimare?tip=${dom.custom ? "magazin" : "start"}&optiuni=${rezultat.addons.map((a) => a.key).join(",")}&domeniu=${dom.key}`
      : "/estimare";

  // Datele raportului — aceleași pentru PDF și email
  const raportData = () =>
    dom && rezultat
      ? {
          firma,
          domeniu: dom.name,
          oras,
          prezenta: PREZENTA.find((p) => p.key === prezenta)?.label ?? "",
          gasit: ai?.gasit,
          intro: ai?.intro,
          beneficii: ai?.beneficii?.length ? ai.beneficii : dom.benefits,
          crestere: ai?.crestere ?? [],
          concluzie: ai?.concluzie,
          recomandare: rezultat.reparatii
            ? "Îți recomandăm să-ți reparăm site-ul — nu e nevoie de unul nou. Plătești după ce reparăm și îți arătăm raportul înainte / după."
            : areSite
            ? "Îți recomandăm să-ți faci site-ul mai ușor de găsit — nu un site nou."
            : areSiteAles
              ? "Îți recomandăm să-ți refaci site-ul de la zero, personalizat, pe tehnologii de ultimă generație folosite de YouTube și Netflix: rapid, perfect pe telefon și ușor de găsit pe Google."
              : `Îți recomandăm să-ți faci un site pentru ${firma || "afacerea ta"}.`,
          concurenta: ai?.concurenta ?? [],
          puncteForte: ai?.puncteForte ?? [],
          deImbunatatit: ai?.deImbunatatit ?? [],
          plan30: ai?.plan30 ?? [],
          site: siteCheck?.reachable
            ? { url: siteCheck.url, tech: siteCheck.tech, checks: siteCheck.checks, verdict: siteCheck.verdict, reasons: siteCheck.reasons }
            : null,
          pachet: rezultat.base ? `${rezultat.pachet} — ${lei(rezultat.base)}` : rezultat.pachet,
          optiuni: rezultat.addons.map((a) => ({ name: a.name, price: a.price })),
          total: rezultat.total,
          ofertaUrl: ofertaHref,
        }
      : null;

  const descarca = () => {
    const d = sanitizeRaport(raportData());
    if (!d) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Analiza ${d.firma || "afacerii tale"} — Imperial Media</title><style>*{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:12mm}</style></head><body style="margin:0;">${raportHtml(d)}</body></html>`
    );
    w.document.close();
    w.focus();
    w.print();
  };

  const trimitePeEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaport.trim())) {
      setTrimis("Scrie o adresă de email validă.");
      return;
    }
    setTrimis("busy");
    const r = await fetch("/api/analiza/trimite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailRaport.trim(), reamintiri, raport: raportData() }),
    }).catch(() => null);
    const j = await r?.json().catch(() => null);
    setTrimis(r?.ok ? "ok" : j?.error ?? "Nu am putut trimite. Încearcă din nou.");
  };

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
              {areSiteAles ? (
                <div className="mt-5">
                  <label htmlFor="analiza-site-url" className="text-[13px] font-semibold text-white/85">
                    Adresa site-ului tău — îl verificăm acum (opțional)
                  </label>
                  <input
                    id="analiza-site-url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="ex: firma-ta.ro"
                    inputMode="url"
                    className="input mt-2 rounded-2xl"
                  />
                  <p className="mt-1.5 text-[12px] text-white/50">
                    Măsurăm viteza, versiunea de telefon, ce vede Google și pe ce e construit — și îți spunem dacă merită îmbunătățit sau refăcut.
                  </p>
                </div>
              ) : null}
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
                  {areSiteAles && siteUrl.trim()
                    ? "Verificăm site-ul tău (viteză, telefon, Google) — durează până la un minut..."
                    : firma
                      ? `Căutăm „${firma}” pe internet și pregătim analiza...`
                      : "Pregătim analiza personalizată..."}
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
              {siteCheck ? (
                <div className="mt-4 rounded-xl border border-white/[0.1] bg-white/[0.03] p-4">
                  <p className="text-[14px] font-semibold text-text">
                    Ce am găsit pe {siteCheck.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    {siteCheck.tech ? <span className="font-normal text-white/60"> · făcut pe {siteCheck.tech}</span> : null}
                  </p>
                  {siteCheck.reachable ? (
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {siteCheck.checks.map((c) => (
                        <li key={c.key} className="flex gap-2 text-[13px] leading-snug text-white/75">
                          <span className={c.ok ? "text-green-400" : "text-red-400"}>{c.ok ? "✓" : "✗"}</span>
                          <span>
                            <b className="font-medium text-white/90">{c.label}</b> — {c.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div
                    className={`mt-4 rounded-lg p-3 text-[14px] leading-relaxed ${
                      siteCheck.verdict === "refacere"
                        ? "border border-brand-orange/40 bg-brand-orange/[0.08]"
                        : "border border-green-500/30 bg-green-500/[0.06]"
                    }`}
                  >
                    <b className="text-text">
                      {siteCheck.verdict === "refacere"
                        ? "Verdict: merită refăcut de la zero, personalizat, pe tehnologii de ultimă generație folosite de YouTube și Netflix."
                        : siteCheck.verdict === "imbunatatire"
                          ? "Verdict: îl îmbunătățim, nu e nevoie să-l refaci."
                          : "Nu am putut verifica site-ul acum."}
                    </b>{" "}
                    <span className="text-white/75">{siteCheck.reasons.join("; ")}.</span>
                  </div>
                </div>
              ) : null}
              {ai?.intro ? <p className="mt-4 text-[15px] leading-relaxed text-white/80">{ai.intro}</p> : null}
              {ai?.puncteForte?.length || ai?.deImbunatatit?.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {ai?.puncteForte?.length ? (
                    <div className="rounded-xl border border-green-500/25 bg-green-500/[0.05] p-4">
                      <p className="text-[13px] font-semibold text-green-300">Ce faci deja bine</p>
                      <ul className="mt-2 space-y-1.5">
                        {ai.puncteForte.map((x) => (
                          <li key={x} className="flex gap-2 text-[13px] leading-snug text-white/75"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />{x}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {ai?.deImbunatatit?.length ? (
                    <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/[0.05] p-4">
                      <p className="text-[13px] font-semibold text-brand-orange">Ce poți îmbunătăți</p>
                      <ul className="mt-2 space-y-1.5">
                        {ai.deImbunatatit.map((x) => (
                          <li key={x} className="flex gap-2 text-[13px] leading-snug text-white/75"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />{x}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {ai?.concurenta?.length ? (
                <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[14px] font-semibold text-text">Cine apare pe Google în {oras} în domeniul tău</p>
                  <ul className="mt-2 space-y-2">
                    {ai.concurenta.map((c) => (
                      <li key={c.nume} className="text-[13px] leading-snug text-white/75">
                        <b className="text-white/90">{c.nume}</b> — {c.observatie}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-text sm:text-3xl">
                {areSite ? "Investiția se plătește din " : "Site-ul se plătește din "}
                <span className="text-gradient">
                  {rezultat.clientiPtSite} {rezultat.clientiPtSite === 1 ? "client" : "clienți"}
                </span>
                .
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
                La o valoare medie de {lei(valoare)} pe {dom.clientLabel}, investiția de {lei(rezultat.total)} se
                recuperează din primii {rezultat.clientiPtSite} clienți noi{areSite ? " care te găsesc" : " aduși de site"}. Tot ce vine după e câștig.
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
                  <b className="text-text">{areSite ? "Pasul următor: " : "Unde pierzi acum clienți: "}</b>
                  {PREZENTA.find((p) => p.key === prezenta)!.gap}
                </div>
              ) : null}

              <h4 className="mt-8 font-display text-lg font-bold text-text">
                {areSite ? `Ce i-ar aduce în plus site-ului tău, în ${oras}:` : `Ce ți-ar aduce un site, pentru o afacere ca a ta din ${oras}:`}
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

              {ai?.plan30?.length ? (
                <>
                  <h4 className="mt-8 font-display text-lg font-bold text-text">Planul tău pentru primele 30 de zile:</h4>
                  <ol className="mt-4 space-y-3">
                    {ai.plan30.map((x, i) => (
                      <li key={x} className="flex gap-3 text-[14px] leading-relaxed text-white/75">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-brand-orange font-jmono text-[11px] font-bold text-brand-orange">{i + 1}</span>
                        {x}
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}

              <div className="mt-8 rounded-2xl border border-brand-magenta/40 bg-gradient-to-b from-brand-magenta/[0.08] to-transparent p-6">
                <span className="font-jmono text-[10px] uppercase tracking-[0.25em] text-white/55">Recomandarea noastră</span>
                <p className="mt-2 font-display text-lg font-bold leading-snug text-text">
                  {rezultat.reparatii
                    ? "Îți recomandăm să-ți reparăm site-ul — nu e nevoie de unul nou."
                    : areSite
                    ? "Îți recomandăm să-ți faci site-ul mai ușor de găsit — nu un site nou."
                    : areSiteAles
                      ? "Îți recomandăm să-ți refaci site-ul de la zero, personalizat, pe tehnologii de ultimă generație folosite de YouTube și Netflix: rapid, perfect pe telefon și ușor de găsit pe Google."
                      : `Îți recomandăm să-ți faci un site pentru ${firma || "afacerea ta"}.`}
                </p>
                {ai?.concluzie ? <p className="mt-2 text-[14px] leading-relaxed text-white/75">{ai.concluzie}</p> : null}
                <p className="mt-2 font-display text-xl font-bold text-text">
                  {rezultat.pachet}
                  {rezultat.base ? ` — ${lei(rezultat.base)}` : ""}
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
                {rezultat.reparatii ? (
                  <p className="mt-3 text-[13px] leading-relaxed text-white/70">
                    <b className="text-text">Plătești după</b> ce reparăm totul și îți arătăm raportul „înainte / după”, cu scorul măsurat din nou.
                    {rezultat.total >= REPARATIE_PLAFON ? ` Pentru ${lei(1500 - REPARATIE_PLAFON)} în plus ai un site nou, construit de la zero (Site Start, ${lei(1500)}).` : ""}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={ofertaHref}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[14px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
                  >
                    <Zap className="h-4 w-4" />
                    Primește oferta exactă
                  </Link>
                  {!areSite && !dom.custom ? (
                    <Link
                      href="/site-start"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[13.5px] font-medium text-white/85 transition hover:border-brand-orange/70"
                    >
                      Vezi ce include Site Start
                    </Link>
                  ) : null}
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

              {/* păstrează analiza: PDF sau email */}
              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <p className="text-[14px] font-semibold text-text">Păstrează analiza</p>
                <button
                  type="button"
                  onClick={descarca}
                  disabled={aiLoading}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] font-medium text-white/90 transition hover:border-brand-orange/60 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Descarcă analiza (PDF)
                </button>
                {trimis === "ok" ? (
                  <p className="mt-4 text-[14px] text-green-400">Gata — analiza e în emailul tău.</p>
                ) : (
                  <div className="mt-4">
                    <label htmlFor="analiza-email" className="text-[13px] text-white/70">
                      Sau primește-o pe email:
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <input
                        id="analiza-email"
                        type="email"
                        value={emailRaport}
                        onChange={(e) => setEmailRaport(e.target.value)}
                        placeholder="emailul tău"
                        className="input min-w-[200px] flex-1 rounded-full"
                      />
                      <button
                        type="button"
                        onClick={trimitePeEmail}
                        disabled={trimis === "busy" || aiLoading}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-60"
                      >
                        {trimis === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        Trimite-mi analiza
                      </button>
                    </div>
                    <label className="mt-3 flex cursor-pointer items-start gap-2 text-[12.5px] leading-snug text-white/60">
                      <input type="checkbox" checked={reamintiri} onChange={(e) => setReamintiri(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-500" />
                      Vreau și două reamintiri scurte pe email (după 3 și 14 zile). Mă pot dezabona oricând.
                    </label>
                    {trimis !== "idle" && trimis !== "busy" ? <p className="mt-2 text-[13px] text-red-400">{trimis}</p> : null}
                  </div>
                )}
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
