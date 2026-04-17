import type { Metadata } from "next";
import { Sparkles, Mic, Zap, ShieldCheck } from "lucide-react";
import { BriefChat } from "@/components/BriefChat";

export const metadata: Metadata = {
  title: "Primește estimare — Imperial AI | Imperial Media",
  description:
    "Discută cu Imperial AI: scris sau prin voce. În ~2 minute primești o estimare orientativă pentru proiectul tău web.",
};

export default function BriefPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Fundal gradient subtil */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.08)_0%,transparent_50%)]" />

      <section className="container-app pb-20 pt-10 sm:pt-14">
        {/* Header pagină */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip">
            <Sparkles className="h-3 w-3" /> Brief AI conversațional
          </span>
          <h1 className="section-title mt-4 mx-auto">
            Primește <span className="text-gradient">estimare în 2 minute</span>
          </h1>
          <p className="section-subtitle mx-auto">
            Vorbește cu Imperial AI — scris sau prin voce. Îți adaptăm întrebările
            pe proiectul tău, îți propunem pachetul potrivit și îți dăm o estimare
            orientativă pe loc. Oferta fermă pe email în maxim 24h.
            <strong className="text-brand-orange"> BONUS: campanie de promovare gratuită în 50 ziare la orice site nou.</strong>
          </p>

          {/* Benefits strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-brand-orange" />
              Răspuns instant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-brand-orange" />
              Voce în română
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" />
              Fără obligații
            </span>
          </div>
        </div>

        {/* Chat + Brief Card */}
        <div className="mx-auto mt-12 max-w-6xl">
          <BriefChat />
        </div>

        {/* Fallback footer */}
        <p className="mt-8 text-center text-xs text-text-subtle">
          Preferi să ne scrii direct?{" "}
          <a href="/contact" className="text-brand-orange hover:underline">
            Formular clasic
          </a>
          {"  ·  "}
          Sau sună la{" "}
          <a href="tel:0758169388" className="text-brand-orange hover:underline">
            0758 169 388
          </a>
        </p>
      </section>
    </main>
  );
}
