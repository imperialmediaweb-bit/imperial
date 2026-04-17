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
  return LOCATIONS.filter((l) => l.isCountySeat).map((loc) => ({
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
  return LOCATIONS.filter((l) => l.isCountySeat).map((loc) => ({
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
    title: "Site web pentru restaurant — ce trebuie să includă și cât costă",
    description: "Ghid complet: meniu digital, rezervări online, galerie, comenzi. Ce funcționalități are nevoie un restaurant și cât costă implementarea.",
    category: "Industrii",
    date: "2026-04-08",
    readTime: "6 min",
    template: "general",
  },
  {
    slug: "site-web-pentru-cabinet-medical",
    title: "Site web pentru cabinet medical / stomatologic — ghid complet",
    description: "Programări online, profil medici, secțiune servicii, GDPR. Tot ce trebuie să știi despre un site medical profesional.",
    category: "Industrii",
    date: "2026-04-05",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "site-web-pentru-salon-beauty",
    title: "Site web pentru salon de beauty / coafor / spa — ce trebuie",
    description: "Programări online, portofoliu stilist, prețuri servicii. Ghid pentru saloane care vor clienți din online.",
    category: "Industrii",
    date: "2026-04-03",
    readTime: "5 min",
    template: "general",
  },
  {
    slug: "magazin-online-ghid-complet",
    title: "Cum să deschizi un magazin online în 2026 — ghid pas cu pas",
    description: "De la alegerea platformei la plăți, livrare și promovare. Tot ce trebuie să știi ca să vinzi online.",
    category: "E-commerce",
    date: "2026-04-01",
    readTime: "8 min",
    template: "general",
  },
  {
    slug: "seo-local-ghid-romania",
    title: "SEO local în România — cum să apari primul pe Google în orașul tău",
    description: "Google Business, cuvinte cheie locale, backlink-uri din ziare, reviews. Strategii SEO local testate pentru piața din România.",
    category: "SEO",
    date: "2026-03-28",
    readTime: "7 min",
    template: "general",
  },
  {
    slug: "google-business-profile-ghid",
    title: "Google Business Profile — ghid complet pentru afaceri locale",
    description: "Cum să-ți creezi și optimizezi profilul Google Business ca să apari pe Maps și în căutările locale. Pas cu pas.",
    category: "Marketing",
    date: "2026-03-25",
    readTime: "6 min",
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
    title: "WordPress vs site custom — ce e mai bun pentru afacerea ta?",
    description: "Comparație sinceră: preț, viteză, securitate, scalabilitate. Când merită WordPress și când ai nevoie de custom.",
    category: "Tehnologie",
    date: "2026-03-20",
    readTime: "5 min",
    template: "general",
  },
  {
    slug: "cat-costa-magazin-online-romania",
    title: "Cât costă un magazin online în România în 2026?",
    description: "Prețuri reale: de la 1200€ la 5000€+. Ce influențează prețul, ce include, și cum alegi furnizorul potrivit.",
    category: "E-commerce",
    date: "2026-03-18",
    readTime: "6 min",
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

export function generateCostContent(loc: Location): string {
  return `Un site web profesional în ${loc.name} pornește de la **699€** pentru un site de prezentare cu 5 pagini și de la **1200€** pentru un magazin online.

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
  return `Vrei mai mulți clienți pentru afacerea ta din ${loc.name}? Iată strategiile concrete care funcționează în ${loc.county} în 2026.

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
