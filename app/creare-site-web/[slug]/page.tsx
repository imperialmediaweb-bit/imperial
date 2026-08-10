import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Zap,
  Shield,
  Clock,
  Code2,
  Palette,
  ShoppingBag,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Star,
  Gift,
} from "lucide-react";
import { LOCATIONS, getLocationBySlug, getNearbyLocations } from "@/lib/locations";
import { cityEconomyProfile } from "@/lib/city-economy";
import { importedProjects } from "@/lib/projects-data";
import { siteConfig } from "@/lib/site";
import { packages } from "@/lib/packages";

// Pre-render toate locațiile la build
export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const loc = getLocationBySlug(params.slug);
  if (!loc) return {};
  return {
    title: `Creare Site Web ${loc.name} — Web Design ${loc.county} | Imperial Media`,
    description: `Căutați o echipă de web design în ${loc.name}? Imperial Media creează site-uri custom, magazine online și campanii de promovare pentru afaceri din ${loc.name}, ${loc.county}. Estimare gratuită în 2 minute.`,
    alternates: { canonical: `${siteConfig.url}/creare-site-web/${loc.slug}` },
    openGraph: {
      title: `Creare Site Web ${loc.name} | Imperial Media`,
      description: `Site-uri custom și magazine online pentru afaceri din ${loc.name}. 10+ ani experiență, 200+ clienți. Estimare gratuită.`,
      url: `${siteConfig.url}/creare-site-web/${loc.slug}`,
      locale: "ro_RO",
      type: "website",
    },
  };
}

export default function LocationPage({
  params,
}: {
  params: { slug: string };
}) {
  const loc = getLocationBySlug(params.slug);
  if (!loc) notFound();

  const nearby = getNearbyLocations(params.slug, 6);

  // Cifre locale derivate din populația reală — fiecare pagină de oraș devine unică
  const popK = Math.round(loc.population / 1000);
  const firmsEst = Math.round(loc.population / 38);
  const searchesEst = Math.round(loc.population * 0.6);
  // Profilul economic scris de mână + proiectele reale livrate în zonă — conținut de necopiat
  const economy = cityEconomyProfile(loc.slug, loc.region);
  const localProjects = importedProjects
    .filter((p) => p.slug.includes(loc.slug) || p.title.toLowerCase().includes(loc.name.toLowerCase()))
    .slice(0, 3);

  const services = [
    {
      icon: Code2,
      title: `Website prezentare ${loc.name}`,
      text: `Site-uri de prezentare custom pentru firme din ${loc.name} — design modern, responsive, optimizat SEO.`,
      price: "de la 699€",
    },
    {
      icon: ShoppingBag,
      title: `Magazin online ${loc.name}`,
      text: `Magazine online performante pentru afaceri din ${loc.county} — plăți sigure, administrare ușoară.`,
      price: "de la 1200€",
    },
    {
      icon: Palette,
      title: `Branding & identitate`,
      text: `Logo, paletă de culori și identitate vizuală completă pentru brand-ul tău din ${loc.name}.`,
      price: "inclus",
    },
    {
      icon: Megaphone,
      title: `Promovare online ${loc.name}`,
      text: `Campanii de promovare în 50+ ziare online — vizibilitate și SEO pentru afaceri locale din ${loc.county}.`,
      price: "de la 200€",
    },
  ];

  const faqs = [
    {
      q: `Cât costă un site web în ${loc.name}?`,
      a: `Un site de prezentare custom pornește de la 699€, iar un magazin online de la 1200€. Prețul final depinde de funcționalități, pagini și complexitate. Folosește estimatorul nostru AI gratuit pentru un preț orientativ în 2 minute.`,
    },
    {
      q: `Cât durează să faceți un site pentru firma mea din ${loc.name}?`,
      a: `Un site de prezentare: 2-4 săptămâni. Un magazin online: 4-8 săptămâni. Termenul exact depinde de complexitate și de cât de repede primim conținutul (texte, poze).`,
    },
    {
      q: `Faceți și mentenanță după livrare?`,
      a: `Da — primele 30 de zile sunt gratuite. După, oferim pachetul de Administrare (de la 50€/lună) care include backup, update-uri, articole SEO și suport.`,
    },
    {
      q: `Lucrați doar cu firme din ${loc.name}?`,
      a: `Nu — lucrăm cu clienți din toată România și diaspora. Dar avem experiență directă cu piața din ${loc.county} și ${loc.region}, ceea ce ne ajută să înțelegem mai bine nevoile locale.`,
    },
    {
      q: `Ce tehnologii folosiți?`,
      a: `Totul este 100% custom — cod scris de la zero cu limbaje de programare moderne și rapide. NU folosim WordPress sau template-uri gata făcute. Rezultat: site-uri ultra-rapide cu scor Google PageSpeed peste 90.`,
    },
  ];

  const benefits = [
    { icon: Zap, text: "Site-uri ultra-rapide, scor PageSpeed 90+" },
    { icon: Shield, text: "100% custom — NU WordPress, NU template-uri" },
    { icon: Clock, text: "Livrare în 2-4 săptămâni" },
    { icon: Star, text: "10+ ani experiență, 200+ clienți" },
    { icon: MapPin, text: `Experți în piața din ${loc.region}` },
    { icon: CheckCircle2, text: "Suport 30 zile gratuit post-lansare" },
  ];

  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.1)_0%,transparent_50%)]" />

        <div className="container-app relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-xs font-medium text-brand-orange">
            <MapPin className="h-3.5 w-3.5" />
            {loc.name}, {loc.county}
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Creare Site Web în{" "}
            <span className="text-gradient">{loc.name}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted sm:text-lg">
            Echipă de web design cu 10+ ani experiență.
            Creăm site-uri custom, magazine online și campanii de promovare
            pentru afaceri din {loc.name} și {loc.county}.
            Estimare gratuită în 2 minute cu AI-ul nostru.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/brief"
              className="group inline-flex items-center gap-2.5 rounded-full bg-orange-gradient px-8 py-4 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04]"
            >
              <Zap className="h-5 w-5" />
              Primește estimare gratuită
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-text-subtle">
            <span>10 ani experiență</span>
            <span className="text-brand-orange/40">/</span>
            <span>200+ clienți</span>
            <span className="text-brand-orange/40">/</span>
            <span>384+ proiecte</span>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app">
          <div className="text-center">
            <h2 className="section-title mx-auto">
              De ce <span className="text-gradient">Imperial Media</span> în {loc.name}?
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-bg-border bg-bg-card/60 p-4"
              >
                <b.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
                <p className="text-sm text-text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICII ─── */}
      <section className="section">
        <div className="container-app">
          <div className="text-center">
            <span className="chip">Servicii în {loc.name}</span>
            <h2 className="section-title mt-4 mx-auto">
              Ce facem pentru afaceri din{" "}
              <span className="text-gradient">{loc.county}</span>
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-bg-border bg-bg-card bg-card-gradient p-6 transition hover:border-brand-orange/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <s.icon className="h-6 w-6 text-brand-orange" strokeWidth={1.8} />
                  <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
                    {s.price}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-text">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/brief"
              className="btn-primary"
            >
              <Zap className="h-4 w-4" />
              Cere estimare pentru {loc.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PACHETE ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app">
          <div className="text-center">
            <h2 className="section-title mx-auto">
              Pachete pentru afaceri din{" "}
              <span className="text-gradient">{loc.name}</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Prețuri transparente, fără costuri ascunse. Domeniu + hosting gratuit primul an.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <Link
                key={pkg.key}
                href={`/brief?pachet=${pkg.key}`}
                className={`rounded-2xl border p-5 text-center transition hover:-translate-y-1 ${
                  pkg.popular
                    ? "border-brand-orange bg-brand-orange/5 shadow-glow-orange"
                    : "border-bg-border bg-bg-card/60"
                }`}
              >
                {pkg.popular && (
                  <span className="mb-2 inline-block rounded-full bg-orange-gradient px-3 py-0.5 text-[10px] font-bold text-white">
                    Popular
                  </span>
                )}
                <p className="font-display text-lg font-bold text-text">
                  {pkg.name}
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-gradient">
                  {pkg.price}
                </p>
                <p className="mt-0.5 text-xs text-text-subtle">
                  {pkg.priceNote}
                </p>
                <p className="mt-3 text-xs text-brand-orange">
                  Cere estimare →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ LOCAL ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl">
          <div className="text-center">
            <h2 className="section-title mx-auto">
              Întrebări frecvente — web design{" "}
              <span className="text-gradient">{loc.name}</span>
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-bg-border bg-bg-card"
              >
                <summary className="cursor-pointer select-none px-5 py-4 font-medium text-text transition hover:bg-white/5">
                  {faq.q}
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">
            Pregătit pentru un site web în{" "}
            <span className="text-gradient">{loc.name}</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Completează un brief rapid și primește estimare gratuită în 2 minute.
            Oferta fermă pe email în maximum 24 de ore.
          </p>
          <div className="mt-8">
            <Link href="/brief" className="btn-primary">
              <Zap className="h-5 w-5" />
              Primește estimare gratuită
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            🎁 BONUS: Primești <strong className="text-brand-orange">campanie de promovare gratuită</strong> în 50 ziare online la orice site nou.
          </p>
        </div>
      </section>

      {/* ─── PIAȚA LOCALĂ ÎN CIFRE — conținut unic per oraș (anti-doorway) ─── */}
      <section className="border-t border-bg-border/40 py-12">
        <div className="container-app">
          <h2 className="text-center font-display text-xl font-extrabold text-text sm:text-2xl">
            Piața din {loc.name}, în cifre
          </h2>
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-bg-border bg-white/5 p-5 text-center">
              <p className="font-display text-3xl font-extrabold text-brand-orange">~{popK}.000</p>
              <p className="mt-1 text-xs text-text-muted">locuitori în {loc.name}</p>
            </div>
            <div className="rounded-2xl border border-bg-border bg-white/5 p-5 text-center">
              <p className="font-display text-3xl font-extrabold text-brand-orange">~{firmsEst.toLocaleString("ro-RO")}</p>
              <p className="mt-1 text-xs text-text-muted">firme active estimate în zonă</p>
            </div>
            <div className="rounded-2xl border border-bg-border bg-white/5 p-5 text-center">
              <p className="font-display text-3xl font-extrabold text-brand-orange">{searchesEst.toLocaleString("ro-RO")}+</p>
              <p className="mt-1 text-xs text-text-muted">căutări locale estimate pe lună</p>
            </div>
          </div>
          {/* Potențialul orașului — profil economic scris de mână, unic per oraș */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-orange/25 bg-gradient-to-br from-brand-orange/[0.07] via-transparent to-brand-purple/[0.06] p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
              💡 Potențialul pieței din {loc.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{economy}</p>
            <p className="mt-3 border-t border-bg-border/50 pt-3 text-sm leading-relaxed text-text-muted">
              <strong className="text-text">Cum te ajută concret un site aici:</strong> cele{" "}
              {searchesEst.toLocaleString("ro-RO")}+ căutări lunare din zonă sunt oameni care VOR ceva acum
              — iar Google le arată primele 3-5 firme. Un site rapid, cu profil Google îngrijit, te mută în
              fața lor: pentru multe firme din {loc.name}, asta înseamnă primii clienți noi din altă sursă
              decât „din auzite" — măsurabili, lună de lună.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PROIECTE REALE DIN ZONĂ — dovada de necopiat (doar unde există) ─── */}
      {localProjects.length > 0 && (
        <section className="border-t border-bg-border/40 py-12">
          <div className="container-app">
            <h2 className="text-center font-display text-xl font-extrabold text-text sm:text-2xl">
              Proiecte livrate pentru clienți din zona {loc.county}
            </h2>
            <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
              {localProjects.map((p) => (
                <Link key={p.slug} href={`/proiecte/${p.slug}`}
                  className="rounded-2xl border border-bg-border bg-white/5 p-4 text-sm font-semibold text-text transition hover:border-brand-orange/60">
                  {p.title}
                  <span className="mt-1 block text-[11px] font-normal text-text-subtle">vezi proiectul →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GHIDURILE ORAȘULUI — linkuri interne oraș ↔ articole (SEO) ─── */}
      {loc.isCountySeat && (
        <section className="border-t border-bg-border/40 py-12">
          <div className="container-app">
            <h3 className="text-center text-xs font-bold uppercase tracking-wider text-text-subtle">
              Ghiduri gratuite pentru {loc.name}
            </h3>
            <div className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-3">
              <Link href={`/blog/cat-costa-site-web-${loc.slug}`}
                className="rounded-2xl border border-bg-border bg-white/5 p-4 text-sm font-semibold text-text transition hover:border-brand-orange/60">
                💰 Cât costă un site web în {loc.name} în 2026?
              </Link>
              <Link href={`/blog/promovare-afacere-online-${loc.slug}`}
                className="rounded-2xl border border-bg-border bg-white/5 p-4 text-sm font-semibold text-text transition hover:border-brand-orange/60">
                📣 Cum să-ți promovezi afacerea online în {loc.name}
              </Link>
              <Link href="/service"
                className="rounded-2xl border border-brand-orange/40 bg-brand-orange/5 p-4 text-sm font-semibold text-text transition hover:border-brand-orange">
                🔍 Radiografia Afacerii — raport pe datele reale ale firmei tale din {loc.name}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── ALTE LOCAȚII ─── */}
      <section className="border-t border-bg-border/40 py-12">
        <div className="container-app">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-text-subtle">
            Web design și în alte orașe
          </h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/creare-site-web/${n.slug}`}
                className="rounded-full border border-bg-border bg-white/5 px-3 py-1.5 text-xs text-text-muted transition hover:border-brand-orange hover:text-text"
              >
                {n.name}
              </Link>
            ))}
            <Link
              href="/creare-site-web/bucuresti"
              className="rounded-full border border-bg-border bg-white/5 px-3 py-1.5 text-xs text-text-muted transition hover:border-brand-orange hover:text-text"
            >
              toate orașele →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Schema.org (JSON-LD @graph): ProfessionalService + FAQPage + Breadcrumb ───
           Arsenalul complet pentru Google (rich results) și LLM-uri (răspunsuri citabile) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ProfessionalService",
                "@id": `${siteConfig.url}/creare-site-web/${loc.slug}#business`,
                name: `Imperial Media — Web Design ${loc.name}`,
                description: `Creare site web custom, magazine online și promovare în presă pentru afaceri din ${loc.name}, ${loc.county}. 10+ ani experiență, 200+ clienți.`,
                url: `${siteConfig.url}/creare-site-web/${loc.slug}`,
                image: `${siteConfig.url}/logo.png`,
                logo: `${siteConfig.url}/logo.png`,
                telephone: siteConfig.phone,
                email: siteConfig.email,
                address: { "@type": "PostalAddress", addressCountry: "RO", addressRegion: loc.county },
                areaServed: [
                  { "@type": "City", name: loc.name },
                  { "@type": "AdministrativeArea", name: loc.county },
                ],
                priceRange: "699€ - 5000€",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: siteConfig.reviews.ratingValue,
                  reviewCount: siteConfig.reviews.reviewCount,
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: `Servicii web design ${loc.name}`,
                  itemListElement: services.map((s) => ({
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: s.title, description: s.text },
                    priceSpecification: { "@type": "PriceSpecification", price: s.price, priceCurrency: "EUR" },
                  })),
                },
                sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
              },
              {
                "@type": "FAQPage",
                "@id": `${siteConfig.url}/creare-site-web/${loc.slug}#faq`,
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/creare-site-web/${loc.slug}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Acasă", item: siteConfig.url },
                  { "@type": "ListItem", position: 2, name: "Creare site web", item: `${siteConfig.url}/servicii` },
                  { "@type": "ListItem", position: 3, name: loc.name, item: `${siteConfig.url}/creare-site-web/${loc.slug}` },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
