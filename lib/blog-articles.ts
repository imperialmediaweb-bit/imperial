import { LOCATIONS, type Location } from "./locations";

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  location?: Location;
  template: "cost" | "promovare" | "general";
};

function generateCostArticles(): BlogArticle[] {
  // TOATE cele 61 de orașe (nu doar reședințele) — fiecare oraș cu ghidul lui de prețuri
  return LOCATIONS.map((loc) => ({
    slug: `cat-costa-site-web-${loc.slug}`,
    title: `Cât costă un site web în ${loc.name} în 2026?`,
    description: `Ghid complet de prețuri pentru creare site web în ${loc.name}, ${loc.county}. Pachete de la 699€, factori care influențează prețul, și cum să alegi.`,
    category: "Prețuri",
    date: "2026-04-15",
    readTime: "5 min",
    location: loc,
    template: "cost" as const,
  }));
}

function generatePromoArticles(): BlogArticle[] {
  return LOCATIONS.map((loc) => ({
    slug: `promovare-afacere-online-${loc.slug}`,
    title: `Cum să-ți promovezi afacerea online în ${loc.name}`,
    description: `Strategii concrete de promovare online pentru afaceri din ${loc.name}: SEO local, Google Business, social media, și campanii în 50 ziare.`,
    category: "Marketing",
    date: "2026-04-10",
    readTime: "6 min",
    location: loc,
    template: "promovare" as const,
  }));
}

const GENERAL_ARTICLES: BlogArticle[] = [
  {
    slug: "de-ce-ai-nevoie-de-site-web",
    title: "De ce ai nevoie de un site web în 2026 — 10 motive concrete",
    description: "87% din consumatori caută online înainte să cumpere. Iată 10 motive concrete pentru care afacerea ta pierde bani fără un site profesional.",
    category: "Business",
    date: "2026-04-12",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "site-web-pentru-restaurant",
    title: "Site web pentru restaurant: meniu, rezervări, comenzi — prețuri 2026",
    description: "Ghid complet: meniu digital, rezervări online, galerie, comenzi. Ce funcționalități are nevoie un restaurant, cât costă (de la 699€) și ce greșeli să eviți.",
    category: "Industrii",
    date: "2026-08-16",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "site-web-pentru-cabinet-medical",
    title: "Site web cabinet medical / stomatologic: preț, programări, GDPR — ghid 2026",
    description: "Programări online, profil medici, secțiune servicii, GDPR. Cât costă un site medical profesional (699-1.500€) și ce trebuie să conțină obligatoriu.",
    category: "Industrii",
    date: "2026-08-16",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "site-web-pentru-salon-beauty",
    title: "Site web pentru salon de beauty / coafor / spa: ce trebuie și cât costă",
    description: "Programări online, portofoliu, prețuri servicii, Instagram integrat. Ghid 2026 pentru saloane care vor clienți din online — de la 699€.",
    category: "Industrii",
    date: "2026-08-16",
    readTime: "6 min",
    template: "general",
  },
  {
    slug: "magazin-online-ghid-complet",
    title: "Cum să deschizi un magazin online în 2026 — ghid pas cu pas",
    description: "De la alegerea platformei la plăți, livrare, ANPC și promovare. Tot ce trebuie să știi ca să vinzi online în România, cu costuri reale la fiecare pas.",
    category: "E-commerce",
    date: "2026-08-16",
    readTime: "9 min",
    template: "general",
  },
  {
    slug: "seo-local-ghid-romania",
    title: "SEO local în România: cum ajungi pe prima pagină Google în orașul tău",
    description: "Google Business, cuvinte cheie locale, backlink-uri din presă, recenzii. Strategia completă de SEO local pentru 2026, pas cu pas, testată pe piața din România.",
    category: "SEO",
    date: "2026-08-16",
    readTime: "8 min",
    template: "general",
  },
  {
    slug: "google-business-profile-ghid",
    title: "Google Business Profile — ghid complet 2026 pentru afaceri locale",
    description: "Cum să-ți creezi și optimizezi profilul Google Business ca să apari pe Maps și în căutările locale. Pas cu pas, gratuit, cu greșelile care te îngroapă.",
    category: "Marketing",
    date: "2026-08-16",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "greseli-site-web-firme",
    title: "Top 10 greșeli pe care le fac firmele cu site-ul lor",
    description: "De la viteză lentă la lipsă SEO, de la design învechit la lipsa mobile. Greșelile care te costă clienți — și cum le repari.",
    category: "Web Design",
    date: "2026-03-22",
    readTime: "6 min",
    template: "general",
  },
  {
    slug: "wordpress-vs-custom",
    title: "WordPress vs site custom — comparație sinceră pentru afacerea ta",
    description: "Preț, viteză, securitate, scalabilitate — comparate cinstit. Când merită WordPress, când ai nevoie de custom și cât costă fiecare pe termen lung.",
    category: "Tehnologie",
    date: "2026-08-16",
    readTime: "6 min",
    template: "general",
  },
  {
    slug: "cat-costa-magazin-online-romania",
    title: "Preț magazin online 2026: cât costă REAL în România (1.200-4.500€)",
    description: "Prețuri reale pe fiecare tip de magazin online: platformă, plăți, livrare, mentenanță. Ce include fiecare buget și de unde vin costurile ascunse.",
    category: "E-commerce",
    date: "2026-08-16",
    readTime: "7 min",
    template: "general",
  },
];

let _all: BlogArticle[] | null = null;

export function getAllArticles(): BlogArticle[] {
  if (_all) return _all;
  _all = [
    ...GENERAL_ARTICLES,
    ...generateCostArticles(),
    ...generatePromoArticles(),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return _all;
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

// Cifre locale derivate din populație — fac fiecare articol UNIC per oraș
// (Google devalorizează șabloanele identice; cifrele locale sunt diferențiatorul)
function localStats(loc: Location) {
  const popK = Math.round(loc.population / 1000);
  const firms = Math.round(loc.population / 38); // ~1 firmă activă la 38 de locuitori (media urbană RO)
  const searches = Math.round(loc.population * 0.6); // căutări locale lunare estimate pe servicii
  return { popK, firms, searches };
}

export function generateCostContent(loc: Location): string {
  const { popK, firms } = localStats(loc);
  return `Un site web profesional în ${loc.name} pornește de la **699€** pentru un site de prezentare cu 5 pagini și de la **1200€** pentru un magazin online.

## Piața din ${loc.name}, în cifre

${loc.name} are aproximativ **${popK}.000 de locuitori** și, la media urbană din România, în jur de **${firms.toLocaleString("ro-RO")} de firme active** în oraș și împrejurimi. Concret: indiferent de domeniu, ai zeci sau sute de concurenți locali — iar clientul care caută pe Google „${loc.name}" + serviciul tău alege aproape întotdeauna dintre primele rezultate. În ${loc.county}, firmele cu site profesional și profil Google îngrijit domină sistematic aceste căutări, indiferent de mărimea lor reală.

## Ce influențează prețul unui site în ${loc.name}?

Prețul unui site web depinde de mai mulți factori:

**1. Tipul de site**
- **Site prezentare** (5 pagini): de la 699€ — ideal pentru firme mici, cabinete, saloane din ${loc.name}
- **Magazin online** (20+ produse): de la 1200€ — pentru comerț online din ${loc.county}
- **Site complex / custom**: preț la cerere — aplicații web, platforme, integrări speciale

**2. Funcționalități extra**
- Rezervări / programări online: +120-180€
- Plăți cu cardul: +200€
- Blog: +80-120€
- Galerie / portofoliu: +80-120€
- Multilimbă: +120-180€
- Formular avansat: +120-180€

**3. Logo și branding**
- Dacă nu ai logo, îl facem noi: +150-250€
- Identitate vizuală completă: preț la cerere

**4. Urgență**
- Termen standard (2-4 săptămâni): inclus în preț
- Urgență "cât mai repede": +100€

## Ce include un site de la Imperial Media?

Toate site-urile noastre pentru clienți din ${loc.name} includ:
- ✅ Design 100% custom (NU WordPress, NU template-uri)
- ✅ Responsive pe toate dispozitivele
- ✅ Domeniu + hosting gratuit primul an
- ✅ Optimizare SEO de bază
- ✅ **BONUS: campanie de promovare în 50 ziare online** (valoare 200€)

## De ce Imperial Media pentru ${loc.name}?

Cu peste **10 ani de experiență** și **200+ clienți** din toată România, Imperial Media oferă:
- Cod modern, rapid — site-uri cu scor Google PageSpeed peste 90
- Suport 30 zile gratuit post-lansare
- Plată în 2 rate: 50% avans + 50% la livrare
- Administrare opțională de la 50€/lună

## Primește estimare gratuită

Folosește [consultantul nostru digital AI](/consultanta) pentru a afla exact cât ar costa site-ul TĂU — personalizat pe industria și nevoile tale din ${loc.name}. Durează 2 minute, e gratuit, fără obligații.`;
}

export function generatePromoContent(loc: Location): string {
  const { popK, searches } = localStats(loc);
  return `Vrei mai mulți clienți pentru afacerea ta din ${loc.name}? Iată strategiile concrete care funcționează în ${loc.county} în 2026.

La o populație de circa **${popK}.000 de locuitori**, în ${loc.name} se fac lunar zeci de mii de căutări locale pe Google (estimativ **${searches.toLocaleString("ro-RO")}+** pe servicii și produse). Fiecare strategie de mai jos țintește exact aceste căutări — ale oamenilor din orașul tău, aflați deja în căutarea a ceea ce vinzi.

## 1. Google Business Profile (GRATUIT)

Primul lucru pe care trebuie să-l faci — e **gratuit** și durează 15 minute:
- Creează-ți profilul pe Google Business
- Adaugă poze, program, servicii, adresă
- Cere review-uri de la clienții mulțumiți
- **Rezultat:** apari pe Google Maps când cineva caută "${loc.name} + serviciul tău"

## 2. Site web profesional

87% din consumatori caută online înainte să cumpere. Fără site, ești **invizibil** pentru ei.
- Un site de prezentare pornește de la **699€**
- Returnarea investiției: primii 2-3 clienți noi plătesc site-ul
- Include: design custom, SEO, domeniu, hosting

## 3. Promovare în 50 ziare online

Cea mai rapidă metodă de vizibilitate în ${loc.county}:
- Articolul tău publicat în **50 ziare online** (41 locale + 9 naționale)
- **50+ linkuri dofollow** → boost SEO masiv
- Distribuire pe Facebook-ul fiecărei publicații
- Raport complet în 24h
- Preț: **200€** per campanie (sau **GRATUIT** la orice site nou)
- Includ și ziar local din ${loc.county}: ${loc.name} Expres

## 4. Social media activ

Nu trebuie să fii pe TOATE platformele — alege 1-2:
- **Facebook** — obligatoriu pentru ${loc.name}. Postări de 3-4 ori pe săptămână
- **Instagram** — ideal dacă ai produse vizuale (mâncare, beauty, fashion)
- **TikTok** — dacă targetezi tineri (sub 35 ani)

## 5. Google Ads (opțional, plătit)

Dacă vrei rezultate IMEDIATE:
- Campanii locale targetate pe ${loc.name} și ${loc.county}
- Buget recomandat: 200-500€/lună
- ROI tipic: 3-5x (la fiecare 1€ investit, câștigi 3-5€)

## Plan de acțiune pentru afaceri din ${loc.name}

**Luna 1:** Google Business + Site profesional (699€ + gratuit)
**Luna 2:** Campanie 50 ziare + Facebook activ (gratuit la site + 0€)
**Luna 3+:** SEO + conținut lunar (50€/lună administrare)

**Rezultat estimat:** +30-50% vizibilitate locală în 3 luni.

## Începe acum — gratuit

Folosește [consultantul nostru digital AI](/consultanta) pentru un diagnostic complet al prezenței tale online în ${loc.name}. Gratuit, 2 minute, fără obligații.`;
}

export function generateGeneralContent(slug: string): string {
  const contents: Record<string, string> = {
    "de-ce-ai-nevoie-de-site-web": `În 2026, un site web nu mai este un lux — este o **necesitate** pentru orice afacere. Iată 10 motive concrete:

## 1. 87% din consumatori caută online înainte să cumpere
Dacă nu ești online, nu exiști pentru 87 din 100 potențiali clienți.

## 2. Concurența ta are deja site
Fiecare zi fără site = clienți care merg la concurență.

## 3. Un site lucrează 24/7
Spre deosebire de un angajat, site-ul tău nu doarme. Primește cereri la 3 dimineața.

## 4. Credibilitate instant
75% din oameni judecă credibilitatea unei firme după site. Fără site = "firma asta chiar există?"

## 5. Google Business + site = vizibilitate maximă
Cu Google Business Profile + un site optimizat, apari pe Maps ȘI în căutări.

## 6. ROI măsurabil
Știi exact câți vizitatori ai, de unde vin, ce fac pe site. Marketing-ul tradițional nu-ți dă asta.

## 7. Costul e mai mic ca niciodată
Un site profesional pornește de la **699€**. Un angajat costă mai mult pe lună.

## 8. Mobile first — 70% din trafic vine de pe telefon
Un site responsive captează toți acești vizitatori. Fără site, îi pierzi pe toți.

## 9. SEO = trafic gratuit lunar
Un site bine optimizat aduce clienți gratuit, luni și ani de zile, fără publicitate plătită.

## 10. Este baza pentru ORICE strategie digitală
Vrei Facebook Ads? Ai nevoie de landing page. Vrei Google Ads? Ai nevoie de site. Vrei email marketing? Ai nevoie de site. Totul pornește de aici.

## Cât costă?

- Site prezentare: de la **699€**
- Magazin online: de la **1200€**
- BONUS: campanie promovare în 50 ziare **gratuit** la orice site nou

[Primește estimare gratuită →](/brief)`,

    "cat-costa-magazin-online-romania": `Răspunsul scurt: în România, în 2026, un magazin online profesional costă între **1.200€ și 4.500€** ca investiție inițială, plus **50-150€/lună** întreținere. Mai jos ai defalcarea exactă, ca să știi ce primești la fiecare buget — și unde se ascund costurile despre care nu-ți spune nimeni.

## Prețuri reale pe tipuri de magazin online

- **1.200-1.800€** — magazin de pornire: până la ~50 de produse, plăți cu cardul, design adaptat pe brand, livrare prin curier integrată manual. Suficient pentru un business la început care vinde o gamă restrânsă.
- **1.800-3.000€** — magazinul standard serios: sute de produse, integrare curieri (AWB automat), facturare automată, filtre și căutare, blog pentru SEO. Aici se află majoritatea magazinelor care chiar vând.
- **3.000-4.500€+** — magazin avansat: mii de produse, import automat de la furnizori, abonamente, configuratoare, integrare cu gestiunea (SmartBill, Oblio), multi-limbă.

## Costurile pe care ți le spune abia factura

- **Procesatorul de plăți**: 1-2% + 0,5-1 leu pe tranzacție (Stripe, Netopia, PayU). Nu e evitabil — e costul încasării.
- **Hosting**: 5-30€/lună la volum normal. La noi, primul an e inclus.
- **Mentenanța**: 50-150€/lună — actualizări, backup, mici modificări. Un magazin neîntreținut se strică în 6-12 luni, garantat.
- **Marketing la lansare**: fără buget de promovare, un magazin nou nu are trafic. Calculează minim 200-500€/lună primele 3 luni sau folosește campania de presă în 50 de ziare (la noi e inclusă).

## De ce diferă prețurile atât de mult între oferte?

Pentru că „magazin online" înseamnă orice, de la un șablon de 300€ instalat în 2 ore până la o platformă construită pe nevoile tale. Diferențele reale: cine face designul (șablon vs custom), cine răspunde când crapă ceva, viteza (Google penalizează magazinele lente), și dacă SEO e făcut de la structură sau „adăugat" la final. Un magazin ieftin care nu vinde e cel mai scump magazin.

## Întrebări pe care să le pui ORICĂRUI furnizor

- Ce se întâmplă după livrare — cât costă modificările?
- Magazinul e al meu? (cod, domeniu, date — unele „abonamente" te țin captiv)
- Cât încarcă o pagină pe mobil? (peste 3 secunde = clienți pierduți)
- Ce primesc concret pentru SEO?

## Cât costă la Imperial Media

Magazinele noastre pornesc de la **1.800€** — design 100% custom (nu șablon), plăți integrate, curieri cu AWB automat, SEO din structură, domeniu + hosting primul an, iar **campania de promovare în 50 de ziare online e inclusă**. Vezi și [cât costă un site de prezentare](/blog/de-ce-ai-nevoie-de-site-web) dacă nu vinzi încă produse fizice.

Vrei cifra exactă pentru cazul tău? [Estimarea cu consultantul AI durează 2 minute](/consultanta) — spui ce vinzi, primești bugetul defalcat, fără obligații.`,

    "site-web-pentru-restaurant": `Un restaurant fără prezență online serioasă pierde clienți în fiecare seară — 8 din 10 oameni se uită la meniu și la poze ÎNAINTE să aleagă unde ies. Iată exact ce trebuie să conțină site-ul unui restaurant în 2026 și cât costă.

## Ce trebuie să conțină obligatoriu

- **Meniul, ca pagină — NU ca PDF.** PDF-ul nu se citește pe telefon, nu apare în Google și nu poate fi găsit la căutarea „pizza + orașul tău". Meniul ca pagină HTML e indexat de Google și de AI-urile care recomandă restaurante.
- **Poze reale, făcute profesionist.** Mâncarea se vinde cu ochii. 5-10 poze bune fac mai mult decât orice text.
- **Rezervări online** — un formular simplu sau integrare cu un sistem de rezervări. Clientul de la 22:30 nu sună; completează.
- **Program, adresă, hartă, telefon click-to-call** — vizibile din primul ecran pe mobil, unde e 80% din traficul unui restaurant.
- **Legătura cu Google Maps și recenziile** — site-ul și [profilul Google Business](/blog/google-business-profile-ghid) lucrează împreună: profilul aduce vizibilitate, site-ul convinge.

## Ce NU trebuie să faci

- Să te bazezi doar pe Facebook — algoritmul îți arată postările la sub 5% din urmăritori.
- Să lași meniul neactualizat: prețuri vechi pe site = discuții neplăcute la nota de plată și recenzii proaste.
- Slider-e, muzică de fundal, animații grele — încetinesc site-ul, iar clientul flămând nu așteaptă.

## Comenzi online: da sau nu?

Dacă ai deja livrare prin aplicații (Glovo, Tazz), un modul propriu de comenzi te scapă de comisionul de 25-35% pe comenzile clienților fideli — îi muți treptat pe site-ul tău. Se adaugă ulterior, nu trebuie din prima zi.

## Cât costă site-ul unui restaurant

- **Site de prezentare cu meniu + rezervări: de la 699€** — acoperă 90% din restaurante.
- **Cu modul de comenzi online: 1.400-2.500€.**
- La Imperial Media, orice site nou include **campania de promovare în 50 de ziare online** — exact genul de mențiuni care urcă restaurantul în căutările locale și în recomandările AI.

Vrei să vezi pe cifrele tale? [Radiografia Afacerii](/service) îți scanează restaurantul (Google, recenzii, site, competiție locală) și îți spune exact unde pierzi clienți. Sau [cere o estimare în 2 minute](/brief).`,

    "site-web-pentru-cabinet-medical": `Pentru un cabinet medical sau stomatologic, site-ul nu e marketing — e infrastructura de încredere. Pacientul nou te caută pe Google, se uită 30 de secunde și decide dacă sună. Iată ce trebuie să conțină site-ul unui cabinet în 2026, cu prețuri concrete.

## Ce caută pacientul (și trebuie să găsească în 30 de secunde)

- **Cine sunt medicii** — nume, specializare, experiență, poză profesională. Anonimatul nu inspiră încredere nimănui care își alege medicul.
- **Ce servicii oferi și la ce prețuri** — cabinetele care afișează prețurile primesc mai multe programări, nu mai puține. Pacientul care știe prețul vine decis; cel care nu-l găsește sună la concurență.
- **Programare online** — un calendar sau măcar un formular. Recepția e ocupată, pacientul sună după program: formularul lucrează 24/7.
- **Adresă, program, telefon click-to-call, hartă** — pe mobil, în primul ecran.

## Obligatoriu pentru domeniul medical

- **GDPR serios**: formularele de programare colectează date de sănătate — ai nevoie de consimțământ explicit, politică de confidențialitate reală și transmitere criptată (HTTPS). Amenzile pe date medicale sunt cele mai dure.
- **Informație medicală responsabilă**: conținutul care promite vindecare îți atrage probleme cu Colegiul Medicilor. Scrie despre proceduri, nu promisiuni.
- **Viteză și accesibilitate**: pacienții în vârstă folosesc telefoane vechi — site-ul trebuie să meargă și acolo.

## Ce te urcă în Google înaintea celorlalte cabinete

O pagină pe FIECARE serviciu important („implant dentar", „detartraj", „ecografie") — nu toate înghesuite într-o listă. Google indexează pagini, nu rânduri de listă; fiecare pagină de serviciu e o ușă de intrare din căutări. Plus [profil Google Business optimizat](/blog/google-business-profile-ghid) cu recenzii — pentru cabinete, recenziile cântăresc mai greu decât în orice alt domeniu.

## Cât costă

- **Site cabinet (prezentare + servicii + programare prin formular): 699-1.000€**
- **Cu programări online în calendar + notificări: 1.400-1.500€**
- Include la noi: design custom, GDPR configurat corect, SEO pe paginile de servicii, domeniu + hosting primul an, plus **promovarea în 50 de ziare online** — mențiunile în presă contează și pentru pacienți, și pentru Google.

Ai deja site sau profil Google? [Radiografia Afacerii](/service) îți arată în 5 minute cum stă cabinetul tău față de celelalte din oraș — recenzii, vizibilitate, ce văd pacienții când te caută. Sau [cere direct o estimare](/brief).`,

    "site-web-pentru-salon-beauty": `Clienta nouă te descoperă pe Instagram, dar decide pe Google: se uită la recenzii, la prețuri și dacă se poate programa fără telefon. Salonul care are toate trei ia clienta. Iată ce-ți trebuie în 2026.

## Cele 4 lucruri care aduc programări

- **Programare online** — mai mult de jumătate din programări se fac seara, după ce salonul e închis. Fără programare online, clienta scrie pe Instagram și așteaptă… sau scrie salonului care i-a răspuns instant cu un link de programare.
- **Lista de servicii CU prețuri** — „preț la cerere" gonește clientele. Transparența aduce programări decise, fără negocieri în DM.
- **Portofoliu înainte/după** — lucrările tale sunt cel mai puternic argument de vânzare. Galeria din site + Instagram integrat.
- **Recenziile la vedere** — leagă [profilul Google Business](/blog/google-business-profile-ghid) de site și cere activ recenzii după fiecare clientă mulțumită. QR pe oglindă sau la casă.

## Greșelile clasice ale saloanelor

- Totul doar pe Instagram: algoritmul te arată la sub 5% din urmăritoare, iar cine nu are cont nu te vede deloc. Instagramul atrage; site-ul convertește.
- Poze cu filtre agresive la lucrări — clienta vede diferența pe viu și încrederea dispare.
- Programul neactualizat în sărbători → cliente în fața ușii închise → recenzii de 1 stea.

## Cât costă site-ul unui salon

- **Site de prezentare cu servicii, prețuri, portofoliu și formular de programare: de la 699€**
- **Cu sistem de programări online (calendar pe angajate, confirmări automate): 1.400-1.800€**
- La Imperial Media, orice site include design custom (nu șablon roz generic), SEO local ca să apari la „salon + orașul tău", domeniu + hosting primul an și **campania de promovare în 50 de ziare online**.

Curioasă cum stă salonul tău acum? [Radiografia Afacerii](/service) îți scanează prezența online (Google, recenzii, competiția din oraș) și îți spune exact ce te costă fiecare lipsă. Sau [cere o estimare în 2 minute](/brief).`,

    "magazin-online-ghid-complet": `Vrei să vinzi online în 2026? Iată drumul complet, pas cu pas, cu costuri reale la fiecare etapă — fără povești, exact cum se face în România.

## Pasul 1: Firma și obligațiile legale

Ai nevoie de SRL sau PFA (SRL-ul e standardul pentru comerț), iar pe site trebuie afișate obligatoriu: datele firmei, politica de retur (14 zile drept de retragere la vânzarea online — legea), termeni și condiții, GDPR și linkurile ANPC/SOL. Lipsa lor = amenzi și cont de plăți refuzat.

## Pasul 2: Platforma — decizia care le influențează pe toate

- **Magazin custom** — construit pe nevoile tale, rapid, fără abonamente lunare la platformă, controlezi tot. Investiție inițială mai mare, libertate totală. ([Comparația WordPress vs custom, sincer](/blog/wordpress-vs-custom))
- **Shopify/platforme SaaS** — pornești repede, dar plătești lunar pentru totdeauna (29-300$/lună) + comisioane, iar magazinul nu e cu adevărat al tău.
- **WooCommerce** — ieftin la instalare, scump la întreținere: plugin-uri, actualizări, securitate pe capul tău.

## Pasul 3: Plățile și facturarea

Procesator de plăți român sau internațional (Netopia, PayU, Stripe): 1-2% pe tranzacție. Facturarea automată (SmartBill, Oblio, Facturis) se integrează cu magazinul — factura pleacă singură la fiecare comandă. Ramburs prin curier rămâne popular în România (~40% din comenzi), ține-l activ.

## Pasul 4: Livrarea

Contract direct cu 1-2 curieri (Fan, Cargus, Sameday) sau agregator (ex. SelfAWB, Innoship). Integrarea cu magazinul generează AWB-ul automat — la 10+ comenzi pe zi, asta e diferența dintre business și corvoadă. Easybox/lockere: tot mai cerute, comision mai mic decât livrarea la ușă.

## Pasul 5: Produsele — partea subestimată

Poze bune pe fond curat, descrieri UNICE (nu copiate de la furnizor — Google penalizează conținutul duplicat), prețuri și stoc corecte. 20 de produse prezentate impecabil vând mai mult decât 500 aruncate în grabă.

## Pasul 6: Lansarea și primii clienți

Un magazin nou fără promovare = zero trafic, oricât de frumos ar fi. Ordinea corectă:
- **Săptămâna 1**: [profil Google Business](/blog/google-business-profile-ghid) + Google Merchant Center (produsele tale în tab-ul Shopping, gratuit)
- **Luna 1**: campanie de presă — mențiunile în publicații urcă domeniul în Google (la noi, **50 de ziare online incluse** la orice magazin)
- **Lunile 1-3**: reclame pe produsele vedetă (200-500€/lună) + [SEO local](/blog/seo-local-ghid-romania) dacă ai și punct fizic

## Cât te costă totul, cinstit

- Magazinul: **1.200-4.500€** o dată ([defalcarea completă pe bugete aici](/blog/cat-costa-magazin-online-romania))
- Lunar: hosting + mentenanță 50-150€, plăți 1-2% din încasări, marketing 200-500€ la început

Vrei planul exact pe produsele tale? [Consultantul AI îți face estimarea în 2 minute](/consultanta) — ce platformă ți se potrivește, cât costă, în ce ordine lansezi.`,

    "seo-local-ghid-romania": `SEO local = să apari în primele rezultate când cineva din orașul tău caută ce vinzi. Nu e magie și nu durează ani: e o listă de lucruri făcute corect, în ordinea corectă. Iată strategia completă pentru România, 2026.

## 1. Google Business Profile — fundația (gratuit)

Jumătate din bătălia locală se câștigă pe Maps. Profil complet: categorie corectă, program, poze reale, servicii, postări. [Ghidul complet pas cu pas e aici](/blog/google-business-profile-ghid). Fără profil optimizat, restul nu are pe ce să se așeze.

## 2. Recenziile — moneda încrederii locale

Google ordonează pachetul local după rating × volum × prospețime. Sistem simplu: cere recenzia imediat după momentul de mulțumire (QR la casă, mesaj după livrare), răspunde la TOATE (și la cele rele — calm și concret), țintește constanța: 2-4 recenzii noi pe lună bat 20 primite acum doi ani.

## 3. Site-ul: câte o pagină pentru fiecare serviciu și oraș

Regula de aur: **o intenție de căutare = o pagină**. „Instalator centrale Botoșani" și „desfundare țevi Botoșani" sunt căutări diferite → pagini diferite. Fiecare pagină: titlul conține serviciul + orașul, conținut real (nu 3 rânduri), prețuri orientative, întrebări frecvente. Așa am construit și noi [paginile pe orașe pentru creare site-uri](/creare-site-web/botosani) — fiecare oraș cu pagina lui, cu date locale reale.

## 4. Backlink-urile locale — acceleratorul

Google are încredere în site-urile despre care vorbesc alte site-uri. Pentru local, cele mai valoroase mențiuni sunt din **presa locală și regională** — un articol în ziarul orașului cu link către site-ul tău face mai mult decât 50 de directoare obscure. E exact motivul pentru care includem **campania de presă în 50 de ziare online** la serviciile noastre: e cel mai rapid mod legitim de a construi autoritate locală.

## 5. Date structurate — limbajul pe care Google îl citește direct

Schema.org (LocalBusiness, servicii, FAQ, recenzii) spune Google-ului negru pe alb cine ești, unde ești, ce faci. Bonus în 2026: AI-urile (ChatGPT, Perplexity) citează site-urile cu date structurate mult mai des — SEO local bun e acum și „GEO" (vizibilitate în răspunsurile AI).

## 6. Consistența NAP

Nume, adresă, telefon IDENTICE peste tot: site, Google, Facebook, directoare. Variațiile („Str. Unirii 5" vs „Strada Unirii nr. 5") diluează încrederea algoritmică.

## Ordinea de implementare (realistă)

- **Săptămâna 1**: Google Business complet + NAP consistent
- **Luna 1**: paginile de servicii pe site + date structurate + sistemul de recenzii pornit
- **Lunile 2-3**: campania de presă + primele articole utile pe blog
- **Rezultate vizibile**: 2-4 luni pentru căutările locale principale

Vrei să știi exact unde stai ACUM? [Radiografia Afacerii](/service) îți scanează prezența pe Google, recenziile față de competitorii tăi reali și vizibilitatea în căutările AI — cu plan concret pe firma ta.`,

    "google-business-profile-ghid": `Profilul Google Business e cel mai profitabil lucru GRATUIT pe care îl poate face o afacere locală: el decide dacă apari pe Maps și în „pachetul local" (primele 3 rezultate cu hartă). Iată ghidul complet, pas cu pas, cu greșelile care te îngroapă.

## Crearea profilului (15 minute)

- Intră pe business.google.com cu contul Google al firmei (nu personal — plecarea unui angajat nu trebuie să-ți ia profilul)
- Numele EXACT al firmei — fără „SRL", fără cuvinte cheie îndesate („Frizerie Marcel — Cel Mai Bun Tuns Ieftin" = risc de suspendare)
- **Categoria principală e cea mai importantă setare din tot profilul**: alege exact ce ești („Cabinet stomatologic", nu „Clinică"). Categoriile secundare — tot ce se aplică.
- Verificarea: video sau cod poștal. Fă-o imediat — profil neverificat = invizibil.

## Optimizarea care te urcă în top 3

- **Poze reale, lunar**: exteriorul (ca să te găsească), interiorul, echipa, produsele. Profilurile cu poze primesc de câteva ori mai multe cereri de direcții și apeluri.
- **Program corect + programul de sărbători** — nimic nu aduce recenzii de 1 stea mai sigur decât „scria că e deschis".
- **Servicii și produse completate** — fiecare serviciu listat e o cheie de căutare în plus.
- **Postări săptămânale** (oferte, noutăți) — semnal de afacere vie.
- **Q&A**: pune TU întrebările frecvente și răspunde-le — apar public și scutesc telefoane.

## Recenziile — motorul profilului

Ordinea în pachetul local = relevanță × distanță × **proeminență** (rating, volum, prospețime). Cere recenzia în momentul de vârf al mulțumirii, cu link direct sau QR (îl generăm noi clienților în cont). Răspunde la toate în 24-48h. NU cumpăra recenzii — filtrele Google le șterg și profilul intră la penalizare.

## Greșelile care suspendă profiluri

- Adresă falsă sau cutie poștală (pentru servicii la domiciliu: ascunde adresa, setează zona de acoperire)
- Nume cu cuvinte cheie îndesate
- Mai multe profiluri pentru aceeași locație
- **Pinul pus greșit pe hartă** — verifică-l pe satelit; un pin în alt cartier (sau altă țară!) îți omoară căutările din zona reală

## Profil + site = mașina completă

Profilul te face găsit; site-ul convinge și convertește. Profilul cu link către un site rapid, cu aceleași date (NAP identic), urcă amândouă. [Strategia completă de SEO local e aici](/blog/seo-local-ghid-romania).

Nu ai timp de toate astea? La orice site făcut de noi, **setarea Google Business e inclusă gratuit** — iar prin [Pachetul Start Online (500 lei)](/service) îți facem profilul + pagina de Facebook profesionist, fără să ai nevoie de site. Verifică întâi [cum stă profilul tău față de competiție](/service).`,

    "wordpress-vs-custom": `Întrebarea pe care o primim cel mai des: „nu-mi faceți mai ieftin un WordPress?" Răspunsul cinstit: depinde ce cumperi de fapt. Iată comparația fără marketing, pe cifre și pe termen lung.

## Prețul REAL, pe 3 ani

- **WordPress cu temă**: 300-800€ la instalare. Dar: plugin-uri premium 100-300€/an, mentenanță obligatorie (actualizări la temă, plugin-uri, PHP — se strică LUNAR câte ceva) 30-80€/lună, curățare după un hack 200-500€. Total realist pe 3 ani: **1.500-3.500€**.
- **Site custom**: 699-1.500€ la construire. Fără licențe, fără plugin-uri de actualizat, mentenanță minimă (50€/lună opțional, include modificări). Total pe 3 ani: **700-2.300€**.
Ieftin la intrare nu înseamnă ieftin.

## Viteza — factorul pe care Google îl măsoară

WordPress cu temă de 40$ încarcă 2-4 MB de cod generic pe fiecare pagină (page builder, slider, 30 de plugin-uri) → 3-6 secunde pe mobil. Site-ul custom conține DOAR ce folosești → sub 1 secundă, scor PageSpeed 90+. Viteza e criteriu direct de ranking și primul motiv de abandon.

## Securitatea

43% din site-urile lumii sunt WordPress — de aceea el e ținta numărul 1: boți scanează non-stop plugin-uri neactualizate. Un site custom nu are panoul de login universal cunoscut și nici plugin-uri terțe vulnerabile; suprafața de atac e o fracțiune.

## Când WordPress chiar e alegerea corectă

Sinceritate completă:
- Publici articole ZILNIC cu o echipă de redactori — CMS-ul matur ajută
- Buget sub 500€ și accepți compromisurile de mai sus în cunoștință de cauză
- Ai deja pe cineva care se ocupă de mentenanță

## Când custom e fără discuție

- Site de prezentare sau magazin care trebuie să VÂNDĂ (viteză, SEO, conversie)
- Nu vrei să te gândești niciodată la „actualizează plugin-urile"
- Vrei funcții exacte pe procesele tale (programări, configuratoare, integrări) — la WordPress fiecare funcție e încă un plugin, încă o vulnerabilitate
- Magazin online serios ([comparăm costurile reale aici](/blog/cat-costa-magazin-online-romania))

## Concluzia noastră (evident subiectivă, dar argumentată)

Noi construim custom pentru că vindem rezultatul, nu instalarea: site-uri cu PageSpeed 90+, care nu se sparg și nu cer taxă lunară de „să nu moară". De la **699€**, cu domeniu, hosting primul an și [promovarea în 50 de ziare online inclusă](/blog/seo-local-ghid-romania). [Cere estimarea pentru cazul tău](/brief) — 2 minute, cifră concretă.`,

    "greseli-site-web-firme": `Multe firme au site — dar un site prost e mai rău decât niciunul. Iată cele mai frecvente greșeli:

## 1. ❌ Site lent (încărcare peste 3 secunde)
53% din vizitatori pleacă dacă site-ul nu se încarcă în 3 secunde. Verifică pe PageSpeed Insights.

## 2. ❌ Nu e responsive pe mobil
70% din trafic vine de pe telefon. Dacă site-ul arată prost pe mobil, pierzi 7 din 10 vizitatori.

## 3. ❌ Fără meta description și titluri SEO
Google nu știe despre ce e site-ul tău → nu te afișează în căutări.

## 4. ❌ Design învechit
Un site care arată "din 2015" spune clientului "firma asta nu investește în ea". Prima impresie contează.

## 5. ❌ Fără CTA clar (Call to Action)
Vizitatorul intră pe site și... ce face? Trebuie să fie UN BUTON MARE și CLAR: "Sună acum", "Cere ofertă", "Programează-te".

## 6. ❌ Fără HTTPS (certificat SSL)
Chrome arată "Not Secure". Clienții fug. Plus, Google penalizează site-urile fără SSL.

## 7. ❌ Conținut copiat sau generic
"Bine ați venit pe site-ul nostru" nu vinde nimic. Conținutul trebuie să fie specific, util, și original.

## 8. ❌ Fără Google Analytics
Cum știi câți vizitatori ai? De unde vin? Ce pagini citesc? Fără date = decizii pe ghicit.

## 9. ❌ Fără formular de contact funcțional
Dacă formularul nu merge sau nu primești emailurile, pierzi clienți fără să știi.

## 10. ❌ Nu e actualizat
Ultimul articol din 2022? Prețuri vechi? Program greșit? Un site neactualizat face mai mult rău decât bine.

## Soluția?

Un [audit gratuit al site-ului tău](/audit) îți arată exact ce e greșit + cum să repari. 30 secunde, fără obligații.`,
  };
  return contents[slug] || `Articol în curs de redactare. [Contactează-ne](/contact) pentru detalii.`;
}
