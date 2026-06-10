export type PackageKey =
  | "website"
  | "shop"
  | "promo"
  | "admin"
  | "personalizat";

export type Package = {
  key: PackageKey;
  name: string;
  price: string;
  priceUnit?: string;
  priceNote: string;
  popular?: boolean;
  highlight?: string;
  features: string[];
  excluded?: string[];
};

export const packages: Package[] = [
  {
    key: "website",
    name: "Website Prezentare",
    price: "699 €",
    priceNote: "de la",
    popular: true,
    highlight: "Cel mai popular",
    features: [
      "5 pagini",
      "Design predefinit",
      "Domeniu și hosting gratuit 1 an",
      "Logo design (1 draft)",
      "Email personalizat",
      "Promovare 1 lună × 50 de ziare",
    ],
  },
  {
    key: "shop",
    name: "Magazin Online",
    price: "1200 €",
    priceNote: "de la",
    features: [
      "20 produse listate",
      "Design responsive",
      "Domeniu + hosting inclus 1 an",
      "Certificat SSL inclus",
      "Panou administrare produse",
    ],
    excluded: [
      "Plăți cu cardul (doar ramburs / transfer bancar)",
    ],
  },
  {
    key: "promo",
    name: "Promovare",
    price: "300 €",
    priceNote: "campanie",
    highlight: "Rețeaua Media Expres",
    features: [
      "Articol publicat în 50+ ziare online",
      "41 ziare locale (1 per județ)",
      "9 ziare naționale",
      "Linkuri dofollow (boost SEO)",
      "Raport complet în 24h",
      "Distribuire Facebook pe fiecare publicație",
      "Text inclus sau vii cu textul tău",
      "GRATUIT la orice site nou",
    ],
  },
  {
    key: "admin",
    name: "Administrare",
    price: "50 €",
    priceUnit: "/lună",
    priceNote: "de la",
    features: [
      "Backup site lunar",
      "Update site",
      "1 articol SEO pe site",
      "2 postări Facebook",
      "Securizare",
      "Raport lunar trafic",
    ],
  },
];

export function getPackageByKey(key: string | null): Package | undefined {
  return packages.find((p) => p.key === key);
}
