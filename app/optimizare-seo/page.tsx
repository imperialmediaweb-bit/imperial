// Landingul NAȚIONAL „optimizare SEO” — cuvântul „seo local” avea deja afișări în
// Search Console; pagina acoperă SEO clasic + GEO (vizibilitatea în motoarele AI).

import type { Metadata } from "next";
import Link from "next/link";
import { ServiceLanding } from "@/components/ServiceLanding";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Optimizare SEO + vizibilitate în AI (ChatGPT, Gemini) | Imperial Media",
  description:
    "Optimizare SEO pentru site-uri și afaceri locale din România: tehnic, conținut, autoritate prin presă (rețeaua parteneră Media Expres, 50 de ziare) și GEO — vizibilitate în ChatGPT, Gemini, Perplexity.",
  alternates: { canonical: `${siteConfig.url}/optimizare-seo` },
};

export default function OptimizareSeoPage() {
  return (
    <ServiceLanding
      slug="optimizare-seo"
      chip="📈 Optimizare SEO + AI"
      h1={<>Optimizare SEO — să te găsească <span className="text-gradient">Google ȘI ChatGPT</span></>}
      h1Plain="Optimizare SEO și vizibilitate în motoarele AI"
      intro="SEO-ul în 2026 are două fronturi: Google (unde se caută încă cel mai mult) și motoarele AI — ChatGPT, Gemini, Perplexity — unde clienții întreabă direct „ce firmă îmi recomanzi?”. Le acoperim pe amândouă, iar pentru autoritate lucrăm cu rețeaua parteneră de presă Media Expres."
      priceText="SEO tehnic inclus la orice site · campanii de autoritate de la 300€"
      bullets={[
        "SEO tehnic: structură, meta, date structurate schema.org, viteză 90+",
        "Autoritate prin presă reală: rețeaua parteneră Media Expres, 50 de ziare online",
        "GEO: optimizare pentru ChatGPT, Gemini, Perplexity (llms.txt, date structurate, mențiuni)",
        "SEO local: Google Business, recenzii, pagini de oraș",
        "Conținut care răspunde la întrebări — formatul pe care îl citează AI-urile",
        "Măsurare reală: Search Console + rapoarte lunare, nu promisiuni",
      ]}
      sections={[
        {
          title: "Cele 3 straturi ale SEO-ului care funcționează",
          body: (
            <>
              <p><strong className="text-text">1. Tehnic</strong> — fundația: site rapid (sub 1 secundă), structură corectă, meta și date structurate schema.org pe fiecare pagină. La site-urile noastre e inclus din construcție, nu vândut separat ca „pachet SEO”.</p>
              <p><strong className="text-text">2. Conținut</strong> — pagini care răspund exact la ce caută omul: câte o pagină pe serviciu și pe oraș, întrebări frecvente cu răspunsuri directe, ghiduri reale. Așa am construit și site-ul nostru: pagini dedicate pentru fiecare oraș din România.</p>
              <p><strong className="text-text">3. Autoritate</strong> — motivul pentru care paginile urcă: linkuri și mențiuni din surse de încredere. Aici lucrăm cu <strong className="text-text">rețeaua parteneră Media Expres — 50 de ziare online</strong> (unul în fiecare județ + 9 naționale), unde publicăm campaniile de presă pentru clienți.</p>
            </>
          ),
        },
        {
          title: "GEO — cum ajungi să te recomande ChatGPT și Gemini",
          body: (
            <>
              <p>Tot mai mulți clienți nu mai caută pe Google — întreabă AI-ul: „ce service auto îmi recomanzi în Botoșani?”, „o firmă bună de site-uri?”. Motoarele AI răspund cu nume concrete, alese după trei semnale: <strong className="text-text">mențiuni în surse de încredere</strong> (presa — exact ce publicăm pentru clienți), <strong className="text-text">date structurate</strong> pe site (schema.org, llms.txt) și <strong className="text-text">conținut citabil</strong> (răspunsuri clare, cu cifre).</p>
              <p>Vrei să vezi unde stai ACUM? <Link href="/service" className="text-brand-orange underline underline-offset-2">Radiografia Afacerii</Link> include testul real: întrebăm un AI cu căutare web dacă te recomandă pe tine sau concurența — și îți dăm planul să intri în recomandări.</p>
            </>
          ),
        },
        {
          title: "SEO local — prima pagină în orașul tău",
          body: (
            <>
              <p>Pentru afaceri locale, bătălia se câștigă pe trei fronturi: profilul Google Business optimizat (categorii, poze, postări), recenziile (volum + prospețime + răspunsuri) și paginile locale de pe site. Ghidul complet, gratuit: <Link href="/blog/seo-local-ghid-romania" className="text-brand-orange underline underline-offset-2">SEO local în România →</Link></p>
              <p>Iar pentru autoritate locală, articolul în ziarul județului tău — din rețeaua parteneră Media Expres — e cel mai puternic semnal pe care îl poți cumpăra cinstit.</p>
            </>
          ),
        },
      ]}
      faqs={[
        { q: "Cât costă optimizarea SEO?", a: "SEO-ul tehnic e inclus gratuit în orice site făcut de noi (structură, meta, date structurate, viteză). Campaniile de autoritate prin presă: de la 300€ (articol în 50 de ziare online). Administrarea Complet (300 lei/lună) include un articol de presă pe lună plus monitorizarea pozițiilor." },
        { q: "În cât timp se văd rezultatele SEO?", a: "Cinstit: căutările locale cu concurență mică — 2-4 săptămâni de la indexare; cuvintele competitive — 2-4 luni, accelerate serios de campaniile de presă. Cine promite „prima pagină în 7 zile” minte." },
        { q: "Ce e GEO / optimizarea pentru AI?", a: "Optimizarea prezenței tale în răspunsurile motoarelor AI (ChatGPT, Gemini, Perplexity): mențiuni în presă pe care AI-urile le consideră de încredere, date structurate pe site (schema.org, llms.txt) și conținut formulat ca răspunsuri citabile. O facem pentru site-ul nostru și pentru clienți." },
        { q: "Puteți optimiza și un site existent, făcut de altcineva?", a: "Da — începem cu un audit gratuit (30 de secunde, pe /audit) sau cu Radiografia Afacerii (analiza completă, 299 lei), apoi primești lista exactă: ce reparăm tehnic, ce conținut lipsește și ce campanii de autoritate au sens pentru domeniul tău." },
        { q: "Garantați poziția 1 în Google?", a: "Nu — și nimeni serios nu o face, pentru că algoritmul nu e al nostru. Garantăm fundația corectă (tehnic + conținut + presă reală) și măsurarea transparentă în Search Console, lună de lună. Rezultatele vin din disciplină, nu din promisiuni." },
      ]}
      ctaLabel="Vezi unde stai — Radiografia Afacerii"
      ctaHref="/service"
      secondaryLabel="Audit gratuit de site (30 sec)"
      secondaryHref="/audit"
      related={[
        { href: "/creare-site-web", label: "Creare site web" },
        { href: "/creare-magazin-online", label: "Creare magazin online" },
        { href: "/blog/seo-local-ghid-romania", label: "Ghid: SEO local în România" },
        { href: "/blog/google-business-profile-ghid", label: "Ghid: Google Business Profile" },
        { href: "/service", label: "Radiografia Afacerii" },
      ]}
    />
  );
}
