// Contractul de prestări servicii — șablonul + identitatea legală a prestatorului.
// Datele firmei tale vin din Railway (LEGAL_*); fără ele apar placeholder-e vizibile,
// ca să nu semnezi din greșeală cu date lipsă.

export const PRESTATOR = {
  name: process.env.LEGAL_NAME || "LEGIO WEB DEVELOPMENT TOOLS S.R.L.",
  cui: process.env.LEGAL_CUI || "46466484",
  regcom: process.env.LEGAL_REGCOM || "J07/506/2022",
  address: process.env.LEGAL_ADDRESS || "Aleea Parcului nr. 1, Sc. B, Et. 1, Ap. 7, Botoșani, România",
  rep: process.env.LEGAL_REP || "Administrator",
  email: "office@imperial-media.ro",
  brand: "Imperial Media",
};

import { type Config } from "./configuratie";
import { getPackageByKey } from "./packages";

export type ContractInput = {
  clientName: string; // denumirea firmei beneficiare (de la ANAF)
  clientCui: string;
  clientAddress: string;
  clientRep: string; // numele reprezentantului care semnează
  clientEmail: string;
  service: string; // pachetul ales
  price: string; // prețul în lei, ca text
  acceptedAt: Date;
  ip: string;
  config?: Config | null; // configurația acceptată din ofertă — detaliază ce primește și cum plătește
};

// Pragul de plată: până la 2.500 lei plată integrală la semnare; peste, 50% avans și 50% la finalizare
export const PRAG_AVANS = 2500;

export function paymentTerms(once: number): string {
  const lei = (n: number) => `${n.toLocaleString("ro-RO")} lei`;
  if (once <= PRAG_AVANS) return `integral, la semnarea contractului: <b>${lei(once)}</b>`;
  const avans = Math.round(once / 2);
  return `în două tranșe: <b>avans 50% la semnarea contractului (${lei(avans)})</b> și <b>50% la finalizare, înainte de publicarea site-ului (${lei(once - avans)})</b>`;
}

const CONFIG_PACKAGE: Record<string, string> = { start: "website", prezentare: "custom", magazin: "shop" };

// Ce primește Beneficiarul: ce include pachetul + opțiunile alese (găzduirea are clauza ei)
export function contractItems(c: Config): string[] {
  const pkg = getPackageByKey(CONFIG_PACKAGE[c.type]);
  const included = (pkg?.features ?? []).filter((f) => !/^Găzduire|^Opțional/.test(f));
  const options = c.lines.filter((l) => !l.monthly).map((l) => `${l.name.replace(/ \(per .*\)$/, "")} (+${l.lei.toLocaleString("ro-RO")} lei)`);
  return [...included, "Încărcare rapidă, versiune perfectă pe telefon, certificat SSL", ...options];
}

// Numărul contractului: data + CUI-ul clientului — unic și trasabil fără tabele noi
export function contractNumber(i: ContractInput): string {
  const d = i.acceptedAt.toISOString().slice(0, 10).replace(/-/g, "");
  return `IM-${d}-${i.clientCui}`;
}

export function contractHtml(i: ContractInput): string {
  const nr = contractNumber(i);
  const dataRo = i.acceptedAt.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<div style="font-family:Georgia,serif;font-size:14px;color:#111;line-height:1.7;max-width:680px;">
  <h2 style="text-align:center;">CONTRACT DE PRESTĂRI SERVICII<br/><span style="font-size:14px;font-weight:normal;">nr. ${nr} din ${dataRo}</span></h2>

  <p><b>I. PĂRȚILE</b></p>
  <p><b>1. PRESTATOR:</b> ${esc(PRESTATOR.name)}, CUI ${esc(PRESTATOR.cui)}, Reg. Com. ${esc(PRESTATOR.regcom)}, cu sediul în ${esc(PRESTATOR.address)}, reprezentată de ${esc(PRESTATOR.rep)}, email ${PRESTATOR.email} (denumită în continuare „Prestatorul" — brand comercial: ${PRESTATOR.brand}).</p>
  <p><b>2. BENEFICIAR:</b> ${esc(i.clientName)}, CUI ${esc(i.clientCui)}, cu sediul în ${esc(i.clientAddress)}, reprezentată de ${esc(i.clientRep)}, email ${esc(i.clientEmail)} (denumită în continuare „Beneficiarul").</p>

  <p><b>II. OBIECTUL CONTRACTULUI</b></p>
  <p>Prestatorul furnizează Beneficiarului serviciile aferente pachetului: <b>${esc(i.service)}</b>, conform ofertei acceptate și descrierii publicate pe imperial-media.ro la data acceptării.</p>
  ${
    i.config
      ? `<p>Beneficiarul primește:</p><ul>${contractItems(i.config).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`
      : `<p>Serviciile includ, unde pachetul o prevede: realizarea site-ului web, optimizarea tehnică pentru motoarele de căutare și bonusurile aferente pachetului.</p>`
  }
  <p>Site-ul este construit de la zero, personalizat pentru Beneficiar, fără șabloane.</p>

  <p><b>III. PREȚUL ȘI PLATA</b></p>
  <p>Prețul serviciilor este de <b>${esc(i.price)}</b>.</p>
  <p>Plata se face ${
    i.config
      ? paymentTerms(i.config.once)
      : `integral la semnare pentru proiectele de până la ${PRAG_AVANS.toLocaleString("ro-RO")} lei; pentru proiectele de peste ${PRAG_AVANS.toLocaleString("ro-RO")} lei, 50% avans la semnare și 50% la finalizare, înainte de publicarea site-ului`
  }, prin transfer bancar pe baza facturii proforme trimise de Prestator (sau cu cardul online, unde site-ul oferă această variantă). Factura fiscală se emite la încasare. Lucrul începe după încasarea plății de la semnare. Opțiunile suplimentare cerute ulterior de Beneficiar se facturează separat, la prețurile comunicate în scris înainte de execuție.</p>

  <p><b>IV. PAȘII PROIECTULUI, TERMENE ȘI LIVRARE</b></p>
  <ol>
    <li>Semnarea contractului (acceptare electronică).</li>
    <li>Prestatorul trimite factura proformă; Beneficiarul plătește suma de la semnare.</li>
    <li>Beneficiarul trimite conținutul: datele firmei prin formularul dedicat, textele și pozele.</li>
    <li>Prestatorul construiește site-ul și trimite linkul de previzualizare.</li>
    <li>O rundă de revizii consolidate, pe baza observațiilor Beneficiarului.</li>
    <li>${i.config && i.config.once > PRAG_AVANS ? "Plata diferenței de 50%, apoi publicarea site-ului pe domeniul agreat." : "Publicarea site-ului pe domeniul agreat."}</li>
    ${i.config && i.config.monthly > 0 ? "<li>De la lansare începe administrarea lunară (cap. VII).</li>" : ""}
  </ol>
  <p>Termenul de livrare curge de la data la care Beneficiarul transmite integral conținutul necesar (datele firmei prin formularul dedicat și materialele foto) și este de regulă 3-7 zile lucrătoare. Livrarea include: link de previzualizare, o rundă de revizii consolidate, publicarea pe domeniul agreat și 14 zile de corecturi mărunte de la publicare (pentru pachetul Site Start; pachetele superioare beneficiază de 30 de zile).</p>

  <p><b>V. OBLIGAȚIILE PĂRȚILOR</b></p>
  <p>Prestatorul: execută serviciile profesionist, informează Beneficiarul asupra stadiului, păstrează confidențialitatea datelor primite. Beneficiarul: furnizează conținut corect asupra căruia deține drepturile, răspunde solicitărilor de clarificare, folosește serviciile în conformitate cu legea.</p>

  <p><b>VI. PROPRIETATE ȘI DREPTURI</b></p>
  <p>La plata integrală, site-ul livrat (conținut, design, domeniu) aparține Beneficiarului. Prestatorul își păstrează dreptul de a menționa lucrarea în portofoliu și o mențiune discretă de autor în subsolul site-ului. Imaginile de stock incluse sunt licențiate pentru utilizarea în site-ul livrat.</p>

  <p><b>VII. GĂZDUIRE, DOMENIU ȘI ADMINISTRARE</b></p>
  ${
    i.config && i.config.monthly > 0
      ? `<p>Beneficiarul contractează <b>administrarea lunară, de ${i.config.monthly.toLocaleString("ro-RO")} lei/lună</b>, facturată lunar începând cu luna lansării. Aceasta include: găzduirea site-ului, domeniul, certificatul SSL, backup, actualizări de securitate și modificări mici de conținut${i.config.monthly >= 200 ? ", plus creditele pentru asistentul AI" : ""}. Administrarea poate fi încetată de oricare parte cu notificare de 30 de zile; la încetare, Prestatorul predă Beneficiarului domeniul și fișierele site-ului.</p>`
      : `<p>Găzduirea și domeniul nu sunt incluse în prețul de mai sus. Ele sunt incluse în administrarea lunară (de la 100 lei/lună, conform ofertei curente de pe imperial-media.ro), pe care Beneficiarul o poate contracta oricând. Dacă Beneficiarul nu o contractează, Prestatorul îi predă la livrare fișierele site-ului, iar găzduirea și domeniul cad în sarcina Beneficiarului.</p>`
  }
  <p>Site-ul nu este suspendat fără o notificare prealabilă de cel puțin 15 zile.</p>

  <p><b>VIII. PROTECȚIA DATELOR</b></p>
  <p>Părțile prelucrează datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR). Politica de confidențialitate a Prestatorului: imperial-media.ro/confidentialitate.</p>

  <p><b>IX. ÎNCETARE ȘI LITIGII</b></p>
  <p>Contractul încetează prin executarea obligațiilor, prin acordul părților sau prin reziliere pentru neexecutare, cu notificare prealabilă de 15 zile. Litigiile se soluționează amiabil, iar în caz contrar de instanțele competente de la sediul Prestatorului, conform legii române.</p>

  <p><b>X. ÎNCHEIEREA LA DISTANȚĂ</b></p>
  <p>Prezentul contract a fost încheiat la distanță și acceptat electronic de Beneficiar, prin reprezentantul ${esc(i.clientRep)}, la data de ${dataRo} (IP: ${esc(i.ip)}). Părțile convin că acceptarea electronică, împreună cu plata sumei de la semnare, țin loc de semnătură olografă, conform art. 1178 și urm. Cod Civil privind libertatea formei. Fiecare parte primește un exemplar electronic pe email.</p>

  <table style="width:100%;margin-top:24px;"><tr>
    <td style="width:50%;vertical-align:top;"><b>PRESTATOR</b><br/>${esc(PRESTATOR.name)}<br/>prin ${esc(PRESTATOR.rep)}</td>
    <td style="width:50%;vertical-align:top;"><b>BENEFICIAR</b><br/>${esc(i.clientName)}<br/>prin ${esc(i.clientRep)}<br/><i>acceptat electronic la ${dataRo}</i></td>
  </tr></table>
</div>`;
}
