"use client";

/**
 * Homepage-ul flagship — portat din IMPERIAL-DESIGN-SYSTEM (template-ul T15
 * „Imperial Media”): aur pe negru, titlu care se dezvăluie cuvânt cu cuvânt,
 * brandul sculptat în aur sub lumina cursorului, manifestul care se aprinde la
 * scroll, proiectele în care INTRI prin uși (Portal Scroll), indexul de
 * servicii, marquee-ul de stack, cifrele, procesul, pachetele reale, FAQ și
 * finalul de contact. Conținut 100% real — fără cifre inventate.
 */

import { lazy, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import {
  gsap,
  registerGsap,
  useGSAP,
} from "./ids/lib/gsap";
import { useReducedMotion } from "./ids/hooks";
import { MagneticButton } from "./ids/effects/MagneticButton";
import { CustomCursor } from "./ids/effects/CustomCursor";
import { Marquee as IdsMarquee } from "./ids/extras/Marquee";
import { PortalScroll, type PortalScene } from "./ids/extras/PortalScroll";

const GlowingOrbitalRing = dynamic(
  () => import("./ids/three/ring/GlowingOrbitalRing").then((m) => m.GlowingOrbitalRing),
  { ssr: false }
);
const ReliefLight = dynamic(
  () => import("./ids/webgl/relief/ReliefLight").then((m) => m.ReliefLight),
  { ssr: false }
);

const ACCENT = "#FF2E9A";


/* Reveal pe linii: animăm chiar elementele cu .text-chrome/.text-gradient
   (orice copil inline-block sub background-clip:text oprește pictarea în Chrome). */
function LineReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion("auto");
  useGSAP(
    () => {
      registerGsap();
      const lines = ref.current?.querySelectorAll<HTMLElement>("[data-line]");
      if (!lines?.length || reduced) return;
      gsap.fromTo(
        lines,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.16, ease: "power3.out" }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );
  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}

const btn =
  "inline-flex h-14 items-center rounded-full px-8 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

/* ───────────────────────── Manifestul — cuvintele se aprind la scroll ───────────────────────── */
function Manifesto({ eyebrow, text }: { eyebrow: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion("auto");
  useGSAP(
    () => {
      registerGsap();
      const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (!words?.length || reduced) return;
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 45%", scrub: 0.4 },
        }
      );
    },
    { scope: ref, dependencies: [reduced, text] }
  );
  const words = text.split(/\s+/);
  return (
    <section id="manifesto" className="mx-auto w-full max-w-6xl px-5 py-32 sm:px-8 lg:py-44">
      <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
        {eyebrow}
      </p>
      <div ref={ref}>
        <p className="mt-8 font-display text-[clamp(1.7rem,3.8vw,3.4rem)] font-extrabold normal-case leading-[1.15] text-white">
          {words.map((w, i) => (
            <span key={`${w}-${i}`}>
              <span data-word>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── O scenă-ușă: proiect real pe tot ecranul ───────────────────────── */
function DoorScene({
  img,
  eyebrow,
  title,
  highlight,
  text,
  href,
  ctaLabel,
}: {
  img: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  text: string;
  href: string;
  ctaLabel: string;
}) {
  const at = highlight ? title.indexOf(highlight) : -1;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0908]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.55)_0%,rgb(5_5_5/0.25)_40%,rgb(5_5_5/0.9)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
        <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          {eyebrow}
        </p>
        <h3 className="mt-3 font-display font-black uppercase text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] text-white">
          {at >= 0 ? (
            <>
              {title.slice(0, at)}
              <em className="text-gradient not-italic">
                {highlight}
              </em>
              {title.slice(at + highlight!.length)}
            </>
          ) : (
            title
          )}
        </h3>
        <p className="mt-3 max-w-md text-white/70">{text}</p>
        <a
          href={href}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-orange-gradient px-6 text-sm font-medium text-white shadow-glow-orange"
        >
          {ctaLabel} →
        </a>
      </div>
    </div>
  );
}

const DOORS: PortalScene[] = [
  {
    id: "clinica",
    label: "Clinica Sf. Gheorghe",
    shape: "door",
    accent: ACCENT,
    content: (
      <DoorScene
        img="/proiecte/clinica-sf-gheorghe/home.jpg"
        eyebrow="Spital privat · Botoșani"
        title="Clinica Sfântul Gheorghe"
        highlight="Gheorghe"
        text="36 de pagini, programări online, asistent AI și panou de administrare — construit de la zero."
        href="/proiecte/site-clinica-sfantul-gheorghe-botosani"
        ctaLabel="Vezi proiectul"
      />
    ),
  },
  {
    id: "sarami",
    label: "Sarami Media",
    shape: "arch",
    accent: ACCENT,
    content: (
      <DoorScene
        img="/proiecte/sarami/home.jpg"
        eyebrow="Agenție video · migrare WordPress"
        title="Sarami Media"
        highlight="Sarami"
        text="124 de articole mutate fără pierdere SEO, panou propriu, brief-uri și ofertare."
        href="/proiecte/sarami-media-editare-video"
        ctaLabel="Vezi proiectul"
      />
    ),
  },
  {
    id: "programari",
    label: "Programări online",
    shape: "circle",
    accent: ACCENT,
    content: (
      <DoorScene
        img="/proiecte/clinica-sf-gheorghe/programare.jpg"
        eyebrow="Modul construit de la zero"
        title="Programări online"
        highlight="online"
        text="Pacientul alege medicul și ziua; recepția primește totul în panou, instant."
        href="/proiecte"
        ctaLabel="Tot portofoliul"
      />
    ),
  },
  {
    id: "al-tau",
    label: "Site-ul tău",
    shape: "keyhole",
    accent: ACCENT,
    content: (
      <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[#0b0907]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, rgb(255 46 154/0.35) 0%, transparent 70%)",
          }}
        />
        <div className="relative px-6 text-center">
          <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Ultima ușă
          </p>
          <h3 className="mt-4 font-display font-black uppercase text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] text-white">
            Site-ul <em className="text-gradient not-italic">tău.</em>
          </h3>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Spune-ne ideea în 2 minute — primești oferta fermă pe email în 24 de ore.
          </p>
          <a
            href="/brief"
            className="mt-8 inline-flex h-14 items-center rounded-full bg-orange-gradient px-8 text-sm font-semibold text-white shadow-glow-orange"
          >
            Începe proiectul →
          </a>
        </div>
      </div>
    ),
  },
];

/* ───────────────────────── Datele reale ───────────────────────── */
const SERVICES = [
  {
    title: "Site-uri & aplicații",
    text: "Custom pe Next.js, de la zero: viteză sub o secundă, SEO din construcție, panou propriu.",
    tags: ["Next.js", "TypeScript", "SEO", "Panou admin"],
  },
  {
    title: "Magazine online",
    text: "Plăți cu cardul, AWB automat la curieri, facturare integrată. De la 1.200€.",
    tags: ["Stripe", "Curieri", "Facturare"],
  },
  {
    title: "Produse SaaS",
    text: "De la idee la utilizatori plătitori: design de produs, dashboard, abonamente.",
    tags: ["Dashboard", "Abonamente", "AI"],
  },
  {
    title: "3D & motion",
    text: "Three.js, shadere WebGL și coregrafie de scroll — construite în propriul design system.",
    tags: ["Three.js", "WebGL", "GSAP"],
  },
  {
    title: "Video AI",
    text: "Filme de brand și produs generate cu AI, montate pentru web.",
    tags: ["Higgsfield", "Hero films"],
  },
  {
    title: "Presă & SEO",
    text: "Deținem rețeaua Media Expres: articole reale despre firma ta în 50 de ziare online.",
    tags: ["50 de ziare", "Autoritate", "GEO"],
  },
];

const STATS = [
  { value: "384+", label: "proiecte livrate" },
  { value: "200+", label: "clienți" },
  { value: "50", label: "ziare în rețeaua proprie" },
  { value: "10", label: "ani de meserie" },
];

const PROCESS = [
  { title: "Consultanță", text: "Obiective, public, concurență — primești plan clar și preț fix." },
  { title: "Design", text: "Direcție de artă pe brandul tău, machete pe care le vezi înainte să construim." },
  { title: "Dezvoltare", text: "Cod de producție, preview-uri pe link live, fără surprize." },
  { title: "Lansare & creștere", text: "Viteză, SEO și presă la lansare — apoi creștem împreună." },
];

const PACHETE = [
  {
    name: "Site Start",
    price: "1.500 lei",
    duration: "câteva zile",
    text: "4 pagini, totul inclus: domeniu, găzduire, SSL, textele scrise de noi.",
    includes: ["Design pe brand", "Articol de presă cadou", "Radiografia Afacerii cadou"],
    href: "/site-start",
  },
  {
    name: "Site complet",
    price: "de la 699€",
    duration: "2–4 săptămâni",
    text: "Site de prezentare cu funcții dedicate și strategie de conținut.",
    includes: ["Pagini nelimitate ca scop", "Campanie în 50 de ziare", "SEO complet"],
    href: "/brief",
  },
  {
    name: "Magazin online",
    price: "de la 1.200€",
    duration: "4–8 săptămâni",
    text: "Magazin construit să vândă, cu plăți, curieri și facturare.",
    includes: ["Stripe / Netopia", "AWB automat", "Facturare automată"],
    href: "/creare-magazin-online",
  },
  {
    name: "SaaS / Aplicație",
    price: "la cerere",
    duration: "de la 10 săptămâni",
    text: "Design de produs, aplicație și site de lansare.",
    includes: ["Dashboard", "Plăți recurente", "Funcții AI"],
    href: "/brief",
  },
];

const FAQ_ITEMS = [
  {
    q: "Cât costă un site?",
    a: "Prețurile sunt publice: Site Start — 1.500 lei totul inclus; site complet — de la 699€; magazin online — de la 1.200€. Estimarea exactă pentru proiectul tău e gratuită și durează 2 minute, cu asistentul AI.",
  },
  {
    q: "Cu atâtea efecte, site-ul rămâne rapid?",
    a: "Da. Efectele grele se încarcă doar când e nevoie, se opresc când nu sunt pe ecran și au variantă simplă pe telefoanele vechi. Ținta noastră: încărcare sub 2,5 secunde.",
  },
  {
    q: "Pot modifica singur conținutul?",
    a: "Da — site-urile vin cu panou de administrare propriu: texte, poze, prețuri, articole. Fără programator, fără abonamente la platforme.",
  },
  {
    q: "Voi vă ocupați și de găzduire?",
    a: "Da: domeniul și găzduirea sunt gratuite primul an, apoi administrare de la 100 lei/lună — cu monitorizare și un articol de presă pe lună la pachetul Complet.",
  },
];

/* ───────────────────────── Pagina ───────────────────────── */
export function ImperialHome() {
  return (
    <div className="relative bg-[#050505] text-white">
      <CustomCursor size={12} hoverSize={56} blend="difference" />

      {/* ───── HERO: inelul orbital de aur + titlul cuvânt cu cuvânt ───── */}
      <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-24 sm:px-10">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Suspense fallback={null}>
            <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_65%_40%,#2a1038_0%,#050505_70%)]" />
            <GlowingOrbitalRing
              color="#FF2E9A"
              secondaryColor="#8B2FF7"
              intensity={0.95}
              particleCount={600}
              quality="medium"
              style={{ position: "absolute", inset: 0 }}
              label=""
            />
          </Suspense>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.2)_0%,rgb(5_5_5/0)_40%,rgb(5_5_5/0.92)_100%),linear-gradient(90deg,rgb(5_5_5/0.75)_0%,transparent_60%)]" />
        </div>

        <div className="mx-auto w-full max-w-[1600px]">
          <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Imperial Media — studio de design & development
          </p>
          <LineReveal className="mt-6 max-w-[16ch] font-display font-black uppercase text-[clamp(2.4rem,7vw,7rem)] leading-[0.98] tracking-tight">
            <span data-line className="text-chrome block">Site-uri pe care</span>
            <span data-line className="text-chrome block">oamenii</span>
            <span data-line className="text-gradient block">nu le uită.</span>
          </LineReveal>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="relative max-w-xl border-l-2 border-transparent pl-6 text-lg font-light leading-relaxed text-white/55 sm:text-xl [border-image:linear-gradient(180deg,#FF6B1A,#FF2E9A,#8B2FF7)_1]">
              Site-uri premium, magazine online și produse SaaS —{" "}
              <span className="text-white">mișcare cinematică, 3D în timp real</span> și cod
              care se încarcă instant. Promovate în{" "}
              <span className="text-white">propria rețea de 50 de ziare</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton strength={0.35}>
                <a href="/brief" className={`${btn} bg-orange-gradient text-white shadow-glow-orange hover:shadow-[0_0_55px_rgba(255,46,154,0.5)]`}>
                  Începe un proiect
                </a>
              </MagneticButton>
              <MagneticButton strength={0.35}>
                <a href="#work" className={`${btn} border border-white/25 text-white hover:border-white`}>
                  Vezi proiectele
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-5 font-jmono text-[11px] uppercase tracking-[0.25em] text-white/50">
          <IdsMarquee speed={40} label="Ce facem">
            {[
              "Web design",
              "Next.js",
              "Magazine online",
              "Produse SaaS",
              "Three.js & WebGL",
              "Animație GSAP",
              "Video AI",
              "Presă — 50 de ziare",
            ].map((t) => (
              <span key={t} className="whitespace-nowrap px-6">
                {t} <span style={{ color: ACCENT }}>✦</span>
              </span>
            ))}
          </IdsMarquee>
        </div>
      </section>

      {/* ───── IMPERIAL sculptat în aur, luminat de cursor ───── */}
      <section aria-label="Sculptat în obsidian" className="relative h-[60vh] min-h-[320px]">
        <Suspense
          fallback={
            <div className="grid h-full place-items-center bg-[#111016] font-display text-[14vw] font-black leading-none text-white/80">
              IMPERIAL
            </div>
          }
        >
          <ReliefLight
            text="IMPERIAL"
            material="obsidian"
            style={{ position: "absolute", inset: 0 }}
          />
        </Suspense>
        <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-jmono text-[11px] uppercase tracking-[0.3em] text-white/70">
          Sculptat în obsidian. Mișcă mouse-ul ca să-l luminezi.
        </p>
      </section>

      <Manifesto
        eyebrow="Manifest"
        text="Majoritatea site-urilor sunt uitate în câteva secunde. Noi le construim pe cele pe care oamenii le derulează de două ori: uși prin care intri, produse care se asamblează în fața ta, lumină care îți urmărește mâna. Fiecare efect își câștigă locul, fiecare pagină se încarcă rapid și fiecare pixel e construit să vândă."
      />

      {/* ───── Ușile: intri în proiecte ───── */}
      <section id="work">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-between gap-6 px-5 pb-16 sm:px-10 lg:flex-row lg:items-end">
          <div>
            <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
              Proiecte
            </p>
            <h2 className="text-chrome mt-5 font-display font-black uppercase text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-tight">
              Intră în proiecte
            </h2>
          </div>
          <p className="max-w-md text-white/65">
            Derulează prin fiecare ușă. Fiecare proiect de mai jos e un site real, livrat unui
            client real.
          </p>
        </div>
        <PortalScroll scenes={DOORS} accent={ACCENT} label="Intră în proiecte" />
      </section>

      {/* ───── Indexul de servicii ───── */}
      <section id="servicii-index" className="mx-auto w-full max-w-[1600px] px-5 py-32 sm:px-10">
        <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          Servicii
        </p>
        <h2 className="text-chrome mt-5 font-display font-black uppercase text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-tight">
          Ce construim
        </h2>
        <ol className="mt-16 border-b border-white/10">
          {SERVICES.map((s, i) => (
            <li
              key={s.title}
              className="group grid gap-4 border-t border-white/10 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-[6rem_minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-10 md:px-4"
            >
              <span className="font-jmono text-sm text-white/40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display font-black uppercase text-[clamp(2rem,4.5vw,4rem)] leading-none transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-brand-magenta">
                {s.title}
              </h3>
              <div>
                <p className="text-white/65">{s.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-full border border-white/15 px-3 py-1 font-jmono text-[11px] text-white/60">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ───── Stack marquee — litere conturate ───── */}
      <section aria-label="Stack" className="overflow-hidden border-y border-white/10 py-10">
        <IdsMarquee speed={70} label="Stack" gap="0">
          {["Next.js", "React", "TypeScript", "Three.js", "WebGL", "GSAP", "Tailwind", "AI"].map((t) => (
            <span
              key={t}
              className="whitespace-nowrap px-10 font-display font-black uppercase text-[clamp(3rem,9vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_46_154/0.55)]"
            >
              {t}
            </span>
          ))}
        </IdsMarquee>
      </section>

      {/* ───── Cifrele reale ───── */}
      <section className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-10 px-5 py-24 sm:px-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-gradient font-display text-6xl font-black leading-none sm:text-7xl">
              {s.value}
            </p>
            <p className="mt-3 max-w-[18ch] text-sm text-white/60">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ───── Procesul ───── */}
      <section id="proces" className="mx-auto w-full max-w-[1600px] px-5 py-24 sm:px-10">
        <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          Proces
        </p>
        <h2 className="text-chrome mt-5 font-display font-black uppercase text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[0.95] tracking-tight">
          De la primul mesaj la lansare
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <div key={p.title} className="border-t border-white/15 pt-6">
              <span className="font-jmono text-sm text-white/40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display font-black uppercase text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Pachetele reale ───── */}
      <section id="pachete" className="mx-auto w-full max-w-[1600px] px-5 py-28 sm:px-10">
        <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          Pachete
        </p>
        <h2 className="text-chrome mt-5 font-display font-black uppercase text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-tight">
          Alege de unde începi
        </h2>
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PACHETE.map((e) => (
            <article
              key={e.name}
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-brand-magenta/60"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-transparent blur-3xl transition-colors duration-700 group-hover:bg-brand-magenta/20"
              />
              <span className="w-fit rounded-full border border-white/15 px-3 py-1 font-jmono text-[11px] text-white/60">
                {e.duration}
              </span>
              <h3 className="mt-8 font-display font-black uppercase text-4xl">{e.name}</h3>
              <p className="mt-1 font-jmono text-sm" style={{ color: ACCENT }}>
                {e.price}
              </p>
              <p className="mt-3 text-white/65">{e.text}</p>
              <ul className="mt-6 flex flex-col gap-2 text-sm text-white/75">
                {e.includes.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden style={{ color: ACCENT }}>
                      ✦
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <a
                href={e.href}
                className="mt-auto pt-10 text-sm underline-offset-4 hover:underline"
                style={{ color: ACCENT }}
              >
                Cere ofertă →<span className="sr-only">: {e.name}</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq-home" className="mx-auto w-full max-w-4xl px-5 py-24 sm:px-10">
        <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          Întrebări
        </p>
        <h2 className="text-chrome mt-5 font-display font-black uppercase text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[0.95] tracking-tight">
          Înainte să întrebi
        </h2>
        <div className="mt-12">
          {FAQ_ITEMS.map((f) => (
            <details key={f.q} className="group border-t border-white/10 py-5 last:border-b">
              <summary className="flex cursor-pointer select-none items-baseline justify-between gap-6 font-display font-black uppercase text-xl text-white sm:text-2xl">
                {f.q}
                <span className="font-jmono text-sm text-white/40 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───── Finalul de contact ───── */}
      <section id="start" className="relative isolate overflow-hidden px-5 py-40 sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, rgb(255 46 154/0.3) 0%, transparent 70%), radial-gradient(30% 40% at 15% 20%, rgb(139 47 247/0.22) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center text-center">
          <p className="font-jmono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            Contact
          </p>
          <LineReveal className="mt-6 max-w-[16ch] font-display font-black uppercase text-[clamp(2.4rem,6vw,6rem)] leading-[0.98] tracking-tight">
            <span data-line className="text-chrome block">Hai să construim</span>
            <span data-line className="text-gradient block">ceva imperial.</span>
          </LineReveal>
          <p className="mt-8 max-w-md text-white/65">
            Povestește-ne proiectul — scris sau cu vocea. Răspundem în aceeași zi lucrătoare.
          </p>
          <a
            href="mailto:office@imperial-media.ro"
            className="mt-10 font-display font-black uppercase text-[clamp(1.5rem,3.6vw,3rem)] text-white underline decoration-1 underline-offset-[0.3em] transition-colors hover:text-brand-magenta"
            style={{ textDecorationColor: ACCENT }}
          >
            office@imperial-media.ro
          </a>
          <MagneticButton strength={0.4} className="mt-12">
            <a href="/brief" className={`${btn} bg-orange-gradient text-white shadow-glow-orange hover:shadow-[0_0_55px_rgba(255,46,154,0.5)]`}>
              Primește estimarea gratuită
            </a>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
