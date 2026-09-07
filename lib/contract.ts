// Contractul de prestări servicii — șablonul + identitatea legală a prestatorului.
// Datele firmei tale vin din Railway (LEGAL_*); fără ele apar placeholder-e vizibile,
// ca să nu semnezi din greșeală cu date lipsă.

export const PRESTATOR = {
  name: process.env.LEGAL_NAME || "LEGIO WEB DEVELOPMENT TOOL S.R.L.",
  cui: process.env.LEGAL_CUI || "[COMPLETEAZĂ LEGAL_CUI ÎN RAILWAY]",
  regcom: process.env.LEGAL_REGCOM || "[COMPLETEAZĂ LEGAL_REGCOM ÎN RAILWAY]",
  address: process.env.LEGAL_ADDRESS || "Botoșani, România",
  rep: process.env.LEGAL_REP || "Administrator",
  email: "office@imperial-media.ro",
  brand: "Imperial Media",
};

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
};

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
  <p>Prestatorul furnizează Beneficiarului serviciile aferente pachetului: <b>${esc(i.service)}</b>, conform descrierii publicate pe imperial-media.ro la data acceptării, incluzând (unde pachetul o prevede): realizarea site-ului web, înregistrarea domeniului și găzduirea în primul an, optimizarea de bază pentru motoarele de căutare și bonusurile aferente pachetului.</p>

  <p><b>III. PREȚUL ȘI PLATA</b></p>
  <p>Prețul serviciilor este de <b>${esc(i.price)}</b>, plătit integral la comandă (card online sau transfer bancar pe bază de factură proformă). Factura fiscală se emite automat la încasare. Opțiunile suplimentare solicitate ulterior de Beneficiar se facturează separat, la prețurile comunicate înainte de execuție.</p>

  <p><b>IV. TERMENE ȘI LIVRARE</b></p>
  <p>Termenul de livrare curge de la data la care Beneficiarul transmite integral conținutul necesar (datele firmei prin formularul dedicat și materialele foto) și este de regulă 3-7 zile lucrătoare. Livrarea include: link de previzualizare, o rundă de revizii consolidate, publicarea pe domeniul agreat și 14 zile de corecturi mărunte de la publicare (pentru pachetul Site Start; pachetele superioare beneficiază de 30 de zile).</p>

  <p><b>V. OBLIGAȚIILE PĂRȚILOR</b></p>
  <p>Prestatorul: execută serviciile profesionist, informează Beneficiarul asupra stadiului, păstrează confidențialitatea datelor primite. Beneficiarul: furnizează conținut corect asupra căruia deține drepturile, răspunde solicitărilor de clarificare, folosește serviciile în conformitate cu legea.</p>

  <p><b>VI. PROPRIETATE ȘI DREPTURI</b></p>
  <p>La plata integrală, site-ul livrat (conținut, design, domeniu) aparține Beneficiarului. Prestatorul își păstrează dreptul de a menționa lucrarea în portofoliu și o mențiune discretă de autor în subsolul site-ului. Imaginile de stock incluse sunt licențiate pentru utilizarea în site-ul livrat.</p>

  <p><b>VII. DUPĂ PRIMUL AN</b></p>
  <p>Domeniul și găzduirea sunt incluse în primul an. Ulterior, Beneficiarul poate opta pentru: (a) abonament de administrare (conform ofertei curente de pe imperial-media.ro), sau (b) reînnoirea individuală a domeniului și găzduirii, facturată anual. Prestatorul notifică Beneficiarul cu cel puțin 30 de zile înainte de expirare; site-ul nu este suspendat fără notificare prealabilă.</p>

  <p><b>VIII. PROTECȚIA DATELOR</b></p>
  <p>Părțile prelucrează datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR). Politica de confidențialitate a Prestatorului: imperial-media.ro/confidentialitate.</p>

  <p><b>IX. ÎNCETARE ȘI LITIGII</b></p>
  <p>Contractul încetează prin executarea obligațiilor, prin acordul părților sau prin reziliere pentru neexecutare, cu notificare prealabilă de 15 zile. Litigiile se soluționează amiabil, iar în caz contrar de instanțele competente de la sediul Prestatorului, conform legii române.</p>

  <p><b>X. ÎNCHEIEREA LA DISTANȚĂ</b></p>
  <p>Prezentul contract a fost încheiat la distanță și acceptat electronic de Beneficiar, prin reprezentantul ${esc(i.clientRep)}, la data de ${dataRo} (IP: ${esc(i.ip)}). Părțile convin că acceptarea electronică, împreună cu plata efectuată, țin loc de semnătură olografă, conform art. 1178 și urm. Cod Civil privind libertatea formei. Fiecare parte primește un exemplar electronic pe email.</p>

  <table style="width:100%;margin-top:24px;"><tr>
    <td style="width:50%;vertical-align:top;"><b>PRESTATOR</b><br/>${esc(PRESTATOR.name)}<br/>prin ${esc(PRESTATOR.rep)}</td>
    <td style="width:50%;vertical-align:top;"><b>BENEFICIAR</b><br/>${esc(i.clientName)}<br/>prin ${esc(i.clientRep)}<br/><i>acceptat electronic la ${dataRo}</i></td>
  </tr></table>
</div>`;
}
