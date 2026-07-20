// Trimitere email via Resend API.
// Dacă RESEND_API_KEY lipsește, log-ăm payload-ul și nu picăm — util în dev.

import { siteConfig } from "./site";

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
          <p style="margin:8px 0 0;opacity:.95;font-size:14px;">Am primit briefingul tău.</p>
        </div>
        <div style="padding:24px;color:#222;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
            Echipa Imperial Media analizează cererea ta și revine cu
            <strong>oferta personalizată în maximum 24 de ore</strong>
            pe email.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
            Pachet selectat: <strong>${escapeHtml(p.selectedPackage)}</strong><br/>
            Domeniu: <strong>${escapeHtml(p.industry)}</strong>
          </p>
          <p style="margin:24px 0 8px;font-size:14px;color:#666;">
            Vrei să discutăm direct?
          </p>
          <a href="tel:${siteConfig.phoneRaw}" style="display:inline-block;background:#FF6B1A;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">📞 ${siteConfig.phone}</a>
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
      subject: `[Lead] ${p.selectedPackage} — ${p.name}`,
      html: ownerHtml,
      replyTo: p.email,
    }),
    send({
      from: fromEmail,
      to: p.email,
      subject: "Am primit cererea ta — Imperial Media",
      html: clientHtml,
    }),
  ]);
}
