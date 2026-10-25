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
  iban: process.env.LEGAL_IBAN || "",
  bank: process.env.LEGAL_BANK || "",
};

// Contul în care se plătește — apare în contract doar când e setat în Railway (LEGAL_IBAN / LEGAL_BANK)
export function bankLine(): string {
  if (!PRESTATOR.iban) return "";
  return `IBAN ${PRESTATOR.iban}${PRESTATOR.bank ? ` · ${PRESTATOR.bank}` : ""}`;
}

import { type Config } from "./configuratie";
import { getPackageByKey } from "./packages";
import { siteConfig } from "./site";

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

// Termenul de livrare, de la primirea completă a conținutului: o bază pe pachet
// + 2 zile lucrătoare pentru fiecare opțiune aleasă — cu cât proiectul e mai complex, cu atât mai mult timp
const TERMEN_BAZA: Record<string, number> = { start: 7, prezentare: 14, magazin: 20 };
export const ZILE_PE_OPTIUNE = 2;

export function termenLivrare(c: Config): string {
  const extra = c.lines.filter((l) => !l.monthly).length * ZILE_PE_OPTIUNE;
  return `maximum ${TERMEN_BAZA[c.type] + extra} zile lucrătoare`;
}

// Culorile Imperial — folosite inline, ca documentul să arate la fel în email, pe pagină și la print
const C = { dark: "#0d0b12", orange: "#FF9A1A", magenta: "#FF2E9A", purple: "#8B2FF7", ink: "#1d1a24", muted: "#6b6577", line: "#ece8f2", soft: "#faf7ff" };

export function contractHtml(i: ContractInput): string {
  const nr = contractNumber(i);
  const dataRo = i.acceptedAt.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lei = (n: number) => `${n.toLocaleString("ro-RO")} lei`;
  const c = i.config ?? null;
  const prag = lei(PRAG_AVANS);
  const avans = c ? Math.round(c.once / 2) : 0;
  const transe = c && c.once > PRAG_AVANS;
  const termen = c ? termenLivrare(c) : "maximum 7 zile lucrătoare pentru Site Start, 14 zile lucrătoare pentru Site Custom și 20 de zile lucrătoare pentru magazinul online, plus 2 zile lucrătoare pentru fiecare opțiune suplimentară";

  const P = (html: string) => `<p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:${C.ink};">${html}</p>`;
  const section = (n: string, title: string, body: string) => `
    <tr><td style="padding:22px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px;"><tr>
        <td style="width:30px;height:30px;border-radius:15px;background:${C.magenta};background:linear-gradient(135deg,${C.orange},${C.magenta});color:#fff;font:700 12px Arial,sans-serif;text-align:center;vertical-align:middle;">${n}</td>
        <td style="padding-left:10px;font:700 15px Arial,sans-serif;color:${C.ink};letter-spacing:.2px;">${title}</td>
      </tr></table>
      ${body}
    </td></tr>`;
  const kv = (k: string, v: string) =>
    `<tr><td style="padding:7px 0;font:12px Arial,sans-serif;color:${C.muted};width:130px;vertical-align:top;">${k}</td><td style="padding:7px 0;font:700 14px Arial,sans-serif;color:${C.ink};">${v}</td></tr>`;
  const party = (label: string, name: string, lines: string[]) => `
    <td style="width:50%;vertical-align:top;padding:16px;border:1px solid ${C.line};border-radius:10px;">
      <div style="font:700 10px Arial,sans-serif;letter-spacing:1.5px;color:${C.magenta};text-transform:uppercase;">${label}</div>
      <div style="margin-top:6px;font:700 14px Arial,sans-serif;color:${C.ink};">${esc(name)}</div>
      ${lines.map((l) => `<div style="margin-top:3px;font:12.5px/1.5 Arial,sans-serif;color:${C.muted};">${l}</div>`).join("")}
    </td>`;

  // Ce primește: inclus în pachet (bifă) + opțiunile plătite (cu preț)
  const pkg = c ? getPackageByKey(CONFIG_PACKAGE[c.type]) : undefined;
  const included = c ? [...(pkg?.features ?? []).filter((f) => !/^Găzduire|^Opțional/.test(f)), "Încărcare rapidă, versiune perfectă pe telefon, certificat SSL"] : [];
  const options = c ? c.lines.filter((l) => !l.monthly) : [];
  const itemRow = (name: string, right: string) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid ${C.line};font:14px Arial,sans-serif;color:${C.ink};"><span style="color:${C.magenta};font-weight:700;">✓</span>&nbsp;&nbsp;${esc(name)}</td><td style="padding:8px 0;border-bottom:1px solid ${C.line};font:13px Arial,sans-serif;color:${C.muted};text-align:right;white-space:nowrap;">${right}</td></tr>`;
  const itemsTable = c
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td colspan="2" style="padding:4px 0 6px;font:700 12px Arial,sans-serif;color:${C.muted};">${esc(c.typeName)} — ${lei(c.base)}</td></tr>
        ${included.map((x) => itemRow(x, "inclus")).join("")}
        ${options.length ? `<tr><td colspan="2" style="padding:14px 0 6px;font:700 12px Arial,sans-serif;color:${C.muted};">Opțiuni alese</td></tr>${options.map((o) => itemRow(o.name.replace(/ \(per .*\)$/, ""), `+${lei(o.lei)}`)).join("")}` : ""}
      </table>`
    : P("Serviciile includ, unde pachetul o prevede: realizarea site-ului web, optimizarea tehnică pentru motoarele de căutare și bonusurile aferente pachetului.");

  const payRow = (k: string, v: string, bold = false) =>
    `<tr><td style="padding:10px 14px;border-bottom:1px solid ${C.line};font:${bold ? 700 : 400} 14px Arial,sans-serif;color:${C.ink};">${k}</td><td style="padding:10px 14px;border-bottom:1px solid ${C.line};font:700 14px Arial,sans-serif;color:${C.ink};text-align:right;white-space:nowrap;">${v}</td></tr>`;
  const payTable = c
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:10px;margin:4px 0 12px;">
        ${transe ? payRow("Avans 50% — la semnarea contractului", lei(avans)) + payRow("Rest 50% — la finalizare, înainte de publicare", lei(c.once - avans)) : payRow("Integral — la semnarea contractului", lei(c.once))}
        ${payRow("Total", lei(c.once), true)}
        ${c.monthly > 0 ? payRow("Administrare lunară — de la lansare", `${lei(c.monthly)}/lună`) : ""}
      </table>`
    : P(`Plata se face integral la semnare pentru proiectele de până la ${prag}; pentru proiectele de peste ${prag}, 50% avans la semnare și 50% la finalizare, înainte de publicarea site-ului.`);

  const steps = [
    "Semnarea contractului (acceptare electronică).",
    "Prestatorul trimite factura; Beneficiarul plătește prin transfer bancar suma de la semnare.",
    "Beneficiarul trimite conținutul: datele firmei prin formularul dedicat, textele și pozele.",
    "Prestatorul construiește site-ul și trimite linkul de previzualizare.",
    "O rundă de revizii consolidate, pe baza observațiilor Beneficiarului.",
    transe ? "Plata diferenței de 50%, apoi publicarea site-ului pe domeniul agreat." : "Publicarea site-ului pe domeniul agreat.",
    ...(c && c.monthly > 0 ? ["De la lansare începe administrarea lunară (cap. VII)."] : []),
  ];
  const stepsTable = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px;">${steps
    .map(
      (t, k) =>
        `<tr><td style="width:24px;height:24px;border-radius:12px;background:${C.soft};border:1px solid ${C.orange};color:${C.orange};font:700 11px Arial,sans-serif;text-align:center;vertical-align:middle;">${k + 1}</td><td style="padding:5px 0 5px 10px;font:14px/1.5 Arial,sans-serif;color:${C.ink};">${t}</td></tr>`
    )
    .join("")}</table>`;

  const summary = c
    ? `<tr><td style="padding:20px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};border-left:4px solid ${C.magenta};border-radius:8px;">
          <tr><td style="padding:14px 18px;">
            <div style="font:700 10px Arial,sans-serif;letter-spacing:1.5px;color:${C.magenta};text-transform:uppercase;margin-bottom:4px;">Pe scurt</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${kv("Pachet", esc(i.service))}
              ${kv("Total", lei(c.once))}
              ${kv("Plată", transe ? `50% la semnare (${lei(avans)}) + 50% la finalizare (${lei(c.once - avans)})` : `integral la semnare (${lei(c.once)})`)}
              ${c.monthly > 0 ? kv("Administrare", `${lei(c.monthly)}/lună, de la lansare`) : ""}
            </table>
          </td></tr>
        </table>
      </td></tr>`
    : "";

  return `<div style="background:#ffffff;max-width:720px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.dark};border-radius:12px 12px 0 0;">
    <tr>
      <td style="padding:20px 8px 20px 22px;"><img src="${siteConfig.url}/brand/logo-liniar-480.png" width="180" alt="Imperial Media" style="display:block;border:0;width:180px;max-width:100%;height:auto;" /></td>
      <td style="padding:20px 22px 20px 8px;text-align:right;font:11px/1.6 Arial,sans-serif;color:#cfc8dc;">Contract nr.<br/><b style="color:#fff;font-size:12px;word-break:break-all;">${esc(nr)}</b><br/>${dataRo}</td>
    </tr>
  </table>
  <div style="height:4px;background:${C.magenta};background:linear-gradient(90deg,${C.orange},${C.magenta},${C.purple});"></div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:0 26px 26px;">
    <tr><td style="padding:26px 0 0;">
      <div style="font:800 24px/1.2 Arial,sans-serif;color:${C.ink};">Contract de prestări servicii</div>
      <div style="margin-top:6px;font:14px Arial,sans-serif;color:${C.muted};">${esc(i.service)}</div>
    </td></tr>
    ${summary}

    ${section("I", "Părțile", `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:0 -8px;"><tr>
        ${party("Prestator", PRESTATOR.name, [`CUI ${esc(PRESTATOR.cui)} · Reg. Com. ${esc(PRESTATOR.regcom)}`, esc(PRESTATOR.address), `Reprezentant: ${esc(PRESTATOR.rep)}`, `${PRESTATOR.email} · brand ${PRESTATOR.brand}`, ...(bankLine() ? [esc(bankLine())] : [])])}
        ${party("Beneficiar", i.clientName, [`CUI ${esc(i.clientCui)}`, esc(i.clientAddress), `Reprezentant: ${esc(i.clientRep)}`, esc(i.clientEmail)])}
      </tr></table>`)}

    ${section("II", "Obiectul contractului", `
      ${P(`Prestatorul furnizează Beneficiarului serviciile aferente pachetului <b>${esc(i.service)}</b>, conform ofertei acceptate și descrierii publicate pe imperial-media.ro la data acceptării. Site-ul este construit de la zero, personalizat pentru Beneficiar, fără șabloane.`)}
      ${itemsTable}`)}

    ${section("III", "Prețul și plata", `
      ${P(`Prețul serviciilor este de <b>${esc(i.price)}</b>.`)}
      ${payTable}
      ${P(`Plata se face prin transfer bancar în contul Prestatorului${bankLine() ? ` (${esc(bankLine())})` : ""}, pe baza facturii emise de Prestator. Lucrul începe după încasarea plății de la semnare. Opțiunile suplimentare cerute ulterior de Beneficiar se facturează separat, la prețurile comunicate în scris înainte de execuție.`)}`)}

    ${section("IV", "Pașii proiectului, termene și livrare", `
      ${stepsTable}
      ${P(`Termenul de livrare curge de la data la care Beneficiarul transmite integral conținutul necesar (datele firmei prin formularul dedicat și materialele foto) și este de ${termen}. Livrarea include: link de previzualizare, o rundă de revizii consolidate, publicarea pe domeniul agreat și ${c && c.type !== "start" ? "30" : "14"} zile de corecturi mărunte de la publicare.`)}`)}

    ${section("V", "Obligațiile părților", P("<b>Prestatorul</b> execută serviciile profesionist, informează Beneficiarul asupra stadiului și păstrează confidențialitatea datelor primite. <b>Beneficiarul</b> furnizează conținut corect asupra căruia deține drepturile, răspunde solicitărilor de clarificare și folosește serviciile în conformitate cu legea."))}

    ${section("VI", "Proprietate și drepturi", P("La plata integrală, site-ul livrat (conținut, design, domeniu) aparține Beneficiarului. Prestatorul își păstrează dreptul de a menționa lucrarea în portofoliu și o mențiune discretă de autor în subsolul site-ului. Imaginile de stock incluse sunt licențiate pentru utilizarea în site-ul livrat."))}

    ${section("VII", "Găzduire, domeniu și administrare", `
      ${
        c && c.monthly > 0
          ? P(`Beneficiarul contractează <b>administrarea lunară, de ${lei(c.monthly)}/lună</b>, facturată lunar începând cu luna lansării. Aceasta include: găzduirea site-ului, domeniul, certificatul SSL, backup, actualizări de securitate și modificări mici de conținut${c.monthly >= 200 ? ", plus creditele pentru asistentul AI" : ""}. Administrarea poate fi încetată de oricare parte cu notificare de 30 de zile; la încetare, Prestatorul predă Beneficiarului domeniul și fișierele site-ului.`)
          : P("Găzduirea și domeniul nu sunt incluse în prețul de mai sus. Ele sunt incluse în administrarea lunară (de la 100 lei/lună, conform ofertei curente de pe imperial-media.ro), pe care Beneficiarul o poate contracta oricând. Dacă Beneficiarul nu o contractează, Prestatorul îi predă la livrare fișierele site-ului, iar găzduirea și domeniul cad în sarcina Beneficiarului.")
      }
      ${P("Site-ul nu este suspendat fără o notificare prealabilă de cel puțin 15 zile.")}`)}

    ${section("VIII", "Protecția datelor", P("Părțile prelucrează datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR). Politica de confidențialitate a Prestatorului: imperial-media.ro/confidentialitate."))}

    ${section("IX", "Încetare și litigii", P("Contractul încetează prin executarea obligațiilor, prin acordul părților sau prin reziliere pentru neexecutare, cu notificare prealabilă de 15 zile. Litigiile se soluționează amiabil, iar în caz contrar de instanțele competente de la sediul Prestatorului, conform legii române."))}

    ${section("X", "Încheierea la distanță", P(`Prezentul contract a fost încheiat la distanță și acceptat electronic de Beneficiar, prin reprezentantul ${esc(i.clientRep)}, la data de ${dataRo} (IP: ${esc(i.ip)}). Părțile convin că acceptarea electronică, împreună cu plata sumei de la semnare, țin loc de semnătură olografă, conform art. 1178 și urm. Cod Civil privind libertatea formei. Fiecare parte primește un exemplar electronic pe email.`))}

    <tr><td style="padding:28px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:0 -8px;"><tr>
        <td style="width:50%;vertical-align:top;padding:18px 16px;border:1px solid ${C.line};border-radius:10px;">
          <div style="font:700 10px Arial,sans-serif;letter-spacing:1.5px;color:${C.magenta};">PRESTATOR</div>
          <div style="margin-top:6px;font:700 14px Arial,sans-serif;color:${C.ink};">${esc(PRESTATOR.name)}</div>
          <div style="font:12.5px Arial,sans-serif;color:${C.muted};">prin ${esc(PRESTATOR.rep)}</div>
          <div style="margin-top:34px;border-top:1px solid ${C.line};padding-top:6px;font:11px Arial,sans-serif;color:${C.muted};">semnătura</div>
        </td>
        <td style="width:50%;vertical-align:top;padding:18px 16px;border:1px solid ${C.line};border-radius:10px;">
          <div style="font:700 10px Arial,sans-serif;letter-spacing:1.5px;color:${C.magenta};">BENEFICIAR</div>
          <div style="margin-top:6px;font:700 14px Arial,sans-serif;color:${C.ink};">${esc(i.clientName)}</div>
          <div style="font:12.5px Arial,sans-serif;color:${C.muted};">prin ${esc(i.clientRep)}</div>
          <div style="margin-top:34px;border-top:1px solid ${C.line};padding-top:6px;font:11px Arial,sans-serif;color:${C.muted};">acceptat electronic la ${dataRo}</div>
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:24px 0 0;text-align:center;font:11px Arial,sans-serif;color:${C.muted};">
      Imperial Media · ${PRESTATOR.email} · imperial-media.ro
    </td></tr>
  </table>
</div>`;
}
