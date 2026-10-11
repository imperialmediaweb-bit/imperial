// Șablonul landingurilor naționale de serviciu („creare site web”, „creare magazin
// online", „site de prezentare”, „optimizare SEO”) — paginile care țintesc cuvintele
// cheie MARI, fără oraș. Fiecare pagină îi dă conținut unic; șablonul dă structura,
// schema.org (Service + FAQPage + Breadcrumb) și legăturile interne.

import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { LOCATIONS } from "@/lib/locations";

export type ServiceLandingProps = {
  slug: string;
  chip: string;
  h1: React.ReactNode;
  h1Plain: string; // pentru schema
  intro: string;
  priceText: string; // ex: "de la 1.500 lei"
  bullets: string[];
  sections: Array<{ title: string; body: React.ReactNode }>;
  faqs: Array<{ q: string; a: string }>;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  related: Array<{ href: string; label: string }>;
  showCitiesHub?: boolean;
};

export function ServiceLanding(p: ServiceLandingProps) {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* HERO */}
      <section className="container-app py-16 text-center sm:py-24">
        <span className="chip">{p.chip}</span>
        <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
          {p.h1}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted sm:text-lg">{p.intro}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={p.ctaHref} className="btn-primary text-base">
            <Zap className="h-5 w-5" />
            {p.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {p.secondaryHref && (
            <Link href={p.secondaryHref} className="btn-ghost">{p.secondaryLabel}</Link>
          )}
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-2">
          {p.bullets.map((b) => (
            <p key={b} className="flex items-start gap-2 text-sm text-text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /> {b}
            </p>
          ))}
        </div>
      </section>

      {/* SECȚIUNI DE CONȚINUT */}
      {p.sections.map((s) => (
        <section key={s.title} className="section border-t border-bg-border/40">
          <div className="container-app max-w-3xl">
            <h2 className="section-title">{s.title}</h2>
            <div className="prose-section mt-5 space-y-4 text-[15px] leading-relaxed text-text-muted">{s.body}</div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl">
          <h2 className="section-title text-center">Întrebări frecvente</h2>
          <div className="mt-8 space-y-3">
            {p.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-bg-border bg-bg-card">
                <summary className="cursor-pointer select-none px-5 py-4 font-medium text-text transition hover:bg-white/5">{f.q}</summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">Primește prețul exact pentru proiectul tău</h2>
          <p className="section-subtitle mx-auto">Estimare gratuită în 2 minute, ofertă fermă pe email în 24 de ore.</p>
          <div className="mt-6">
            <Link href={p.ctaHref} className="btn-primary">
              <Zap className="h-4 w-4" /> {p.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LEGĂTURI ÎNRUDITE */}
      <section className="border-t border-bg-border/40 py-12">
        <div className="container-app">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-text-subtle">Servicii înrudite</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {p.related.map((r) => (
              <Link key={r.href} href={r.href}
                className="rounded-full border border-bg-border bg-white/5 px-3 py-1.5 text-xs text-text-muted transition hover:border-brand-orange hover:text-text">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HUB-UL ORAȘELOR — toate cele 60 de pagini locale, legate dintr-un singur loc */}
      {p.showCitiesHub && (
        <section className="border-t border-bg-border/40 py-12">
          <div className="container-app">
            <h2 className="text-center font-display text-xl font-extrabold text-text">
              Creare site web în orașul tău — pagini locale dedicate
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-text-muted">
              Prețuri, proiecte livrate local și ghiduri pentru fiecare oraș:
            </p>
            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm">
              {LOCATIONS.map((l) => (
                <Link key={l.slug} href={`/creare-site-web/${l.slug}`} className="text-text-muted transition hover:text-brand-orange">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schema.org: Service + FAQPage + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                "@id": `${siteConfig.url}/${p.slug}#service`,
                name: p.h1Plain,
                description: p.intro,
                provider: { "@id": `${siteConfig.url}/#organization` },
                areaServed: { "@type": "Country", name: "România" },
                url: `${siteConfig.url}/${p.slug}`,
                offers: { "@type": "Offer", description: p.priceText, priceCurrency: "RON" },
              },
              {
                "@type": "FAQPage",
                "@id": `${siteConfig.url}/${p.slug}#faq`,
                mainEntity: p.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Acasă", item: siteConfig.url },
                  { "@type": "ListItem", position: 2, name: p.h1Plain, item: `${siteConfig.url}/${p.slug}` },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
