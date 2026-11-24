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
  // ── Restul orașelor cu pagină proprie (adăugate 24 nov 2026): același standard —
  //    fapte generale, verificabile; fără prețuri de opțiuni (lista se poate schimba).
  "piatra-neamt": {
    intro: [
      "Piatra Neamț e un oraș de munte, între Cozla și Cetățuia, cu telegondolă, centru istoric în jurul Curții Domnești și acces rapid spre Ceahlău, Lacul Bicaz și Cheile Bicazului. Turismul, comerțul și serviciile țin economia orașului.",
      "Turiștii își aleg cazarea și restaurantul de pe telefon, cu zile înainte, iar localnicii caută la fel serviciile de zi cu zi. Firmele din Piatra Neamț care apar primele pe Google prind clienții din tot județul Neamț.",
    ],
    businesses: [
      { name: "Pensiuni și cazări spre Ceahlău și Bicaz", need: "galerie mare, prețuri pe sezon și rezervare directă, fără comisionul platformelor" },
      { name: "Restaurante și terase", need: "meniu actualizat, rezervări și program vizibil pe Google" },
      { name: "Agenții de turism și ghizi locali", need: "pagini pe trasee și excursii, cu formular de rezervare" },
      { name: "Cabinete medicale și stomatologice", need: "pagini pe servicii și programare online" },
      { name: "Meșteri și firme de construcții", need: "lucrări făcute, zonele acoperite din județ și buton de sunat" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din zona Ceahlău și Bicaz?", a: "Da. Un site de pensiune are nevoie de poze mari, prețuri pe sezon și rezervare directă. Rezervările directe te scapă de comisionul platformelor." },
      { q: "Lucrați și cu firme din Roman sau Târgu Neamț?", a: "Da, cu firme din tot județul Neamț. Totul se face online, iar pagina se optimizează pe orașul în care vrei clienți." },
      { q: "Cât costă un site de prezentare în Piatra Neamț?", a: "Site Start pornește de la 1.500 lei: 5 pagini și blog, construit de la zero, gata în câteva zile. Prețul exact îl vezi pe loc în calculatorul de pe site." },
    ],
  },
  roman: {
    intro: [
      "Romanul e al doilea oraș al județului Neamț și un centru industrial al Moldovei, cunoscut pentru fabrica de țevi și pentru rolul de nod feroviar și rutier între Bacău, Piatra Neamț și Iași. Economia combină industria, comerțul și serviciile.",
      "Pentru firmele din Roman, concurența online e încă mică: un site clar și un profil Google îngrijit ajung repede în primele rezultate pentru căutările din oraș și din comunele din jur.",
    ],
    businesses: [
      { name: "Furnizori industriali și ateliere", need: "site de prezentare cu capacități, certificări și cerere de ofertă" },
      { name: "Magazine și firme de comerț", need: "produse principale, program, hartă și comandă telefonică" },
      { name: "Cabinete medicale și stomatologice", need: "programare online și prețuri orientative" },
      { name: "Service-uri auto", need: "listă de servicii, programare și buton de apel direct" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Roman, deși sunteți din Botoșani?", a: "Da. Tot proiectul merge online: discuția, oferta, contractul și livrarea. Lucrăm cu firme din toată Moldova." },
      { q: "Pot apărea în presa locală din județul Neamț?", a: "Da. Rețeaua Media Expres include ziarul local al județului Neamț, iar la lansarea site-ului poți primi un articol de prezentare." },
      { q: "Cât durează să fac un site pentru firma mea din Roman?", a: "Un Site Start e gata în câteva zile după ce ne trimiți textele și pozele. Proiectele mai mari primesc un termen clar în ofertă." },
    ],
  },
  vaslui: {
    intro: [
      "Vasluiul e reședința unui județ agricol din estul Moldovei, cu orașul centrat pe administrație, comerț și servicii, și cu industrie ușoară, în special confecții. Mulți clienți vin din comunele din jur și din Bârlad, Huși sau Negrești.",
      "Prezența online profesionistă e încă rară printre firmele locale, așa că cine își face acum site și profil Google apare primul la căutările din tot județul.",
    ],
    businesses: [
      { name: "Firme agricole și distribuitori", need: "prezentarea produselor, zone de livrare și cerere de ofertă" },
      { name: "Fabrici de confecții", need: "site în română și engleză, pentru clienți din străinătate" },
      { name: "Cabinete medicale", need: "pagini pe servicii și programare online" },
      { name: "Magazine de materiale și bricolaj", need: "produse, stoc orientativ, program și comandă telefonică" },
    ],
    faqs: [
      { q: "Faceți site-uri și pentru firme din Bârlad sau Huși?", a: "Da, lucrăm cu firme din tot județul Vaslui. Pagina se poate optimiza pe orașul în care vrei să te găsească clienții." },
      { q: "Merită un site dacă firma mea trăiește din recomandări?", a: "Da. Și cei care te află din recomandare te caută pe Google înainte să sune. Un site clar le confirmă că ești serios." },
      { q: "Cât costă un site în Vaslui?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog, gata în câteva zile." },
    ],
  },
  focsani: {
    intro: [
      "Focșaniul e capitala Vrancei, cea mai mare zonă viticolă a țării, cu podgoriile Panciu, Odobești și Cotești în apropiere. Economia orașului combină vinul, agricultura, comerțul și serviciile.",
      "Cramele și producătorii care s-au mutat online vând în toată țara, nu doar local. Pentru firmele de servicii din oraș, un site bun și un profil Google îngrijit aduc clienți din tot județul.",
    ],
    businesses: [
      { name: "Crame și producători de vin", need: "magazin online sau comenzi, povestea cramei și degustări cu rezervare" },
      { name: "Firme agricole", need: "prezentarea produselor și cerere de ofertă pentru distribuitori" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie și cerere de ofertă pentru nunți și botezuri" },
      { name: "Cabinete medicale și clinici", need: "programare online și pagini pe specialități" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru crame din Vrancea?", a: "Da. O cramă are nevoie de prezentarea vinurilor, a cramei și a degustărilor, iar pentru vânzarea online de magazin cu verificarea vârstei." },
      { q: "Lucrați și cu firme din Adjud sau Mărășești?", a: "Da, cu firme din tot județul Vrancea, totul online." },
      { q: "Pot vinde vin online prin site?", a: "Da, printr-un magazin online. Discutăm întâi regulile pentru vânzarea de alcool, ca site-ul să fie conform." },
    ],
  },
  barlad: {
    intro: [
      "Bârladul e al doilea oraș al județului Vaslui, cu tradiție culturală, industrie și un rol de centru comercial pentru sudul județului. Mulți clienți vin din comunele din jur.",
      "Concurența online e mică, deci o firmă din Bârlad cu site clar și profil Google îngrijit poate domina căutările locale cu un efort mic.",
    ],
    businesses: [
      { name: "Firme de producție și ateliere", need: "prezentare, capacități și cerere de ofertă" },
      { name: "Magazine locale", need: "produse, program, hartă și comandă telefonică" },
      { name: "Cabinete medicale și stomatologice", need: "servicii, programare online" },
      { name: "Firme de construcții și instalații", need: "lucrări realizate, servicii și zonele acoperite" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru firme mici din Bârlad?", a: "Da. Site Start e gândit exact pentru firme mici: 5 pagini și blog, de la 1.500 lei, gata în câteva zile." },
      { q: "Trebuie să vin la birou?", a: "Nu. Discuția, oferta, contractul și livrarea se fac online, iar pe WhatsApp ne poți trimite și poze." },
      { q: "Mă ajutați și cu profilul Google?", a: "Da. Profilul Google Business e adesea primul lucru pe care îl vede clientul, așa că îl putem configura odată cu site-ul." },
    ],
  },
  dorohoi: {
    intro: [
      "Dorohoiul e al doilea oraș al județului Botoșani, în nordul Moldovei, aproape de granița cu Ucraina. Economia locală stă pe comerț, servicii și agricultura din zona din jur.",
      "Fiind din Botoșani, cunoaștem bine piața de aici. Clienții din Dorohoi și din comunele vecine caută tot mai mult pe telefon, iar concurența online serioasă aproape lipsește.",
    ],
    businesses: [
      { name: "Magazine și firme de comerț", need: "produse, program, hartă și comandă telefonică" },
      { name: "Firme agricole", need: "prezentarea produselor și zone de livrare" },
      { name: "Cabinete medicale", need: "servicii și programare online" },
      { name: "Meșteri și firme de servicii", need: "servicii, lucrări și buton de sunat" },
    ],
    faqs: [
      { q: "Sunteți aproape de Dorohoi?", a: "Da, Imperial Media e din Botoșani. Ne putem vedea pentru discuția de început, iar restul proiectului merge online." },
      { q: "Pot apărea în Botoșani Expres?", a: "Da. La lansarea site-ului primești un articol în Botoșani Expres, ziarul local din rețeaua noastră, cu link spre site-ul tău." },
      { q: "Cât costă un site în Dorohoi?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog, gata în câteva zile." },
    ],
  },
  radauti: {
    intro: [
      "Rădăuțiul e un oraș bucovinean cu tradiție meșteșugărească, cunoscut pentru ceramica neagră de Marginea din apropiere și pentru Mănăstirea Putna, la mică distanță. Economia combină prelucrarea lemnului, agricultura, comerțul și turismul.",
      "Turiștii care vin spre Putna și Sucevița își caută cazarea și masa online, iar firmele locale de lemn și mobilă au clienți și în străinătate. Pentru amândouă, site-ul e prima impresie.",
    ],
    businesses: [
      { name: "Pensiuni din zona Putna, Sucevița, Marginea", need: "galerie, prețuri pe sezon, rezervare directă, variantă în engleză" },
      { name: "Fabrici de mobilă și prelucrare a lemnului", need: "catalog de produse și cerere de ofertă, în română și engleză" },
      { name: "Meșteri populari și ateliere", need: "povestea atelierului și magazin online simplu" },
      { name: "Firme de servicii locale", need: "servicii, program și buton de sunat" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Bucovina?", a: "Da. Un site de pensiune are nevoie de poze mari, prețuri pe sezon, rezervare directă și variantă în engleză." },
      { q: "Pot vinde produse meșteșugărești online?", a: "Da, printr-un magazin online simplu, cu livrare prin curier în toată țara." },
      { q: "Lucrați cu firme din tot județul Suceava?", a: "Da: Rădăuți, Suceava, Fălticeni, Câmpulung Moldovenesc și comunele din jur, totul online." },
    ],
  },
  "campulung-moldovenesc": {
    intro: [
      "Câmpulung Moldovenesc e un oraș de munte în Obcinile Bucovinei, la poalele Rarăului și Giumalăului, cu tradiție în prelucrarea lemnului și un turism activ de iarnă și de vară.",
      "Turiștii își rezervă cazarea și activitățile de pe telefon, iar cine apare primul pe Google prinde clienții întregii zone, de la Vatra Dornei la Gura Humorului.",
    ],
    businesses: [
      { name: "Pensiuni și cabane", need: "galerie, prețuri pe sezon, rezervare directă, engleză" },
      { name: "Închirieri echipament și activități montane", need: "oferte, prețuri, rezervare online" },
      { name: "Firme de prelucrare a lemnului", need: "catalog și cerere de ofertă" },
      { name: "Restaurante cu specific bucovinean", need: "meniu, galerie și rezervări" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru cabane și pensiuni de munte?", a: "Da. Punem accent pe poze, disponibilitate și rezervare directă, ca să nu plătești comision platformelor." },
      { q: "Poate fi site-ul în română și engleză?", a: "Da, a doua limbă e o opțiune la preț fix, utilă pentru turiștii străini." },
      { q: "Lucrați și cu firme din Vatra Dornei sau Gura Humorului?", a: "Da, cu firme din tot județul Suceava." },
    ],
  },
  targoviste: {
    intro: [
      "Târgoviștea a fost capitala Țării Românești, iar Curtea Domnească și Turnul Chindiei sunt și azi reperele orașului. Astăzi e reședința Dâmboviței, cu universitate, industrie și comerț, la aproximativ o oră de București.",
      "Clienții de aici compară natural cu oferta din capitală, deci firmele locale au nevoie de o prezentare online pe măsură ca să nu piardă clienți în fața celor din București.",
    ],
    businesses: [
      { name: "Firme industriale și furnizori", need: "capacități, certificări, cerere de ofertă" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie, cerere de ofertă" },
      { name: "Firme de construcții și amenajări", need: "portofoliu de lucrări și zone acoperite" },
    ],
    faqs: [
      { q: "Lucrați cu firme din tot județul Dâmbovița?", a: "Da: Târgoviște, Moreni, Pucioasa, Găești și restul județului, totul online." },
      { q: "Pot apărea în presa locală din Dâmbovița?", a: "Da. Rețeaua Media Expres include ziarul local al județului Dâmbovița." },
      { q: "Cât costă un site în Târgoviște?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog, gata în câteva zile." },
    ],
  },
  buzau: {
    intro: [
      "Buzăul e un nod comercial și feroviar între Muntenia și Moldova, cu industrie, agricultură și comerț. Județul e cunoscut pentru Vulcanii Noroioși și Muzeul Chihlimbarului din Colți, care aduc turiști în zonă.",
      "Clientela caută tot mai mult online, iar oferta locală de prezență digitală profesionistă e încă subțire. Pentru firmele din Buzău, asta e o fereastră bună de poziționare.",
    ],
    businesses: [
      { name: "Distribuitori și firme de comerț", need: "produse, zone de livrare, cerere de ofertă" },
      { name: "Pensiuni și cazări spre zona Vulcanilor Noroioși", need: "galerie, prețuri și rezervare directă" },
      { name: "Cabinete medicale", need: "servicii și programare online" },
      { name: "Service-uri auto și transportatori", need: "servicii, programare, buton de apel" },
    ],
    faqs: [
      { q: "Lucrați și cu firme din Râmnicu Sărat?", a: "Da, cu firme din tot județul Buzău, online." },
      { q: "Mă ajutați să apar pe Google Maps?", a: "Da. Configurăm profilul Google Business odată cu site-ul, ca să apari la căutările de tip „serviciu + Buzău”." },
      { q: "Cât durează un site?", a: "Un Site Start e gata în câteva zile după ce primim textele și pozele." },
    ],
  },
  braila: {
    intro: [
      "Brăila e un oraș-port la Dunăre, cu un centru istoric mare și tradiție comercială. Economia combină industria navală și metalurgică, comerțul și agricultura din Câmpia Brăilei, iar podul peste Dunăre a apropiat orașul de Tulcea și Delta Dunării.",
      "Piața de servicii e compactă, cu concurență online moderată. Firmele care își fac acum o prezență serioasă prind pozițiile bune înainte să se aglomereze.",
    ],
    businesses: [
      { name: "Firme din industria navală și metalurgie", need: "prezentare în română și engleză, capacități" },
      { name: "Firme agricole și de cereale", need: "produse, capacitate, cerere de ofertă" },
      { name: "Restaurante și terase pe faleză", need: "meniu, rezervări, galerie" },
      { name: "Clinici și cabinete", need: "programare online și pagini pe servicii" },
    ],
    faqs: [
      { q: "Faceți site-uri în engleză pentru firme din port?", a: "Da, a doua limbă e o opțiune la preț fix în calculator." },
      { q: "Pot apărea în presa locală din Brăila?", a: "Da. Rețeaua Media Expres include ziarul local al județului Brăila." },
      { q: "Cât costă un site în Brăila?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog, gata în câteva zile." },
    ],
  },
  slobozia: {
    intro: [
      "Slobozia e reședința Ialomiței, în inima Bărăganului, una dintre cele mai importante zone agricole ale țării. Economia orașului stă pe agricultură, procesarea produselor agricole, comerț și servicii.",
      "Firmele agricole și de servicii care se văd online deservesc un județ întreg, cu concurență digitală mică. Un site clar și profilul Google ajung rapid în primele rezultate.",
    ],
    businesses: [
      { name: "Ferme și firme agricole", need: "producție, capacitate, contact pentru cumpărători" },
      { name: "Furnizori de inputuri și utilaje agricole", need: "catalog, cerere de ofertă, zone acoperite" },
      { name: "Cabinete medicale", need: "servicii, programare online" },
      { name: "Magazine și firme de servicii", need: "program, hartă, buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru ferme?", a: "Da. O fermă are nevoie de prezentarea producției, a capacității și a unui contact clar pentru cumpărători și parteneri." },
      { q: "Lucrați și cu firme din Urziceni sau Fetești?", a: "Da, cu firme din tot județul Ialomița, online." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog." },
    ],
  },
  calarasi: {
    intro: [
      "Călărașiul e un oraș dunărean din sud-estul Munteniei, cu agricultură puternică în tot județul și industrie în jurul orașului. Clienții vin din oraș, din Oltenița și din comunele din Bărăgan.",
      "Piața de servicii locale abia se digitalizează, așa că primele firme cu prezență serioasă ajung sus în căutări fără luptă mare.",
    ],
    businesses: [
      { name: "Firme agricole", need: "producție, capacitate, contact pentru cumpărători" },
      { name: "Pescării și restaurante cu specific pescăresc", need: "meniu, rezervări, galerie" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții și instalații", need: "lucrări, servicii, zone acoperite" },
    ],
    faqs: [
      { q: "Lucrați și cu firme din Oltenița?", a: "Da, cu firme din tot județul Călărași." },
      { q: "Pot apărea în presa locală?", a: "Da. Rețeaua Media Expres include ziarul local al județului Călărași." },
      { q: "Cât durează să am site?", a: "Un Site Start e gata în câteva zile după ce primim textele și pozele." },
    ],
  },
  giurgiu: {
    intro: [
      "Giurgiul e oraș-port la Dunăre și punct de trecere spre Bulgaria, prin Podul Prieteniei spre Ruse. Logistica, transportul și comerțul țin economia, iar Bucureștiul e la aproximativ 60 de kilometri.",
      "Mulți clienți din zonă compară cu oferta din capitală, iar firmele de logistică lucrează cu parteneri din străinătate. Un site profesionist, eventual în două limbi, face diferența.",
    ],
    businesses: [
      { name: "Firme de transport și logistică", need: "servicii, flotă, cerere de ofertă, română și engleză" },
      { name: "Case de schimb și firme de servicii pentru tranzit", need: "program, servicii, hartă" },
      { name: "Restaurante și cazări pentru tranzit", need: "meniu, rezervări, poziție pe hartă" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Faceți site-uri în engleză sau bulgară?", a: "Da. A doua limbă e o opțiune la preț fix în calculator." },
      { q: "Lucrați cu firme din tot județul Giurgiu?", a: "Da, online." },
      { q: "Cât costă un site?", a: "Site Start pornește de la 1.500 lei, cu 5 pagini și blog." },
    ],
  },
  alexandria: {
    intro: [
      "Alexandria e reședința Teleormanului, un județ predominant agricol din sudul țării. Orașul e centru administrativ și comercial pentru zona din jur, inclusiv pentru Roșiori de Vede, Turnu Măgurele și Zimnicea.",
      "Prezența online profesionistă e încă excepția, nu regula, în piața locală. O firmă cu site bun și profil Google îngrijit iese ușor în evidență.",
    ],
    businesses: [
      { name: "Firme agricole și de procesare", need: "producție, capacitate, contact pentru cumpărători" },
      { name: "Magazine și distribuitori", need: "produse, program, comandă telefonică" },
      { name: "Cabinete medicale", need: "servicii, programare online" },
      { name: "Firme de servicii locale", need: "servicii, zone acoperite, buton de apel" },
    ],
    faqs: [
      { q: "Lucrați și cu firme din Roșiori de Vede sau Turnu Măgurele?", a: "Da, cu firme din tot județul Teleorman." },
      { q: "Pot apărea în presa locală din Teleorman?", a: "Da. Rețeaua Media Expres include ziarul local al județului Teleorman." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  slatina: {
    intro: [
      "Slatina e reședința județului Olt, cunoscută pentru industria aluminiului, cu cel mai mare producător de aluminiu din țară, și pentru industria de componente din jurul ei. Asta aduce venituri stabile și o piață de servicii activă.",
      "Concurența online între firmele locale e încă mică. Un site rapid și un profil Google îngrijit aduc clienți din tot județul Olt.",
    ],
    businesses: [
      { name: "Furnizori și firme din industrie", need: "capacități, certificări, cerere de ofertă" },
      { name: "Clinici și cabinete", need: "programare online, pagini pe specialități" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie, cerere de ofertă" },
      { name: "Firme de construcții", need: "lucrări realizate, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Caracal sau Balș?", a: "Da, cu firme din tot județul Olt." },
      { q: "Faceți site-uri pentru furnizori industriali?", a: "Da, cu pagini de capabilități, certificări și variantă în engleză." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "ramnicu-valcea": {
    intro: [
      "Râmnicu Vâlcea e reședința unui județ cu stațiuni balneare cunoscute, Călimănești-Căciulata, Băile Olănești și Băile Govora, și cu mănăstiri ca Horezu și Cozia. Economia combină industria chimică, turismul și comerțul.",
      "Turismul balnear și cel spre mănăstiri aduc valuri de căutări online. Firmele pregătite cu site și profil Google le transformă în clienți.",
    ],
    businesses: [
      { name: "Pensiuni și hoteluri în stațiunile balneare", need: "galerie, tratamente, prețuri, rezervare directă" },
      { name: "Restaurante și terase", need: "meniu, rezervări" },
      { name: "Clinici și centre de recuperare", need: "servicii, programare online" },
      { name: "Firme industriale", need: "capacități, cerere de ofertă" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Călimănești sau Olănești?", a: "Da, cu rezervare directă și prezentarea tratamentelor din zonă." },
      { q: "Lucrați cu firme din tot județul Vâlcea?", a: "Da, inclusiv Horezu, Drăgășani și Brezoi." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  campina: {
    intro: [
      "Câmpina e un oraș din Prahova, pe Valea Prahovei, cu tradiție în industria petrolieră și repere precum Castelul Iulia Hasdeu și Muzeul Nicolae Grigorescu. E la intrarea spre stațiunile montane din Valea Prahovei.",
      "Mulți clienți vin din Ploiești, Breaza și stațiunile din apropiere și caută totul online. Firmele locale cu prezență serioasă câștigă zona întreagă.",
    ],
    businesses: [
      { name: "Firme din industria petrolieră și furnizori", need: "capacități, certificări, cerere de ofertă" },
      { name: "Pensiuni și cazări spre Valea Prahovei", need: "galerie, prețuri, rezervare directă" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții și amenajări", need: "portofoliu, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Breaza, Comarnic sau Ploiești?", a: "Da, cu firme din tot județul Prahova." },
      { q: "Faceți site-uri pentru pensiuni?", a: "Da, cu galerie mare și rezervare directă." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "drobeta-turnu-severin": {
    intro: [
      "Drobeta-Turnu Severin e un oraș-port la Dunăre, la intrarea în zona Porților de Fier, cu ruinele podului lui Traian și cu Cazanele Dunării la mică distanță. Economia combină industria, comerțul și un turism în creștere.",
      "Piața de servicii e compactă și concurența online redusă, un avantaj clar pentru firmele care se poziționează acum, mai ales cele din turism.",
    ],
    businesses: [
      { name: "Pensiuni și cazări spre Cazanele Dunării", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Firme de croaziere și excursii pe Dunăre", need: "oferte, prețuri, rezervare online" },
      { name: "Restaurante cu specific pescăresc", need: "meniu, rezervări" },
      { name: "Firme de servicii locale", need: "servicii, program, buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru turismul de pe Dunăre?", a: "Da: pensiuni, excursii cu barca, restaurante, cu rezervare directă și variantă în engleză." },
      { q: "Lucrați cu firme din tot județul Mehedinți?", a: "Da, inclusiv Orșova, online." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "targu-jiu": {
    intro: [
      "Târgu Jiu e orașul lui Brâncuși: Coloana Infinitului, Poarta Sărutului și Masa Tăcerii atrag turiști tot anul. Economia vine din energie și minerit, în tranziție, plus comerț și servicii, iar Rânca și Transalpina sunt aproape.",
      "Piața de servicii locale se mută spre online și încă are poziții bune libere, mai ales pentru turism și HoReCa.",
    ],
    businesses: [
      { name: "Pensiuni spre Rânca și Transalpina", need: "galerie, prețuri pe sezon, rezervare directă" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări" },
      { name: "Firme din energie și furnizori", need: "capacități, cerere de ofertă" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Rânca?", a: "Da, cu rezervare directă și prețuri pe sezon." },
      { q: "Lucrați cu firme din Motru sau Târgu Cărbunești?", a: "Da, cu firme din tot județul Gorj." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "targu-mures": {
    intro: [
      "Târgu Mureș e un important centru universitar și medical, cu Universitatea de Medicină, Farmacie, Științe și Tehnologie, și un oraș bilingv, cu reperul Palatului Culturii. Economia combină industria, serviciile medicale private și comerțul.",
      "Cabinetele, clinicile și serviciile private concurează intens pe căutările pacienților, unde recenziile și site-ul cântăresc decisiv. Mulți clienți caută și în maghiară.",
    ],
    businesses: [
      { name: "Clinici și cabinete medicale", need: "pagini pe specialități, medici, programare online" },
      { name: "Farmacii și laboratoare", need: "servicii, program, hartă" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări, română și maghiară" },
      { name: "Firme industriale și furnizori", need: "capacități, cerere de ofertă" },
    ],
    faqs: [
      { q: "Faceți site-uri în română și maghiară?", a: "Da. A doua limbă e o opțiune la preț fix în calculator." },
      { q: "Faceți site-uri pentru clinici?", a: "Da, cu pagini pe specialități, profil de medic și programare online." },
      { q: "Lucrați cu firme din Reghin sau Sighișoara?", a: "Da, cu firme din tot județul Mureș." },
    ],
  },
  "alba-iulia": {
    intro: [
      "Alba Iulia e orașul Marii Uniri și al Cetății Alba Carolina, una dintre cele mai mari cetăți bastionare din țară. Turismul istoric, industria și podgoriile din zonă susțin economia.",
      "Turiștii și localnicii aleg deopotrivă pe Google. Pensiunile, restaurantele și firmele de servicii care apar primele câștigă clienții orașului și ai județului.",
    ],
    businesses: [
      { name: "Pensiuni și hoteluri lângă Cetate", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări, hartă" },
      { name: "Crame din zona Alba", need: "prezentare, degustări, comenzi" },
      { name: "Firme industriale", need: "capacități, cerere de ofertă" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru turismul din Alba Iulia?", a: "Da: pensiuni, restaurante, ghizi, cu rezervare directă și variantă în engleză." },
      { q: "Lucrați cu firme din Sebeș, Aiud sau Blaj?", a: "Da, cu firme din tot județul Alba." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  bistrita: {
    intro: [
      "Bistrița e reședința județului Bistrița-Năsăud, cu un centru medieval săsesc și industrie electrotehnică și de prelucrare. E și oraș de tranzit spre Bucovina și Maramureș, prin Pasul Tihuța.",
      "Firmele locale primesc tot mai mulți clienți din căutările online, inclusiv turiști în tranzit care caută cazare și masă pe drum.",
    ],
    businesses: [
      { name: "Firme industriale și furnizori", need: "capacități, certificări, engleză" },
      { name: "Pensiuni spre Pasul Tihuța", need: "galerie, prețuri, rezervare directă" },
      { name: "Restaurante pe traseul turistic", need: "meniu, hartă, program" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Năsăud sau Beclean?", a: "Da, cu firme din tot județul." },
      { q: "Faceți site-uri în engleză sau germană?", a: "Da, fiecare limbă în plus e o opțiune la preț fix." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  deva: {
    intro: [
      "Deva e reședința Hunedoarei, cu Cetatea Devei deasupra orașului și Castelul Corvinilor la câțiva kilometri. Administrația, comerțul și serviciile țin economia, într-un județ cu tradiție industrială.",
      "Piața de servicii locale se mută vizibil online, cu poziții de top încă accesibile pentru firmele care se mișcă acum.",
    ],
    businesses: [
      { name: "Pensiuni și cazări spre Cetate și Castelul Corvinilor", need: "galerie, prețuri, rezervare directă" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții", need: "lucrări, servicii, zone acoperite" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Hunedoara, Orăștie sau Brad?", a: "Da, cu firme din tot județul Hunedoara." },
      { q: "Mă ajutați și cu profilul Google?", a: "Da, îl configurăm odată cu site-ul." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  hunedoara: {
    intro: [
      "Hunedoara e orașul Castelului Corvinilor, unul dintre cele mai vizitate monumente din țară, și un fost centru siderurgic care își caută drumul spre servicii și turism.",
      "Turiștii care vin la castel caută online unde să mănânce și să doarmă. Firmele locale care apar primele pe Google prind acest flux.",
    ],
    businesses: [
      { name: "Pensiuni și cazări lângă castel", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Restaurante și cafenele", need: "meniu, hartă, program" },
      { name: "Firme industriale și ateliere", need: "capacități, cerere de ofertă" },
      { name: "Firme de servicii locale", need: "servicii, buton de apel" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru turismul din jurul Castelului Corvinilor?", a: "Da, cu rezervare directă și variantă în engleză." },
      { q: "Lucrați și cu firme din Deva sau Simeria?", a: "Da, cu firme din tot județul Hunedoara." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  sighisoara: {
    intro: [
      "Sighișoara are una dintre puținele cetăți medievale locuite din Europa, inclusă în patrimoniul UNESCO, cu Turnul cu Ceas și Casa Vlad Dracul. Turismul domină economia, alături de industria locală.",
      "Turiștii, mulți străini, rezervă totul online. Pensiunile și restaurantele din cetate și din jurul ei câștigă pe poze, recenzii și site în engleză.",
    ],
    businesses: [
      { name: "Pensiuni și hoteluri din cetate", need: "galerie, prețuri, rezervare directă, engleză și germană" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări, engleză" },
      { name: "Ghizi și agenții de tururi", need: "tururi, prețuri, rezervare online" },
      { name: "Magazine de suveniruri și meșteri", need: "magazin online, povestea atelierului" },
    ],
    faqs: [
      { q: "Faceți site-uri în engleză și germană pentru turiști?", a: "Da, fiecare limbă în plus e o opțiune la preț fix." },
      { q: "Pot primi rezervări direct pe site?", a: "Da, fără comisionul platformelor de rezervări." },
      { q: "Lucrați cu firme din tot județul Mureș?", a: "Da, online." },
    ],
  },
  medias: {
    intro: [
      "Mediașul e un oraș săsesc din județul Sibiu, cu centru istoric și biserică fortificată, și e centrul industriei gazelor naturale din România. Industria și serviciile conexe susțin economia.",
      "Furnizorii industriali au nevoie de site profesionist pentru parteneri, iar serviciile locale de vizibilitate pe Google pentru oraș și zona Târnavelor.",
    ],
    businesses: [
      { name: "Furnizori din industria gazelor", need: "capacități, certificări, cerere de ofertă, engleză" },
      { name: "Firme de inginerie și service industrial", need: "servicii, proiecte, contact" },
      { name: "Pensiuni și crame din zona Târnavelor", need: "galerie, rezervare, degustări" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru furnizori industriali?", a: "Da, cu capabilități, certificări și variantă în engleză." },
      { q: "Lucrați cu firme din Sibiu sau Copșa Mică?", a: "Da, cu firme din tot județul Sibiu." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  dej: {
    intro: [
      "Dejul e un oraș din nordul județului Cluj, la confluența Someșurilor, cu tradiție în exploatarea sării, iar salina de la Ocna Dej e în apropiere, și cu industrie de prelucrare. Comerțul și serviciile deservesc și zona din jur.",
      "Mulți clienți compară cu oferta din Cluj-Napoca, deci o prezentare online serioasă ajută firmele locale să rămână alegerea firească pentru zona Dejului.",
    ],
    businesses: [
      { name: "Firme industriale", need: "capacități, cerere de ofertă" },
      { name: "Magazine și firme de comerț", need: "produse, program, hartă" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții", need: "lucrări, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din tot județul Cluj?", a: "Da, inclusiv Gherla și Cluj-Napoca." },
      { q: "Merită un site pentru o firmă mică din Dej?", a: "Da. Clienții te caută pe Google înainte să sune, iar un site clar le confirmă că ești serios." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  turda: {
    intro: [
      "Turda e cunoscută pentru Salina Turda, una dintre cele mai vizitate atracții din țară, și pentru Cheile Turzii din apropiere. Turismul, industria și comerțul țin economia orașului.",
      "Turiștii care vin la salină caută online cazare și restaurante. Firmele locale care apar primele pe Google prind acest flux tot anul.",
    ],
    businesses: [
      { name: "Pensiuni și cazări lângă salină", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Restaurante și cafenele", need: "meniu, hartă, rezervări" },
      { name: "Agenții de turism și ghizi", need: "tururi, prețuri, rezervare" },
      { name: "Firme industriale", need: "capacități, cerere de ofertă" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru turismul din jurul Salinei Turda?", a: "Da, cu rezervare directă și variantă în engleză." },
      { q: "Lucrați și cu firme din Câmpia Turzii sau Cluj-Napoca?", a: "Da, cu firme din tot județul Cluj." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  fagaras: {
    intro: [
      "Făgărașul e orașul cetății, la poalele Munților Făgăraș, între Brașov și Sibiu. Industria și comerțul țin economia, iar turismul montan, cu Transfăgărășanul la mică distanță, aduce vizitatori.",
      "Turiștii care merg spre munte își caută cazarea și ghizii online. Firmele locale cu site și profil Google câștigă clienți din tot Țara Făgărașului.",
    ],
    businesses: [
      { name: "Pensiuni și cabane spre Munții Făgăraș", need: "galerie, prețuri, rezervare directă" },
      { name: "Ghizi montani și activități outdoor", need: "trasee, prețuri, rezervare online" },
      { name: "Firme industriale", need: "capacități, cerere de ofertă" },
      { name: "Restaurante", need: "meniu, hartă, program" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Țara Făgărașului?", a: "Da, cu galerie mare și rezervare directă." },
      { q: "Lucrați cu firme din tot județul Brașov?", a: "Da, online." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  arad: {
    intro: [
      "Aradul e un oraș de graniță din vest, cu industrie puternică, mai ales componente auto și logistică, și cu un centru cu clădiri istorice și Cetatea Aradului. Mulți clienți vin din diaspora sau din Ungaria vecină.",
      "Clienții de aici sunt obișnuiți cu standarde vestice și compară online. Firmele locale au nevoie de site rapid și bine prezentat ca să câștige.",
    ],
    businesses: [
      { name: "Furnizori auto și firme de logistică", need: "capacități, certificări, română și engleză" },
      { name: "Clinici și cabinete", need: "programare online, specialități" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări" },
      { name: "Firme de construcții și amenajări", need: "portofoliu, servicii" },
    ],
    faqs: [
      { q: "Faceți site-uri în engleză, maghiară sau germană?", a: "Da, fiecare limbă în plus e o opțiune la preț fix." },
      { q: "Lucrați cu firme din tot județul Arad?", a: "Da, inclusiv Lipova, Ineu și Pecica." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  resita: {
    intro: [
      "Reșița are o lungă tradiție metalurgică și își mută economia spre servicii și turism montan, cu Semenicul și lacurile din zonă aproape. E reședința județului Caraș-Severin.",
      "Piața e în tranziție, iar spațiul online e încă liber pentru firmele care se mișcă primele, mai ales în turism și servicii.",
    ],
    businesses: [
      { name: "Pensiuni spre Semenic și lacurile din zonă", need: "galerie, prețuri, rezervare directă" },
      { name: "Firme industriale și ateliere", need: "capacități, cerere de ofertă" },
      { name: "Restaurante", need: "meniu, hartă" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Caransebeș sau Oravița?", a: "Da, cu firme din tot județul Caraș-Severin." },
      { q: "Faceți site-uri pentru pensiuni montane?", a: "Da, cu rezervare directă." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  lugoj: {
    intro: [
      "Lugojul e al doilea oraș al județului Timiș, pe Timiș, cu tradiție culturală și industrie ușoară. E aproape de Timișoara și pe axa autostrăzii spre vestul țării.",
      "Clienții compară natural cu oferta din Timișoara. Firmele locale cu site profesionist și profil Google îngrijit rămân alegerea firească pentru zona Lugojului.",
    ],
    businesses: [
      { name: "Firme industriale", need: "capacități, cerere de ofertă, engleză" },
      { name: "Magazine și firme de comerț", need: "produse, program, hartă" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții", need: "lucrări, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din tot județul Timiș?", a: "Da, inclusiv Timișoara și Făget." },
      { q: "Faceți site-uri în engleză sau germană?", a: "Da, fiecare limbă în plus e o opțiune la preț fix." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "satu-mare": {
    intro: [
      "Satu Mare e un oraș de graniță din nord-vest, cu industrie ușoară, comerț activ și o comunitate bilingvă. Mulți clienți vin din diaspora sau din Ungaria vecină și caută firmele locale online.",
      "Căutările se fac în română și maghiară, deci un site în ambele limbi și profilul Google aduc clienți din tot județul.",
    ],
    businesses: [
      { name: "Firme de producție și furnizori", need: "capacități, cerere de ofertă, mai multe limbi" },
      { name: "Magazine și distribuitori", need: "produse, program, comandă" },
      { name: "Cabinete medicale și stomatologice", need: "programare online" },
      { name: "Restaurante și săli de evenimente", need: "meniu, galerie, cerere de ofertă" },
    ],
    faqs: [
      { q: "Faceți site-uri în română și maghiară?", a: "Da, a doua limbă e o opțiune la preț fix." },
      { q: "Lucrați cu firme din Carei sau Negrești-Oaș?", a: "Da, cu firme din tot județul Satu Mare." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "baia-mare": {
    intro: [
      "Baia Mare are tradiție minieră și își reinventează economia spre servicii, comerț și turism, fiind poarta spre Maramureșul istoric. Centrul vechi cu Turnul lui Ștefan e reperul orașului.",
      "Piața online locală e în formare. Primii care investesc serios în prezență digitală prind pozițiile de top, inclusiv pe căutările turiștilor.",
    ],
    businesses: [
      { name: "Pensiuni și cazări spre Maramureș", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Firme de comerț și servicii", need: "program, hartă, buton de apel" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții", need: "lucrări, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Sighetu Marmației sau Borșa?", a: "Da, cu firme din tot județul Maramureș." },
      { q: "Faceți site-uri pentru pensiuni din Maramureș?", a: "Da, cu rezervare directă și variantă în engleză." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  zalau: {
    intro: [
      "Zalăul e reședința Sălajului, cu industrie de componente, inclusiv anvelope și țevi, și comerț activ. Orașul deservește un județ întreg, iar situl roman Porolissum e în apropiere.",
      "Firmele vizibile online culeg clienți din tot Sălajul, nu doar din oraș. Concurența digitală e încă moderată.",
    ],
    businesses: [
      { name: "Furnizori industriali", need: "capacități, certificări, engleză" },
      { name: "Magazine și firme de comerț", need: "produse, program, comandă" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții și instalații", need: "lucrări, servicii" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Șimleu Silvaniei sau Jibou?", a: "Da, cu firme din tot județul Sălaj." },
      { q: "Mă ajutați cu profilul Google?", a: "Da, îl configurăm odată cu site-ul." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  "sighetul-marmatiei": {
    intro: [
      "Sighetu Marmației e capitala istorică a Maramureșului, cu Memorialul Victimelor Comunismului și al Rezistenței, iar Cimitirul Vesel de la Săpânța și bisericile de lemn UNESCO sunt aproape. Turismul și comerțul de graniță țin economia.",
      "Turiștii, mulți din străinătate, planifică totul online. Pensiunile și restaurantele care apar primele câștigă sezonul.",
    ],
    businesses: [
      { name: "Pensiuni tradiționale maramureșene", need: "galerie, prețuri, rezervare directă, engleză" },
      { name: "Ghizi și tururi în Maramureș", need: "trasee, prețuri, rezervare online" },
      { name: "Meșteri și ateliere tradiționale", need: "poveste, magazin online" },
      { name: "Restaurante cu specific local", need: "meniu, hartă" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Maramureș?", a: "Da, cu rezervare directă și variantă în engleză." },
      { q: "Pot vinde produse tradiționale online?", a: "Da, printr-un magazin online simplu, cu livrare prin curier." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  tulcea: {
    intro: [
      "Tulcea e poarta Deltei Dunării, rezervație a biosferei UNESCO. Turismul, pescuitul și transportul pe Dunăre țin economia, iar sezonul aduce turiști din toată țara și din străinătate.",
      "Rezervările se decid online cu luni înainte, iar vizibilitatea pe Google face diferența dintre un sezon plin și unul gol.",
    ],
    businesses: [
      { name: "Pensiuni și hoteluri în Deltă", need: "galerie, prețuri pe sezon, rezervare directă, engleză" },
      { name: "Excursii cu barca și ghizi", need: "trasee, prețuri, rezervare online" },
      { name: "Restaurante cu pește", need: "meniu, rezervări" },
      { name: "Firme de transport pe apă", need: "curse, program, contact" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru pensiuni din Deltă?", a: "Da, cu rezervare directă, prețuri pe sezon și variantă în engleză." },
      { q: "Pot primi rezervări pentru excursii pe site?", a: "Da. Rezervările online sunt o opțiune la preț fix." },
      { q: "Lucrați cu firme din Sulina, Măcin sau Babadag?", a: "Da, cu firme din tot județul Tulcea." },
    ],
  },
  mangalia: {
    intro: [
      "Mangalia e cel mai sudic oraș al litoralului, cu stațiunile Saturn, Venus, Neptun, Olimp, Jupiter, Cap Aurora și 2 Mai–Vama Veche în jur. Turismul domină economia, alături de șantierul naval.",
      "Bătălia pentru turiști se dă online, cu luni înainte de sezon. Hotelurile, vilele și restaurantele cu site și recenzii bune își umplu locurile primele.",
    ],
    businesses: [
      { name: "Hoteluri și vile pe litoral", need: "galerie, prețuri pe sezon, rezervare directă" },
      { name: "Restaurante și beach baruri", need: "meniu, rezervări, evenimente" },
      { name: "Închirieri și activități pe plajă", need: "oferte, prețuri, rezervare" },
      { name: "Firme din zona portului", need: "servicii, contact, engleză" },
    ],
    faqs: [
      { q: "Faceți site-uri pentru hoteluri de pe litoral?", a: "Da, cu rezervare directă, fără comisionul platformelor." },
      { q: "Când e bine să-mi fac site-ul pentru sezon?", a: "Cu cel puțin 2–3 luni înainte de vară, ca Google să apuce să-l indexeze și să prinzi rezervările timpurii." },
      { q: "Lucrați cu firme din tot județul Constanța?", a: "Da, online." },
    ],
  },
  medgidia: {
    intro: [
      "Medgidia e un oraș din Dobrogea, pe Canalul Dunăre–Marea Neagră, cu industrie, în special ciment și materiale de construcții, și agricultură în jur. E aproape de Constanța și de litoral.",
      "Mulți clienți compară cu oferta din Constanța. O firmă locală cu site serios și profil Google rămâne alegerea firească pentru zonă.",
    ],
    businesses: [
      { name: "Firme de materiale de construcții", need: "produse, cerere de ofertă, livrare" },
      { name: "Firme agricole", need: "producție, capacitate, contact" },
      { name: "Magazine și firme de servicii", need: "program, hartă, buton de apel" },
      { name: "Cabinete medicale", need: "programare online" },
    ],
    faqs: [
      { q: "Lucrați cu firme din tot județul Constanța?", a: "Da, inclusiv Cernavodă și Constanța." },
      { q: "Mă ajutați cu profilul Google?", a: "Da, îl configurăm odată cu site-ul." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  voluntari: {
    intro: [
      "Voluntari e lipit de nordul Bucureștiului, cu zona de birouri Pipera, cartiere rezidențiale noi și multe firme de servicii. Clienții sunt urbani, digitali și compară totul online.",
      "Concurența e cea a pieței bucureștene. Câștigă firmele cu site rapid, poziționare clară și recenzii bune.",
    ],
    businesses: [
      { name: "Firme de servicii pentru companii", need: "servicii, studii de caz, cerere de ofertă, engleză" },
      { name: "Clinici și cabinete", need: "programare online, specialități" },
      { name: "Restaurante și cafenele", need: "meniu, rezervări, livrare" },
      { name: "Firme de amenajări și imobiliare", need: "portofoliu, proiecte, contact" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Pipera și nordul Bucureștiului?", a: "Da, totul online, cu întâlniri video când e nevoie." },
      { q: "Faceți site-uri în engleză pentru firme cu clienți străini?", a: "Da, a doua limbă e o opțiune la preț fix." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei. Pentru proiecte complexe primești ofertă personalizată în aceeași zi." },
    ],
  },
  "popesti-leordeni": {
    intro: [
      "Popești-Leordeni e un oraș din sudul Ilfovului, lipit de București, care a crescut rapid prin ansambluri rezidențiale noi. Serviciile pentru familii și pentru casă au cerere mare.",
      "Locuitorii noi caută totul pe telefon: grădiniță, dentist, instalator. Firmele care apar primele pe Google prind acest flux constant.",
    ],
    businesses: [
      { name: "Grădinițe și after-school-uri", need: "programe, poze, înscriere online" },
      { name: "Cabinete medicale și stomatologice", need: "programare online" },
      { name: "Firme de amenajări și instalații", need: "lucrări, servicii, buton de apel" },
      { name: "Restaurante și livrări", need: "meniu, comandă" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Ilfov?", a: "Da, cu firme din tot Ilfovul și din București." },
      { q: "Pot primi înscrieri sau programări online?", a: "Da, programările online sunt o opțiune la preț fix." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
  bragadiru: {
    intro: [
      "Bragadiru e un oraș din sud-vestul Ilfovului, lângă București, cu cartiere rezidențiale noi și o populație în creștere rapidă. Serviciile locale au cerere mare și clienți digitali.",
      "Clienții noi din zonă caută serviciile pe telefon. Un site clar și profilul Google bine făcut aduc firmele locale în fața lor.",
    ],
    businesses: [
      { name: "Grădinițe și after-school-uri", need: "programe, poze, înscriere online" },
      { name: "Cabinete medicale", need: "programare online" },
      { name: "Firme de construcții și amenajări", need: "lucrări, servicii" },
      { name: "Magazine și servicii de proximitate", need: "program, hartă, buton de apel" },
    ],
    faqs: [
      { q: "Lucrați cu firme din Bragadiru și Ilfov?", a: "Da, online, cu întâlniri video când e nevoie." },
      { q: "Mă ajutați să apar pe Google Maps?", a: "Da, configurăm profilul Google Business odată cu site-ul." },
      { q: "Cât costă?", a: "Site Start pornește de la 1.500 lei." },
    ],
  },
};

export function getCityContent(slug: string): CityContent | undefined {
  return CITY_CONTENT[slug];
}
