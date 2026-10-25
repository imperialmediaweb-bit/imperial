// Landingul NAȚIONAL „creare site web” — hub-ul cuvântului cheie principal.
// Rută index lângă /creare-site-web/[oras]; leagă toate cele 60 de pagini locale.

import type { Metadata } from "next";
import Link from "next/link";
import { ServiceLanding } from "@/components/ServiceLanding";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creare Site Web — de la zero, fără șabloane, de la 1.500 lei | Imperial Media",
  description:
    "Creare site web profesional în România: construit 100% de la zero, fără șabloane, de la 1.500 lei. Domeniu + găzduire incluse în administrare (de la 100 lei/lună), SEO inclus, livrare rapidă. 10+ ani, 200+ clienți.",
  alternates: { canonical: `${siteConfig.url}/creare-site-web` },
};

export default function CreareSiteWebPage() {
  return (
    <ServiceLanding
      slug="creare-site-web"
      chip="💻 Creare site web"
      h1={<>Creare site web <span className="text-gradient">profesional</span> — custom, nu șablon</>}
      h1Plain="Creare site web profesional"
      intro="Construim site-uri de la zero, personalizate pentru fiecare firmă, pe tehnologii de ultimă generație, folosite de YouTube și Netflix. De la site-ul de prezentare de 1.500 lei la platforme complexe. Fără șabloane, fără template-uri, fără surprize."
      priceText="de la 1.500 lei (Site Start) · Site Custom de la 3.500 lei"
      bullets={[
        "100% custom — codul, domeniul și datele sunt ale tale",
        "Scor Google PageSpeed 90+ — viteza e criteriu de ranking",
        "Domeniu + găzduire incluse în administrare (de la 100 lei/lună), SSL inclus",
        "SEO din construcție, nu adăugat la final",
        "Bonus: promovare în rețeaua noastră de 50 de ziare online",
        "10+ ani de experiență, 200+ clienți, 384+ proiecte livrate",
      ]}
      sections={[
        {
          title: "Cât costă crearea unui site web în 2026?",
          body: (
            <>
              <p>Prețul corect depinde de ce are de făcut site-ul, nu de cine îl face. La Imperial Media prețurile sunt publice și fixe:</p>
              <p><strong className="text-text">Site Start — 1.500 lei, totul inclus</strong>: 4 pagini (Acasă, Despre, Servicii, Contact cu hartă), design pe brandul tău, livrat în câteva zile. Pentru firme care vor să existe online corect, repede. <Link href="/site-start" className="text-brand-orange hover:underline">Detalii și comandă →</Link></p>
              <p><strong className="text-text">Site Custom — de la 3.500 lei</strong>: mai multe pagini, funcții dedicate (programări, rezervări, calculatoare), cu campania de presă în toate cele 50 de ziare cadou.</p>
              <p><strong className="text-text">Magazin online — de la 3.000 lei</strong> · <strong className="text-text">Aplicații și platforme — la cerere</strong>.</p>
              <p>Orice sumă plătită pe o treaptă devine avans pentru următoarea — investiția nu se pierde niciodată.</p>
            </>
          ),
        },
        {
          title: "De ce construit de la zero, nu pe șablon?",
          body: (
            <>
              <p>WordPress cu temă e standardul pieței pentru că e ieftin DE FĂCUT — nu pentru că e bun DE AVUT. Un șablon folosit de alte mii de site-uri, 2-4 MB de cod inutil pe fiecare pagină, plugin-uri care cer actualizări lunare și se sparg exact când nu trebuie.</p>
              <p>Site-urile noastre sunt construite de la zero, pe tehnologii de ultimă generație, folosite de YouTube și Netflix: se încarcă sub o secundă, nu au plugin-uri vulnerabile, nu „mor” dacă nu le atinge nimeni un an. Google măsoară viteza și o răsplătește cu poziții — iar clienții tăi o simt în prima secundă.</p>
            </>
          ),
        },
        {
          title: "Ce include orice site făcut de noi",
          body: (
            <>
              <p>Design unic pe brandul tău · versiune impecabilă pe telefon (acolo e 70% din trafic) · optimizare SEO tehnică din structură (meta, date structurate schema.org, viteză) · certificat SSL · formulare funcționale · domeniu .ro și găzduire incluse în administrare (de la 100 lei/lună) · textele scrise de noi din povestea ta · imagini profesionale dacă nu ai poze.</p>
              <p>Și diferențiatorul pe care nu-l are nicio altă agenție din România: <strong className="text-text">promovarea în propria noastră rețea de presă</strong> — articole despre firma ta în ziare online reale, cu tot cu linkuri. La Site Start primești un articol în ziarul județului tău; la site-urile complete, campania în toate cele 50 de publicații.</p>
            </>
          ),
        },
        {
          title: "Cum lucrăm — totul online, fără drumuri",
          body: (
            <>
              <p>1) Primești <Link href="/brief" className="text-brand-orange hover:underline">estimarea gratuită în 2 minute</Link> cu asistentul AI (scrii sau vorbești). 2) Oferta fermă vine pe email în 24h. 3) Plătești online, semnezi <Link href="/contract" className="text-brand-orange hover:underline">contractul electronic</Link> în 2 minute (CUI → datele se completează de la ANAF). 4) Ne trimiți conținutul printr-un formular de 5 minute. 5) Preview → o rundă de revizii → LIVE.</p>
              <p>Site Start: 3-7 zile de la conținut. Site complet: 2-4 săptămâni. Magazin: 4-8 săptămâni.</p>
            </>
          ),
        },
      ]}
      faqs={[
        { q: "Cât costă un site web?", a: "La Imperial Media: Site Start (5 pagini + blog) — 1.500 lei totul inclus; site de prezentare complet — de la 699€; magazin online — de la 3.000 lei, cu opțiuni la alegere; aplicații custom — la cerere. Toate includ SSL și SEO de bază; găzduirea și domeniul sunt incluse în administrare, de la 100 lei/lună. Estimarea exactă pentru proiectul tău e gratuită și durează 2 minute." },
        { q: "Cât durează să-mi faceți site-ul?", a: "Site Start: 3-7 zile lucrătoare de la primirea conținutului. Site de prezentare complet: 2-4 săptămâni. Magazin online: 4-8 săptămâni. Termenul curge de când ne trimiți textele și pozele (formular de 5 minute — textele finale le scriem noi)." },
        { q: "Lucrați cu firme din orice oraș?", a: "Da — totul se face online: comandă, plată, contract electronic, brief, livrare. Avem clienți în toată România și diaspora, plus pagini locale dedicate pentru fiecare oraș important, cu proiecte livrate în zonă." },
        { q: "Site-ul e al meu sau rămân legat de voi?", a: "E 100% al tău: codul, domeniul, datele. Găzduirea și domeniul sunt incluse în administrarea lunară (de la 100 lei/lună); dacă vreodată pleci, îți predăm codul, domeniul și datele." },
        { q: "Faceți și SEO?", a: "Da — fiecare site vine cu SEO tehnic din construcție (structură, meta, date structurate, viteză 90+), iar campaniile de presă din rețeaua noastră de 50 de ziare construiesc autoritatea domeniului. Pentru optimizarea continuă avem serviciul dedicat de optimizare SEO." },
      ]}
      ctaLabel="Primește estimarea gratuită"
      ctaHref="/brief"
      secondaryLabel="Vezi Site Start — 1.500 lei"
      secondaryHref="/site-start"
      related={[
        { href: "/site-start", label: "Site Start — 1.500 lei" },
        { href: "/creare-site-prezentare", label: "Site de prezentare" },
        { href: "/creare-magazin-online", label: "Creare magazin online" },
        { href: "/optimizare-seo", label: "Optimizare SEO" },
        { href: "/service", label: "Radiografia Afacerii" },
        { href: "/proiecte", label: "Portofoliu — 384+ proiecte" },
      ]}
      showCitiesHub
    />
  );
}
