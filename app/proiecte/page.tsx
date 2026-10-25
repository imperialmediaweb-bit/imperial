import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { ProjectsListClient } from "@/components/ProjectsList";
import { importedProjects } from "@/lib/projects-data";

export const metadata = {
  title: "Proiecte — Portofoliu Imperial Media",
  description:
    "Portofoliu Imperial Media: peste 200 de proiecte realizate pentru clienți reali — site-uri de prezentare, magazine online, branding și promovare.",
};

const mono = "font-jmono text-[10px] uppercase tracking-[0.3em] text-white/60";

export default function ProiectePage() {
  const allCats = Array.from(
    new Set(importedProjects.flatMap((p) => p.categories))
  );
  const liveCount = importedProjects.filter((p) => p.externalUrl).length;

  return (
    <main className="bg-[#050507]">
      {/* ───── HERO — galeria se deschide ───── */}
      <section className="relative overflow-hidden">
        {/* fundalul cu panglicile de lumină ale brandului */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/video/hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.25)_20%,rgba(5,5,7,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050507] to-transparent" />

        <div className="container-app relative z-10 py-24 sm:py-32">
          <div className="flex items-center gap-4">
            <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">01</span>
            <span className="h-px w-14 bg-gradient-to-r from-brand-orange to-brand-magenta" />
            <span className={mono}>Portofoliu</span>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.1rem,4.8vw,3.8rem)] font-semibold leading-[1.06] tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]">
            Proiecte livrate{" "}
            <span className="font-serifd italic text-gradient">pentru clienți reali.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/75 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
            Site-uri de prezentare, magazine online, platforme și campanii de promovare.
            Filtrează după categorie pentru a vedea proiectele relevante pentru domeniul tău.
          </p>
          <div className="mt-10 flex flex-wrap items-start gap-x-12 gap-y-6">
            {[
              { n: "200+", label: "proiecte" },
              { n: `${allCats.length}`, label: "categorii" },
              { n: `${liveCount}+`, label: "site-uri live" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-extrabold text-text [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">{s.n}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectsListClient />

      {/* ───── CTA final ───── */}
      <section className="section relative">
        <div className="container-app text-center">
          <span className={mono}>Hai să vorbim</span>
          <h2 className="section-title mx-auto mt-5">
            Vrei un proiect <span className="font-serifd italic text-gradient">asemănător?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Calculează costul orientativ sau trimite-ne detaliile — răspundem în aceeași zi lucrătoare.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/estimare"
              className="inline-flex items-center gap-2.5 rounded-full bg-orange-gradient px-8 py-4 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.05]"
            >
              <Zap className="h-5 w-5" />
              Calculează prețul pe loc
            </Link>
            <Link
              href="/brief"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-medium text-text transition hover:border-brand-orange/70"
            >
              <ArrowUpRight className="h-4 w-4" />
              Începe proiectul tău
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
