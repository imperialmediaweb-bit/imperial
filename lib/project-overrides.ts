// Descrieri custom case-study per proiect. User-ul a dat info specifice
// pentru unele; altele primesc descrieri generate dinamic din categorii.

export type ProjectOverride = {
  tagline?: string; // Subtitle scurt punchy sub titlu
  challenge?: string; // Ce provocare am avut
  solution?: string; // Ce am livrat concret
  highlights?: string[]; // Badge-uri / features cheie ("Sistem rezervări", "Plăți online")
  results?: Array<{ label: string; value: string }>; // Stats rezultate
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

  return {
    tagline: hasEcommerce
      ? `Magazin online complet livrat pentru ${title}.`
      : `Prezență digitală premium livrată pentru ${title}.`,
    challenge: `${title} avea nevoie de o prezență online care să reflecte profesionalismul afacerii și să atragă clienți noi.`,
    solution: `Am livrat un site modern, optimizat pentru toate dispozitivele, cu design personalizat și toate funcționalitățile necesare.${hasMarketing ? " Am adăugat și o strategie de promovare pentru vizibilitate crescută." : ""}${hasMaintenance ? " Oferim mentenanță continuă pentru funcționare impecabilă." : ""}`,
    highlights: categories.slice(0, 5),
  };
}
