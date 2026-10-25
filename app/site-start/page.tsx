// Landing-ul pentru reclamele Google/Meta la Site Start (1.500 lei) —
// pagină de conversie: promisiune clară, preț la vedere, zero distrageri.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_START_ADDONS, addonPriceLabel } from "@/lib/site-start-addons";
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
    "Site profesional cu 5 pagini + blog: 1.500 lei, domeniu + găzduire gratuite primul an, livrat în câteva zile. Construit pe Next.js, nu WordPress. Suma se scade din site-ul complet.",
  alternates: { canonical: `${siteConfig.url}/site-start` },
};

const STEPS = [
  { nr: "1", title: "Plătești online, în 1 minut", text: "Cu cardul (Stripe, securizat) sau prin transfer bancar pe bază de factură proformă. Factura vine pe email." },
  { nr: "2", title: "Ne trimiți textele și pozele", text: "Câteva rânduri despre firmă + pozele tale, direct pe email și în cont. Nu trebuie să fie perfecte — le șlefuim noi." },
  { nr: "3", title: "Site-ul e LIVE în câteva zile", text: "Primești linkul de previzualizare, ceri o rundă de modificări, apoi îl publicăm pe domeniul tău." },
];

const INCLUDED = [
  "5 pagini: Acasă, Despre, Servicii, Blog, Contact (cu hartă și formular)",
  "Design unic pe brandul tău — culorile și pozele tale",
  "Domeniu (.ro) + găzduire GRATUITE primul an",
  "Certificat SSL (https) și optimizare de bază Google incluse",
  "Perfect pe telefon — acolo unde te caută 70% din clienți",
  "Buton WhatsApp — clienții îți scriu direct pe telefon",
  "Email personalizat (nume@firma-ta.ro)",
  "Articol gratuit despre firma ta în Botoșani Expres",
  "Campanie de promovare de 5 zile pe Facebook, la lansare",
  "1 rundă de revizii + 14 zile de corecturi mărunte",
];

const SITE_START_FAQ = [
  { q: "Ce primesc exact pentru 1.500 lei?", a: "Un site de prezentare cu 5 pagini (Acasă, Despre, Servicii, Blog cu articole, Contact cu hartă și formular), design pe brandul tău, domeniu .ro + găzduire gratuite primul an, certificat SSL, optimizare SEO de bază și versiune perfectă pe telefon. Bonus de lansare: un articol despre firma ta în Botoșani Expres + Radiografia Afacerii (analiza completă cu AI, 299 lei) — cadou." },
  { q: "În cât timp e gata site-ul?", a: "În 3-7 zile lucrătoare de la primirea conținutului (formularul de 5 minute + pozele). Plătești azi, ne trimiți datele, primești linkul de previzualizare, ceri o rundă de modificări și site-ul e live." },
  { q: "Nu am texte sau poze bune. E o problemă?", a: "Deloc. Textele le scriem noi din ce ne povestești despre firmă (nu trebuie să scrii nimic «frumos»), iar dacă nu ai poze folosim imagini profesionale de stock, incluse în preț. Pozele tale reale le poți adăuga oricând mai târziu." },
  { q: "E făcut pe WordPress?", a: "Nu. Site-ul e scris custom pe Next.js — aceeași tehnologie folosită de Netflix și Nike. Se încarcă sub o secundă, nu are plugin-uri care se strică și nu cere mentenanță lunară obligatorie. Codul, domeniul și datele sunt 100% ale tale." },
  { q: "Ce se întâmplă după primul an?", a: "Domeniul și găzduirea gratuite expiră după 12 luni. Alegi atunci: Administrare Start (200 lei/lună — găzduire, domeniu, credite AI pentru asistent, modificări mici, backup), Administrare Complet (300 lei/lună — tot ce e la Start, plus mentenanță deplină, un articol de presă pe lună în ziarul județului tău și monitorizarea lunară a afacerii) sau reînnoirea simplă (~350 lei/an). Te anunțăm cu 30 de zile înainte — site-ul nu se oprește niciodată fără știrea ta." },
  { q: "Dacă vreau mai mult decât cele 5 pagini sau funcții în plus?", a: "Adaugi doar ce-ți trebuie: logo +300 lei, configurare Facebook + Google Business +500 lei, pagină în plus +200 lei, galerie +400 lei, programări online +500 lei, a doua limbă +700 lei, asistent AI +600 lei, promovare în 50 de ziare +1.500 lei. Iar dacă firma crește și vrei Site Custom (de la 3.500 lei), cei 1.500 lei plătiți devin avans — plătești doar diferența." },
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
          💰 Banii nu se pierd: dacă treci la site-ul mare în 6 luni, cei plătiți devin AVANS · plată securizată Stripe · factură automată
        </p>

        {/* MEGA OFERTA — stiva de valoare, cu bonusul pe care nu-l are nicio agenție */}
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border-2 border-brand-orange/50 bg-bg-card bg-card-gradient p-6 text-left shadow-card sm:p-7">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-brand-orange">
            🔥 Oferta de lansare — totul inclus în {price} lei
          </p>
          <div className="mt-4 grid gap-2.5 text-sm text-text-muted">
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>Site-ul complet, cu 5 pagini + blog, pe brandul tău <b className="text-text">(valoare reală 2.500+ lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>Domeniu .ro + găzduire primul an <b className="text-text">(~350 lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>🗞️ BONUS: <b className="text-text">un articol de presă despre firma ta, publicat în Botoșani Expres</b> — rețeaua noastră de presă, avantaj pe care nicio altă agenție nu-l are <b className="text-text">(~300 lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>🔍 BONUS: <b className="text-text">Radiografia Afacerii</b> — analiza completă a firmei tale cu AI: scor, recenzii vs concurență, vizibilitate în ChatGPT, plan de acțiune <b className="text-text">(299 lei)</b></span></p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /><span>💰 Iar dacă firma crește: <b className="text-text">cei {price} lei devin AVANS la site-ul mare</b> — plătești doar diferența</span></p>
          </div>
          <p className="mt-4 border-t border-bg-border/50 pt-3 text-center text-xs text-text-subtle">
            Valoare totală: <s>3.400+ lei</s> → <b className="text-brand-orange">{price} lei</b>, în perioada de lansare
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

      {/* ─── EXTRA-OPȚIUNI — baza e 1.500, restul se adaugă ca la meniu ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl">
          <h2 className="section-title text-center">Vrei mai mult? Adaugi doar ce-ți trebuie</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-text-muted">
            Baza rămâne {price} lei. Extra-opțiunile le alegi după plată, în discuția cu noi — ne spui exact ce vrei în fiecare, le adăugăm la factură.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {SITE_START_ADDONS.map((a) => ({ name: a.name, price: addonPriceLabel(a), desc: a.desc })).map((a) => (
              <div key={a.name} className="flex items-start justify-between gap-3 rounded-2xl border border-bg-border bg-bg-card/60 p-4">
                <div>
                  <p className="text-sm font-bold text-text">{a.name}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{a.desc}</p>
                </div>
                <span className="flex-shrink-0 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">{a.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-text-subtle">
            Vrei plăți cu cardul, magazin sau funcții speciale? Ăla e <Link href="/brief" className="text-brand-orange hover:underline">Site Custom (de la 3.500 lei)</Link> — iar cei {price} lei se scad integral din el.
          </p>
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
            construiește și site-urile mari, de mii de euro — Site Start e aceeași calitate, în format mic.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-text-muted">
            <b className="text-text">💰 Banii tăi nu se pierd niciodată — uite cum:</b> plătești {price} lei acum.
            Dacă în următoarele 6 luni vrei site-ul mare (cu programări, magazin, orice funcții),
            <b className="text-text"> cei {price} lei plătiți devin AVANS</b> — plătești doar diferența.
            Practic, Site Start e prima rată a oricărui site vei vrea vreodată.
          </div>
        </div>
      </section>

      {/* ─── FAQ — răspunsuri directe (SEO + citare în motoarele AI) ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app max-w-3xl">
          <h2 className="section-title text-center">Întrebări frecvente</h2>
          <div className="mt-8 space-y-3">
            {SITE_START_FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-bg-border bg-bg-card">
                <summary className="cursor-pointer select-none px-5 py-4 font-medium text-text transition hover:bg-white/5">{f.q}</summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
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
            "@graph": [
              {
                "@type": "Product",
                name: "Site Start — site de prezentare (5 pagini + blog)",
                description: "Site profesional cu 5 pagini + blog, construit pe Next.js: domeniu + găzduire gratuite primul an, livrat în câteva zile.",
                brand: { "@type": "Organization", name: "Imperial Media" },
                offers: {
                  "@type": "Offer",
                  price: price,
                  priceCurrency: "RON",
                  availability: "https://schema.org/InStock",
                  url: `${siteConfig.url}/site-start`,
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: SITE_START_FAQ.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        }}
      />
    </main>
  );
}
