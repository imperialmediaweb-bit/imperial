import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Aurora } from "@/components/effects/Aurora";
import { Meteors } from "@/components/effects/Meteors";
import { ProjectsListClient } from "@/components/ProjectsList";
import { importedProjects } from "@/lib/projects-data";

export const metadata = {
  title: "Proiecte — Portofoliu Imperial Media",
  description:
    "Portofoliu Imperial Media: peste 200 de proiecte realizate pentru clienți reali — site-uri de prezentare, magazine online, branding și promovare.",
};

export default function ProiectePage() {
  const allCats = Array.from(
    new Set(importedProjects.flatMap((p) => p.categories))
  );
  const liveCount = importedProjects.filter((p) => p.externalUrl).length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Aurora />
        <Meteors count={10} />
        <div className="container-app relative z-10 text-center">
          <div className="flex justify-center">
            <div className="gradient-border rounded-full">
              <span className="relative inline-flex items-center gap-2 rounded-full bg-bg-card/90 px-4 py-1.5 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span className="text-shimmer font-semibold">
                  Portofoliu complet
                </span>
              </span>
            </div>
          </div>

          <h1 className="mx-auto mt-7 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-7xl">
            <span className="text-shimmer">200+</span>{" "}
            proiecte
            <br />
            realizate <span className="text-gradient">cu pasiune</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-text-muted sm:text-lg">
            Site-uri, magazine și campanii pentru clienți reali. Click pe
            orice proiect pentru a vedea ce am făcut.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { n: 200, label: "Proiecte" },
              { n: allCats.length, label: "Categorii" },
              { n: liveCount, label: "Site-uri live" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-brand-orange sm:text-4xl">
                  {s.n}+
                </p>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectsListClient />

      {/* CTA final */}
      <section className="section border-t border-bg-border/50">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">
            Ești pregătit să fii{" "}
            <span className="text-shimmer">următorul</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Spune-ne ce-ți dorești și revenim cu oferta ta personalizată în 24h.
          </p>
          <Link href="/brief" className="btn-primary mt-8 inline-flex">
            <ArrowUpRight className="h-4 w-4" />
            Începe proiectul tău
          </Link>
        </div>
      </section>
    </>
  );
}
