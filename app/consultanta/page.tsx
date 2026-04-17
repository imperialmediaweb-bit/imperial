import type { Metadata } from "next";
import { Sparkles, TrendingUp, Target, Users } from "lucide-react";
import { BriefChat } from "@/components/BriefChat";

export const metadata: Metadata = {
  title: "Consultanță digitală gratuită — Imperial Media",
  description:
    "Află GRATUIT unde greșești cu prezența online. Imperial AI îți analizează afacerea și-ți spune exact ce ai nevoie: site, social media, SEO, branding. Fără obligații.",
};

export default function ConsultantaPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      <section className="container-app pb-20 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip">
            <Target className="h-3 w-3" /> Consultanță gratuită
          </span>
          <h1 className="section-title mt-4 mx-auto">
            Află <span className="text-gradient">unde pierzi clienți</span> — gratuit
          </h1>
          <p className="section-subtitle mx-auto">
            Spune-ne despre afacerea ta (scris sau prin voce) și Imperial AI îți
            arată exact unde greșești, ce-ți lipsește, și ce trebuie să faci ca
            să atragi mai mulți clienți online. Fără obligații, fără costuri.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-brand-orange" />
              Diagnostic complet
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-brand-orange" />
              Ca un consultant real
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
              Sfaturi concrete
            </span>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <BriefChat mode="consultanta" />
        </div>

        <p className="mt-8 text-center text-xs text-text-subtle">
          Știi deja ce vrei?{" "}
          <a href="/brief" className="text-brand-orange hover:underline">
            Cere estimare directă
          </a>
          {"  ·  "}
          Vrei să-ți scanăm site-ul actual?{" "}
          <a href="/audit" className="text-brand-orange hover:underline">
            Audit gratuit
          </a>
        </p>
      </section>
    </main>
  );
}
