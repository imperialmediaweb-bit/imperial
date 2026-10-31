// Termeni și condiții — obligatorii pentru încasarea online (Stripe, ANPC, OUG 34/2014).

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termeni și condiții — Imperial Media",
  description: "Termenii și condițiile serviciilor Imperial Media: audit de afaceri, abonament de monitorizare, servicii web.",
};

const S = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <h2 className="font-display text-lg font-bold text-text">{title}</h2>
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-text-muted">{children}</div>
  </section>
);

export default function TermeniPage() {
  return (
    <main className="container-app py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title">Termeni și condiții</h1>
        <p className="mt-3 text-sm text-text-muted">
          Ultima actualizare: august 2026. Folosirea site-ului imperial-media.ro și cumpărarea
          serviciilor de mai jos înseamnă acceptarea acestor termeni.
        </p>

        <S title="1. Cine suntem">
          <p>
            Serviciile de pe acest site sunt furnizate sub brandul <b className="text-text">Imperial Media</b>,
            operat de <b className="text-text">Legio Web Development Tool S.R.L.</b>, România.
            Contact: {siteConfig.email}. Datele complete de identificare (CUI, Nr. Reg. Com.) sunt
            disponibile la cerere și pe factura fiscală emisă pentru orice comandă.
          </p>
        </S>

        <S title="2. Serviciile">
          <p><b className="text-text">a) Raportul de consultanță („Radiografia Afacerii")</b> — 299 lei (TVA inclus unde e cazul):
            analiză generată automat pe baza datelor publice (Google, ANAF — bilanțuri publice, site-ul și
            paginile firmei) și a datelor furnizate de client, livrată instant, online. Include un articol
            de promovare publicat în rețeaua parteneră de 50 de ziare online (rețeaua Media Expres),
            în maximum 10 zile lucrătoare de la plată.</p>
          <p><b className="text-text">b) Abonamentele</b> — Monitorizare: 99 lei/lună sau 990 lei/an (re-scanare periodică,
            notificări și recomandări lunare, acces la contul de client); Premium: 199 lei/lună sau 1.990 lei/an
            (tot ce include Monitorizarea, plus generatorul de postări și analiza automată a fotografiilor
            încărcate de client). Se reînnoiesc automat; pot fi anulate oricând, cu efect la finalul
            perioadei deja plătite.</p>
          <p><b className="text-text">c) Servicii web</b> (site-uri, magazine online, prezență online) — pe bază de ofertă
            individuală transmisă pe email.</p>
        </S>

        <S title="3. Prețuri și plata">
          <p>Prețurile sunt afișate în lei (RON). Plata online se procesează securizat prin Stripe;
            nu stocăm datele cardului. La plată se colectează datele de facturare (denumire, CUI, adresă),
            iar factura fiscală se emite și se transmite electronic, inclusiv în sistemul e-Factura unde legea o cere.</p>
          <p>Suma plătită pentru raport se deduce integral din valoarea oricărui pachet de servicii web
            comandat în termen de 30 de zile de la plata raportului.</p>
        </S>

        <S title="4. Livrare digitală și dreptul de retragere">
          <p>Raportul este conținut digital livrat imediat după plată. Prin apăsarea butonului de plată,
            clientul își dă acordul expres pentru executarea imediată a contractului și confirmă că
            înțelege că își pierde astfel dreptul de retragere de 14 zile prevăzut de OUG 34/2014
            (art. 16 lit. m), conținutul fiind accesibil integral imediat.</p>
          <p><b className="text-text">Garanția de satisfacție (voluntară):</b> independent de cele de mai sus, dacă în
            raport nu găsești minim 3 informații concrete pe care nu le știai despre afacerea ta, îți
            returnăm integral suma plătită — trimite o cerere la {siteConfig.email} în maximum 14 zile
            de la plată. Garanția acoperă raportul; dacă articolul de promovare a fost deja publicat,
            rambursarea se acordă proporțional.</p>
          <p>Pentru abonament, anularea se poate face oricând din contul Stripe/linkul din email sau
            printr-o cerere la {siteConfig.email}; accesul rămâne activ până la finalul perioadei plătite.</p>
        </S>

        <S title="5. Natura raportului">
          <p>Raportul combină date reale, verificabile (Google, ANAF, scanarea site-ului) cu estimări și
            recomandări generate automat, cu caracter orientativ. Estimările (clienți/venituri pierdute,
            proiecții, scoruri) NU reprezintă garanții de rezultat, consultanță financiară, juridică sau
            fiscală. Deciziile de business aparțin exclusiv clientului.</p>
        </S>

        <S title="6. Răspundere">
          <p>Ne dăm silința ca datele scanate să fie corecte la momentul generării, dar nu răspundem pentru
            erori ale surselor externe (Google, ANAF, rețele sociale) sau pentru indisponibilitatea lor
            temporară. Răspunderea noastră totală este limitată la suma plătită pentru serviciul în cauză.</p>
        </S>

        <S title="7. Proprietate intelectuală">
          <p>Raportul este destinat uzului intern al clientului. Platforma, codul, designul și conținutul
            site-ului aparțin operatorului și nu pot fi copiate sau revândute.</p>
        </S>

        <S title="8. Litigii">
          <p>Legea aplicabilă este legea română. Încercăm întâi rezolvarea amiabilă la {siteConfig.email}.
            Consumatorii se pot adresa ANPC (anpc.ro, inclusiv platforma SAL) și platformei europene
            SOL (ec.europa.eu/consumers/odr).</p>
        </S>
      </div>
    </main>
  );
}
