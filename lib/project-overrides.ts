// Descrieri custom case-study per proiect. User-ul a dat info specifice
// pentru unele; altele primesc descrieri generate dinamic din categorii.

export type ProjectOverride = {
  tagline?: string; // Subtitle scurt punchy sub titlu
  challenge?: string; // Ce provocare am avut
  solution?: string; // Ce am livrat concret
  highlights?: string[]; // Badge-uri / features cheie ("Sistem rezervări", "Plăți online")
  results?: Array<{ label: string; value: string }>; // Stats rezultate
  // Meta proiect — info scurte pt. bara sub hero
  client?: string; // Nume client / industrie
  industry?: string; // Industria (ex: Medical, Non-profit, eCommerce)
  year?: string; // Anul livrării
  duration?: string; // Durata proiectului (ex: "6 săptămâni")
  teamSize?: string; // Mărimea echipei (ex: "4 specialiști")
  // Obiective — ce își dorea clientul la început
  objectives?: string[];
  // Proces — etapele prin care am trecut
  process?: Array<{ title: string; description: string; duration?: string }>;
  // FAQ specific proiectului
  faq?: Array<{ question: string; answer: string }>;
  // Metrici de performanță (Lighthouse, LCP, etc.)
  metrics?: Array<{ label: string; value: string; hint?: string }>;
  // Livrabile concrete (nr. pagini, template-uri email, posts social etc.)
  deliverables?: Array<{ label: string; count: string }>;
  // Tehnologii folosite
  technologies?: string[];
  // Testimonial client
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
  };
  // Servicii livrate (pt. bara de meta)
  services?: string[];
};

export const projectOverrides: Record<string, ProjectOverride> = {
  "creare-website-asociatia-h-a-p-py": {
    tagline:
      "Platformă pentru rezervări evenimente la o asociație care schimbă vieți.",
    challenge:
      "Asociația H.A.P.PY avea nevoie de un site modern care să permită rezervarea automată de locuri la evenimente și workshopuri, fără ca echipa să răspundă manual la fiecare cerere.",
    solution:
      "Am construit o platformă completă cu sistem de rezervare online integrat, calendar dinamic de evenimente, formulare de înscriere custom, panou de administrare pentru echipa asociației și design emoțional care reflectă misiunea lor.",
    highlights: [
      "Sistem rezervări online",
      "Calendar evenimente dinamic",
      "Admin panel custom",
      "Formulare înscriere",
      "Mobile-first design",
    ],
    results: [
      { label: "Rezervări", value: "100%" },
      { label: "Automatizare", value: "24/7" },
      { label: "Satisfacție", value: "5/5" },
    ],
    client: "Asociația H.A.P.PY",
    industry: "Non-profit",
    duration: "6 săptămâni",
    teamSize: "4 specialiști",
    objectives: [
      "Automatizarea completă a procesului de rezervări evenimente",
      "Eliminarea răspunsurilor manuale pe email/telefon",
      "Vizibilitate crescută pentru workshopuri și programe",
      "Un admin panel pe care echipa să-l folosească fără training tehnic",
    ],
    process: [
      {
        title: "Discovery & research",
        description:
          "Interviuri cu echipa asociației, analiza competitorilor non-profit și definirea userflow-ului pentru rezervări.",
        duration: "Săptămâna 1",
      },
      {
        title: "UX & design emoțional",
        description:
          "Wireframing, design system cu paletă caldă și prototipuri interactive validate cu echipa H.A.P.PY.",
        duration: "Săptămânile 2-3",
      },
      {
        title: "Dezvoltare & integrări",
        description:
          "Implementare WordPress custom, sistem rezervări proprietar, email notifications, integrare calendar dinamic.",
        duration: "Săptămânile 3-5",
      },
      {
        title: "Testare & lansare",
        description:
          "QA pe mobile/desktop, training pentru administratori și go-live cu suport dedicat prima lună.",
        duration: "Săptămâna 6",
      },
    ],
    technologies: ["WordPress", "PHP", "Tailwind", "Custom booking", "Google Calendar API"],
    testimonial: {
      quote:
        "Echipa Imperial Media a înțeles imediat ce ne doream. Sistemul de rezervări ne-a salvat zeci de ore pe săptămână.",
      author: "Echipa H.A.P.PY",
      role: "Asociația H.A.P.PY",
    },
    services: ["Web development", "UI/UX design", "Branding", "Mentenanță"],
  },
  "dream-cleaning": {
    tagline:
      "Site de curățenie și DDD care captează lead-uri non-stop în zona locală.",
    challenge:
      "Firmă de curățenie cu zero prezență online. Clienții o găseau doar din gură în gură, iar ofertele se pierdeau pe telefon.",
    solution:
      "10+ pagini de prezentare, logo custom, optimizare SEO locală pentru termeni de căutare relevanți, campanii PPC targetate, formular de ofertă automatizat.",
    highlights: [
      "SEO local",
      "Campanii PPC",
      "Logo design",
      "Social Media",
      "Mentenanță inclusă",
    ],
    results: [
      { label: "Trafic", value: "+250%" },
      { label: "Lead-uri", value: "+180%" },
      { label: "Conversii", value: "+140%" },
    ],
    client: "Dream Cleaning",
    industry: "Servicii curățenie & DDD",
    duration: "5 săptămâni",
    teamSize: "3 specialiști",
    objectives: [
      "Prezență online profesionistă de la zero",
      "Captare lead-uri 24/7 prin formular de ofertă",
      "Top 3 Google pentru termeni locali de curățenie",
      "Identitate vizuală coerentă cu brand-ul firmei",
    ],
    process: [
      {
        title: "Brand discovery",
        description:
          "Workshop cu fondatorii, audit competiție locală și definirea tonului de comunicare.",
      },
      {
        title: "Branding & logo",
        description:
          "Moodboard, logo în 3 variante, ghid de stil și paletă cromatică aplicată pe toate asset-urile.",
      },
      {
        title: "Dezvoltare website",
        description:
          "10+ pagini custom cu design personalizat, formular ofertă inteligent, optimizare Core Web Vitals.",
      },
      {
        title: "SEO & PPC",
        description:
          "Keyword research local, on-page SEO complet, lansare campanii Google Ads cu tracking conversii.",
      },
    ],
    technologies: ["WordPress", "Elementor Pro", "Google Ads", "Search Console", "Meta Ads"],
    testimonial: {
      quote:
        "Au reușit să transforme o afacere necunoscută online într-un brand pe care clienții îl caută pe nume. Merită fiecare leu.",
      author: "Dream Cleaning",
      role: "Echipa Dream Cleaning",
    },
    services: ["Web development", "Branding", "SEO", "Google Ads", "Mentenanță"],
  },
  "ionut-bogdan-carausu": {
    tagline:
      "Site personal pentru un poet și militant civic — identitate premium.",
    challenge:
      "Personalitate publică fără un hub central unde să-și adune poeziile, proiectele și evenimentele pe care le organizează.",
    solution:
      "Website de tip brand personal cu secțiuni dedicate pentru activități, portofoliu, blog și contact direct. Design emoțional, foto editorial.",
    highlights: [
      "Brand personal",
      "Foto editorial",
      "Blog integrat",
      "SEO nume",
      "Social linked",
    ],
  },
  "botosaneanul-ro": {
    tagline:
      "Platformă de știri cu audiență masivă, optimizată pentru viteză și AdSense.",
    challenge:
      "Publicație online care avea nevoie de un redesign complet pentru a crește engagement-ul și veniturile din advertising.",
    solution:
      "Arhitectură modernă cu încărcare <1s, layout editorial premium, integrare Google News, zone de ads optimizate, panou de redactori simplu.",
    highlights: [
      "Viteză <1s",
      "Google News",
      "AdSense optim",
      "Editor UI",
      "Categorii dinamice",
    ],
  },
  "clinica-sfantul-nicolae": {
    tagline:
      "Site pentru clinică medicală — încredere + programări online rapide.",
    challenge:
      "Clinică cu mai multe specializări care avea nevoie de un site curat, profesional și un sistem simplu pentru pacienți să-și ia programare fără telefon.",
    solution:
      "Design clean medical, pagini dedicate fiecărei specializări, formular programări cu notificare automată către echipă, secțiune doctori, recenzii pacienți.",
    highlights: [
      "Programări online",
      "Pagini specializări",
      "Echipă doctori",
      "Recenzii pacienți",
      "Design medical",
    ],
  },
  "trafyt-ro": {
    tagline:
      "Soluție analytics pentru monitorizare trafic și statistici în timp real.",
    challenge:
      "Produs SaaS care avea nevoie de un landing care să explice clar beneficiile și să converteze vizitatori în trial-uri plătite.",
    solution:
      "Landing high-conversion cu features showcase, pricing tables, formular sign-up optimizat, demo video, testimoniale.",
    highlights: [
      "SaaS landing",
      "Pricing tables",
      "Sign-up optim",
      "Demo video",
      "A/B ready",
    ],
  },
  "asociatia-autism-botosani": {
    tagline:
      "Platformă pentru o asociație care luptă pentru copiii cu autism.",
    challenge:
      "Asociație care avea nevoie urgent de o platformă de donații online + vizibilitate pentru evenimentele de strângere de fonduri.",
    solution:
      "Site emoțional cu buton prominent de donație, platformă pentru evenimente, secțiune pentru părinți, contact direct.",
    highlights: [
      "Platformă donații",
      "Evenimente online",
      "Zonă părinți",
      "Știri",
      "Social strong",
    ],
  },
  "dream-movers-botosani": {
    tagline:
      "Firmă de mutări cu rezervare online și calculator de cost.",
    challenge:
      "Firmă de mutări care pierdea clienți din cauza lipsei unei modalități simple de a cere ofertă online.",
    solution:
      "Formular inteligent de estimare cost, calendar rezervări, flotă afișată vizual, testimoniale clienți, optimizare mobile pentru cererile rapide.",
    highlights: [
      "Estimare cost",
      "Rezervări online",
      "Flotă vizuală",
      "Mobile-first",
      "SEO local",
    ],
  },
  "gospodarasul-ro": {
    tagline: "Magazin online cu 500+ produse agro-food și livrare rapidă.",
    challenge:
      "Tranziție de la vânzare offline la eCommerce complet — catalog mare, inventar variabil, livrare diversă.",
    solution:
      "Magazin online cu panou admin pentru inventar, multiple metode de plată, integrare curier, zone de livrare, cupoane promoționale.",
    highlights: [
      "500+ produse",
      "Plăți online",
      "Integrare curier",
      "Cupoane promo",
      "Admin inventar",
    ],
  },
  "fundraising-academy": {
    tagline:
      "Platformă educațională pentru traineri în fundraising — cursuri și webinarii.",
    challenge:
      "Academie care voia să livreze cursuri online și să gestioneze comunitatea de cursanți într-un singur loc.",
    solution:
      "Platformă LMS customizată, cont utilizator, plăți cursuri, webinarii live, certificate automate la finalizare, forum discuții.",
    highlights: [
      "LMS custom",
      "Plăți cursuri",
      "Webinarii live",
      "Certificate",
      "Forum discuții",
    ],
  },
  "transport-marfa-mutari-botosani": {
    tagline:
      "Platformă pentru transport marfă și mutări — focus pe conversii telefonice.",
    challenge:
      "Firmă care avea nevoie să captureze cereri de ofertă cât mai rapid prin telefon sau formular.",
    solution:
      "Landing optimizat cu buton apel permanent vizibil, formular ofertă instant, galeria flotei, zonă clienți recurenți.",
    highlights: ["CTA telefon", "Ofertă instant", "Galerie flotă", "SEO local"],
  },
  "group-extra-site-de-prezentare": {
    tagline:
      "Site corporate pentru firmă de instalații — prezentare premium servicii.",
    challenge:
      "Firmă cu portofoliu divers care avea nevoie de un hub clar pentru toate serviciile oferite.",
    solution:
      "Site corporate multi-serviciu, pagini dedicate per specializare, portofoliu cu studii de caz, formular contact per serviciu.",
    highlights: [
      "Multi-serviciu",
      "Studii de caz",
      "Contact smart",
      "Corporate feel",
    ],
  },
  "cununa-film": {
    tagline:
      "Site pentru o echipă de videografie nunți — portofoliu cinematic.",
    challenge:
      "Cineaști care aveau nevoie de un portofoliu care să transmită emoție și să convertească browse-uitori în rezervări.",
    solution:
      "Hero cinematic cu autoplay video, portofoliu interactiv cu preview, formular rezervare cu calendar, pachete servicii.",
    highlights: [
      "Autoplay video",
      "Portofoliu interactiv",
      "Rezervări calendar",
      "Pachete vizuale",
    ],
  },
};

// Helper: case study pentru proiecte fără override explicit
export function getDefaultCaseStudy(
  title: string,
  categories: string[]
): ProjectOverride {
  const hasEcommerce = categories.some((c) =>
    /magazin|ecom|shop/i.test(c)
  );
  const hasMarketing = categories.some((c) =>
    /marketing|pr|promovare/i.test(c)
  );
  const hasMaintenance = categories.some((c) =>
    /mentenanț|admin/i.test(c)
  );
  const hasBranding = categories.some((c) => /brand/i.test(c));

  // Industrie inferată din categorii / titlu
  const industry = /asocia[țt]ia|fundraising/i.test(title)
    ? "Non-profit"
    : hasEcommerce
      ? "eCommerce"
      : /clinic|medical|doctor/i.test(title)
        ? "Medical"
        : /expres|news|ziar|botosanean/i.test(title)
          ? "Media & Publicații"
          : "Business local";

  const services: string[] = ["Web development"];
  if (hasBranding) services.push("Branding");
  if (hasMarketing) services.push("SEO", "PR & Marketing");
  if (hasEcommerce) services.push("eCommerce setup");
  if (hasMaintenance) services.push("Mentenanță");

  return {
    tagline: hasEcommerce
      ? `Magazin online complet livrat pentru ${title}.`
      : `Prezență digitală premium livrată pentru ${title}.`,
    challenge: `${title} avea nevoie de o prezență online care să reflecte profesionalismul afacerii și să atragă clienți noi.`,
    solution: `Am livrat un site modern, optimizat pentru toate dispozitivele, cu design personalizat și toate funcționalitățile necesare.${hasMarketing ? " Am adăugat și o strategie de promovare pentru vizibilitate crescută." : ""}${hasMaintenance ? " Oferim mentenanță continuă pentru funcționare impecabilă." : ""}`,
    highlights: categories.slice(0, 5),
    industry,
    duration: hasEcommerce ? "8 săptămâni" : "4 săptămâni",
    teamSize: "3 specialiști",
    objectives: [
      "Prezență online profesionistă, diferențiată de competiție",
      "Experiență de utilizare rapidă și clară pe mobile & desktop",
      hasMarketing
        ? "Vizibilitate crescută în motoarele de căutare locale"
        : "Comunicare clară a valorii business-ului",
      hasEcommerce
        ? "Flux de comandă simplu, cu mai multe metode de plată"
        : "Formular de contact optimizat pentru conversii",
    ],
    process: [
      {
        title: "Discovery & research",
        description:
          "Am analizat business-ul, competiția și publicul țintă pentru a defini strategia de comunicare.",
        duration: "Săptămâna 1",
      },
      {
        title: "Design & prototip",
        description:
          "Wireframing, moodboard și mockup-uri în high-fidelity, aprobate împreună cu clientul înainte de dev.",
        duration: "Săptămâna 2",
      },
      {
        title: "Dezvoltare",
        description:
          "Implementare pixel-perfect, optimizări performanță, SEO tehnic și integrări cu serviciile clientului.",
        duration: "Săptămânile 2-4",
      },
      {
        title: "Lansare & suport",
        description:
          "Testare pe dispozitive reale, setup analytics, training admin și suport post-lansare.",
        duration: "Săptămâna 4",
      },
    ],
    technologies: hasEcommerce
      ? ["WordPress", "WooCommerce", "Stripe", "Tailwind", "Google Analytics"]
      : ["WordPress", "Elementor", "Tailwind", "Google Analytics", "Search Console"],
    services,
    deliverables: [
      { label: "Pagini custom", count: "8+" },
      { label: "Iterații design", count: "3" },
      { label: "Dispozitive testate", count: "15+" },
      { label: "Ore suport post-launch", count: "30" },
    ],
    metrics: [
      { label: "Lighthouse Performance", value: "95+", hint: "Mobile & desktop" },
      { label: "Largest Contentful Paint", value: "<1.5s" },
      { label: "Core Web Vitals", value: "Passed" },
      { label: "SEO Score", value: "100/100" },
    ],
    faq: [
      {
        question: "Cât durează un proiect similar?",
        answer:
          "În medie între 4 și 8 săptămâni, în funcție de complexitate, numărul de pagini și integrările necesare. Îți dăm un timeline exact după prima discuție.",
      },
      {
        question: "Ce include prețul final?",
        answer:
          "Totul: design custom, dezvoltare, domeniu + hosting în primul an, SSL, setup analytics, optimizări de bază SEO și instrucțiuni pentru admin. Fără costuri ascunse.",
      },
      {
        question: "Pot modifica singur conținutul după lansare?",
        answer:
          "Da. Primești acces la un panou de administrare simplu + un scurt training video. În plus, ai 30 de zile de suport gratuit pentru orice întrebare.",
      },
      {
        question: "Oferiți mentenanță pe termen lung?",
        answer:
          "Absolut. Avem pachete de mentenanță lunară care includ update-uri, backup-uri, monitorizare uptime și modificări minore — fără stres pentru tine.",
      },
    ],
  };
}

// Extrage anul din URL-ul imaginilor WP: .../wp-content/uploads/YYYY/MM/...
export function extractYearFromImages(images?: string[]): string | null {
  if (!images || images.length === 0) return null;
  const match = images[0].match(/\/uploads\/(\d{4})\//);
  return match ? match[1] : null;
}

// Extrage luna din URL WP (pentru sortare mai fină in cadrul aceluiași an).
export function extractMonthFromImages(images?: string[]): number {
  if (!images || images.length === 0) return 0;
  const match = images[0].match(/\/uploads\/\d{4}\/(\d{2})\//);
  return match ? parseInt(match[1], 10) : 0;
}

// Sortează proiectele descrescător după an + lună (cele mai noi primele).
export function sortProjectsNewestFirst<
  T extends { wpImages?: string[] }
>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const yearA = parseInt(extractYearFromImages(a.wpImages) ?? "0", 10);
    const yearB = parseInt(extractYearFromImages(b.wpImages) ?? "0", 10);
    if (yearA !== yearB) return yearB - yearA;
    return extractMonthFromImages(b.wpImages) - extractMonthFromImages(a.wpImages);
  });
}
