// Trimitere email via Resend API.
// Dacă RESEND_API_KEY lipsește, log-ăm payload-ul și nu picăm — util în dev.

import { siteConfig } from "./site";
import { type Config, configHtml, configQuery, configSummary } from "./configuratie";
import { PRAG_AVANS } from "./contract";

type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  selectedPackage: string;
  industry: string;
  currentSite: string;
  pages: string;
  deadline: string;
  hasLogo: string;
  colorsPreference: string;
  features: string[];
  inspiration: string;
  message: string;
  config?: Config | null; // configurația din calculator, recalculată pe server
  offerNo?: string; // numărul ofertei — clientul îl spune la telefon
};

const RESEND_URL = "https://api.resend.com/emails";

async function send(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // În producție lipsa cheii e o eroare reală — lead-ul s-ar pierde silențios.
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY missing in production — email NOT sent");
    }
    console.warn("[email] RESEND_API_KEY missing — skipping send (dev only). Payload:", {
      to: opts.to,
      subject: opts.subject,
    });
    return { ok: true, skipped: true };
  }
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.replyTo,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend error ${res.status}: ${t}`);
  }
  return { ok: true };
}

function row(label: string, value?: string | string[]) {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const v = Array.isArray(value) ? value.join(", ") : value;
  return `<tr><td style="padding:8px 12px;color:#888;font-size:13px;width:180px;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111;font-size:14px;">${escapeHtml(v)}</td></tr>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Email simplu, generic — folosit de fluxul de audit plătit (/service).
export async function sendSimpleEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const fromEmail =
    process.env.FROM_EMAIL ?? "Imperial Media <noreply@imperial-media.ro>";
  return send({ from: fromEmail, ...opts });
}

export function ownerEmail(): string {
  return process.env.LEAD_EMAIL ?? siteConfig.email;
}

export async function sendLeadEmails(p: LeadPayload) {
  const fromEmail =
    process.env.FROM_EMAIL ?? "Imperial Media <noreply@imperial-media.ro>";
  const ownerEmail = process.env.LEAD_EMAIL ?? siteConfig.email;

  const ownerHtml = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f5f5f7;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #eee;">
        <div style="background:linear-gradient(135deg,#FF6B1A,#7B2FF7);color:white;padding:20px 24px;">
          <h2 style="margin:0;font-size:20px;">🔥 Lead nou — ${escapeHtml(p.selectedPackage)}</h2>
          <p style="margin:6px 0 0;opacity:.9;font-size:13px;">${new Date().toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Nume", p.name)}
          ${row("Telefon", p.phone)}
          ${row("Email", p.email)}
          ${row("Nr. ofertă", p.offerNo ?? "")}
          ${row("Pachet", p.selectedPackage)}
          ${row("Domeniu activitate", p.industry)}
          ${row("Site existent", p.currentSite)}
          ${row("Pagini estimate", p.pages)}
          ${row("Termen dorit", p.deadline)}
          ${row("Are logo", p.hasLogo)}
          ${row("Culori preferate", p.colorsPreference)}
          ${row("Funcționalități", p.features)}
          ${row("Inspirație", p.inspiration)}
          ${row("Mesaj", p.message)}
        </table>
        ${p.config ? `<div style="padding:16px 24px;"><p style="margin:0 0 8px;font-weight:700;font-size:14px;">Configurația aleasă în calculator</p>${configHtml(p.config)}</div>` : ""}
        <div style="padding:20px 24px;background:#fafafa;border-top:1px solid #eee;display:flex;gap:8px;flex-wrap:wrap;">
          ${
            p.phone && p.phone !== "—"
              ? `<a href="tel:${p.phone}" style="background:#FF6B1A;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">📞 Sună acum</a>`
              : ""
          }
          <a href="mailto:${p.email}" style="background:#7B2FF7;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">✉ Trimite ofertă</a>
        </div>
      </div>
    </div>
  `;

  const clientHtml = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f5f5f7;padding:24px;">
      <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #eee;">
        <div style="background:linear-gradient(135deg,#FF6B1A,#7B2FF7);color:white;padding:24px;">
          <h2 style="margin:0;font-size:22px;">Mulțumim, ${escapeHtml(p.name.split(" ")[0])}!</h2>
          <p style="margin:8px 0 0;opacity:.95;font-size:14px;">${p.config ? "Oferta ta e gata." : "Am primit briefingul tău."}</p>
        </div>
        <div style="padding:24px;color:#222;">
          ${p.config ? clientOfferBlock(p.config, p) : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
            Echipa Imperial Media analizează cererea ta și revine cu
            <strong>oferta personalizată în maximum 24 de ore</strong>
            pe email.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
            Pachet selectat: <strong>${escapeHtml(p.selectedPackage)}</strong><br/>
            Domeniu: <strong>${escapeHtml(p.industry)}</strong>
          </p>`}
          ${p.config ? "" : `<p style="margin:24px 0 8px;font-size:14px;color:#666;">
            Vrei să discutăm direct?
          </p>
          <a href="tel:${siteConfig.phoneRaw}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">📞 ${siteConfig.phone}</a>`}
        </div>
        <div style="padding:16px 24px;background:#fafafa;border-top:1px solid #eee;text-align:center;color:#888;font-size:12px;">
          Imperial Media · ${siteConfig.email} · imperial-media.ro
        </div>
      </div>
    </div>
  `;

  // Trimitem ambele emailuri în paralel
  await Promise.all([
    send({
      from: fromEmail,
      to: ownerEmail,
      subject: p.config
        ? `[Ofertă ${p.offerNo}] ${p.name} · ${p.phone} — ${configSummary(p.config)} — ${p.config.once.toLocaleString("ro-RO")} lei`
        : `[Lead] ${p.selectedPackage} — ${p.name}`,
      html: ownerHtml,
      replyTo: p.email,
    }),
    send({
      from: fromEmail,
      to: p.email,
      subject: p.config ? `Oferta ta ${p.offerNo}: ${p.config.typeName} — Imperial Media` : "Am primit cererea ta — Imperial Media",
      html: clientHtml,
    }),
  ]);
}

// Oferta scrisă din emailul clientului: tabelul cu opțiunile, pașii următori și contractul precompletat
function clientOfferBlock(c: Config, p: LeadPayload): string {
  const contractUrl = `${siteConfig.url}/contract?${configQuery(c)}`;
  const who = `n=${encodeURIComponent(p.name)}&e=${encodeURIComponent(p.email)}&t=${encodeURIComponent(p.phone === "—" ? "" : p.phone)}`;
  const refuseUrl = `${siteConfig.url}/oferta/raspuns?${who}&${configQuery(c)}`;
  const waText = encodeURIComponent(`Bună! Am primit oferta pentru ${configSummary(c)} și am o întrebare:`);
  const lei = (n: number) => `${n.toLocaleString("ro-RO")} lei`;
  const avans = Math.round(c.once / 2);
  const plata =
    c.once > PRAG_AVANS
      ? `50% avans la semnare (${lei(avans)}) și 50% la finalizare, înainte de publicare (${lei(c.once - avans)})`
      : `integral la semnare (${lei(c.once)})`;
  const step = (n: number, t: string) =>
    `<tr><td style="padding:4px 10px 4px 0;vertical-align:top;color:#FF6B1A;font-weight:700;">${n}.</td><td style="padding:4px 0;font-size:14px;line-height:1.5;">${t}</td></tr>`;
  return `
          <p style="margin:0 0 6px;font-size:13px;color:#888;">Oferta nr. <strong style="color:#111;">${p.offerNo ?? ""}</strong></p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Mai jos ai oferta pentru configurația aleasă:</p>
          ${configHtml(c)}
          <p style="margin:20px 0 8px;font-size:15px;"><strong>Cum lucrăm, pas cu pas</strong></p>
          <table style="border-collapse:collapse;">
            ${step(1, "Accepți oferta din butonul de mai jos. Citești contractul complet (îl poți și descărca), apoi îl semnezi online, cu CUI-ul firmei.")}
            ${step(2, `Îți trimitem factura proformă. Plătești prin transfer bancar în contul firmei: ${plata}.`)}
            ${step(3, "Ne trimiți datele firmei, textele și pozele, printr-un formular simplu.")}
            ${step(4, "Construim site-ul și îți trimitem linkul de previzualizare.")}
            ${step(5, "O rundă de modificări, pe observațiile tale.")}
            ${step(6, c.once > PRAG_AVANS ? "Plătești restul de 50% și publicăm site-ul." : "Publicăm site-ul pe domeniul tău.")}
            ${c.monthly > 0 ? step(7, `De la lansare: administrarea, ${lei(c.monthly)}/lună — găzduire, domeniu, backup, actualizări și modificări mici.`) : ""}
          </table>
          <p style="margin:16px 0 12px;">
            <a href="${contractUrl}" style="display:inline-block;background:#111;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">📜 Accept oferta și semnez contractul</a>
          </p>
          <p style="margin:20px 0 8px;font-size:15px;line-height:1.6;"><strong>Ai întrebări sau vrei să schimbi ceva?</strong> Sună-ne și spune numărul ofertei, <strong>${p.offerNo ?? ""}</strong> — știm imediat ce ai ales.</p>
          <p style="margin:0 0 12px;">
            <a href="tel:${siteConfig.phoneRaw}" style="display:inline-block;background:#FF6B1A;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 6px 0;">📞 Sună-ne: ${siteConfig.phone}</a>
            <a href="https://wa.me/${siteConfig.whatsapp}?text=${waText}" style="display:inline-block;background:#25D366;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 6px 0;">💬 Scrie-ne pe WhatsApp</a>
          </p>
          <p style="margin:0 0 12px;font-size:14px;">
            Nu e ce căutai? <a href="${refuseUrl}" style="color:#666;font-weight:600;">Nu accept oferta</a> — spune-ne de ce și îți propunem altă variantă.
          </p>
          <p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#888;">
            Prețurile sunt cele din calculatorul de pe site. Dacă apar cerințe în plus, îți spunem înainte, în scris.
          </p>`;
}
