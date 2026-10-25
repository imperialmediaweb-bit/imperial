// Landingul NAȚIONAL „creare site de prezentare” — cuvântul cheie cu care intră
// firmele mici; duce natural spre Site Start (1.500) și site-ul complet (699€+).

import type { Metadata } from "next";
import Link from "next/link";
import { ServiceLanding } from "@/components/ServiceLanding";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creare Site de Prezentare — de la 1.500 lei, gata în câteva zile | Imperial Media",
  description:
    "Site de prezentare profesional pentru firma ta: de la 1.500 lei totul inclus (găzduire + domeniu în administrare de la 100 lei/lună), custom pe Next.js, livrat în câteva zile. Cu formular, hartă, programări opționale.",
  alternates: { canonical: `${siteConfig.url}/creare-site-prezentare` },
};

export default function CreareSitePrezentarePage() {
  return (
    <ServiceLanding
      slug="creare-site-prezentare"
      chip="🏢 Site de prezentare"
      h1={<>Site de prezentare pentru firma ta — <span className="text-gradient">de la 1.500 lei</span></>}
      h1Plain="Creare site de prezentare"
      intro="Cartea de vizită online a firmei tale, făcută ca lumea: design custom pe brandul tău, rapid, cu formular de contact și hartă — livrat în câteva zile, nu în luni. Pentru cabinete, saloane, service-uri, firme de servicii, restaurante și orice afacere care vrea să fie găsită."
      priceText="Site Start 1.500 lei · complet de la 699€"
      bullets={[
        "Site Start: 4 pagini, 1.500 lei TOTUL inclus, gata în câteva zile",
        "Domeniu .ro + găzduire incluse în administrare (de la 100 lei/lună) · SSL inclus",
        "Textele le scriem noi; fără poze? punem imagini profesionale",
        "Programări online, galerie, blog — se adaugă modular",
        "Bonus: articol de presă despre firma ta în Botoșani Expres",
        "Radiografia Afacerii (299 lei) cadou la livrare",
      ]}
      sections={[
        {
          title: "Ce trebuie să conțină un site de prezentare bun",
          body: (
            <>
              <p>Patru lucruri decid dacă site-ul aduce clienți sau doar există: <strong className="text-text">claritatea</strong> (în 5 secunde vizitatorul înțelege ce faci și pentru cine), <strong className="text-text">încrederea</strong> (poze reale, recenzii, povestea firmei), <strong className="text-text">acțiunea</strong> (telefon click-to-call, formular, hartă — la un deget distanță pe mobil) și <strong className="text-text">viteza</strong> (peste 3 secunde la încărcare = 53% din vizitatori pierduți).</p>
              <p>Structura standard care funcționează: Acasă · Despre · Servicii · Contact cu hartă și formular — exact ce include <Link href="/site-start" className="text-brand-orange hover:underline">Site Start, la 1.500 lei totul inclus</Link>.</p>
            </>
          ),
        },
        {
          title: "1.500 lei sau 699€ — care ți se potrivește?",
          body: (
            <>
              <p><strong className="text-text">Site Start (1.500 lei)</strong> — când vrei să exiști online corect, repede: 4 pagini, design pe brand, livrat în câteva zile. Modulele se adaugă când ai nevoie: programări online +700 lei, galerie +400, blog +500, pagină în plus +200.</p>
              <p><strong className="text-text">Site-ul complet (de la 699€)</strong> — când afacerea cere mai mult din prima zi: multe pagini și servicii, funcții dedicate, strategie de conținut — plus campania de presă în toate cele 50 de ziare online, cadou.</p>
              <p>Nu poți greși alegerea: cei 1.500 lei de la Site Start devin AVANS dacă treci la site-ul complet în 6 luni.</p>
            </>
          ),
        },
        {
          title: "De ce la noi se livrează în zile, nu în luni",
          body: (
            <>
              <p>Pentru că procesul e construit să nu se blocheze: plătești online → semnezi <Link href="/contract" className="text-brand-orange hover:underline">contractul electronic</Link> în 2 minute → ne povestești firma printr-un formular de 5 minute (textele finale le scriem noi) → urci pozele din cont sau folosim stock profesional → preview → o rundă de revizii → live. Fără ședințe, fără telefoane obligatorii, fără „vă mai sunăm noi”.</p>
            </>
          ),
        },
      ]}
      faqs={[
        { q: "Cât costă un site de prezentare?", a: "La Imperial Media: Site Start — 1.500 lei (5 pagini + blog, găzduire + domeniu în administrare de la 100 lei/lună, SSL, SEO de bază, articol gratuit în Botoșani Expres); Site Custom, cu design creat de la zero, până la 10 pagini și funcții — de la 3.500 lei, cu campania de presă în 50 de ziare cadou." },
        { q: "În cât timp e gata?", a: "Site Start: 3-7 zile lucrătoare de la primirea conținutului. Site-ul complet: 2-4 săptămâni. Procesul e integral online, fără drumuri." },
        { q: "Pot adăuga programări online?", a: "Da — modulul de programări/rezervări costă +700 lei la Site Start și e inclus în multe configurații ale site-ului complet. Clienții se programează singuri, tu primești notificare." },
        { q: "N-am nici texte, nici poze. Se poate?", a: "Da — fix pentru asta e făcut procesul: tu ne povestești firma cu cuvintele tale (5 minute), textele de site le scriem noi; iar dacă nu ai poze, folosim imagini profesionale de stock, incluse, pe care le poți înlocui oricând cu ale tale." },
        { q: "Ce primesc pe lângă site?", a: "Bonusuri reale: un articol de presă despre firma ta publicat în Botoșani Expres (rețeaua noastră Media Expres) și Radiografia Afacerii (analiza completă a firmei cu AI, 299 lei) — cadou la livrare." },
      ]}
      ctaLabel="Comandă Site Start — 1.500 lei"
      ctaHref="/site-start"
      secondaryLabel="Vreau estimare pentru site complet"
      secondaryHref="/brief"
      related={[
        { href: "/creare-site-web", label: "Creare site web" },
        { href: "/site-start", label: "Site Start — 1.500 lei" },
        { href: "/creare-magazin-online", label: "Creare magazin online" },
        { href: "/optimizare-seo", label: "Optimizare SEO" },
        { href: "/service", label: "Radiografia Afacerii" },
      ]}
    />
  );
}
