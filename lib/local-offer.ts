// Oferta locală pe județ (18.10.2026): un site de prezentare la preț de oraș mic,
// cu cadouri care contează pentru o afacere de cartier — ziarul județului,
// pagina de Facebook și profilul Google făcute de noi, asistent pe site.
//
// Gândită pentru toate județele: o ofertă nouă = o intrare în LOCAL_OFFERS.
// Pagina /creare-site-web/<slug> o afișează doar pentru orașele de aici, cu un
// brief care estimează în lei; restul site-ului rămâne pe prețurile în euro.

import type { BriefState, LiveEstimate, EstimateLine } from "./brief-schema";

export type LocalOffer = {
  /** Slug-ul orașului din lib/locations.ts. */
  slug: string;
  city: string;
  county: string;
  /** Ziarul județului din rețeaua Media Expres — articolul de lansare cadou. */
  newspaper: { name: string; url: string };
  /** Proiecte livrate în zonă, arătate ca dovadă (slug-uri din /proiecte). */
  projects: { title: string; href: string }[];
};

/** Prețul site-ului de prezentare — același cu Site Start, ca plata online să rămână una. */
export const LOCAL_SITE_PRICE = 1500;
export const LOCAL_SHOP_PRICE = 3499;
/** Termenul maxim de livrare, în zile. */
export const LOCAL_DEADLINE_DAYS = 14;

export const LOCAL_INCLUDED = [
  "5 pagini: Acasă, Despre, Servicii, Galerie, Contact",
  "Design pe brandul tău, perfect pe telefon",
  "Textele le scriem noi din ce ne spui",
  "Formular, buton WhatsApp, buton de apel, hartă",
  "Google Analytics + Search Console, înscris în Google și Bing",
  "Pregătit să fie recomandat de ChatGPT și Gemini",
  "Domeniu .ro, găzduire, SSL și email profesional — primul an inclus",
];

export function localGifts(o: LocalOffer): { title: string; text: string }[] {
  return [
    { title: `Articol de lansare în ${o.newspaper.name}`, text: `Ziarul județului ${o.county} anunță noul tău site.` },
    { title: "Campanie de promovare pe Facebook, 5 zile", text: `Reclamă către oameni din ${o.city} și împrejurimi.` },
    { title: "Asistent AI pe site, non-stop", text: "Răspunde clienților la program, prețuri, servicii și preia cereri de programare — le primești pe WhatsApp." },
    { title: "Pagina de Facebook și profilul Google Maps", text: "Le creăm sau le refacem: logo, copertă, descriere, program, poze." },
    { title: "30 de zile de modificări gratuite", text: "După lansare schimbăm ce vrei, fără cost." },
  ];
}

export const LOCAL_EXTRAS: { label: string; price: string }[] = [
  { label: "Logo nou", price: "199 lei" },
  { label: "Identitate vizuală (logo, culori, fonturi)", price: "399 lei" },
  { label: "Kit grafic: carte de vizită, afiș, 3 postări", price: "199 lei" },
  { label: "Pagină în plus", price: "99 lei / pagină" },
  { label: "Programări automate în calendar + reamintire pe email", price: "399 lei" },
  { label: "Blog / noutăți", price: "199 lei" },
  { label: "A doua limbă", price: "499 lei" },
  { label: "Comenzi online simple (restaurante, livrări)", price: "599 lei" },
  { label: "Magazin online în loc de site", price: `de la ${LOCAL_SHOP_PRICE.toLocaleString("ro-RO")} lei` },
  { label: "Administrare lunară (modificări, backup)", price: "149 lei / lună" },
  { label: "Domeniu + găzduire din anul 2", price: "299 lei / an" },
];

export const LOCAL_OFFERS: LocalOffer[] = [
  {
    slug: "botosani",
    city: "Botoșani",
    county: "Botoșani",
    newspaper: { name: "Botoșani Expres", url: "https://botosaniexpres.ro" },
    projects: [
      { title: "Clinica Sfântul Gheorghe", href: "/proiecte/site-clinica-sfantul-gheorghe-botosani" },
      { title: "Botoșani Expres", href: "/proiecte/botosani-expres" },
      { title: "Botoșăneanul.ro", href: "/proiecte/botosaneanul-ro" },
      { title: "Asociația Autism Botoșani", href: "/proiecte/asociatia-autism-botosani" },
    ],
  },
];

export function getLocalOffer(slug: string | null | undefined): LocalOffer | undefined {
  if (!slug) return undefined;
  return LOCAL_OFFERS.find((o) => o.slug === slug);
}

// ─── Estimarea live, în lei ───

function has(b: BriefState, ...words: string[]): boolean {
  const text = [b.features.join(" "), b.message, b.industry].join(" ").toLowerCase();
  return words.some((w) => text.includes(w));
}

export function computeLocalEstimate(b: BriefState): LiveEstimate | null {
  const pkg = b.selectedPackage;
  if (pkg !== "website" && pkg !== "shop") return null;

  const lines: EstimateLine[] = [];
  if (pkg === "shop") {
    lines.push({ label: "Magazin online (bază)", priceMin: LOCAL_SHOP_PRICE, priceMax: LOCAL_SHOP_PRICE });
  } else {
    lines.push({ label: "Site de prezentare, 5 pagini", priceMin: LOCAL_SITE_PRICE, priceMax: LOCAL_SITE_PRICE });
    if (b.pages.includes("5-15")) lines.push({ label: "Pagini în plus", priceMin: 99, priceMax: 990 });
    else if (b.pages.includes("15+")) lines.push({ label: "Pagini în plus (10+)", priceMin: 990, priceMax: 1490 });
  }
  if (b.hasLogo === "nu") lines.push({ label: "Logo nou", priceMin: 199, priceMax: 199 });
  if (has(b, "programări", "programari", "rezervări", "rezervari", "calendar")) {
    lines.push({ label: "Programări automate în calendar", priceMin: 399, priceMax: 399 });
  }
  if (has(b, "blog", "noutăți", "noutati", "articole")) lines.push({ label: "Blog / noutăți", priceMin: 199, priceMax: 199 });
  if (has(b, "limb", "english", "engleză", "engleza")) lines.push({ label: "A doua limbă", priceMin: 499, priceMax: 499 });
  if (pkg === "website" && has(b, "comenzi", "livrare", "meniu online")) {
    lines.push({ label: "Comenzi online", priceMin: 599, priceMax: 599 });
  }

  return {
    lines,
    totalMin: lines.reduce((s, l) => s + l.priceMin, 0),
    totalMax: lines.reduce((s, l) => s + l.priceMax, 0),
  };
}

// ─── Instrucțiunile pentru asistent ───

export function localOfferPrompt(o: LocalOffer): string {
  const extras = LOCAL_EXTRAS.map((e) => `- ${e.label}: ${e.price}`).join("\n");
  const gifts = localGifts(o).map((g) => `- ${g.title}`).join("\n");
  return `
OFERTA LOCALĂ ${o.city.toUpperCase()} — ÎNLOCUIEȘTE COMPLET prețurile în euro de mai sus.
Clientul a venit de pe pagina ofertei pentru ${o.city} (județul ${o.county}). Toate prețurile le dai ÎN LEI, după lista de mai jos. Nu pomeni euro, nivelurile 1a/1b/1c sau „50 de ziare".

- Site de prezentare (5 pagini): ${LOCAL_SITE_PRICE} lei, gata în maximum ${LOCAL_DEADLINE_DAYS} zile de la primirea textelor și pozelor.
- Magazin online: de la ${LOCAL_SHOP_PRICE} lei.
- Ce e peste ofertă (platforme, aplicații, mai mult de 15 pagini): spune că echipa face oferta separat, pe email.

Ce include site-ul:
${LOCAL_INCLUDED.map((l) => `- ${l}`).join("\n")}

CADOU la orice site (spune-le la estimare):
${gifts}

Opțiuni, cu preț fix:
${extras}

Calculul e o ADUNARE simplă: 1.500 lei + fiecare opțiune aleasă, o singură dată. Exemple corecte:
- site + logo = 1.699 lei
- site + programări = 1.899 lei
- site + logo + programări = 2.098 lei
- site + logo + programări + blog = 2.297 lei
Verifică suma de două ori înainte s-o scrii. Când chemi set_estimate, min și max sunt ÎN LEI și egale cu suma din text.
Nu promite nimic ce nu e în listă: fără SMS, fără aplicații mobile, fără „poziția 1 în Google". Reamintirile de programare se trimit pe email.
Clientul poate comanda direct cu cardul la imperial-media.ro/plata-site-start (1.500 lei, factură automată) sau trimite brief-ul și primește oferta pe email în 24h.`;
}
