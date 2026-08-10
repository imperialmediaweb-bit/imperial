// Profilul economic al fiecărui oraș — scris de mână, nu generat.
// Ăsta e conținutul care face fiecare landing de oraș UNIC pentru Google:
// aceleași servicii, dar altă piață, alte industrii, alt tip de client.

const PROFILES: Record<string, string> = {
  bucuresti: "București concentrează cea mai densă piață din țară: corporate, HoReCa, servicii profesionale și e-commerce, toate în competiție acerbă pe fiecare căutare. Aici nu câștigă cine există online, ci cine iese în evidență — site rapid, poziționare clară și recenzii solide.",
  "cluj-napoca": "Clujul e capitala IT-ului românesc și un oraș universitar uriaș — clienții sunt tineri, digitali și compară tot online înainte să cumpere. Pentru firmele locale (de la clinici la HoReCa), standardul de prezență online e cel mai ridicat din țară: un site mediocru aici se vede imediat.",
  iasi: "Iașiul combină cel mai mare centru universitar din Moldova cu un pol IT în creștere rapidă — o piață tânără, conectată, care caută totul pe telefon. Serviciile medicale, educația privată și HoReCa sunt în expansiune și concurează vizibil pe căutările locale.",
  timisoara: "Timișoara trăiește din industrie, automotive și un sector IT matur, cu o clientelă obișnuită cu standarde vestice — inclusiv la prezența online a firmelor locale. Vecinătatea graniței aduce și clienți din diaspora, care caută exclusiv online.",
  constanta: "Constanța e port și turism: sezonalitatea dictează totul, iar bătălia pentru rezervări și clienți se dă online, cu luni înainte de vârful de sezon. Hoteluri, restaurante și servicii — toate trăiesc din vizibilitatea pe Google și din recenzii.",
  brasov: "Brașovul e unul dintre cele mai puternice poluri de turism din țară, cu industrie solidă în jur — pensiuni, restaurante și servicii concurează dur pe căutările turiștilor, care decid exclusiv online, pe recenzii și poze.",
  craiova: "Craiova crește în jurul polului auto (Ford Otosan) și al serviciilor din Oltenia — o piață mare, cu concurență online încă sub potențial: fereastră bună pentru firmele care se mișcă primele.",
  galati: "Galațiul, oraș-port cu tradiție industrială, are o piață de servicii locale în care prezența online serioasă e încă rară — cine investește primul în vizibilitate culege căutările întregului județ.",
  ploiesti: "Ploieștiul stă pe industrie și servicii, la o oră de București — clienții compară natural cu oferta din capitală, deci standardul de prezentare online trebuie să fie pe măsură.",
  oradea: "Oradea e povestea de succes a ultimului deceniu: turism balnear în vecinătate, centru renovat, antreprenoriat activ. Piața locală e educată digital, iar concurența online crește vizibil de la an la an.",
  braila: "Brăila are o piață de servicii compactă, cu concurență online moderată — firmele care își fac acum prezență serioasă prind pozițiile bune înainte să se aglomereze.",
  arad: "Aradul trăiește din industrie și logistică, la graniță — flux constant de business, plus clienți din diaspora care caută serviciile de acasă exclusiv pe Google.",
  pitesti: "Piteștiul gravitează în jurul industriei auto (Dacia la Mioveni) și al serviciilor conexe — putere de cumpărare solidă și o piață de servicii în care vizibilitatea online face diferența.",
  sibiu: "Sibiul îmbină turismul cultural cu industria de componente auto — clienți cu așteptări ridicate, obișnuiți cu standarde europene, inclusiv la site-urile firmelor locale.",
  bacau: "Bacăul e nod comercial al Moldovei centrale, cu antreprenoriat divers — de la producție la servicii. Concurența online e încă moderată: teren bun de cucerit.",
  "targu-mures": "Târgu Mureș e recunoscut pentru polul medical și universitar — cabinetele, clinicile și serviciile private concurează intens pe căutările pacienților, unde recenziile și site-ul cântăresc decisiv.",
  "baia-mare": "Baia Mare își reinventează economia spre servicii și comerț — piața online locală e în formare, iar primii care investesc serios în prezență digitală prind pozițiile de top.",
  buzau: "Buzăul trăiește din comerț, agro și industrie ușoară — clientela caută tot mai mult online, iar oferta locală de prezență digitală profesionistă e încă subțire.",
  botosani: "Botoșaniul stă pe comerț, agro și servicii — o piață unde relațiile personale încă vând, dar clienții noi vin tot din Google. Firmele de aici care și-au făcut prezență online serioasă domină căutările locale cu investiții mici; fereastra e încă deschisă.",
  "satu-mare": "Satu Mare, oraș de graniță cu industrie ușoară și comerț activ, are clienți și în diaspora — care ajung la firmele locale exclusiv prin căutări online.",
  "ramnicu-valcea": "Râmnicu Vâlcea combină turismul balnear din jur cu comerțul local — sezonalitatea aduce valuri de căutări online pe care firmele pregătite le transformă în clienți.",
  suceava: "Suceava e poarta Bucovinei: turism monahal și de pensiuni, industrie de prelucrare a lemnului și agro. Pensiunile și serviciile care domină căutările online prind turiștii înainte să ajungă în zonă.",
  "piatra-neamt": "Piatra Neamț trăiește tot mai mult din turismul văii Bistriței și al Ceahlăului — cazările și serviciile care apar primele pe Google culeg rezervările întregii zone.",
  "drobeta-turnu-severin": "Drobeta-Turnu Severin, oraș-port la Dunăre, are o piață de servicii compactă cu concurență online redusă — avantaj clar pentru firmele care se poziționează acum.",
  "targu-jiu": "Târgu Jiu combină moștenirea industrială cu turismul cultural (Brâncuși) — piața de servicii locale e în tranziție spre online, cu poziții bune încă libere.",
  tulcea: "Tulcea e poarta Deltei: pescuit, turism sezonier, pensiuni — rezervările se decid online cu luni înainte, iar vizibilitatea pe Google face diferența dintre sezon plin și gol.",
  targoviste: "Târgoviște, cu industrie și comerț la o aruncătură de băț de București, are firme care concurează atât local cât și cu oferta capitalei — prezența online solidă e biletul de intrare.",
  focsani: "Focșaniul e capitala viei și vinului românesc — crame, agro și comerț. Producătorii care s-au mutat online vând în toată țara; restul vând doar în piață.",
  "bistrita": "Bistrița îmbină industria (electrotehnică, prelucrare) cu turismul de tranzit spre Bucovina și Maramureș — firmele locale câștigă tot mai mulți clienți din căutările online.",
  resita: "Reșița, cu tradiție metalurgică, își mută economia spre servicii și turism montan (Semenic) — piață în tranziție, cu spațiu online liber pentru cine se mișcă primul.",
  slatina: "Slatina stă pe industria aluminiului și pe serviciile conexe — putere de cumpărare stabilă și o piață de servicii locale cu concurență online încă mică.",
  calarasi: "Călărașiul e agro și industrie la Dunăre — piața de servicii locale abia se digitalizează, iar primele firme cu prezență serioasă prind topul căutărilor fără luptă.",
  giurgiu: "Giurgiu, port și punct de graniță, trăiește din logistică și comerț — plus clienți din Bucureștiul aflat la 60 km, care caută online tot ce e mai aproape și mai ieftin.",
  slobozia: "Slobozia e inima agriculturii din Bărăgan — firmele agro și de servicii care se văd online deservesc un județ întreg cu concurență digitală minimă.",
  alexandria: "Alexandria, centru agro și administrativ al Teleormanului, are o piață de servicii în care prezența online profesionistă e încă excepția — nu regula. Oportunitate.",
  vaslui: "Vasluiul e agro și comerț, cu o piață de servicii în digitalizare — cine își face acum site și profil Google serios rămâne ani buni în fața concurenței locale.",
  "sfantu-gheorghe": "Sfântu Gheorghe are o piață compactă, bilingvă, cu comerț și servicii locale puternic ancorate în comunitate — iar căutările online cresc constant, în ambele limbi.",
  "miercurea-ciuc": "Miercurea Ciuc trăiește din industrie locală (celebrul pol al berii), turism montan și servicii — piață bilingvă, cu clienți care caută online în română și maghiară deopotrivă.",
  deva: "Deva combină administrația cu turismul cetății și industria din jur — piața de servicii locale se mută vizibil online, cu poziții de top încă accesibile.",
  zalau: "Zalăul, cu industrie de componente și comerț activ, deservește un județ întreg — firmele vizibile online culeg clienți din tot Sălajul, nu doar din oraș.",
  "alba-iulia": "Alba Iulia trăiește din turismul Cetății și din antreprenoriatul în creștere al zonei — plus vecinătatea podgoriilor. Turiștii și localnicii deopotrivă aleg pe Google: cine nu apare acolo nu există.",
};

const REGION_FALLBACK: Record<string, string> = {
  Moldova: "Piața locală combină comerțul, agro și serviciile — iar clienții noi vin tot mai mult din căutările online, unde concurența e încă mică față de orașele mari. Fereastra de poziționare e deschisă.",
  Transilvania: "Piața locală e activă și tot mai digitalizată — clienții compară online înainte să aleagă, iar firmele cu prezență profesionistă câștigă sistematic în fața celor care amână.",
  Muntenia: "Piața locală de comerț și servicii se mută accelerat online — iar apropierea de marile orașe ridică standardul așteptărilor clienților.",
  Oltenia: "Piața locală de servicii are concurență online încă moderată — firmele care investesc primele în vizibilitate prind pozițiile bune pentru ani înainte.",
  Banat: "Piața locală, influențată de vecinătatea graniței și standardele vestice, are clienți obișnuiți să caute și să compare online — prezența digitală solidă e așteptată, nu opțională.",
  Crișana: "Piața locală crește constant, iar clienții — inclusiv cei din diaspora — ajung la firmele de aici prin căutări online. Vizibilitatea pe Google aduce județul întreg, nu doar orașul.",
  Maramureș: "Piața locală combină tradiția cu turismul în creștere — firmele care se văd online culeg atât localnicii, cât și turiștii care planifică totul de pe telefon.",
  Dobrogea: "Piața locală e marcată de sezonalitate și turism — bătălia pentru clienți se dă online, cu luni înainte de sezon, pe căutări și recenzii.",
};

export function cityEconomyProfile(slug: string, region: string): string {
  return (
    PROFILES[slug] ??
    REGION_FALLBACK[region] ??
    "Piața locală de comerț și servicii se digitalizează accelerat — clienții noi vin din căutările online, iar firmele cu prezență profesionistă câștigă sistematic teren."
  );
}
