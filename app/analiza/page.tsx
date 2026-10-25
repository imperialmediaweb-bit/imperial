import type { Metadata } from "next";
import { AnalizaSite } from "@/components/analiza/AnalizaSite";

export const metadata: Metadata = {
  title: "Ai nevoie de un site? Află în 2 minute | Imperial Media",
  description:
    "Analiză gratuită pentru afacerea ta: ce clienți ți-ar aduce un site, din câți clienți se plătește și ce pachet ți se potrivește — salon, cabinet, restaurant, service, servicii sau magazin online.",
  alternates: { canonical: "/analiza" },
};

export default function AnalizaPage() {
  return (
    <main className="relative overflow-hidden bg-[#050507]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand-magenta/[0.08] blur-3xl" />
        <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-brand-purple/[0.09] blur-3xl" />
      </div>
      <section className="section relative">
        <div className="container-app max-w-3xl">
          <span className="chip">Analiză gratuită</span>
          <h1 className="section-title mt-4">
            Ai nevoie de un site? <span className="text-gradient">Află în 2 minute.</span>
          </h1>
          <p className="section-subtitle">
            Răspunzi la 4 întrebări despre afacerea ta și primești pe loc o analiză: ce ți-ar aduce
            un site, cum te face cunoscut în orașul tău, din câți clienți se plătește și ce pachet ți se potrivește.
          </p>
          <div className="mt-10">
            <AnalizaSite />
          </div>
        </div>
      </section>
    </main>
  );
}
