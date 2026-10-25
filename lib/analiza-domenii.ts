// Domeniile pentru analiza „Ai nevoie de un site?" — beneficii, funcții și opțiuni
// recomandate per tip de afacere. Fără statistici inventate: calculul de rentabilitate
// se face din valoarea medie a unui client, introdusă de vizitator.

export type Domeniu = {
  key: string;
  name: string;
  emoji: string;
  clientValue: number; // valoare medie implicită a unui client, în lei
  clientLabel: string; // cum numim clientul în domeniul respectiv
  benefits: string[];
  addons: string[]; // chei din SITE_START_ADDONS recomandate
  custom?: boolean; // are nevoie de Site Custom / magazin, nu de Site Start
};

export const DOMENII: Domeniu[] = [
  {
    key: "salon",
    name: "Salon / înfrumusețare",
    emoji: "💇",
    clientValue: 150,
    clientLabel: "programare",
    benefits: [
      "Clientele se programează singure, la orice oră — și noaptea, când îți răspund la mesaje doar concurenții cu site.",
      "Galeria cu lucrările tale convinge mai repede decât orice descriere.",
      "Prețurile afișate clar elimină telefoanele de tipul „cât costă?”.",
      "Apari pe Google când cineva caută „salon” în orașul tău.",
    ],
    addons: ["programari", "galerie", "social"],
  },
  {
    key: "medical",
    name: "Cabinet medical / stomatologic",
    emoji: "🦷",
    clientValue: 300,
    clientLabel: "pacient",
    benefits: [
      "Pacienții noi îți verifică întâi site-ul: medicii, serviciile și prețurile.",
      "Programările online reduc telefoanele și golurile din program.",
      "O pagină pentru fiecare medic construiește încredere înainte de prima vizită.",
      "Apari pe Google la căutările de tipul „dentist + oraș”.",
    ],
    addons: ["programari", "pagina", "social"],
  },
  {
    key: "restaurant",
    name: "Restaurant / cafenea",
    emoji: "🍽️",
    clientValue: 120,
    clientLabel: "masă",
    benefits: [
      "Meniul cu poze și prețuri, mereu actualizat — oamenii aleg localul înainte să iasă din casă.",
      "Rezervările online îți umplu mesele în serile liniștite.",
      "Turiștii și oamenii noi din oraș te găsesc pe Google Maps.",
      "Evenimentele private (botezuri, aniversări) încep aproape mereu cu o căutare online.",
    ],
    addons: ["programari", "galerie", "social"],
  },
  {
    key: "auto",
    name: "Service auto",
    emoji: "🔧",
    clientValue: 400,
    clientLabel: "reparație",
    benefits: [
      "Când mașina se strică, omul caută pe telefon „service + oraș” și sună primul rezultat de încredere.",
      "Lista de servicii și mărcile cu care lucrezi aduc clienții potriviți.",
      "Programările online îți organizează ziua de lucru.",
      "Recenziile bune de pe Google cântăresc mai mult decât orice reclamă.",
    ],
    addons: ["programari", "social"],
  },
  {
    key: "constructii",
    name: "Construcții / meșteri / instalații",
    emoji: "🏗️",
    clientValue: 2500,
    clientLabel: "lucrare",
    benefits: [
      "Portofoliul cu lucrări finalizate e argumentul care închide contractele mari.",
      "Clienții compară mai mulți meșteri online înainte să sune — fără site, nu intri în comparație.",
      "Un formular de cerere ofertă îți aduce lucrări chiar și când ești pe șantier.",
      "Firmele și dezvoltatorii caută colaboratori serioși, cu prezență profesionistă.",
    ],
    addons: ["galerie", "social"],
  },
  {
    key: "profesionisti",
    name: "Avocat / contabil / notar",
    emoji: "⚖️",
    clientValue: 800,
    clientLabel: "client",
    benefits: [
      "Într-un domeniu bazat pe încredere, un site profesionist face diferența la primul contact.",
      "Explici clar serviciile și actele necesare — primești clienți mai bine pregătiți.",
      "Articolele de pe blog răspund la întrebări reale și te aduc în Google.",
      "Formularul de programare a consultației lucrează pentru tine 24/7.",
    ],
    addons: ["programari", "social"],
  },
  {
    key: "pensiune",
    name: "Pensiune / cazare / turism",
    emoji: "🏡",
    clientValue: 600,
    clientLabel: "rezervare",
    benefits: [
      "Rezervările directe pe site te scapă de comisioanele platformelor de booking.",
      "Galeria cu camerele și împrejurimile vinde sejurul înainte de sosire.",
      "Turiștii străini ajung la tine prin varianta în a doua limbă.",
      "Apari pe Google Maps când cineva caută cazare în zonă.",
    ],
    addons: ["programari", "galerie", "limba", "social"],
  },
  {
    key: "magazin",
    name: "Magazin / produse",
    emoji: "🛍️",
    clientValue: 200,
    clientLabel: "comandă",
    benefits: [
      "Vinzi și când magazinul e închis — și în toată țara, nu doar în orașul tău.",
      "Plățile cu cardul și AWB-ul la curieri pot funcționa automat, fără muncă de mână.",
      "Fiecare produs e o pagină care poate apărea în Google.",
      "Clienții vechi revin mai ușor când pot comanda online.",
    ],
    addons: ["card", "awb"],
    custom: true,
  },
  {
    key: "servicii",
    name: "Servicii (curățenie, transport, evenimente...)",
    emoji: "🚚",
    clientValue: 350,
    clientLabel: "comandă",
    benefits: [
      "Oamenii caută pe Google „curățenie / transport / DJ + oraș” și aleg dintre firmele care au site.",
      "Formularul de cerere ofertă îți aduce comenzi și când ești pe teren.",
      "Lucrările și recenziile afișate îți cresc încrederea față de concurență.",
      "Prețurile orientative te scapă de clienții care nu se potrivesc bugetului.",
    ],
    addons: ["galerie", "social"],
  },
  {
    key: "altceva",
    name: "Alt domeniu",
    emoji: "✨",
    clientValue: 300,
    clientLabel: "client",
    benefits: [
      "Majoritatea oamenilor caută online înainte să cumpere un serviciu sau un produs.",
      "Un site profesionist îți dă credibilitate în fața clienților noi.",
      "Ai un loc al tău, pe care îl controlezi, nu doar o pagină pe rețelele sociale.",
      "Apari pe Google când cineva caută ce oferi tu.",
    ],
    addons: ["social"],
  },
];

export type Prezenta = "recomandari" | "facebook" | "google" | "site-vechi";

export const PREZENTA: { key: Prezenta; label: string; gap: string }[] = [
  { key: "recomandari", label: "Doar din recomandări", gap: "Acum depinzi doar de recomandări. Toți cei care te caută pe Google ajung la concurență." },
  { key: "facebook", label: "Am pagină de Facebook", gap: "Facebook ajută, dar nu apari pe Google, iar cine nu are cont nu-ți vede pagina." },
  { key: "google", label: "Sunt pe Google Maps", gap: "Te găsesc pe hartă, dar fără site nu au unde vedea serviciile, prețurile și lucrările tale." },
  { key: "site-vechi", label: "Am un site vechi", gap: "Un site vechi, lent sau nefuncțional pe telefon îndepărtează clienții în loc să-i aducă." },
];
