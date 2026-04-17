// Toate localitățile din România pentru landing pages SEO.
// 41 județe + reședințe de județ + orașe mari cu >30k locuitori.

export type Location = {
  slug: string; // URL-friendly: "botosani", "cluj-napoca"
  name: string; // Nume cu diacritice: "Botoșani", "Cluj-Napoca"
  county: string; // Județul: "Botoșani", "Cluj"
  isCountySeat: boolean; // E reședință de județ
  population: number; // Estimat, pentru sortare
  region: string; // Moldova, Transilvania, Muntenia, etc.
};

export const LOCATIONS: Location[] = [
  // ─── MOLDOVA ───
  { slug: "botosani", name: "Botoșani", county: "Botoșani", isCountySeat: true, population: 106847, region: "Moldova" },
  { slug: "iasi", name: "Iași", county: "Iași", isCountySeat: true, population: 382484, region: "Moldova" },
  { slug: "suceava", name: "Suceava", county: "Suceava", isCountySeat: true, population: 124534, region: "Moldova" },
  { slug: "bacau", name: "Bacău", county: "Bacău", isCountySeat: true, population: 196883, region: "Moldova" },
  { slug: "piatra-neamt", name: "Piatra Neamț", county: "Neamț", isCountySeat: true, population: 114914, region: "Moldova" },
  { slug: "roman", name: "Roman", county: "Neamț", isCountySeat: false, population: 69483, region: "Moldova" },
  { slug: "vaslui", name: "Vaslui", county: "Vaslui", isCountySeat: true, population: 97067, region: "Moldova" },
  { slug: "galati", name: "Galați", county: "Galați", isCountySeat: true, population: 304340, region: "Moldova" },
  { slug: "focsani", name: "Focșani", county: "Vrancea", isCountySeat: true, population: 100229, region: "Moldova" },
  { slug: "barlad", name: "Bârlad", county: "Vaslui", isCountySeat: false, population: 69183, region: "Moldova" },
  { slug: "dorohoi", name: "Dorohoi", county: "Botoșani", isCountySeat: false, population: 30281, region: "Moldova" },
  { slug: "radauti", name: "Rădăuți", county: "Suceava", isCountySeat: false, population: 32396, region: "Moldova" },
  { slug: "campulung-moldovenesc", name: "Câmpulung Moldovenesc", county: "Suceava", isCountySeat: false, population: 20376, region: "Moldova" },

  // ─── MUNTENIA / SUD ───
  { slug: "bucuresti", name: "București", county: "București", isCountySeat: true, population: 1883425, region: "Muntenia" },
  { slug: "ploiesti", name: "Ploiești", county: "Prahova", isCountySeat: true, population: 233468, region: "Muntenia" },
  { slug: "pitesti", name: "Pitești", county: "Argeș", isCountySeat: true, population: 177172, region: "Muntenia" },
  { slug: "targoviste", name: "Târgoviște", county: "Dâmbovița", isCountySeat: true, population: 97372, region: "Muntenia" },
  { slug: "buzau", name: "Buzău", county: "Buzău", isCountySeat: true, population: 133116, region: "Muntenia" },
  { slug: "braila", name: "Brăila", county: "Brăila", isCountySeat: true, population: 210611, region: "Muntenia" },
  { slug: "slobozia", name: "Slobozia", county: "Ialomița", isCountySeat: true, population: 52693, region: "Muntenia" },
  { slug: "calarasi", name: "Călărași", county: "Călărași", isCountySeat: true, population: 75333, region: "Muntenia" },
  { slug: "giurgiu", name: "Giurgiu", county: "Giurgiu", isCountySeat: true, population: 69587, region: "Muntenia" },
  { slug: "alexandria", name: "Alexandria", county: "Teleorman", isCountySeat: true, population: 51340, region: "Muntenia" },
  { slug: "slatina", name: "Slatina", county: "Olt", isCountySeat: true, population: 79171, region: "Muntenia" },
  { slug: "ramnicu-valcea", name: "Râmnicu Vâlcea", county: "Vâlcea", isCountySeat: true, population: 120427, region: "Muntenia" },
  { slug: "campina", name: "Câmpina", county: "Prahova", isCountySeat: false, population: 36282, region: "Muntenia" },

  // ─── OLTENIA ───
  { slug: "craiova", name: "Craiova", county: "Dolj", isCountySeat: true, population: 305689, region: "Oltenia" },
  { slug: "drobeta-turnu-severin", name: "Drobeta-Turnu Severin", county: "Mehedinți", isCountySeat: true, population: 104557, region: "Oltenia" },
  { slug: "targu-jiu", name: "Târgu Jiu", county: "Gorj", isCountySeat: true, population: 97531, region: "Oltenia" },

  // ─── TRANSILVANIA ───
  { slug: "cluj-napoca", name: "Cluj-Napoca", county: "Cluj", isCountySeat: true, population: 324576, region: "Transilvania" },
  { slug: "brasov", name: "Brașov", county: "Brașov", isCountySeat: true, population: 290743, region: "Transilvania" },
  { slug: "sibiu", name: "Sibiu", county: "Sibiu", isCountySeat: true, population: 169611, region: "Transilvania" },
  { slug: "targu-mures", name: "Târgu Mureș", county: "Mureș", isCountySeat: true, population: 150191, region: "Transilvania" },
  { slug: "alba-iulia", name: "Alba Iulia", county: "Alba", isCountySeat: true, population: 74336, region: "Transilvania" },
  { slug: "bistrita", name: "Bistrița", county: "Bistrița-Năsăud", isCountySeat: true, population: 93268, region: "Transilvania" },
  { slug: "deva", name: "Deva", county: "Hunedoara", isCountySeat: true, population: 69258, region: "Transilvania" },
  { slug: "hunedoara", name: "Hunedoara", county: "Hunedoara", isCountySeat: false, population: 71257, region: "Transilvania" },
  { slug: "sighisoara", name: "Sighișoara", county: "Mureș", isCountySeat: false, population: 32287, region: "Transilvania" },
  { slug: "medias", name: "Mediaș", county: "Sibiu", isCountySeat: false, population: 55153, region: "Transilvania" },
  { slug: "dej", name: "Dej", county: "Cluj", isCountySeat: false, population: 38473, region: "Transilvania" },
  { slug: "turda", name: "Turda", county: "Cluj", isCountySeat: false, population: 55907, region: "Transilvania" },
  { slug: "fagaras", name: "Făgăraș", county: "Brașov", isCountySeat: false, population: 36102, region: "Transilvania" },

  // ─── BANAT ───
  { slug: "timisoara", name: "Timișoara", county: "Timiș", isCountySeat: true, population: 319279, region: "Banat" },
  { slug: "arad", name: "Arad", county: "Arad", isCountySeat: true, population: 177422, region: "Banat" },
  { slug: "resita", name: "Reșița", county: "Caraș-Severin", isCountySeat: true, population: 83985, region: "Banat" },
  { slug: "lugoj", name: "Lugoj", county: "Timiș", isCountySeat: false, population: 44100, region: "Banat" },

  // ─── CRIȘANA / MARAMUREȘ ───
  { slug: "oradea", name: "Oradea", county: "Bihor", isCountySeat: true, population: 222239, region: "Crișana" },
  { slug: "satu-mare", name: "Satu Mare", county: "Satu Mare", isCountySeat: true, population: 115630, region: "Crișana" },
  { slug: "baia-mare", name: "Baia Mare", county: "Maramureș", isCountySeat: true, population: 146133, region: "Maramureș" },
  { slug: "zalau", name: "Zalău", county: "Sălaj", isCountySeat: true, population: 68591, region: "Crișana" },
  { slug: "sighetul-marmatiei", name: "Sighetul Marmației", county: "Maramureș", isCountySeat: false, population: 44185, region: "Maramureș" },

  // ─── DOBROGEA ───
  { slug: "constanta", name: "Constanța", county: "Constanța", isCountySeat: true, population: 319766, region: "Dobrogea" },
  { slug: "tulcea", name: "Tulcea", county: "Tulcea", isCountySeat: true, population: 92379, region: "Dobrogea" },
  { slug: "mangalia", name: "Mangalia", county: "Constanța", isCountySeat: false, population: 41153, region: "Dobrogea" },
  { slug: "medgidia", name: "Medgidia", county: "Constanța", isCountySeat: false, population: 44016, region: "Dobrogea" },

  // ─── ILFOV (zona București) ───
  { slug: "voluntari", name: "Voluntari", county: "Ilfov", isCountySeat: false, population: 42944, region: "Muntenia" },
  { slug: "popesti-leordeni", name: "Popești-Leordeni", county: "Ilfov", isCountySeat: false, population: 60904, region: "Muntenia" },
  { slug: "bragadiru", name: "Bragadiru", county: "Ilfov", isCountySeat: false, population: 24242, region: "Muntenia" },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getNearbyLocations(slug: string, count: number = 4): Location[] {
  const loc = getLocationBySlug(slug);
  if (!loc) return LOCATIONS.slice(0, count);
  return LOCATIONS
    .filter((l) => l.slug !== slug && (l.county === loc.county || l.region === loc.region))
    .sort((a, b) => b.population - a.population)
    .slice(0, count);
}
