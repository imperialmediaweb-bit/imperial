// Conținut scris special pentru fiecare oraș, ca paginile de oraș să nu mai fie același
// text cu numele schimbat. Doar fapte reale despre oraș (economie, zone, repere),
// fără cifre inventate. Orașele care nu sunt aici păstrează pagina standard.

export type CityContent = {
  intro: string[];
  businesses: { name: string; need: string }[];
  faqs: { q: string; a: string }[];
};

export const CITY_CONTENT: Record<string, CityContent> = {
  botosani: {
    intro: [
      "Botoșaniul e orașul lui Eminescu, cu un Centru Vechi restaurat, teatru și o viață comercială concentrată în jurul centrului și al Uvertura Mall. Economia stă pe confecții și textile, comerț, agricultură în tot județul și servicii pentru oamenii din oraș și din Dorohoi, Flămânzi sau Săveni.",
      "Aici multe firme încă trăiesc din recomandări, dar clientul nou caută întâi pe telefon: „dentist Botoșani”, „service auto Botoșani”, „catering Botoșani”. Cine are un site clar și profilul Google îngrijit apare primul, pentru că concurența online serioasă e încă mică.",
    ],
    businesses: [
      { name: "Fabrici de confecții (lohn)", need: "site de prezentare în română și engleză, cu capacitate de producție și poze din fabrică, pentru clienți din afară" },
      { name: "Cabinete medicale și stomatologice", need: "pagini pe servicii, programare online și prețuri orientative" },
      { name: "Restaurante, catering, săli de evenimente", need: "meniu, galerie, cerere de ofertă pentru nunți și botezuri" },
      { name: "Service-uri auto și firme de construcții", need: "lista de servicii, zonele acoperite din județ și buton de sunat direct" },
      { name: "Ferme și producători locali", need: "magazin online simplu sau comenzi pe telefon, cu livrare în județ" },
    ],
    faqs: [
      { q: "Aveți birou în Botoșani?", a: "Da, Imperial Media e din Botoșani. Ne putem vedea față în față pentru discuția de început, iar restul proiectului merge online, ca să nu pierzi timp cu drumuri." },
      { q: "Faceți site și pentru firmele din Dorohoi sau din comunele județului?", a: "Da. Lucrăm cu firme din tot județul Botoșani; pagina se poate optimiza pe orașul sau zona în care vrei să te găsească clienții." },
      { q: "Pot să apar și în Botoșani Expres?", a: "Da. La lansarea site-ului primești un articol în Botoșani Expres, ziarul local din rețeaua noastră, cu link spre site-ul tău." },
    ],
  },
  suceava: {
    intro: [
      "Suceava e poarta Bucovinei: Cetatea de Scaun, mănăstirile pictate din jur și aeroportul aduc turiști tot anul, iar Universitatea „Ștefan cel Mare” ține orașul tânăr. Economia combină turismul, industria lemnului, comerțul și serviciile, cu zone comerciale în jurul Iulius Mall și Shopping City.",
      "Pentru pensiunile din Bucovina, rezervarea se decide pe Google cu săptămâni înainte, pe poze și recenzii. Pentru firmele din oraș (Obcini, George Enescu, Burdujeni, Centru), contează să apară la „serviciu + Suceava” pe telefon.",
    ],
    businesses: [
      { name: "Pensiuni și cazări din Bucovina", need: "galerie mare, disponibilitate, rezervare directă fără comision la platforme, în română și engleză" },
      { name: "Firme din industria lemnului și mobilă", need: "catalog de produse, cerere de ofertă și pagină pentru clienți din străinătate" },
      { name: "Cabinete medicale și clinici", need: "programare online și pagini pe specialități" },
      { name: "Restaurante și cafenele din centru", need: "meniu actualizat, rezervări și hartă" },
      { name: "Firme de servicii pentru casă", need: "listă de servicii, zone acoperite (Suceava, Fălticeni, Rădăuți) și buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Bucovina?", a: "Da. Un site de pensiune are nevoie de poze mari, prețuri pe sezon, formular de rezervare direct și variantă în engleză. Rezervările directe te scapă de comisionul platformelor." },
      { q: "Lucrați și cu firme din Rădăuți, Fălticeni sau Câmpulung Moldovenesc?", a: "Da, cu firme din tot județul Suceava. Totul se face online, iar pagina se optimizează pe orașul în care vrei clienți." },
      { q: "Pot apărea și în presa locală din Suceava?", a: "Da. Rețeaua noastră include ziarul local din județul Suceava, iar la lansarea site-ului primești articol de prezentare cu link spre site." },
    ],
  },
  iasi: {
    intro: [
      "Iașiul e cel mai mare centru universitar și medical din Moldova: universități mari, spitale regionale și un sector IT în creștere, cu centre ale unor companii internaționale. Asta înseamnă o clientelă tânără, care caută și compară totul pe telefon.",
      "Concurența online e mare în Copou, Tătărași, Păcurari sau în zona Palas, mai ales la clinici, educație privată și HoReCa. Ca să apari la „clinică Iași” sau „restaurant Copou”, ai nevoie de pagini separate pe fiecare serviciu și de un site rapid pe mobil.",
    ],
    businesses: [
      { name: "Clinici private și cabinete", need: "câte o pagină pe fiecare specialitate, profil medici și programare online" },
      { name: "Școli private, after-school, meditații", need: "program, prețuri, înscriere online și pagini pe cursuri" },
      { name: "Restaurante și cafenele pentru studenți", need: "meniu, oferte, comenzi online fără comisionul aplicațiilor de livrare" },
      { name: "Imobiliare și dezvoltatori", need: "listă de proprietăți, filtre și cerere de vizionare" },
      { name: "Firme IT și startup-uri", need: "site de prezentare în engleză, portofoliu și pagină de cariere" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru clinici din Iași?", a: "Da. Pentru o clinică facem câte o pagină pe fiecare specialitate, profilul medicilor, programare online și setările GDPR corecte, ca să apară la căutările de tipul „specialitate + Iași”." },
      { q: "Puteți face site-ul în română și engleză?", a: "Da. A doua limbă e o opțiune de 499 lei, utilă pentru firmele IT, clinicile cu pacienți străini și cazări." },
      { q: "Lucrați și cu firme din Pașcani sau din zona metropolitană?", a: "Da, cu firme din tot județul Iași, inclusiv din comunele din jurul orașului, unde se mută tot mai multe afaceri." },
    ],
  },
  "cluj-napoca": {
    intro: [
      "Clujul e capitala IT a României și un oraș universitar mare, cu festivaluri care aduc turiști tot anul. Clienții de aici sunt foarte digitali: compară site-uri, citesc recenzii și se așteaptă la programare sau comandă online.",
      "În Mărăști, Gheorghieni, Mănăștur sau în centru, firmele mici concurează cu agenții și lanțuri care au deja site-uri bune. De aceea aici nu ajunge doar „să existe” site-ul: trebuie să fie rapid, clar și făcut pe căutările reale ale clienților.",
    ],
    businesses: [
      { name: "Firme IT și startup-uri", need: "site în engleză, portofoliu de proiecte și pagină de cariere" },
      { name: "Clinici, stomatologie, estetică", need: "programare online, pagini pe tratamente și prețuri" },
      { name: "Cafenele, restaurante, cazări", need: "meniu, rezervări, galerie și variantă în engleză pentru turiști" },
      { name: "Imobiliare și construcții", need: "proiecte, filtre de căutare și formular de vizionare" },
      { name: "Săli de sport, studiouri de yoga, cursuri", need: "orar, abonamente și înscriere online" },
    ],
    faqs: [
      { q: "Merită un site custom în Cluj, unde concurența online e mare?", a: "Da, tocmai de aceea. Un site rapid, cu pagini separate pe fiecare serviciu și date structurate pentru Google, are mai multe șanse decât un șablon care arată la fel ca al concurenței." },
      { q: "Faceți site-uri în engleză pentru firme IT?", a: "Da. Varianta în a doua limbă costă 499 lei și o recomandăm pentru firmele care au clienți sau angajați din afara țării." },
      { q: "Lucrați cu firme din Florești sau Apahida?", a: "Da. Lucrăm cu firme din tot județul Cluj, inclusiv din localitățile din jurul orașului." },
    ],
  },
  bucuresti: {
    intro: [
      "Bucureștiul are cea mai densă piață din țară: sedii de companii în Pipera, Floreasca și centru, mii de firme de servicii în fiecare sector și cel mai mare volum de comerț online. Pe aproape orice căutare există zeci de concurenți cu site.",
      "Aici câștigă cine se diferențiază: pagini pe fiecare serviciu și pe fiecare sector sau cartier în care lucrezi (Militari, Titan, Drumul Taberei, Berceni), site rapid pe telefon și recenzii adunate constant în profilul Google.",
    ],
    businesses: [
      { name: "Servicii profesionale: avocați, contabili, consultanți", need: "pagini pe fiecare serviciu, prezentarea echipei și programare la consultanță" },
      { name: "Clinici și cabinete în fiecare sector", need: "programare online și pagini pe specialități și pe locații" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări și comenzi online fără comisionul aplicațiilor" },
      { name: "Firme de renovări, instalații, curățenie", need: "pagini pe sectoarele deservite, galerie de lucrări și cerere de ofertă" },
      { name: "Magazine online", need: "magazin rapid, plăți cu cardul, curier integrat și facturare automată" },
    ],
    faqs: [
      { q: "Puteți face pagini separate pe fiecare sector din București?", a: "Da. Pentru firmele care lucrează la domiciliul clientului (renovări, instalații, curățenie) facem pagini pe sectoarele sau cartierele deservite, ca să apari la căutările locale." },
      { q: "Faceți și magazine online pentru firme din București?", a: "Da. Magazinul online pornește de la 3.000 lei, cu plăți cu cardul, curier și facturare." },
      { q: "Lucrați și cu firme din Ilfov?", a: "Da, cu firme din Voluntari, Otopeni, Bragadiru, Popești-Leordeni și tot județul Ilfov." },
    ],
  },
  timisoara: {
    intro: [
      "Timișoara are o economie puternică de industrie, automotive și IT, un centru istoric renovat și cartiere vechi precum Fabric, Iosefin și Elisabetin, care revin la viață cu cafenele și afaceri noi. Clienții sunt obișnuiți cu standarde vestice.",
      "Apropierea de graniță aduce și clienți din Serbia și Ungaria, plus diaspora care caută servicii de acasă online. Pentru multe firme de aici, un site în două limbi și profil Google îngrijit fac diferența.",
    ],
    businesses: [
      { name: "Furnizori din industrie și automotive", need: "site de prezentare în română și engleză, cu capabilități și certificări" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Cafenele și restaurante din centru și Fabric", need: "meniu, rezervări și galerie" },
      { name: "Firme IT", need: "portofoliu, servicii și cariere, în engleză" },
      { name: "Imobiliare și construcții", need: "proiecte, filtre și formular de vizionare" },
    ],
    faqs: [
      { q: "Faceți site-uri în două limbi pentru firmele din Timișoara?", a: "Da. A doua limbă costă 499 lei; e utilă pentru furnizorii din industrie, firmele IT și afacerile cu clienți din străinătate." },
      { q: "Lucrați cu firme din Dumbrăvița sau Giroc?", a: "Da, cu firme din tot județul Timiș, inclusiv din localitățile din jurul orașului." },
      { q: "Cât durează un site de prezentare?", a: "Un site de prezentare e gata în aproximativ două săptămâni de la primirea textelor și pozelor." },
    ],
  },
  constanta: {
    intro: [
      "Constanța trăiește din port și turism: Mamaia, Năvodari și stațiunile de pe litoral aduc vârful de clienți vara, dar rezervările se fac online cu luni înainte. Orașul are și o piață mare de servicii pentru localnici, în Tomis, centru și zona Universității Ovidius.",
      "Pentru cazări și restaurante, sezonul se câștigă primăvara, pe Google și pe recenzii. Pentru firmele de transport, logistică și servicii portuare, contează un site serios, în română și engleză.",
    ],
    businesses: [
      { name: "Hoteluri, apartamente în regim hotelier, pensiuni", need: "galerie, prețuri pe sezon, rezervare directă și variantă în engleză" },
      { name: "Restaurante și beach bar-uri", need: "meniu, rezervări, evenimente" },
      { name: "Firme de transport, logistică, servicii portuare", need: "site de prezentare în engleză, servicii și cerere de ofertă" },
      { name: "Clinici și cabinete", need: "programare online și pagini pe specialități" },
      { name: "Firme de servicii pentru casă", need: "zone acoperite (Constanța, Mamaia, Ovidiu, Năvodari) și buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru cazări din Mamaia și de pe litoral?", a: "Da. Un site de cazare cu rezervare directă te scapă de comisionul platformelor; îl recomandăm gata cu cel puțin două luni înainte de sezon." },
      { q: "Puteți face site în engleză pentru firme de logistică?", a: "Da, a doua limbă costă 499 lei." },
      { q: "Lucrați cu firme din Mangalia sau Medgidia?", a: "Da, cu firme din tot județul Constanța." },
    ],
  },
  brasov: {
    intro: [
      "Brașovul e unul dintre cele mai puternice orașe turistice din țară: centrul istoric cu Piața Sfatului, Poiana Brașov și drumul spre Râșnov și Bran aduc turiști tot anul. În jurul orașului există și o industrie solidă și multe firme noi în zona Coresi.",
      "Turiștii aleg cazarea și restaurantul pe telefon, după poze și recenzii, iar localnicii caută servicii în cartierele lor. Ambele tipuri de clienți ajung la tine doar dacă apari primul pe Google.",
    ],
    businesses: [
      { name: "Pensiuni, cabane, apartamente în regim hotelier", need: "galerie, disponibilitate, rezervare directă și variantă în engleză" },
      { name: "Restaurante și cafenele din centrul istoric", need: "meniu, rezervări și hartă" },
      { name: "Agenții de turism și activități (ski, drumeții, tururi)", need: "pachete, calendar și rezervare online" },
      { name: "Firme din industrie și furnizori", need: "site de prezentare în română și engleză" },
      { name: "Clinici și servicii pentru localnici", need: "programare online și pagini pe servicii" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Brașov și din Bran?", a: "Da. Facem site-uri cu rezervare directă, galerie mare și variantă în engleză, ca să nu depinzi doar de platformele cu comision." },
      { q: "Lucrați cu firme din Săcele, Ghimbav sau Râșnov?", a: "Da, cu firme din tot județul Brașov." },
      { q: "Puteți face și profilul Google al afacerii?", a: "Da. Profilul Google Business complet costă 200 lei și e cel mai important pas pentru o afacere turistică sau locală." },
    ],
  },
  bacau: {
    intro: [
      "Bacăul e un nod comercial al Moldovei centrale, cu aeroport, industrie aeronautică și mulți antreprenori locali, unii crescuți până la branduri naționale. Piața de servicii e diversă, de la producție la comerț și HoReCa.",
      "Concurența online e încă moderată: în multe domenii, câteva firme cu site bun prind majoritatea căutărilor din județ. E un moment bun să intri înaintea concurenței.",
    ],
    businesses: [
      { name: "Producători și firme industriale", need: "catalog de produse, capabilități și cerere de ofertă" },
      { name: "Distribuitori și comerț en-gros", need: "catalog online, formular pentru parteneri" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie, cerere de ofertă pentru evenimente" },
      { name: "Firme de construcții și amenajări", need: "galerie de lucrări, servicii și zone acoperite din județ" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Onești, Moinești sau Comănești?", a: "Da, cu firme din tot județul Bacău; pagina se optimizează pe orașul în care vrei clienți." },
      { q: "Faceți catalog online pentru producători?", a: "Da. Un catalog cu produse, fișe tehnice și cerere de ofertă se poate face ca site de prezentare sau ca magazin online, după cum vinzi." },
      { q: "Cât costă un site de prezentare?", a: "Pornește de la 1.500 lei, cu opțiuni la preț fix, de la 99 lei pe pagină în plus." },
    ],
  },
  galati: {
    intro: [
      "Galațiul e orașul-port de la Dunăre, cu tradiție în siderurgie și construcții navale, universitate mare și o faleză care adună lumea în weekend. Piața de servicii locale e mare, dar puține firme au o prezență online serioasă.",
      "Asta e un avantaj: în multe domenii, un site rapid și un profil Google îngrijit sunt suficiente ca să prinzi căutările din tot județul, inclusiv din Tecuci.",
    ],
    businesses: [
      { name: "Firme din industrie, naval și servicii portuare", need: "site de prezentare în română și engleză, cu servicii și certificări" },
      { name: "Clinici și cabinete", need: "programare online și pagini pe specialități" },
      { name: "Restaurante și terase pe faleză", need: "meniu, rezervări, evenimente" },
      { name: "Firme de construcții și instalații", need: "galerie de lucrări, servicii și buton de apel" },
      { name: "Magazine și service-uri", need: "program, servicii și hartă" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Tecuci sau din județul Galați?", a: "Da, cu firme din tot județul." },
      { q: "Faceți site-uri în engleză pentru firme din zona portului?", a: "Da, a doua limbă costă 499 lei." },
      { q: "Cât durează un site?", a: "Un site de prezentare e gata în aproximativ două săptămâni de la primirea textelor și pozelor." },
    ],
  },
  ploiesti: {
    intro: [
      "Ploieștiul e oraș industrial, cu rafinării și mulți furnizori din jur, la o oră de București și la intrarea pe Valea Prahovei. Mulți clienți compară oferta locală cu cea din capitală, așa că prezentarea online trebuie să fie la același nivel.",
      "Pentru afacerile de pe Valea Prahovei (Sinaia, Bușteni, Azuga), turismul se joacă online. Pentru firmele din oraș, contează paginile pe servicii și profilul Google.",
    ],
    businesses: [
      { name: "Furnizori și firme industriale", need: "site de prezentare, capabilități și cerere de ofertă" },
      { name: "Cazări și restaurante pe Valea Prahovei", need: "galerie, rezervare directă, variantă în engleză" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Firme de construcții și instalații", need: "lucrări, servicii, zone acoperite" },
      { name: "Service-uri auto", need: "servicii, programare și buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni de pe Valea Prahovei?", a: "Da, cu rezervare directă și galerie, ca să nu depinzi doar de platformele cu comision." },
      { q: "Lucrați cu firme din Câmpina sau Mizil?", a: "Da, cu firme din tot județul Prahova." },
      { q: "Cât costă un site de prezentare?", a: "Pornește de la 1.500 lei; opțiunile se adaugă la preț fix." },
    ],
  },
  pitesti: {
    intro: [
      "Piteștiul gravitează în jurul industriei auto, cu uzina Dacia de la Mioveni și mulți furnizori în zonă. Asta aduce putere de cumpărare și o piață de servicii activă, de la clinici la HoReCa.",
      "Concurența online e moderată: o firmă locală cu site bun și profil Google îngrijit poate ajunge în primele rezultate pentru căutările din tot județul Argeș.",
    ],
    businesses: [
      { name: "Furnizori din industria auto", need: "site de prezentare în română și engleză, capabilități și certificări" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie, cerere de ofertă" },
      { name: "Service-uri auto și piese", need: "servicii, programare, buton de apel" },
      { name: "Firme de construcții", need: "lucrări, servicii, zone acoperite" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Mioveni, Câmpulung sau Curtea de Argeș?", a: "Da, cu firme din tot județul Argeș." },
      { q: "Faceți site în engleză pentru furnizori auto?", a: "Da, a doua limbă costă 499 lei." },
      { q: "Pot programa clienții online?", a: "Da. Programările automate în calendar, cu reamintire pe email, costă 399 lei." },
    ],
  },
  sibiu: {
    intro: [
      "Sibiul combină turismul cultural (centrul istoric cu Piața Mare, festivalurile și Păltinișul) cu industria de componente auto din jurul orașului. Clienții, turiști sau localnici, au așteptări ridicate, inclusiv la site-urile firmelor.",
      "Turiștii aleg online, pe poze și recenzii, iar furnizorii industriali au nevoie de prezentare serioasă în engleză. Un site rapid, în două limbi, acoperă ambele situații.",
    ],
    businesses: [
      { name: "Pensiuni, hoteluri, apartamente în centru", need: "galerie, rezervare directă, variantă în engleză și germană" },
      { name: "Restaurante și cafenele din centrul istoric", need: "meniu, rezervări și hartă" },
      { name: "Furnizori auto și industriali", need: "site de prezentare în engleză și germană" },
      { name: "Agenții de turism și ghizi", need: "tururi, calendar și rezervare online" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
    ],
    faqs: [
      { q: "Faceți site-uri în engleză sau germană pentru firme din Sibiu?", a: "Da. Fiecare limbă în plus costă 499 lei; e utilă pentru turism și pentru furnizorii cu clienți din străinătate." },
      { q: "Lucrați cu firme din Mediaș, Cisnădie sau Avrig?", a: "Da, cu firme din tot județul Sibiu." },
      { q: "Faceți site-uri pentru pensiuni din Mărginimea Sibiului?", a: "Da, cu rezervare directă și galerie mare." },
    ],
  },
  oradea: {
    intro: [
      "Oradea a devenit unul dintre cele mai îngrijite orașe din țară: centrul Art Nouveau renovat, Băile Felix aproape și o comunitate de antreprenori activă. Mulți turiști vin din Ungaria și din restul țării, iar localnicii sunt obișnuiți să caute totul online.",
      "Concurența online crește de la an la an, așa că paginile pe servicii, variantele în mai multe limbi și recenziile contează tot mai mult.",
    ],
    businesses: [
      { name: "Cazări în Oradea și la Băile Felix", need: "galerie, rezervare directă, variantă în engleză și maghiară" },
      { name: "Restaurante și cafenele din centru", need: "meniu, rezervări, evenimente" },
      { name: "Clinici, stomatologie, tratamente", need: "programare online, pagini pe tratamente, variantă pentru pacienți din străinătate" },
      { name: "Firme din producție și logistică", need: "site de prezentare în engleză" },
      { name: "Firme de servicii pentru casă", need: "servicii, zone acoperite și buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri în maghiară sau engleză?", a: "Da. Fiecare limbă în plus costă 499 lei." },
      { q: "Lucrați cu cazări de la Băile Felix?", a: "Da, cu rezervare directă, galerie și prețuri pe sezon." },
      { q: "Lucrați cu firme din Salonta, Beiuș sau Marghita?", a: "Da, cu firme din tot județul Bihor." },
    ],
  },
  craiova: {
    intro: [
      "Craiova crește în jurul industriei auto (uzina Ford Otosan), al universității și al serviciilor pentru toată Oltenia. Parcul Romanescu, centrul renovat și zona Electroputere adună viața comercială a orașului.",
      "E o piață mare, cu concurență online încă sub potențial: firmele care își fac acum un site bun și profilul Google prind pozițiile bune înaintea celorlalte.",
    ],
    businesses: [
      { name: "Furnizori auto și industriali", need: "site de prezentare în română și engleză, capabilități" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Restaurante, terase, săli de evenimente", need: "meniu, galerie, cerere de ofertă" },
      { name: "Firme de construcții și amenajări", need: "lucrări, servicii, zone acoperite din Dolj" },
      { name: "Școli private și cursuri", need: "program, prețuri și înscriere online" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Băilești, Calafat sau Filiași?", a: "Da, cu firme din tot județul Dolj." },
      { q: "Cât costă un site de prezentare în Craiova?", a: "Pornește de la 1.500 lei, cu opțiuni la preț fix, de exemplu programări online 399 lei sau logo 199 lei." },
      { q: "Faceți și magazine online?", a: "Da, de la 3.000 lei, cu plăți cu cardul și curier." },
    ],
  },
};

export function getCityContent(slug: string): CityContent | undefined {
  return CITY_CONTENT[slug];
}
