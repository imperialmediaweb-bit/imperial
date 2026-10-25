// Explicațiile din fereastra „Ce e asta?" — pentru opțiuni și pentru ce e inclus în orice site.
// Scrise pentru patronul unei firme mici: ce face, ce câștigă, ce trebuie să facă el.

export type Info = { title: string; body: string[] };

export const ADDON_INFO: Record<string, Info> = {
  logo: {
    title: "Logo",
    body: [
      "Creăm logo-ul firmei tale de la zero, pe culorile și stilul brandului.",
      "Primești variantele pentru site, Facebook, firmă și documente.",
      "Dacă ai deja un logo, nu ai nevoie de această opțiune.",
    ],
  },
  social: {
    title: "Configurare Facebook + Google Business",
    body: [
      "Îți facem pagina de Facebook și profilul de pe Google Maps, complete și legate de site.",
      "Copertă, descriere, program, buton de contact și poze optimizate, ca firma să arate profesionist peste tot.",
      "Când cineva caută ce oferi în orașul tău, te găsește pe hartă, cu recenzii și telefon.",
    ],
  },
  geo: {
    title: "Vizibilitate în ChatGPT, Gemini și Claude",
    body: [
      "Tot mai mulți oameni întreabă un asistent AI în loc să caute pe Google: „ce salon bun e în Botoșani?”.",
      "Pregătim site-ul ca asistenții AI să-l înțeleagă și să-l poată recomanda: informații structurate despre firmă, servicii, prețuri și întrebări frecvente, plus fișierul special pe care îl citesc AI-urile.",
      "Nu putem garanta că un AI te va recomanda, dar fără această pregătire șansele sunt mult mai mici.",
    ],
  },
  pagina: {
    title: "Pagină în plus",
    body: [
      "Orice pagină în afara celor incluse în pachet: un serviciu separat, o ofertă, o pagină de cariere.",
      "Ne spui ce vrei să conțină, iar noi o scriem și o construim în același stil cu restul site-ului.",
    ],
  },
  galerie: {
    title: "Galerie foto / portofoliu",
    body: [
      "O secțiune cu lucrările tale, prezentate profesionist, cu poze mari și rapide.",
      "Ideală pentru saloane, construcții, evenimente, pensiuni — oricine vinde cu ochii.",
    ],
  },
  programari: {
    title: "Programări / rezervări online",
    body: [
      "Clienții își aleg singuri ziua și ora direct de pe site, la orice oră.",
      "Tu primești notificare pe email și vezi programările într-un panou simplu.",
      "Mai puține telefoane, mai puține goluri în program.",
    ],
  },
  ai: {
    title: "Asistent AI pe site",
    body: [
      "Un asistent care știe tot ce e pe site-ul tău și răspunde vizitatorilor 24/7: servicii, prețuri, program.",
      "Preia cereri de programare sau ofertă și ți le trimite.",
      "La Site Start se adaugă ca opțiune; la Site Custom e inclus. Creditele AI lunare sunt cuprinse în administrarea de 200 lei/lună."
    ],
  },
  "ai-shop": {
    title: "Asistent AI smart pentru magazin",
    body: [
      "Un asistent care cunoaște tot magazinul: produse, prețuri, stoc, livrare și retur — și răspunde clienților 24/7.",
      "Clientul scrie numărul comenzii, iar asistentul îi spune pe loc în ce stadiu e: primită, pregătită, predată curierului.",
      "Urmărește automat coletul prin curier (AWB) și îi spune clientului unde a ajuns și când ajunge — direct în chat.",
      "Mai puține telefoane și mesaje de tipul „unde e comanda mea?”. Funcționează împreună cu opțiunea de AWB automat.",
    ],
  },
  // magazin
  card: {
    title: "Plăți online cu cardul",
    body: [
      "Clienții plătesc cu cardul direct în magazin, prin Netopia sau Stripe.",
      "Banii ajung în contul firmei tale. Procesatorul de plăți ia un mic comision pe fiecare tranzacție.",
      "Contul la procesator se face pe firma ta; noi te ajutăm cu înscrierea și legăm totul de magazin.",
    ],
  },
  awb: {
    title: "AWB automat la curieri",
    body: [
      "Legăm magazinul de o platformă care adună toți curierii (FAN Courier, Sameday, Cargus și alții).",
      "La fiecare comandă, AWB-ul se generează dintr-un click, iar clientul primește linkul de urmărire a coletului.",
      "Contul la platforma de curierat e pe firma ta; noi îl putem face cu datele tale.",
    ],
  },
  factura: {
    title: "Facturare automată",
    body: [
      "La fiecare comandă, factura se emite și se trimite singură clientului.",
      "Legăm magazinul de programul tău de facturare: SmartBill sau Oblio.",
      "Dacă nu ai program de facturare, întreabă-ți contabilul sau îți recomandăm noi unul.",
    ],
  },
  variante: {
    title: "Variante de produs + filtre",
    body: [
      "Un produs cu mai multe mărimi sau culori, fiecare cu stocul și prețul lui.",
      "Filtre în magazin (mărime, culoare, preț), ca clienții să găsească repede ce caută.",
    ],
  },
  produse: {
    title: "Încărcare produse în plus",
    body: [
      "Încărcăm noi produsele peste cele incluse în pachet, cu poze, descrieri și prețuri.",
      "Le poți adăuga și singur din panoul magazinului, gratuit, oricând.",
    ],
  },
  admin: {
    title: "Administrare lunară",
    body: [
      "Găzduirea site-ului și domeniul sunt incluse în administrare — fără ea site-ul n-ar avea unde sta online.",
      "Plus backup, actualizări de securitate și modificări mici, ca site-ul să meargă mereu.",
      "100 lei/lună; 200 lei/lună dacă ai asistent AI pe site (include creditele AI).",
    ],
  },
};

// Ce primește orice client, inclus în preț — se vede ca să se știe că e muncă.
export const INCLUDED: { key: string; name: string; info: Info }[] = [
  {
    key: "viteza",
    name: "Încărcare sub o secundă",
    info: {
      title: "Încărcare sub o secundă",
      body: [
        "Site-ul se deschide aproape instant, pe telefon și pe calculator.",
        "Oamenii pleacă de pe site-urile lente, iar Google le pune mai jos în căutări. Viteza aduce clienți.",
      ],
    },
  },
  {
    key: "seo",
    name: "SEO tehnic",
    info: {
      title: "SEO tehnic — optimizare pentru Google",
      body: [
        "Construim site-ul ca Google să-l înțeleagă: titluri și descrieri pentru fiecare pagină, structură corectă, date despre firmă.",
        "E baza pe care apari în căutări când cineva caută ce oferi.",
      ],
    },
  },
  {
    key: "analytics",
    name: "Google Analytics",
    info: {
      title: "Google Analytics",
      body: [
        "Instalăm statisticile Google pe site: câți vizitatori ai, de unde vin și ce pagini citesc.",
        "Așa vezi clar ce aduce site-ul și ce merge în reclame.",
      ],
    },
  },
  {
    key: "searchconsole",
    name: "Google Search Console",
    info: {
      title: "Google Search Console",
      body: [
        "Înscriem site-ul în contul de administrare al Google și îi verificăm proprietatea.",
        "Vezi pe ce cuvinte apari în Google și ești anunțat dacă apare vreo problemă.",
      ],
    },
  },
  {
    key: "sitemap",
    name: "Sitemap trimis la Google",
    info: {
      title: "Sitemap optimizat și trimis la Google",
      body: [
        "Harta site-ului, cu toate paginile, generată automat și trimisă la Google.",
        "Paginile noi apar mai repede în căutări.",
      ],
    },
  },
  {
    key: "mobil",
    name: "Perfect pe telefon + SSL",
    info: {
      title: "Perfect pe telefon + certificat SSL",
      body: [
        "Site-ul arată și merge perfect pe telefon, de unde vin majoritatea vizitatorilor.",
        "Certificatul SSL (lacătul din browser) e inclus: site-ul e sigur, iar Google îl preferă.",
      ],
    },
  },
];
