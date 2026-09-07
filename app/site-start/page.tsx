// Landing-ul pentru reclamele Google/Meta la Site Start (1.500 lei) —
// pagină de conversie: promisiune clară, preț la vedere, zero distrageri.

import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Zap,
  Clock,
  Shield,
  ArrowRight,
  Globe,
  Sparkles,
} from "lucide-react";
import { siteStartPriceRon } from "@/lib/stripe";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Site de prezentare — 1.500 lei, gata în câteva zile | Imperial Media",
  description:
    "Site profesional cu 4 pagini: 1.500 lei, domeniu + găzduire gratuite primul an, livrat în câteva zile. Construit pe Next.js, nu WordPress. Suma se scade din site-ul complet.",
  alternates: { canonical: `${siteConfig.url}/site-start` },
};

const STEPS = [
  { nr: "1", title: "Plătești online, în 1 minut", text: "Card, plată securizată Stripe — factura vine automat pe email." },
  { nr: "2", title: "Ne trimiți textele și pozele", text: "Câteva rânduri despre firmă + pozele tale, direct pe email și în cont. Nu trebuie să fie perfecte — le șlefuim noi." },
  { nr: "3", title: "Site-ul e LIVE în câteva zile", text: "Primești linkul de previzualizare, ceri o rundă de modificări, apoi îl publicăm pe domeniul tău." },
];

const INCLUDED = [
  "4 pagini: Acasă, Despre, Servicii, Contact (cu hartă și formular)",
  "Design pe brandul tău — culori, logo, poze",
  "Domeniu (.ro) + găzduire GRATUITE primul an",
  "Certificat SSL (https) și optimizare de bază Google incluse",
  "Perfect pe telefon — acolo unde te caută 70% din clienți",
  "1 rundă de revizii + 14 zile de corecturi mărunte",
];

export default function SiteStartPage() {
  const price = siteStartPriceRon();

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* ─── HERO ─── */}
      <section className="container-app py-16 text-center sm:py-24">
        <span className="chip">🏗️ Site Start</span>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
          Site profesional pentru firma ta —{" "}
          <span className="text-gradient">{price} lei</span>, gata în câteva zile
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted sm:text-lg">
          Nu șablon de WordPress. Un site construit pe Next.js — aceeași tehnologie ca la marile
          companii — rapid, modern, al tău cu totul. Cu domeniu și găzduire gratuite primul an.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/plata-site-start" className="btn-primary text-base">
            <Zap className="h-5 w-5" />
            Comandă acum — {price} lei
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/consultanta" className="btn-ghost">
            Am întrebări — vorbesc cu consultantul
          </Link>
        </div>
        <p className="mt-4 text-xs text-text-subtle">
          💰 Suma se scade INTEGRAL din orice site complet comanzi în 6 luni · plată securizată Stripe · factură automată
        </p>

        {/* MEGA OFERTA — stiva de valoare, cu bonusul pe care nu-l are nicio agenție */}
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border-2 border-brand-orange/50 bg-bg-card bg-card-gradient p-6 text-left shadow-card sm:p-7">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-brand-orange">
            🔥 Oferta de lansare — totul inclus în {price} lei
          </p>
          <div className="mt-4 grid gap-2.5 text-sm text-text-muted">
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>Site-ul complet, cu 4 pagini, pe brandul tău <b className="text-text">(valoare reală 2.500+ lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>Domeniu .ro + găzduire primul an <b className="text-text">(~350 lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>🗞️ BONUS: <b className="text-text">un articol de presă despre firma ta, publicat în ziarul online al județului tău</b> — rețeaua noastră de presă, avantaj pe care nicio altă agenție nu-l are <b className="text-text">(~300 lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>💰 Iar dacă firma crește: <b className="text-text">toți cei {price} lei se scad din site-ul complet</b> — investiția nu se pierde niciodată</span></p>
          </div>
          <p className="mt-4 border-t border-bg-border/50 pt-3 text-center text-xs text-text-subtle">
            Valoare totală: <s>3.100+ lei</s> → <b className="text-brand-orange">{price} lei</b>, în perioada de lansare
          </p>
        </div>
      </section>

      {/* ─── CE PRIMEȘTI ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl">
          <h2 className="section-title text-center">Ce primești pentru {price} lei</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-bg-border bg-bg-card/60 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                <p className="text-sm text-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CUM FUNCȚIONEAZĂ ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-4xl">
          <h2 className="section-title text-center">Cum funcționează — fără drumuri, fără telefoane</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.nr} className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-gradient font-display text-lg font-extrabold text-white shadow-glow-orange">
                  {s.nr}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-text">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DE CE NOI ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl text-center">
          <h2 className="section-title">De ce nu e „încă un site ieftin"</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
              <Zap className="mx-auto h-6 w-6 text-brand-orange" />
              <p className="mt-2 text-sm font-bold text-text">Viteză reală</p>
              <p className="mt-1 text-xs text-text-muted">Se încarcă sub o secundă — Google iubește asta, clienții și mai mult.</p>
            </div>
            <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
              <Shield className="mx-auto h-6 w-6 text-brand-orange" />
              <p className="mt-2 text-sm font-bold text-text">Fără WordPress</p>
              <p className="mt-1 text-xs text-text-muted">Zero plugin-uri de spart, zero mentenanță obligatorie. Nu „moare" dacă-l lași în pace.</p>
            </div>
            <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
              <Globe className="mx-auto h-6 w-6 text-brand-orange" />
              <p className="mt-2 text-sm font-bold text-text">E al tău, cu totul</p>
              <p className="mt-1 text-xs text-text-muted">Cod, domeniu, date — nimic „închiriat", nimeni nu te ține captiv.</p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm text-text-muted">
            Cu peste <b className="text-text">10 ani de experiență și 200+ clienți</b>, suntem agenția care
            construiește și site-urile mari de mii de euro — Site Start e aceeași calitate, în format mic.
            Iar dacă firma crește: <b className="text-text">cei {price} lei se scad integral din site-ul complet</b>.
          </p>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app text-center">
          <h2 className="section-title">Firma ta merită să existe online. Azi.</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/plata-site-start" className="btn-primary text-base">
              <Sparkles className="h-5 w-5" />
              Comandă Site Start — {price} lei
            </Link>
          </div>
          <p className="mt-3 text-xs text-text-subtle">
            <Clock className="mr-1 inline h-3.5 w-3.5" />
            Livrare în câteva zile de la primirea conținutului · totul online, fără telefoane
          </p>
        </div>
      </section>

      {/* Schema.org: Product cu preț — eligibil pentru rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Site Start — site de prezentare (4 pagini)",
            description: "Site profesional cu 4 pagini, construit pe Next.js: domeniu + găzduire gratuite primul an, livrat în câteva zile.",
            brand: { "@type": "Organization", name: "Imperial Media" },
            offers: {
              "@type": "Offer",
              price: price,
              priceCurrency: "RON",
              availability: "https://schema.org/InStock",
              url: `${siteConfig.url}/site-start`,
            },
          }),
        }}
      />
    </main>
  );
}
