import { Aurora } from "@/components/effects/Aurora";
import { ProjectsGrid } from "@/components/Projects";
import { importedProjects } from "@/lib/projects-data";

export const metadata = {
  title: "Proiecte — Portofoliu Imperial Media",
  description:
    "Portofoliu complet Imperial Media: 18+ proiecte realizate pentru clienți reali — site-uri de prezentare, magazine online, branding și promovare.",
};

export default function ProiectePage() {
  // Grupăm după categorie (primul cat fiecărui proiect)
  const allCats = Array.from(
    new Set(importedProjects.flatMap((p) => p.categories))
  ).sort();

  return (
    <>
      {/* Hero pagină */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Aurora />
        <div className="container-app relative z-10 text-center">
          <span className="chip">Portofoliu complet</span>
          <h1 className="mx-auto mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-7xl">
            <span className="text-shimmer">{importedProjects.length}</span>{" "}
            proiecte
            <br />
            realizate cu pasiune
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-text-muted sm:text-lg">
            Site-uri, magazine, campanii — toate create pentru clienți
            reali. Click pe orice card pentru a vizita site-ul live.
          </p>

          {/* Categorii chips */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {allCats.map((cat) => (
              <span
                key={cat}
                className="chip border-bg-border bg-white/5"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid complet */}
      <section className="relative pb-24">
        <div className="container-app">
          <ProjectsGrid items={importedProjects} />
        </div>
      </section>

      {/* CTA final */}
      <section className="section relative overflow-hidden">
        <div className="container-app relative z-10 text-center">
          <h2 className="section-title mx-auto">
            Ești pregătit să fii <span className="text-shimmer">următorul</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Spune-ne ce-ți dorești și te contactăm în 24h cu oferta ta
            personalizată.
          </p>
          <a href="/#brief" className="btn-primary mt-8 inline-flex">
            Începe proiectul tău
          </a>
        </div>
      </section>
    </>
  );
}
