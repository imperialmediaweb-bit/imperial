// Landingul NAȚIONAL „creare magazin online” — intenția de preț cea mai căutată
// (Search Console: „pret magazin online” era deja în top la afișări).

import type { Metadata } from "next";
import Link from "next/link";
import { ServiceLanding } from "@/components/ServiceLanding";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creare Magazin Online — prețuri reale 1.200-4.500€ | Imperial Media",
  description:
    "Creare magazin online în România: plăți cu cardul, integrare curieri cu AWB automat, facturare automată. Prețuri transparente de la 1.200€, custom pe Next.js. Promovare în 50 de ziare inclusă.",
  alternates: { canonical: `${siteConfig.url}/creare-magazin-online` },
};

export default function CreareMagazinOnlinePage() {
  return (
    <ServiceLanding
      slug="creare-magazin-online"
      chip="🛒 Creare magazin online"
      h1={<>Magazin online care <span className="text-gradient">chiar vinde</span> — de la 1.200€</>}
      h1Plain="Creare magazin online"
      intro="Magazine online construite custom pe Next.js: plăți cu cardul, curieri cu AWB automat, facturare integrată, viteză sub o secundă. Prețuri publice, fără costuri ascunse — și campania de promovare în 50 de ziare online, cadou."
      priceText="1.200-4.500€ în funcție de complexitate"
      bullets={[
        "Plăți cu cardul: Stripe / Netopia / PayU integrate",
        "Curieri cu AWB generat automat (Fan, Cargus, Sameday)",
        "Facturare automată: SmartBill, Oblio, Facturis",
        "Conform legii: retur 14 zile, ANPC/SOL, GDPR — incluse",
        "Viteză sub 1 secundă — magazinele lente pierd 53% din vizitatori",
        "Campania de presă în 50 de ziare online, CADOU",
      ]}
      sections={[
        {
          title: "Cât costă un magazin online în 2026 — prețuri reale",
          body: (
            <>
              <p><strong className="text-text">1.200-1.800€ — magazinul de pornire</strong>: până la ~50 de produse, plăți cu cardul, design pe brand. Pentru afaceri la început, cu gamă restrânsă.</p>
              <p><strong className="text-text">1.800-3.000€ — magazinul standard serios</strong>: sute de produse, AWB automat la curieri, facturare automată, filtre și căutare, blog pentru SEO. Aici sunt majoritatea magazinelor care chiar vând.</p>
              <p><strong className="text-text">3.000-4.500€+ — magazinul avansat</strong>: mii de produse, import automat de la furnizori, abonamente, configuratoare, integrare cu gestiunea, multi-limbă.</p>
              <p>Costuri lunare reale, spuse cinstit: procesatorul de plăți ia 1-2% pe tranzacție (al lui, nu al nostru); găzduirea e inclusă primul an; mentenanța opțională de la 100 lei/lună. Ghidul complet de prețuri: <Link href="/blog/cat-costa-magazin-online-romania" className="text-brand-orange hover:underline">Preț magazin online 2026 →</Link></p>
            </>
          ),
        },
        {
          title: "De ce nu Shopify sau WooCommerce?",
          body: (
            <>
              <p><strong className="text-text">Shopify</strong>: pornești repede, dar plătești abonament pentru totdeauna (29-300$/lună) plus comisioane — iar magazinul nu e cu adevărat al tău. <strong className="text-text">WooCommerce</strong>: ieftin la instalare, scump la întreținere — plugin-uri, actualizări, securitate pe capul tău, și viteză mediocră exact unde contează.</p>
              <p>Magazinul custom pe Next.js: fără abonamente la platformă, viteza maximă posibilă (Google Shopping și clienții o simt), orice funcție construită exact pe fluxul tău de lucru — și e proprietatea ta deplină.</p>
            </>
          ),
        },
        {
          title: "Lansarea — partea pe care alții o sar",
          body: (
            <>
              <p>Un magazin frumos fără trafic e un depozit cu ușa închisă. La livrare primești drumul de lansare complet: profilul Google Business + Google Merchant Center (produsele tale în tab-ul Shopping, gratuit), <strong className="text-text">campania de articole în rețeaua noastră de 50 de ziare online</strong> (autoritate + primii vizitatori) și planul primelor 3 luni de promovare.</p>
              <p>Vrei să vezi întâi unde stă afacerea ta? <Link href="/service" className="text-brand-orange hover:underline">Radiografia Afacerii</Link> îți arată în 5 minute prezența ta online față de competiție.</p>
            </>
          ),
        },
      ]}
      faqs={[
        { q: "Cât costă un magazin online?", a: "Între 1.200€ și 4.500€ ca investiție inițială, în funcție de numărul de produse și integrările necesare (curieri, facturare, gestiune). Magazinul standard care vinde serios costă de regulă 1.800-3.000€. Estimarea exactă pentru produsele tale e gratuită, în 2 minute." },
        { q: "Pot încasa cu cardul și ramburs?", a: "Da — integrăm Stripe, Netopia sau PayU pentru plăți cu cardul (comision 1-2% al procesatorului), iar rambursul prin curier rămâne activ (încă ~40% din comenzile din România). Facturile se emit automat la fiecare comandă." },
        { q: "Cât durează până e gata?", a: "4-8 săptămâni de la primirea conținutului (produse, poze, texte). Magazinele mici, spre 4; cele cu integrări multiple, spre 8." },
        { q: "Ce acte îmi trebuie ca să vând online?", a: "SRL sau PFA, plus paginile legale obligatorii pe site: termeni și condiții, politica de retur (14 zile drept de retragere), GDPR și linkurile ANPC/SOL. Toate sunt incluse — le configurăm noi corect." },
        { q: "Mă ajutați și după lansare?", a: "Da: 30 de zile de modificări incluse, apoi administrare opțională (de la 100 lei/lună, cu găzduirea inclusă din anul 2). Plus campania de presă din 50 de ziare cadou la lansare și consultantul AI din contul tău, disponibil oricând." },
      ]}
      ctaLabel="Cere estimarea pentru magazinul tău"
      ctaHref="/brief"
      secondaryLabel="Ghid: cât costă un magazin online"
      secondaryHref="/blog/cat-costa-magazin-online-romania"
      related={[
        { href: "/creare-site-web", label: "Creare site web" },
        { href: "/creare-site-prezentare", label: "Site de prezentare" },
        { href: "/optimizare-seo", label: "Optimizare SEO" },
        { href: "/blog/magazin-online-ghid-complet", label: "Ghid: deschide magazin online" },
        { href: "/proiecte", label: "Portofoliu" },
      ]}
    />
  );
}
