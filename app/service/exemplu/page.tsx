// Raport-EXEMPLU public — arma de conversie pentru /service.
// O firmă demonstrativă (fictivă), ca vizitatorul să vadă EXACT ce primește înainte să plătească.
// Datele de mai jos sunt inventate, dar realiste — raportul real se generează pe datele lui.

import Link from "next/link";
import { ServiceReportView } from "@/components/ServiceReportView";
import type { ServiceReport } from "@/app/api/service-report/route";

export const metadata = {
  title: "Exemplu de raport — Radiografia Afacerii | Imperial Media",
  description:
    "Vezi exact cum arată Radiografia Afacerii: raport complet pe date reale (Google, ANAF, competiție, AI) — exemplu pe o firmă demonstrativă.",
};

const DEMO_REPORT: ServiceReport = {
  companyName: "Pizzeria Toscana (exemplu)",
  city: "Botoșani",
  overallScore: 38,
  lostClientsPerMonth: 46,
  lostRevenuePerMonth: 1200,
  googleData: { found: true, rating: 4.3, reviewCount: 87, hasWebsite: false },
  anafData: {
    found: true,
    legalName: "TOSCANA FOOD CONCEPT S.R.L. (firmă demonstrativă)",
    active: true,
    vatPayer: true,
    caen: "5610",
    caenLabel: "Restaurante",
    regYear: "2017",
    balanceYear: 2024,
    turnover: 612400,
    profit: 48900,
    employees: 6,
  },
  competitors: [
    { name: "Pizzeria Bella Napoli", rating: 4.7, reviewCount: 412, hasWebsite: true },
    { name: "Trattoria Il Forno", rating: 4.6, reviewCount: 298, hasWebsite: true },
    { name: "Pizza Presto", rating: 4.4, reviewCount: 176, hasWebsite: false },
    { name: "La Cuptor", rating: 4.1, reviewCount: 93, hasWebsite: false },
  ],
  diagnostics: [
    {
      area: "Profilul Google Business",
      emoji: "📍",
      status: "warning",
      finding:
        "Profilul există și are 4.3★ din 87 de recenzii — o bază bună. Dar lipsesc fotografiile recente (ultimele sunt de acum 2 ani), programul nu e actualizat pentru sărbători și nu răspunzi la recenzii. Google promovează profilurile active — al tău arată abandonat.",
    },
    {
      area: "Site și comenzi online",
      emoji: "🌐",
      status: "bad",
      finding:
        "Nu ai site. Meniul tău există doar pe hârtie și în poze vechi pe Facebook. Clientul care caută „pizza Botoșani” la ora 20:00 ajunge pe site-ul Bella Napoli, vede meniul, comandă în 2 minute. Tu primești doar telefoanele celor care te știu deja — zero clienți noi din căutări.",
    },
    {
      area: "Recenzii vs. competiție",
      emoji: "⭐",
      status: "warning",
      finding:
        "87 de recenzii e onorabil, dar liderii pieței au 298–412. La volum egal de clienți mulțumiți, diferența vine din SISTEM: ei cer recenzia la fiecare livrare (QR pe cutie, mesaj după comandă). Tu le primești doar pe cele spontane.",
    },
    {
      area: "Social media",
      emoji: "📱",
      status: "warning",
      finding:
        "Pagina de Facebook are 2.400 de urmăritori, dar ultima postare e de acum 3 săptămâni și nu ai niciun reel. În food, video-ul scurt (blatul întins, mozzarella trasă, cuptorul cu lemne) e cel mai ieftin generator de pofte — și de comenzi. Competiția ta postează zilnic.",
    },
    {
      area: "Vizibilitate în AI (ChatGPT, Google AI)",
      emoji: "🤖",
      status: "bad",
      finding:
        "Am testat: la întrebarea „unde mănânc o pizza bună în Botoșani?”, AI-urile recomandă Bella Napoli și Il Forno — pe tine nu te menționează. Motivul: ele apar în articole, topuri locale și au site indexabil. Tot mai mulți clienți întreabă AI-ul înainte să aleagă — iar tu nu exiști acolo.",
    },
    {
      area: "Prezența în presă și topuri locale",
      emoji: "🗞️",
      status: "bad",
      finding:
        "Zero apariții în presa locală sau în topurile „cele mai bune pizzerii din Botoșani”. Astea sunt exact sursele din care se hrănesc și Google, și AI-urile când decid pe cine recomandă. Un singur articol bun îți schimbă poziția în ambele.",
    },
  ],
  topRecommendation: {
    title: "Meniu online + comandă directă — site simplu, lansat în 2 săptămâni",
    why: "E singura acțiune care atacă simultan cele mai mari 3 pierderi: clienții noi din căutări (acum pierduți integral), comenzile din afara orelor de telefon și poziția în AI/Google. Cu 6 angajați și 612.000 lei cifră de afaceri, un plus de 25–30 de comenzi pe lună e vizibil direct în profit.",
    firstStep: "Fotografiază 10 produse la lumină naturală și trimite-le împreună cu meniul actual — restul e treaba noastră.",
  },
  projection: {
    invest3m: 700,
    return3m: 1600,
    invest12m: 1800,
    return12m: 11500,
    breakEvenMonth: 4,
    newClientsPerMonth: 28,
  },
  industryLeaders: {
    practices: [
      "Meniu online cu poze reale și comandă în 3 click-uri — fără aplicații de descărcat",
      "Cer recenzia sistematic: QR pe cutia de pizza + mesaj automat după fiecare comandă",
      "3–4 reels pe săptămână filmate în bucătărie, cu telefonul — autenticitatea vinde",
      "Apar constant în presa locală și în topurile culinare — de acolo îi ia și AI-ul",
    ],
    gap: "Produsul tău e la același nivel cu al lor — diferența e că ei sunt VIZIBILI în fiecare loc în care clientul caută, iar tu doar în memoria clienților vechi.",
  },
  socialPlan: {
    reelsPerWeek: 3,
    postsPerWeek: 4,
    storiesPerWeek: 5,
    ideas: [
      "Reel: blatul întins în aer + mozzarella trasă la felie — clasicul care nu dă greș",
      "Reel: „O zi la cuptor” — de la aluat la livrare, 30 de secunde",
      "Reel: reacția clienților la prima felie (cu acordul lor)",
      "Postare: povestea rețetei de la bunica + poza familiei — localul cu suflet bate lanțul",
      "Story zilnic: „pizza zilei” cu ofertă doar pentru urmăritori",
      "Postare: recenzia săptămânii, cu mulțumiri publice clientului",
    ],
  },
  firstMonthPlan: [
    {
      week: "Săptămâna 1",
      focus: "Materia primă: poze, meniu, acces la conturi",
      tasks: [
        "Fotografiază 10 produse la lumină naturală, lângă geam — cu telefonul, fără trepied, 1 oră",
        "Trimite meniul actual cu prețele la zi (poza de pe perete e suficientă)",
        "Recuperează accesul la profilul Google Business și la pagina de Facebook",
        "Alege pizza-vedetă a casei — ea deschide site-ul, articolul de presă și primul reel",
      ],
      result: "Tot materialul pentru site și campanie e strâns — de aici lucrăm noi",
    },
    {
      week: "Săptămâna 2",
      focus: "Profilul Google renaște",
      tasks: [
        "Urcăm cele 10 poze noi + corectăm programul, telefonul și linkurile",
        "Răspundem la ultimele 20 de recenzii (da, și la cele vechi — Google vede activitatea)",
        "Prima postare Google Business: pizza-vedetă + ofertă de re-lansare",
        "Tipărește QR-ul de recenzie și lipește-l pe cutiile de pizza — de acum se cere la fiecare livrare",
      ],
      result: "Profilul arată viu — primele recenzii noi încep să curgă",
    },
    {
      week: "Săptămâna 3",
      focus: "Site-ul cu meniu online intră în lucru",
      tasks: [
        "Validezi structura: meniu, comandă direct pe WhatsApp/telefon, pagina „despre noi” cu povestea locului",
        "Scriem împreună articolul de presă: povestea pizzeriei + ce o face diferită",
        "Primele 2 reels filmate după planul de social media (blatul + cuptorul)",
        "OFFLINE: duci primele flyere cu QR spre meniu la cele 2 hoteluri partenere",
      ],
      result: "Site-ul e în construcție, articolul aprobat de tine, primele reels postate",
    },
    {
      week: "Săptămâna 4",
      focus: "Lansarea: site live + campania în 50 de ziare",
      tasks: [
        "Site-ul se lansează și se leagă la profilul Google",
        "Articolul pleacă în rețeaua Media Expres — 50 de ziare online, cu link spre site-ul nou",
        "Postare de lansare pe Facebook + primele 300 lei în Google Ads pe „pizza Botoșani”",
        "Măsurăm săptămânal: apeluri, comenzi, recenzii noi — baza pentru luna 2",
      ],
      result: "Ești vizibil peste tot unde caută clientul nou — cu cifre de urmărit",
    },
  ],
  actionPlan: [
    {
      phase: "Luna 1",
      title: "Fundația: să te găsească",
      actions: [
        "Site cu meniu online și comandă directă (fără comisioane către aplicații)",
        "Profil Google resuscitat: 20 de poze noi, program corect, postări săptămânale",
        "Sistem de recenzii: QR pe fiecare cutie + mesaj după comandă",
        "OFFLINE: flyer cu QR spre meniu în fiecare comandă livrată + parteneriat cu 2 hoteluri din zonă pentru recomandări",
      ],
      investment: "~700€",
      impact: "Apari în căutări, comenzile nu mai depind de telefon",
    },
    {
      phase: "Lunile 2–3",
      title: "Vizibilitate: să te aleagă",
      actions: [
        "Campania de presă: articolul tău în 50 de ziare online (inclusă în acest raport)",
        "3 reels/săptămână după planul de mai sus — filmate cu telefonul, 20 min/zi",
        "Google Ads local pe „pizza Botoșani” — buget mic, 300 lei/lună, doar la orele de comenzi",
        "OFFLINE: seară de degustare pentru firmele din zonă (catering de birou = comenzi recurente)",
      ],
      investment: "~400€ + 300 lei/lună ads",
      impact: "+15–20 comenzi/lună din clienți complet noi",
    },
    {
      phase: "Lunile 4–6",
      title: "Sistem: să revină singuri",
      actions: [
        "Program de fidelizare simplu: a 10-a pizza gratuită — pe număr de telefon, fără carduri",
        "SMS/WhatsApp cu oferta săptămânii către baza de clienți (cu acord GDPR)",
        "Catering pentru evenimente și birouri — pagină dedicată pe site",
        "OFFLINE: sponsorizare echipă locală de juniori — logo pe tricouri, comenzi de la părinți",
      ],
      investment: "~250€",
      impact: "Clientul ocazional devine abonatul tău neoficial",
    },
    {
      phase: "Lunile 7–12",
      title: "Creștere: să domini piața locală",
      actions: [
        "Monitorizare lunară: scor, recenzii, competiție — corectezi din mers, nu la un an",
        "Extindere livrare în comunele limitrofe (zonă fără competiție reală)",
        "Al doilea val de presă + topuri culinare locale — consolidezi poziția în AI",
        "OFFLINE: colaborare cu Bizz Club Botoșani — networking-ul local aduce evenimente private",
      ],
      investment: "~450€",
      impact: "De la „pizzeria de cartier” la primele 3 nume din oraș",
    },
  ],
  summary:
    "Ai un produs bun — 4.3★ nu se fură — și o firmă sănătoasă, cu profit real. Problema ta nu e produsul, e VIZIBILITATEA: nu exiști în căutări, în AI sau în presă, exact acolo unde clientul nou decide. Pierzi ~46 de clienți pe lună nu în favoarea unei pizza mai bune, ci a uneia mai ușor de găsit. Vestea bună: fix asta se repară cel mai repede — primele rezultate se văd din luna 2.",
};

export default function ExempluRaportPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app pb-20 pt-14 sm:pt-20">
        {/* Banner: e un exemplu, pe firmă demonstrativă */}
        <div className="mx-auto mb-8 max-w-5xl rounded-2xl border border-brand-orange/40 bg-brand-orange/10 px-5 py-4 text-center">
          <p className="text-sm font-bold text-brand-orangeLight">
            📄 Acesta e un raport-EXEMPLU, pe o firmă demonstrativă (fictivă).
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Al tău se generează identic — dar pe datele TALE reale: profilul tău Google, bilanțul tău de la ANAF,
            competitorii tăi, testul tău de vizibilitate în AI.
          </p>
          <Link href="/service" className="btn-primary mt-3 inline-flex justify-center text-sm">
            Generează raportul pentru firma ta →
          </Link>
        </div>

        <ServiceReportView report={DEMO_REPORT} />

        {/* CTA final */}
        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8 text-center shadow-card">
          <h2 className="font-display text-2xl font-extrabold text-text">Așa arată și al tău — pe cifrele tale.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
            Raportul complet + articolul de promovare publicat în 50 de ziare online (pachetul de publicare de 300€, inclus).
            Dacă nu afli minim 3 lucruri concrete pe care nu le știai despre afacerea ta — banii înapoi.
          </p>
          <Link href="/service" className="btn-primary mt-5 inline-flex justify-center">
            Vreau radiografia firmei mele
          </Link>
        </div>
      </section>
    </main>
  );
}
