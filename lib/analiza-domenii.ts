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
  why: Record<string, string>; // de ce îi folosește fiecare opțiune recomandată, pe domeniul lui
  ideas: string[]; // idei de conținut incluse în preț, gândite pentru domeniul lui
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
    why: { programari: "Clientele se programează singure, inclusiv seara, fără să te sune în timp ce lucrezi.", galerie: "Lucrările tale (tunsori, manichiură, machiaj) vând mai bine decât orice descriere.", social: "Te găsesc pe Google Maps când caută „salon” în orașul tău, cu recenzii și program." },
    ideas: ["Listă de prețuri clară, pe categorii (tuns, vopsit, manichiură)", "Galerie „înainte și după” pentru fiecare serviciu", "Prezentarea echipei, cu specializarea fiecăruia", "Buton de WhatsApp pentru întrebări rapide", "Articole pe blog: îngrijirea părului, tendințe de sezon"],
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
    why: { programari: "Pacienții își fac singuri programarea, iar recepția are mai puține telefoane.", pagina: "O pagină pentru fiecare medic sau serviciu important construiește încredere înainte de prima vizită.", social: "Apari pe Google Maps la căutări de tipul „dentist + oraș”, cu program și telefon." },
    ideas: ["Pagina „Prima vizită”: ce aduci, cât durează, cum se plătește", "Lista de servicii și tarife", "Răspunsuri la întrebările frecvente ale pacienților", "Hartă și indicații de parcare", "Articole pe blog despre prevenție, scrise pe înțelesul tuturor"],
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
    why: { programari: "Rezervări de mese online, la orice oră, fără telefoane în orele aglomerate.", galerie: "Pozele cu preparatele și localul îi conving să vină.", social: "Turiștii și oamenii noi din oraș te găsesc pe Google Maps." },
    ideas: ["Meniul online cu poze, ușor de actualizat", "Pagina pentru evenimente private: botezuri, aniversări, mese de firmă", "Program și zona de livrare, la vedere", "Buton „Sună pentru rezervare” direct de pe telefon", "Ofertele zilei sau meniul zilei pe prima pagină"],
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
    why: { programari: "Clienții își aleg singuri ora pentru revizie sau reparație.", social: "Când cuiva i se strică mașina, caută „service auto” pe hartă — trebuie să apari acolo." },
    ideas: ["Lista serviciilor cu prețuri orientative (ITP, revizie, schimb ulei)", "Mărcile cu care lucrezi", "Pagina „Ce facem când îți aduci mașina”: pași și durată", "Buton de WhatsApp pentru poze cu problema", "Sfaturi pe blog: întreținere de sezon, anvelope"],
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
    addons: ["galerie", "pagina", "social"],
    why: { galerie: "Portofoliul cu lucrări finalizate e argumentul principal pentru un client nou.", social: "Apari pe Google Maps când cineva caută meșteri în zona ta.", pagina: "O pagină pentru fiecare serviciu (acoperișuri, instalații, finisaje) te face găsit pe fiecare căutare." },
    ideas: ["Portofoliu cu lucrări, pe categorii", "Pagina „Cum lucrăm”: de la evaluare la predare", "Formular de cerere de ofertă cu poze atașate", "Zonele în care lucrezi", "Garanții și materialele folosite, explicate simplu"],
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
    addons: ["programari", "ai", "geo", "pagina"],
    why: { programari: "Clienții își programează singuri consultația, fără să sune de mai multe ori.", ai: "Asistentul răspunde la întrebările frecvente (acte necesare, onorarii, program) și preia cererile de consultație.", geo: "Tot mai mulți oameni întreabă ChatGPT „ce avocat bun e în orașul meu?” — pregătim site-ul să poată fi recomandat.", pagina: "O pagină pentru fiecare domeniu de practică (civil, penal, familie, firme) te face găsit pe căutări precise.", social: "Apari pe Google Maps, cu recenzii, program și telefon." },
    ideas: ["O pagină pentru fiecare domeniu de practică", "Întrebări frecvente: acte necesare, durată, onorarii orientative", "Pagina „Cum decurge prima consultație”", "Articole pe blog despre schimbările legislative, pe înțelesul clienților", "Prezentarea experienței și a specializărilor, fără exagerări"],
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
    why: { programari: "Rezervări directe, fără comisionul platformelor de cazare.", galerie: "Camerele și împrejurimile în poze mari decid rezervarea.", limba: "Turiștii străini rezervă doar unde înțeleg ce scrie.", social: "Apari pe Google Maps când caută cazare în zonă." },
    ideas: ["Pagina fiecărei camere, cu poze și dotări", "Ce poți vizita în zonă: trasee, obiective, restaurante", "Pachete pentru sărbători și weekenduri", "Politica de anulare și check-in, la vedere", "Galerie cu împrejurimile, pe anotimpuri"],
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
    addons: ["card", "awb", "factura"],
    why: { card: "Mulți clienți vor să plătească pe loc cu cardul, nu doar ramburs.", awb: "AWB-ul se generează dintr-un click, iar clientul primește linkul de urmărire.", factura: "Factura pleacă automat la fiecare comandă — mai puțină muncă de birou." },
    ideas: ["Pagina „Livrare și retur”, clară", "Produsele cele mai vândute pe prima pagină", "Ghid de mărimi sau de alegere a produsului", "Recenziile clienților pe pagina produsului", "Abonare la ofertă prin email"],
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
    addons: ["galerie", "programari", "social"],
    why: { galerie: "Pozele cu lucrările făcute arată calitatea înainte de primul telefon.", programari: "Clienții rezervă singuri o dată și o oră pentru serviciu.", social: "Apari pe Google Maps când cineva caută serviciul tău în oraș." },
    ideas: ["Lista serviciilor cu ce include fiecare", "Zona în care lucrezi și programul", "Formular de cerere de ofertă rapidă", "Recenziile clienților", "Întrebări frecvente: cât durează, ce trebuie pregătit"],
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
    why: { social: "Te găsesc pe Google Maps și pe Facebook, cu program și telefon." },
    ideas: ["Prezentarea clară a serviciilor sau produselor", "Pagina „Despre noi”, cu povestea firmei", "Formular de contact și buton de WhatsApp", "Recenziile clienților", "Articole pe blog care răspund la întrebările clienților tăi"],
  },
];

export type Prezenta = "recomandari" | "facebook" | "google" | "site-vechi";

export const PREZENTA: { key: Prezenta; label: string; gap: string }[] = [
  { key: "recomandari", label: "Doar din recomandări", gap: "Acum depinzi doar de recomandări. Toți cei care te caută pe Google ajung la concurență." },
  { key: "facebook", label: "Am pagină de Facebook", gap: "Facebook ajută, dar nu apari pe Google, iar cine nu are cont nu-ți vede pagina." },
  { key: "google", label: "Sunt pe Google Maps", gap: "Te găsesc pe hartă, dar fără site nu au unde vedea serviciile, prețurile și lucrările tale." },
  { key: "site-vechi", label: "Am un site vechi", gap: "Un site vechi, lent sau nefuncțional pe telefon îndepărtează clienții în loc să-i aducă." },
];
