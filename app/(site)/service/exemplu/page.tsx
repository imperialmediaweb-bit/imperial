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
  companyName: "Kebab Meteor (exemplu)",
  city: "Botoșani",
  overallScore: 38,
  lostClientsPerMonth: 46,
  lostRevenuePerMonth: 1200,
  googleData: { found: true, rating: 4.3, reviewCount: 87, hasWebsite: false },
  anafData: {
    found: true,
    legalName: "METEOR STREET FOOD S.R.L. (firmă demonstrativă)",
    active: true,
    vatPayer: true,
    caen: "5610",
    caenLabel: "Restaurante",
    regYear: "2017",
    balanceYear: 2024,
    turnover: 612400,
    profit: 48900,
    employees: 6,
    history: [
      { year: 2024, turnover: 612400, profit: 48900, employees: 6 },
      { year: 2023, turnover: 574200, profit: 51300, employees: 6 },
      { year: 2022, turnover: 521800, profit: 46100, employees: 5 },
    ],
  },
  competitors: [
    { name: "Kebab Galactic", rating: 4.7, reviewCount: 412, hasWebsite: true },
    { name: "Shaorma Andromeda", rating: 4.6, reviewCount: 298, hasWebsite: true },
    { name: "Fast Food Cometa", rating: 4.4, reviewCount: 176, hasWebsite: false },
    { name: "Kebab Zenit", rating: 4.1, reviewCount: 93, hasWebsite: false },
  ],
  diagnostics: [
    {
      area: "Sănătatea financiară & trendul",
      emoji: "💰",
      status: "warning",
      finding:
        "Cifra de afaceri crește sănătos: 522k → 574k → 612k lei (+6,7% în ultimul an). Dar marja netă a SCĂZUT de la 8,9% la 8,0% — vinzi mai mult și câștigi proporțional mai puțin, semn că ori costurile cresc mai repede decât prețurile, ori vinzi prea mult din produsele slabe. Productivitatea e de ~102.000 lei/angajat/an, decentă pentru fast-food, dar sub liderii care trec de 130.000.",
      fix: "Două mișcări care ridică marja fără să sperie clienții: 1) meniul online scoate în față produsele cu marjă mare (combo-uri, băuturi) — vânzarea ghidată crește bonul mediu cu 10-15% fără efort; 2) +1 leu pe produsele vedetă (nimeni nu pleacă pentru 1 leu) = ~30.000 lei/an direct în profit la volumul tău. Țintă realistă 12 luni: CA de la 612k la ~700k lei cu marja înapoi peste 9%.",
    },
    {
      area: "Profilul Google Business",
      emoji: "📍",
      status: "warning",
      finding:
        "Profilul există și are 4.3★ din 87 de recenzii — o bază bună. Dar lipsesc fotografiile recente (ultimele sunt de acum 2 ani), programul nu e actualizat pentru sărbători și nu răspunzi la recenzii. Google promovează profilurile active — al tău arată abandonat.",
      fix: "O oră, o singură dată: urci 10 poze noi făcute cu telefonul la lumină naturală, corectezi programul și telefonul. Apoi 15 minute pe săptămână: răspunzi la fiecare recenzie nouă și publici o postare (oferta săptămânii). În 3-4 săptămâni Google te urcă vizibil în hărți.",
    },
    {
      area: "Site și comenzi online",
      emoji: "🌐",
      status: "bad",
      finding:
        "Nu ai site. Meniul tău există doar pe hârtie și în poze vechi pe Facebook. Clientul care caută „kebab Botoșani” la ora 20:00 ajunge pe site-ul Kebab Galactic, vede meniul, comandă în 2 minute. Tu primești doar telefoanele celor care te știu deja — zero clienți noi din căutări.",
      fix: "Site simplu cu meniul, pozele și comandă pe WhatsApp/telefon — îl facem noi în 2 săptămâni, tu dai doar pozele și meniul. Se leagă la profilul Google și la articolul de presă, ca tot ce publici să ducă spre el. Primele comenzi de la străini vin de regulă în prima lună.",
    },
    {
      area: "Recenzii vs. competiție",
      emoji: "⭐",
      status: "warning",
      finding:
        "87 de recenzii e onorabil, dar liderii pieței au 298–412. La volum egal de clienți mulțumiți, diferența vine din SISTEM: ei cer recenzia la fiecare livrare (QR pe cutie, mesaj după comandă). Tu le primești doar pe cele spontane.",
      fix: "Tipărești QR-ul de recenzie (ți-l generăm noi) și îl lipești pe fiecare caserolă, iar livratorul spune o singură frază: „dacă v-a plăcut, un review ne ajută enorm”. La 30-40 comenzi pe zi, și doar 1 din 20 lasă recenzie — +40-50 pe lună. În 4-5 luni ești în liga liderilor.",
    },
    {
      area: "Social media",
      emoji: "📱",
      status: "warning",
      finding:
        "Pagina de Facebook are 2.400 de urmăritori, dar ultima postare e de acum 3 săptămâni și nu ai niciun reel. În food, video-ul scurt (carnea tăiată de pe rotisor, sosul, lipia caldă) e cel mai ieftin generator de pofte — și de comenzi. Competiția ta postează zilnic.",
      fix: "Urmezi planul de social media de mai jos: 3 reels pe săptămână, filmate cu telefonul în bucătărie, 20 de minute pe zi — ideile concrete le ai în raport, iar consultantul tău din cont îți scrie textele gata de publicat și te învață pas cu pas și reclamele plătite (15-30 lei/zi, țintite pe Botoșani).",
    },
    {
      area: "Vizibilitate în AI (ChatGPT, Google AI)",
      emoji: "🤖",
      status: "bad",
      finding:
        "Am testat: la întrebarea „unde mănânc un kebab bun în Botoșani?”, AI-urile recomandă Kebab Galactic și Shaorma Andromeda — pe tine nu te menționează. Motivul: ele apar în articole, topuri locale și au site indexabil. Tot mai mulți clienți întreabă AI-ul înainte să aleagă — iar tu nu exiști acolo.",
      fix: "AI-urile citează surse: presă, topuri, directoare, site-uri. Campania ta din 50 de ziare (inclusă aici) + site-ul nou + înscrierea în topurile culinare locale te bagă exact în sursele lor. La următoarea scanare lunară retestăm întrebarea și vezi negru pe alb dacă ai intrat în recomandări.",
    },
    {
      area: "Prezența în presă și topuri locale",
      emoji: "🗞️",
      status: "bad",
      finding:
        "Zero apariții în presa locală sau în topurile „cele mai bune shaormerii din Botoșani”. Astea sunt exact sursele din care se hrănesc și Google, și AI-urile când decid pe cine recomandă. Un singur articol bun îți schimbă poziția în ambele.",
      fix: "Rezolvată din start: articolul tău de promovare — scris cu tine, pe povestea localului — se publică în toate cele 50 de ziare din rețeaua Media Expres (inclus în acest raport). 50 de linkuri către site-ul tău, din publicații pe care Google și AI-urile le citesc zilnic.",
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
      "Cer recenzia sistematic: QR pe caserolă + mesaj automat după fiecare comandă",
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
      "Reel: carnea tăiată de pe rotisor + sosul turnat în lipie — clasicul care nu dă greș",
      "Reel: „O zi la rotisor” — de la marinare la livrare, 30 de secunde",
      "Reel: reacția clienților la prima mușcătură (cu acordul lor)",
      "Postare: povestea rețetei de marinare + poza echipei — localul cu suflet bate lanțul",
      "Story zilnic: „meniul zilei” cu ofertă doar pentru urmăritori",
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
        "Alege kebab-ul-vedetă al casei — el deschide site-ul, articolul de presă și primul reel",
      ],
      result: "Tot materialul pentru site și campanie e strâns — de aici lucrăm noi",
    },
    {
      week: "Săptămâna 2",
      focus: "Profilul Google renaște",
      tasks: [
        "Urcăm cele 10 poze noi + corectăm programul, telefonul și linkurile",
        "Răspundem la ultimele 20 de recenzii (da, și la cele vechi — Google vede activitatea)",
        "Prima postare Google Business: kebab-ul-vedetă + ofertă de re-lansare",
        "Tipărește QR-ul de recenzie și lipește-l pe caserole și pungi — de acum se cere la fiecare livrare",
      ],
      result: "Profilul arată viu — primele recenzii noi încep să curgă",
    },
    {
      week: "Săptămâna 3",
      focus: "Site-ul cu meniu online intră în lucru",
      tasks: [
        "Validezi structura: meniu, comandă direct pe WhatsApp/telefon, pagina „despre noi” cu povestea locului",
        "Scriem împreună articolul de presă: povestea localului + ce îl face diferit",
        "Primele 2 reels filmate după planul de social media (rotisorul + lipia)",
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
        "Postare de lansare pe Facebook + primele 300 lei în Google Ads pe „kebab Botoșani”",
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
        "Google Ads local pe „kebab Botoșani” — buget mic, 300 lei/lună, doar la orele de comenzi",
        "OFFLINE: seară de degustare pentru firmele din zonă (catering de birou = comenzi recurente)",
      ],
      investment: "~400€ + 300 lei/lună ads",
      impact: "+15–20 comenzi/lună din clienți complet noi",
    },
    {
      phase: "Lunile 4–6",
      title: "Sistem: să revină singuri",
      actions: [
        "Program de fidelizare simplu: al 10-lea meniu gratuit — pe număr de telefon, fără carduri",
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
      impact: "De la „kebab-ul de cartier” la primele 3 nume din oraș",
    },
  ],
  summary:
    "Ai un produs bun — 4.3★ nu se fură — și o firmă sănătoasă, cu profit real. Problema ta nu e produsul, e VIZIBILITATEA: nu exiști în căutări, în AI sau în presă, exact acolo unde clientul nou decide. Pierzi ~46 de clienți pe lună nu în favoarea unui kebab mai bun, ci a unuia mai ușor de găsit. Vestea bună: fix asta se repară cel mai repede — primele rezultate se văd din luna 2.",
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
            Iar suma plătită se scade integral din orice pachet comanzi în 30 de zile.
          </p>
          <Link href="/service" className="btn-primary mt-5 inline-flex justify-center">
            Vreau radiografia firmei mele
          </Link>
        </div>
      </section>
    </main>
  );
}
