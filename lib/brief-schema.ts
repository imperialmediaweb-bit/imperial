// Schema briefing-ului — partajată între client și server.
// AI-ul (Claude) umple aceste câmpuri prin tool use pe măsură ce discută cu clientul.

import type { PackageKey } from "./packages";

export type BriefState = {
  // Contact (email obligatoriu; telefon opțional)
  name: string;
  email: string;
  phone: string;

  // Proiect
  selectedPackage: PackageKey | "personalizat" | "";
  industry: string;
  currentSite: string;
  pages: string;
  deadline: string;

  // Design & features
  hasLogo: "da" | "nu" | "";
  colorsPreference: string;
  features: string[];
  inspiration: string;
  message: string;

  // Estimare generată de AI la final
  estimate: {
    min: number | null;
    max: number | null;
    currency: "EUR";
    reasoning: string;
  };

  // Control flow
  recommendedPackage: PackageKey | "personalizat" | "";
  recommendedReason: string;
  readyToSubmit: boolean;
};

export const emptyBrief: BriefState = {
  name: "",
  email: "",
  phone: "",
  selectedPackage: "",
  industry: "",
  currentSite: "",
  pages: "",
  deadline: "",
  hasLogo: "",
  colorsPreference: "",
  features: [],
  inspiration: "",
  message: "",
  estimate: { min: null, max: null, currency: "EUR", reasoning: "" },
  recommendedPackage: "",
  recommendedReason: "",
  readyToSubmit: false,
};

// Progres 0-100 în funcție de câmpurile umplute.
// Câmpurile "grele" (contact + pachet + industrie) cântăresc mai mult.
export function computeBriefProgress(b: BriefState): number {
  let score = 0;
  const w = {
    name: 12,
    email: 15,
    selectedPackage: 15,
    industry: 12,
    pages: 8,
    deadline: 6,
    hasLogo: 6,
    colorsPreference: 6,
    features: 10,
    inspiration: 5,
    message: 5,
  };
  if (b.name.trim().length >= 2) score += w.name;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) score += w.email;
  if (b.selectedPackage) score += w.selectedPackage;
  if (b.industry.trim().length >= 2) score += w.industry;
  if (b.pages) score += w.pages;
  if (b.deadline) score += w.deadline;
  if (b.hasLogo) score += w.hasLogo;
  if (b.colorsPreference.trim()) score += w.colorsPreference;
  if (b.features.length > 0) score += w.features;
  if (b.inspiration.trim()) score += w.inspiration;
  if (b.message.trim()) score += w.message;
  return Math.min(100, score);
}

// Validare minimă pentru a trimite brief-ul (nu blocăm pe estimate)
export function canSubmitBrief(b: BriefState): boolean {
  const nameOk = b.name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email);
  const pkgOk = !!b.selectedPackage;
  const industryOk = b.industry.trim().length >= 2;
  return nameOk && emailOk && pkgOk && industryOk;
}

// Schema JSON pentru tool_use-ul Claude. Trebuie să rămână sincronizată cu BriefState.
export const briefToolsJsonSchema = {
  update_brief: {
    name: "update_brief",
    description:
      "Actualizează briefing-ul clientului cu informațiile colectate. Apelează DE FIECARE DATĂ când afli ceva nou (nume, email, pachet, features, etc.). Trimite doar câmpurile care s-au schimbat.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Numele complet al clientului" },
        email: { type: "string", description: "Email valid" },
        phone: { type: "string", description: "Telefon (opțional)" },
        selectedPackage: {
          type: "string",
          enum: ["website", "shop", "promo", "admin", "personalizat"],
          description:
            "Pachetul potrivit: website=site prezentare (699€), shop=magazin online (1200€), promo=promovare (200€), admin=mentenanță (50€/lună), personalizat=altceva",
        },
        industry: { type: "string", description: "Domeniul de activitate" },
        currentSite: { type: "string", description: "URL-ul site-ului actual (dacă există)" },
        pages: {
          type: "string",
          enum: ["1-5 pagini", "5-15 pagini", "15+ pagini", "Nu știu încă"],
          description: "Număr estimat de pagini",
        },
        deadline: {
          type: "string",
          enum: ["Cât mai repede", "În 2-4 săptămâni", "În 1-2 luni", "Flexibil"],
          description: "Termen dorit",
        },
        hasLogo: { type: "string", enum: ["da", "nu"], description: "Are logo/identitate vizuală" },
        colorsPreference: { type: "string", description: "Preferințe de culori" },
        features: {
          type: "array",
          items: { type: "string" },
          description:
            "Funcționalități cerute (ex: Blog, Rezervări online, Plăți online, Multilimbă, CRM/Newsletter, Zonă de membri, Formular avansat, Galerie/Portofoliu, Hartă, Social media)",
        },
        inspiration: { type: "string", description: "Site-uri sau brand-uri de inspirație" },
        message: { type: "string", description: "Alte detalii importante" },
      },
    },
  },
  set_recommendation: {
    name: "set_recommendation",
    description:
      "Setează pachetul recomandat pentru client, pe baza conversației. Apelează doar când ești sigur (după ce ai aflat tipul de proiect).",
    input_schema: {
      type: "object" as const,
      properties: {
        package: {
          type: "string",
          enum: ["website", "shop", "promo", "admin", "personalizat"],
        },
        reason: {
          type: "string",
          description: "Un rând explicând de ce e potrivit (ex: 'Perfect pentru cabinet medical cu programări online')",
        },
      },
      required: ["package", "reason"],
    },
  },
  set_estimate: {
    name: "set_estimate",
    description:
      "Afișează o estimare ORIENTATIVĂ de buget (nu prețul final). Apelează doar la sfârșit, după ce ai aflat: pachet, număr pagini aproximativ, features, logo. Dă un range rezonabil (min-max). Calculul: website 699€ bază + 100€/feature complex + 150€ dacă nu are logo. Shop: 1200€ bază + 80€/feature + 150€ logo.",
    input_schema: {
      type: "object" as const,
      properties: {
        min: { type: "number", description: "Minim estimat în EUR" },
        max: { type: "number", description: "Maxim estimat în EUR" },
        reasoning: { type: "string", description: "O frază scurtă cu ce include estimarea" },
      },
      required: ["min", "max", "reasoning"],
    },
  },
  request_submit: {
    name: "request_submit",
    description:
      "Marchează brief-ul ca gata de trimis. Apelează doar după ce ai: nume + email + pachet + industrie + ai făcut rezumat în ultimul mesaj și ai întrebat clientul dacă e ok să trimitem.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
};
