// Politica de confidențialitate (GDPR) — colectăm emailuri, CUI-uri, date de facturare.

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politica de confidențialitate — Imperial Media",
  description: "Cum colectăm, folosim și protejăm datele tale pe imperial-media.ro.",
};

const S = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <h2 className="font-display text-lg font-bold text-text">{title}</h2>
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-text-muted">{children}</div>
  </section>
);

export default function ConfidentialitatePage() {
  return (
    <main className="container-app py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title">Politica de confidențialitate</h1>
        <p className="mt-3 text-sm text-text-muted">
          Ultima actualizare: august 2026. Operator: Legio Web Development Tool S.R.L.
          (brand Imperial Media) · {siteConfig.email}.
        </p>

        <S title="1. Ce date colectăm">
          <p><b className="text-text">Date pe care ni le dai tu:</b> nume, email, telefon (opțional), datele firmei
            introduse în formulare (denumire, oraș, domeniu, CUI, site, pagini sociale, cifre estimative,
            problema descrisă), datele de facturare la plată (denumire firmă, CUI, adresă).</p>
          <p><b className="text-text">Date din surse publice, scanate automat la generarea raportului:</b> profilul public
            Google al firmei și al competitorilor (rating, număr de recenzii), date publice ANAF
            (registrul TVA, bilanțuri publicate), date tehnice ale site-ului tău, date publice ale
            paginii de Facebook.</p>
          <p><b className="text-text">Date tehnice:</b> adresa IP (folosită pentru limitarea abuzului, stocată sub formă
            de amprentă anonimizată), date de utilizare prin Google Analytics (cookie-uri).</p>
        </S>

        <S title="2. De ce le folosim (temeiuri)">
          <p>· Generarea raportului și livrarea serviciilor — executarea contractului.<br/>
             · Emiterea facturilor și evidența plăților — obligație legală.<br/>
             · Emailuri legate de raportul/contul tău (livrare, monitorizare, urmărire după cumpărare) —
             executarea contractului și interes legitim; te poți dezabonat oricând printr-un reply.<br/>
             · Statistici de utilizare — interes legitim / consimțământ (cookie-uri analitice).</p>
        </S>

        <S title="3. Cui le transmitem (împuterniciți)">
          <p>Folosim furnizori care prelucrează date în numele nostru: <b className="text-text">Stripe</b> (plăți —
            datele cardului ajung doar la ei), <b className="text-text">Resend</b> (trimitere emailuri),
            <b className="text-text"> Railway</b> (găzduire și bază de date), <b className="text-text">Google</b> (Places API, Analytics),
            <b className="text-text"> Anthropic</b> (procesarea automată a textului pentru generarea analizei),
            furnizorul de facturare (emiterea facturilor și e-Factura). Nu vindem datele nimănui.</p>
        </S>

        <S title="4. Cât le păstrăm">
          <p>Rapoartele și datele contului — cât timp există contul sau până ceri ștergerea.
            Datele de facturare — conform termenelor legale de arhivare fiscală. Notificările și
            snapshot-urile de monitorizare — cât timp e activă monitorizarea.</p>
        </S>

        <S title="5. Drepturile tale (GDPR)">
          <p>Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție,
            plus dreptul de a-ți retrage consimțământul și de a depune plângere la ANSPDCP
            (dataprotection.ro). Scrie-ne la {siteConfig.email} și răspundem în maximum 30 de zile.</p>
        </S>

        <S title="6. Cookie-uri">
          <p>Folosim cookie-uri strict necesare (sesiunea de autentificare în cont/admin) și cookie-uri
            de analiză (Google Analytics) pentru a înțelege cum e folosit site-ul. Poți bloca
            cookie-urile analitice din setările browserului fără să afectezi funcționarea serviciilor.</p>
        </S>

        <S title="7. Securitate">
          <p>Conexiuni criptate (HTTPS), autentificare fără parole pe bază de linkuri semnate,
            acces la date limitat la strictul necesar, plăți procesate exclusiv de Stripe.</p>
        </S>
      </div>
    </main>
  );
}
