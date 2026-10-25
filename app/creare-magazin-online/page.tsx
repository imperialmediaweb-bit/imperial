// Landingul NAȚIONAL „creare magazin online” — intenția de preț cea mai căutată
// (Search Console: „pret magazin online” era deja în top la afișări).

import type { Metadata } from "next";
import Link from "next/link";
import { ServiceLanding } from "@/components/ServiceLanding";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creare Magazin Online — de la 3.000 lei, opțiuni la alegere | Imperial Media",
  description:
    "Creare magazin online în România: plăți cu cardul, integrare curieri cu AWB automat, facturare automată. Prețuri transparente de la 1.200€, custom pe tehnologii de ultimă generație. Promovare în 50 de ziare inclusă.",
  alternates: { canonical: `${siteConfig.url}/creare-magazin-online` },
};

export default function CreareMagazinOnlinePage() {
  return (
    <ServiceLanding
      slug="creare-magazin-online"
      chip="🛒 Creare magazin online"
      h1={<>Magazin online care <span className="text-gradient">chiar vinde</span> — de la 3.000 lei</>}
      h1Plain="Creare magazin online"
      intro="Magazine online construite de la zero, personalizate, pe tehnologii de ultimă generație, folosite de YouTube și Netflix, cu design unic și viteză sub o secundă. Pornești de la 3.000 lei, cu plata ramburs, și adaugi doar ce îți trebuie: plăți cu cardul, AWB automat, facturare automată. Prețuri publice, fără costuri ascunse — și campania de promovare în 50 de ziare online, cadou."
      priceText="de la 3.000 lei + opțiunile pe care le alegi"
      bullets={[
        "Magazin Start, 3.000 lei: design unic, până la 30 de produse, coș, comenzi, plată ramburs",
        "Opțional: plăți cu cardul (Stripe / Netopia) +800 lei",
        "Opțional: AWB automat la curieri +700 lei · facturare automată (SmartBill / Oblio) +600 lei",
        "Conform legii: retur 14 zile, ANPC/SOL, GDPR — incluse",
        "Viteză sub 1 secundă — magazinele lente pierd 53% din vizitatori",
        "Campania de presă în 50 de ziare online, CADOU",
      ]}
      sections={[
        {
          title: "Cât costă un magazin online în 2026 — prețuri reale",
          body: (
            <>
              <p><strong className="text-text">3.000 lei — Magazin Start</strong>: design unic, până la 30 de produse încărcate de noi, coș, comenzi, plata ramburs, panou pentru produse și comenzi.</p>
              <p><strong className="text-text">Opțiuni la alegere</strong>: plăți online cu cardul +800 lei · AWB automat la curieri +700 lei · facturare automată +600 lei · variante de produs și filtre +500 lei · produse peste 30: +200 lei la fiecare 30 · asistent AI smart (comenzi + urmărire colet) +1.000 lei · logo +300 lei.</p>
              <p><strong className="text-text">Exemplu</strong>: Magazin Start + plăți cu cardul + AWB + facturare = 5.100 lei. Magazinele avansate (mii de produse, import de la furnizori, integrare cu gestiunea) au ofertă personalizată.</p>
              <p>Costuri lunare reale, spuse cinstit: procesatorul de plăți ia 1-2% pe tranzacție (al lui, nu al nostru); administrarea de la 100 lei/lună (include găzduirea). Ghidul complet de prețuri: <Link href="/blog/cat-costa-magazin-online-romania" className="text-brand-orange hover:underline">Preț magazin online 2026 →</Link></p>
            </>
          ),
        },
        {
          title: "De ce nu Shopify sau WooCommerce?",
          body: (
            <>
              <p><strong className="text-text">Shopify</strong>: pornești repede, dar plătești abonament pentru totdeauna (29-300$/lună) plus comisioane — iar magazinul nu e cu adevărat al tău. <strong className="text-text">WooCommerce</strong>: ieftin la instalare, scump la întreținere — plugin-uri, actualizări, securitate pe capul tău, și viteză mediocră exact unde contează.</p>
              <p>Magazinul construit de la zero, fără șabloane: fără abonamente la platformă, viteza maximă posibilă (Google Shopping și clienții o simt), orice funcție construită exact pe fluxul tău de lucru — și e proprietatea ta deplină.</p>
            </>
          ),
        },
        {
          title: "Lansarea — partea pe care alții o sar",
          body: (
            <>
              <p>Un magazin frumos fără trafic e un depozit cu ușa închisă. La livrare primești drumul de lansare complet: profilul Google Business + Google Merchant Center (produsele tale în tab-ul Shopping, gratuit), <strong className="text-text">campania de articole în rețeaua parteneră Media Expres, de 50 de ziare online</strong> (autoritate + primii vizitatori) și planul primelor 3 luni de promovare.</p>
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
        { q: "Mă ajutați și după lansare?", a: "Da: 30 de zile de modificări incluse, apoi administrare opțională (de la 100 lei/lună, de la lansare — găzduire și domeniu incluse). Plus campania de presă din 50 de ziare cadou la lansare și consultantul AI din contul tău, disponibil oricând." },
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
