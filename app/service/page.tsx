import type { Metadata } from "next";
import Link from "next/link";
import {
  Stethoscope,
  Wrench,
  RefreshCw,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Service Digital pentru Afaceri — Diagnostic, Reparații, Întreținere",
  description:
    "Ca un service auto, dar pentru afacerea ta online: diagnostic gratuit, reparații site, revizie lunară și tuning de performanță. Imperial Media — service-ul digital al afacerii tale.",
};

const services = [
  {
    icon: Stethoscope,
    step: "01",
    title: "Diagnostic complet",
    price: "GRATUIT",
    priceColor: "text-green-400",
    description:
      "Ca la ITP: verificăm toată prezența ta online — site, Google, social media, recenzii. AI-ul nostru îți spune exact unde pierzi clienți și ce trebuie reparat.",
    features: ["Analiză site + viteză + SEO", "Verificare Google Business", "Scanare social media", "Raport cu probleme + priorități"],
    cta: "Fă diagnosticul gratuit",
    href: "/consultanta",
    accent: "from-green-500 to-emerald-600",
  },
  {
    icon: Wrench,
    step: "02",
    title: "Reparații & Modernizare",
    price: "de la 699€",
    priceColor: "text-brand-orange",
    description:
      "Site vechi, lent sau stricat? Îl reconstruim de la zero pe tehnologii moderne — rapid, securizat, optimizat pentru Google și AI. Sau construim unul nou dacă nu ai.",
    features: ["Site nou custom (Next.js)", "Migrare de pe WordPress", "Viteză Google 95+", "SEO + optimizare AI inclusă"],
    cta: "Cere estimare",
    href: "/brief",
    accent: "from-brand-orange to-brand-orangeDark",
  },
  {
    icon: RefreshCw,
    step: "03",
    title: "Revizie lunară",
    price: "de la 50€/lună",
    priceColor: "text-brand-purple",
    description:
      "Ca revizia la mașină: site-ul are nevoie de întreținere constantă. Backup, update-uri, securizare, conținut SEO lunar și postări social media — fără să te ocupi tu.",
    features: ["Backup + update-uri lunare", "1 articol SEO / lună", "2 postări Facebook / lună", "Raport lunar de trafic"],
    cta: "Abonează-te la revizie",
    href: "/brief?pachet=admin",
    accent: "from-brand-purple to-brand-glow",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Tuning & Accelerare",
    price: "300€/campanie",
    priceColor: "text-brand-orange",
    description:
      "Vrei mai multă putere? Campanie de promovare în 50 de ziare online (41 locale + 9 naționale) prin Rețeaua Media Expres — vizibilitate instant + boost SEO masiv.",
    features: ["Articol în 50 ziare online", "50+ linkuri dofollow", "Distribuire Facebook", "Raport complet în 24h"],
    cta: "Pornește campania",
    href: "/brief?pachet=promo",
    accent: "from-pink-500 to-brand-purple",
  },
];

export default function ServicePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* HERO */}
      <section className="container-app pb-10 pt-14 sm:pt-20 text-center">
        <span className="chip">
          <Wrench className="h-3 w-3" /> Service digital
        </span>
        <h1 className="section-title mt-4 mx-auto max-w-3xl">
          Service-ul <span className="text-gradient">digital</span> al afacerii tale
        </h1>
        <p className="section-subtitle mx-auto">
          Exact ca un service auto — dar pentru prezența ta online. Aduci
          afacerea, o diagnosticăm gratuit, reparăm ce e stricat și o ținem
          la turație maximă lună de lună.
        </p>
      </section>

      {/* PROCESS STEPS */}
      <section className="container-app pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="card group relative flex flex-col overflow-hidden"
            >
              <span className="absolute -right-3 -top-5 font-display text-8xl font-extrabold text-white/[0.04]">
                {s.step}
              </span>

              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${s.accent} shadow-card transition-transform group-hover:scale-110`}
                >
                  <s.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                </span>
                <span className={`rounded-full border border-bg-border bg-bg-soft/60 px-3 py-1 text-xs font-bold ${s.priceColor}`}>
                  {s.price}
                </span>
              </div>

              <h2 className="mt-5 font-display text-xl font-bold text-text">
                {s.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {s.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={s.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition group-hover:gap-2.5"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-text">
            Nu știi de unde să începi?
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Începe cu diagnosticul gratuit — AI-ul nostru îți spune în 2 minute
            exact ce are nevoie afacerea ta. Fără obligații.
          </p>
          <Link href="/consultanta" className="btn-primary mt-6 inline-flex">
            <Zap className="h-4 w-4" />
            Diagnostic gratuit acum
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
