"use client";

/**
 * EXPERIENȚA IMPERIAL — homepage-ul ca o călătorie (igloo.inc × basement.studio,
 * în identitatea Imperial): canvas 3D persistent în spate, capitole HTML care se
 * lipesc (sticky) peste el. Scroll-ul conduce camera; breakpoint-urile p→z se
 * măsoară din DOM ca scenele 3D să fie mereu sub capitolul potrivit.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, ArrowRight, ArrowUpRight } from "lucide-react";
import { NumberTicker } from "../effects/NumberTicker";
import { Estimator } from "./Estimator";
import { Quote, ChevronDown, ScanLine, Gauge, Search, ShieldCheck } from "lucide-react";
import type { CameraMap } from "./World";

const World = dynamic(() => import("./World").then((m) => m.World), { ssr: false });

/* adâncimile-țintă ale camerei la STARTUL fiecărui capitol (vezi World.tsx) */
const Z_STARTS = [8, -24, -70, -118, -138, -162, -182, -200];
const Z_END = -206;

const mono = "font-jmono text-[10px] uppercase tracking-[0.3em] text-white/60";

/* panou de sticlă întunecată sub blocurile de text — efectele rămân vizibile în jur */
const panel =
  "rounded-2xl border border-white/[0.06] bg-[#050507]/70 p-7 backdrop-blur-md sm:p-9";
/* scrim radial pentru textul centrat (intro/final) */
const scrim =
  "pointer-events-none absolute -inset-x-28 -inset-y-14 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.78)_0%,rgba(5,5,7,0.35)_55%,transparent_78%)]";

function Chapter({
  idx,
  height,
  children,
  refCb,
}: {
  idx: string;
  height: string;
  children: React.ReactNode;
  refCb: (el: HTMLElement | null) => void;
}) {
  return (
    <section ref={refCb} className={`relative ${height}`} data-chapter={idx}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {children}
      </div>
    </section>
  );
}

const fade = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-15% 0px -15% 0px" },
};

export function Experience() {
  const progressRef = useRef(0);
  const mapRef = useRef<CameraMap>({
    ps: [0, 0.13, 0.28, 0.42, 0.53, 0.66, 0.78, 0.9, 1],
    zs: [...Z_STARTS, Z_END],
  });
  const sections = useRef<(HTMLElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const ps = sections.current
        .filter(Boolean)
        .map((el) => Math.min(1, (el as HTMLElement).offsetTop / Math.max(1, total)));
      mapRef.current = { ps: [...ps, 1], zs: [...Z_STARTS, Z_END] };
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / Math.max(1, total)));
    };
    measure();
    onScroll();
    setReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const bind = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };

  return (
    <div className="relative bg-[#050507] text-text">
      {ready && <World progressRef={progressRef} mapRef={mapRef} />}

      {/* vignetă globală pentru lizibilitate */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,7,0.55)_100%)]" />

      <div className="relative z-10 [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]">
        {/* ───── 01 INTRO ───── */}
        <Chapter idx="intro" height="h-[160vh]" refCb={bind(0)}>
          <div className="container-app relative flex flex-col items-center text-center">
            <div className={scrim} />
            <motion.div {...fade} transition={{ duration: 0.9 }}>
              <Image
                src="/brand/logo-round-200.png"
                alt="Imperial Media"
                width={200}
                height={200}
                unoptimized
                priority
                className="mx-auto h-32 w-32 rounded-full drop-shadow-[0_0_45px_rgba(255,46,154,0.55)] sm:h-40 sm:w-40 animate-[pulse_4s_ease-in-out_infinite]"
              />
            </motion.div>
            <motion.h1
              {...fade}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-10 font-display text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-tight tracking-tight"
            >
              Tu ai ideea.{" "}
              <span className="font-serifd italic text-gradient">Noi o aducem la viață.</span>
            </motion.h1>
            <motion.p
              {...fade}
              transition={{ duration: 0.9, delay: 0.28 }}
              className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base"
            >
              Studio de web design & development. Derulează — site-ul ăsta e chiar demonstrația.
            </motion.p>
            <motion.div {...fade} transition={{ duration: 0.9, delay: 0.4 }} className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/brief"
                className="pointer-events-auto group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04]"
              >
                <Zap className="h-5 w-5" />
                Primește estimare gratuită
              </Link>
              <Link
                href="/site-start"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text transition hover:border-brand-orange/70"
              >
                Site Start — 1.500 lei
              </Link>
            </motion.div>
            <motion.div {...fade} transition={{ duration: 0.9, delay: 0.5 }} className="mt-12 flex items-start gap-10 sm:gap-14">
              {[
                { value: 384, suffix: "+", label: "proiecte" },
                { value: 200, suffix: "+", label: "clienți" },
                { value: 50, suffix: "", label: "ziare în rețea" },
              ].map((s) => (
                <div key={s.label}>
                  <NumberTicker value={s.value} suffix={s.suffix} className="font-display text-2xl font-extrabold text-text" />
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-subtle">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${mono}`}>scroll — intri în lume ↓</div>
        </Chapter>

        {/* ───── 02 TUNELUL / SERVICII ───── */}
        <Chapter idx="servicii" height="h-[190vh]" refCb={bind(1)}>
          <div className="container-app">
            <div className={`max-w-3xl ${panel}`}>
            <motion.div {...fade} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">01</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-orange to-brand-magenta" />
                <span className={mono}>Servicii</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Tot ce îți trebuie, <span className="font-serifd italic text-gradient">sub un singur acoperiș.</span>
              </h2>
            </motion.div>
            <div className="mt-8">
              {[
                ["01", "Site-uri & aplicații custom", "Next.js — tehnologia Netflix și Nike. De la 3.500 lei.", "/creare-site-web"],
                ["02", "Magazine online", "Plăți cu cardul, AWB automat, facturare. De la 6.000 lei.", "/creare-magazin-online"],
                ["03", "AI & automatizări", "Consultanți AI pe site, fluxuri care lucrează singure.", "/brief"],
                ["04", "Presă — 50 de ziare", "Rețeaua Media Expres: articole reale, în toată România.", "/servicii"],
                ["05", "SEO + vizibilitate AI", "Autoritate în Google și prezență în ChatGPT / Gemini.", "/optimizare-seo"],
                ["06", "Administrare lunară", "De la 100 lei/lună, găzduire și domeniu incluse din anul 2.", "/servicii"],
              ].map(([n, title, text, href], i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
                  <Link
                    href={href}
                    className="pointer-events-auto group flex items-baseline gap-5 border-b border-white/[0.07] py-4 transition hover:border-brand-magenta/40"
                  >
                    <span className="font-jmono text-[11px] text-white/55">{n}</span>
                    <span className="font-display text-lg font-semibold text-text transition group-hover:text-brand-magenta sm:text-xl">
                      {title}
                    </span>
                    <span className="ml-auto hidden max-w-[260px] text-right text-[12.5px] leading-snug text-white/70 sm:block">
                      {text}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-brand-orange" />
                  </Link>
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        </Chapter>

        {/* ───── 03 GALERIA / PROIECTE ───── */}
        <Chapter idx="proiecte" height="h-[190vh]" refCb={bind(2)}>
          <div className="container-app">
            <motion.div {...fade} transition={{ duration: 0.7 }} className={`max-w-md ${panel}`}>
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">02</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-magenta to-brand-purple" />
                <span className={mono}>Proiecte</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Treci prin <span className="font-serifd italic text-gradient">galeria lucrărilor.</span>
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">
                Portalurile din jur sunt proiecte reale, livrate — clinici, agenții, branduri.
                384+ până acum.
              </p>
              <Link
                href="/proiecte"
                className="pointer-events-auto mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-text transition hover:border-brand-magenta/60"
              >
                Vezi toate proiectele
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </Chapter>

        {/* ───── 04 VOCEA CLIENȚILOR ───── */}
        <Chapter idx="voci" height="h-[170vh]" refCb={bind(3)}>
          <div className="container-app">
            <motion.div {...fade} transition={{ duration: 0.7 }} className="max-w-md">
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">03</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-magenta to-brand-glow" />
                <span className={mono}>Clienți</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Vocea <span className="font-serifd italic text-gradient">clienților.</span>
              </h2>
            </motion.div>
            <div className="mt-8 grid max-w-5xl gap-4 lg:grid-cols-3">
              {[
                ["Ionela Ivan Tudose", "Asociația H.A.P.P.Y", "Mulțumim pentru toate lucrurile grozave: programul de rezervare și plata online a meselor calde, website, harta online!"],
                ["Ionuț-Bogdan Cărăușu", "Scut Botoșănean", "Seriozitate și profesionalism. Răspunde cu promptitudine și efectuează lucrări de calitate. Recomand!"],
                ["Botosaneanul.ro", "Ziar & TV", "Au rezolvat în timp record o problemă veche și ne-au ajutat să creștem eficiența întregii activități."],
              ].map(([name, firm, text], i) => (
                <motion.figure
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className={`${panel} !p-6 ${i === 1 ? "lg:translate-y-8" : ""}`}
                >
                  <Quote className="h-5 w-5 text-brand-magenta/70" />
                  <blockquote className="mt-3 text-[13.5px] leading-relaxed text-white/80">
                    „{text}”
                  </blockquote>
                  <figcaption className="mt-4">
                    <div className="font-display text-[13.5px] font-bold text-text">{name}</div>
                    <div className="font-jmono text-[10px] uppercase tracking-[0.18em] text-white/50">{firm}</div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </Chapter>

        {/* ───── 05 FIRUL / PROCES ───── */}
        <Chapter idx="proces" height="h-[160vh]" refCb={bind(4)}>
          <div className="container-app">
            <div className={`max-w-4xl ${panel}`}>
            <motion.div {...fade} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">04</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-purple to-brand-glow" />
                <span className={mono}>Proces</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                De la idee la lansare, <span className="font-serifd italic text-gradient">pe un singur fir.</span>
              </h2>
            </motion.div>
            <div className="mt-10 grid gap-8 sm:grid-cols-4">
              {[
                ["Pas 01", "Consultanță", "Identificăm nevoile și propunem soluția potrivită."],
                ["Pas 02", "Design", "Modele și design personalizat pentru brandul tău."],
                ["Pas 03", "Dezvoltare", "Implementăm și testăm pentru performanță optimă."],
                ["Pas 04", "Lansare & suport", "Lansăm și oferim mentenanță continuă."],
              ].map(([k, t, d], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <span className={mono}>{k}</span>
                  <h3 className="mt-2 font-display text-lg font-bold">{t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{d}</p>
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        </Chapter>

        {/* ───── 06 PACHETE ───── */}
        <Chapter idx="pachete" height="h-[180vh]" refCb={bind(5)}>
          <div className="container-app">
            <motion.div {...fade} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">05</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-orange to-brand-purple" />
                <span className={mono}>Prețuri</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Pachete <span className="font-serifd italic text-gradient">clare.</span>
              </h2>
            </motion.div>
            <div className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                ["Site Start", "1.500 lei", "plată unică", ["5 pagini + blog incluse", "Gata în câteva zile", "Găzduire 1 an inclusă"], "/site-start", false],
                ["Site de prezentare", "3.500 lei", "de la (≈ 699 €), plată unică", ["Pagini nelimitate, design unic", "Panou de administrare propriu", "SEO tehnic din construcție"], "/creare-site-web", true],
                ["Magazin online", "6.000 lei", "de la (≈ 1.200 €), plată unică", ["Plăți cu cardul integrate", "AWB automat la curieri", "Facturare integrată"], "/creare-magazin-online", false],
              ].map(([name, price, per, feats, href, featured], i) => (
                <motion.div
                  key={name as string}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className={`pointer-events-auto relative rounded-2xl border p-6 backdrop-blur-md ${
                    featured
                      ? "border-brand-magenta/50 bg-[#0d0812]/85"
                      : "border-white/10 bg-[#0a090f]/80"
                  }`}
                >
                  {featured ? (
                    <span className="absolute -top-2.5 left-6 rounded-full bg-orange-gradient px-3 py-1 font-jmono text-[8.5px] uppercase tracking-[0.18em] text-white">
                      Cel mai ales
                    </span>
                  ) : null}
                  <h3 className="font-display text-lg font-bold">{name}</h3>
                  <div className="mt-4 font-serifd text-4xl italic text-gradient">{price}</div>
                  <div className="mt-1 text-[11px] text-white/40">{per}</div>
                  <ul className="mt-5 space-y-2">
                    {(feats as string[]).map((f) => (
                      <li key={f} className="flex items-baseline gap-2.5 text-[13px] text-white/70">
                        <span className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-orange-gradient" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href as string}
                    className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold transition ${
                      featured
                        ? "bg-orange-gradient text-white shadow-glow-orange hover:scale-[1.03]"
                        : "border border-white/15 text-text hover:border-brand-orange/60"
                    }`}
                  >
                    {featured ? "Primește ofertă" : "Detalii"}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Chapter>

        {/* ───── 07 ESTIMATOR LIVE ───── */}
        <Chapter idx="estimator" height="h-[190vh]" refCb={bind(6)}>
          <div className="container-app">
            <motion.div {...fade} transition={{ duration: 0.7 }} className="max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">06</span>
                <span className="h-px w-14 bg-gradient-to-r from-brand-magenta to-brand-purple" />
                <span className={mono}>Estimare live</span>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Cât ar costa <span className="font-serifd italic text-gradient">site-ul tău?</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/70">
                Bifează ce îți trebuie și vezi estimarea pe loc.
              </p>
            </motion.div>
            <motion.div {...fade} transition={{ duration: 0.7, delay: 0.15 }} className="mt-7">
              <Estimator />
            </motion.div>
          </div>
        </Chapter>

        {/* ───── 08 FINAL: radiografie + FAQ + presă + CTA ───── */}
        <section ref={bind(7)} data-chapter="final" className="relative">
          <div className="container-app space-y-20 py-24">
            {/* Radiografia afacerii — teaser cu scanner */}
            <motion.div {...fade} transition={{ duration: 0.7 }} className={`${panel} mx-auto grid max-w-4xl items-center gap-8 lg:grid-cols-2`}>
              <div>
                <div className="flex items-center gap-3">
                  <ScanLine className="h-5 w-5 text-brand-magenta" />
                  <span className={mono}>Gratuit — 2 minute</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  Radiografia <span className="font-serifd italic text-gradient">afacerii tale.</span>
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  Îți scanăm prezența online și îți arătăm exact unde pierzi clienți:
                  viteză, Google, securitate, prezență în AI.
                </p>
                <Link
                  href="/service"
                  className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[14px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
                >
                  <ScanLine className="h-4 w-4" />
                  Scanează-ți site-ul gratuit
                </Link>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0a10] p-5">
                <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-brand-magenta/25 to-transparent" />
                {[
                  [Gauge, "Viteză de încărcare", "3.8s — lent, pierzi 40% din vizitatori"],
                  [Search, "Vizibilitate Google", "pagina 4 — clienții nu te găsesc"],
                  [ShieldCheck, "Securitate & SSL", "2 vulnerabilități găsite"],
                ].map(([Icon, t, d]: any, i) => (
                  <div key={t} className={`flex items-start gap-3 py-3 ${i < 2 ? "border-b border-white/[0.06]" : ""}`}>
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                    <div>
                      <div className="text-[13px] font-semibold text-white/90">{t}</div>
                      <div className="text-[12px] text-white/55">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ compact */}
            <div className="mx-auto max-w-3xl">
              <motion.h3 {...fade} transition={{ duration: 0.6 }} className="text-center font-display text-2xl font-bold sm:text-3xl">
                Întrebări <span className="font-serifd italic text-gradient">frecvente.</span>
              </motion.h3>
              <div className="mt-7">
                <MiniFAQ />
              </div>
            </div>

            {/* banda cu rețeaua de presă */}
            <motion.div {...fade} transition={{ duration: 0.6 }} className="relative overflow-hidden border-y border-white/[0.07] py-4">
              <div className="flex w-max animate-marquee gap-10" style={{ animationDuration: "30s" }}>
                {[...Array(2)].flatMap((_, k) =>
                  ["MEDIA EXPRES", "50 DE ZIARE ÎN TOATĂ ROMÂNIA", "ARTICOLE REALE DESPRE FIRMA TA", "BOTOȘĂNEANUL", "PRESĂ LOCALĂ + NAȚIONALĂ", "AUTORITATE ÎN GOOGLE"].map((t, i) => (
                    <span key={`${k}-${i}`} className="flex items-center gap-10 font-jmono text-[11px] uppercase tracking-[0.3em] text-white/50">
                      {t}
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-gradient" />
                    </span>
                  ))
                )}
              </div>
            </motion.div>

            {/* CTA final */}
            <div className="relative py-10 text-center">
              <div className={scrim} />
              <motion.div {...fade} transition={{ duration: 0.8 }}>
                <span className={mono}>Hai să vorbim</span>
                <h2 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">
                  Construim ceva <span className="font-serifd italic text-gradient">memorabil?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-sm text-[14.5px] text-white/75">
                  Răspundem în aceeași zi. Estimarea e gratuită.
                </p>
                <Link
                  href="/brief"
                  className="pointer-events-auto mt-9 inline-flex items-center gap-2.5 rounded-full bg-orange-gradient px-9 py-4 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.05] hover:shadow-[0_0_60px_rgba(255,46,154,0.5)]"
                >
                  <Zap className="h-5 w-5" />
                  Începe proiectul
                </Link>
              </motion.div>
            </div>
          </div>
          <style>{`@keyframes scanmove{0%{transform:translateY(-40px)}100%{transform:translateY(260px)}}.scanline{animation:scanmove 2.6s ease-in-out infinite alternate}`}</style>
        </section>
      </div>
    </div>
  );
}

/* FAQ compact pe sticlă — primele 4 întrebări, acordeon */
const FAQ_ITEMS = [
  ["Cât durează realizarea unui site?", "Un site de prezentare durează 2-4 săptămâni de la primirea conținutului; magazinele online 4-8 săptămâni, în funcție de complexitate."],
  ["Ce se întâmplă cu domeniul și hostingul după primul an?", "Primul an sunt incluse gratuit. După, reînnoirea costă 50-80€/an, în funcție de extensie. Te anunțăm cu o lună înainte."],
  ["Cum se face plata?", "50% avans la începerea proiectului, 50% la livrare. Acceptăm transfer bancar și emitem factură."],
  ["Pot face modificări după ce site-ul e gata?", "Da — modificările minore în primele 30 de zile sunt gratuite; pentru ulterior recomandăm Administrarea lunară."],
];

function MiniFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="pointer-events-auto space-y-2.5">
      {FAQ_ITEMS.map(([q, a], i) => (
        <div key={q} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#09080e]/80 backdrop-blur-md">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-[14px] font-semibold text-white/90">{q}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-brand-magenta transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i ? (
            <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/65">{a}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
