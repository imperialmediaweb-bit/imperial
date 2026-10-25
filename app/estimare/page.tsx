import type { Metadata } from "next";
import Link from "next/link";
import { Estimator } from "@/components/experience/Estimator";
import { MessageCircle, Zap, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Estimare de preț pe loc — cât costă site-ul tău | Imperial Media",
  description:
    "Alege tipul de site și opțiunile de care ai nevoie și vezi instant estimarea de preț. Oferta exactă, personalizată, o primești gratuit în aceeași zi.",
  alternates: { canonical: "/estimare" },
};

const steps = [
  {
    icon: Zap,
    title: "Estimare instantă",
    text: "Alegi tipul de site și opțiunile dorite și vezi imediat costul orientativ, în lei.",
  },
  {
    icon: MessageCircle,
    title: "Detaliile proiectului",
    text: "Completezi un scurt formular cu cerințele tale prin butonul „Primește oferta exactă”.",
  },
  {
    icon: Clock,
    title: "Ofertă în aceeași zi",
    text: "Primești oferta personalizată în aceeași zi lucrătoare — gratuit și fără obligații.",
  },
];

export default function EstimarePage() {
  return (
    <main className="relative overflow-hidden">
      {/* fundal discret pe brand */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand-magenta/[0.07] blur-3xl" />
        <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-brand-purple/[0.08] blur-3xl" />
      </div>

      <section className="section">
        <div className="container-app">
          <div className="max-w-2xl">
            <span className="chip">Estimare live</span>
            <h1 className="section-title mt-4">
              Cât ar costa <span className="text-gradient">site-ul tău?</span>
            </h1>
            <p className="section-subtitle">
              Bifează ce îți trebuie și vezi estimarea pe loc — iar oferta exactă,
              personalizată pe proiectul tău, o primești gratuit în aceeași zi.
            </p>
          </div>

          <div className="mt-10">
            <Estimator />
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-2xl border border-bg-border glass-card p-6">
                <s.icon className="h-6 w-6 text-brand-magenta" />
                <h2 className="mt-3 font-display text-lg font-bold text-text">{s.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-text-muted">
            Preferi să vorbim direct?{" "}
            <Link href="/contact" className="font-semibold text-brand-magenta hover:underline">
              Scrie-ne sau sună-ne
            </Link>{" "}
            — răspundem rapid.
          </p>
        </div>
      </section>
    </main>
  );
}
