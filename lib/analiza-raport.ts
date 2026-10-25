// Raportul analizei „Ai nevoie de un site?” — același HTML pentru PDF-ul descărcat,
// emailul către client și copia către Imperial. Stiluri inline, ca să arate la fel peste tot.

import { siteConfig } from "./site";

export type RaportCheck = { label: string; ok: boolean; detail: string };

export type RaportData = {
  firma: string;
  domeniu: string;
  oras: string;
  prezenta: string;
  gasit?: string;
  intro?: string;
  beneficii: string[];
  crestere: string[];
  concluzie?: string;
  recomandare: string;
  concurenta: { nume: string; observatie: string }[];
  puncteForte: string[];
  deImbunatatit: string[];
  plan30: string[];
  site?: { url: string; tech?: string | null; checks: RaportCheck[]; verdict: string; reasons: string[] } | null;
  pachet: string;
  optiuni: { name: string; price: number }[];
  total: number;
  ofertaUrl: string;
};

const C = { dark: "#0d0b12", orange: "#FF9A1A", magenta: "#FF2E9A", purple: "#8B2FF7", ink: "#1d1a24", muted: "#6b6577", line: "#ece8f2", soft: "#faf7ff" };
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const lei = (n: number) => `${n.toLocaleString("ro-RO")} lei`;

// Curăță datele venite din browser: doar text, lungimi limitate
export function sanitizeRaport(b: any): RaportData | null {
  const str = (v: unknown, n: number) => String(v ?? "").slice(0, n);
  const arr = (v: unknown, k: number, n: number) => (Array.isArray(v) ? v.map((x) => str(x, n)).filter(Boolean).slice(0, k) : []);
  if (!b || !str(b.domeniu, 80) || !str(b.oras, 60)) return null;
  const site = b.site && typeof b.site === "object"
    ? {
        url: str(b.site.url, 200),
        tech: b.site.tech ? str(b.site.tech, 40) : null,
        checks: (Array.isArray(b.site.checks) ? b.site.checks : []).slice(0, 14).map((c: any) => ({ label: str(c?.label, 80), ok: !!c?.ok, detail: str(c?.detail, 140) })),
        verdict: str(b.site.verdict, 20),
        reasons: arr(b.site.reasons, 6, 240),
      }
    : null;
  const ofertaUrl = str(b.ofertaUrl, 400);
  return {
    firma: str(b.firma, 80),
    domeniu: str(b.domeniu, 80),
    oras: str(b.oras, 60),
    prezenta: str(b.prezenta, 120),
    gasit: str(b.gasit, 600),
    intro: str(b.intro, 800),
    beneficii: arr(b.beneficii, 6, 300),
    crestere: arr(b.crestere, 6, 300),
    concluzie: str(b.concluzie, 600),
    recomandare: str(b.recomandare, 200),
    concurenta: (Array.isArray(b.concurenta) ? b.concurenta : []).slice(0, 3).map((c: any) => ({ nume: str(c?.nume, 80), observatie: str(c?.observatie, 300) })).filter((c: any) => c.nume),
    puncteForte: arr(b.puncteForte, 5, 300),
    deImbunatatit: arr(b.deImbunatatit, 5, 300),
    plan30: arr(b.plan30, 3, 300),
    site,
    pachet: str(b.pachet, 120),
    optiuni: (Array.isArray(b.optiuni) ? b.optiuni : []).slice(0, 10).map((o: any) => ({ name: str(o?.name, 80), price: Math.max(0, Math.min(100000, Number(o?.price) || 0)) })),
    total: Math.max(0, Math.min(1_000_000, Number(b.total) || 0)),
    // linkul spre ofertă duce doar pe site-ul nostru
    ofertaUrl: ofertaUrl.startsWith("/") ? `${siteConfig.url}${ofertaUrl}` : `${siteConfig.url}/estimare`,
  };
}

export function raportHtml(d: RaportData): string {
  const data = new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  const h = (t: string) => `<div style="margin:26px 0 10px;font:700 15px Arial,sans-serif;color:${C.ink};">${t}</div>`;
  const P = (t: string) => `<p style="margin:0 0 10px;font:14px/1.65 Arial,sans-serif;color:${C.ink};">${t}</p>`;
  const bullet = (t: string, mark = "✓", color = C.magenta) =>
    `<tr><td style="width:20px;vertical-align:top;padding:4px 0;color:${color};font:700 13px Arial,sans-serif;">${mark}</td><td style="padding:4px 0;font:14px/1.55 Arial,sans-serif;color:${C.ink};">${t}</td></tr>`;
  const list = (items: string[]) => `<table role="presentation" cellpadding="0" cellspacing="0">${items.map((x) => bullet(esc(x))).join("")}</table>`;
  const numbered = (items: string[]) =>
    `<table role="presentation" cellpadding="0" cellspacing="0">${items
      .map((x, i) => `<tr><td style="width:24px;height:24px;border-radius:12px;border:1px solid ${C.orange};color:${C.orange};font:700 11px Arial,sans-serif;text-align:center;vertical-align:middle;">${i + 1}</td><td style="padding:5px 0 5px 10px;font:14px/1.5 Arial,sans-serif;color:${C.ink};">${esc(x)}</td></tr>`)
      .join("")}</table>`;

  const site = d.site
    ? `${h(`Ce am găsit pe site-ul tău${d.site.tech ? ` (făcut pe ${esc(d.site.tech)})` : ""}`)}
       <div style="font:12px Arial,sans-serif;color:${C.muted};margin:-4px 0 8px;">${esc(d.site.url)}</div>
       <table role="presentation" cellpadding="0" cellspacing="0">${d.site.checks.map((c) => bullet(`<b>${esc(c.label)}</b> — ${esc(c.detail)}`, c.ok ? "✓" : "✗", c.ok ? "#16a34a" : "#dc2626")).join("")}</table>
       <div style="margin-top:12px;padding:12px 14px;border-radius:8px;background:${d.site.verdict === "refacere" ? "#fff6ec" : "#effaf3"};border-left:4px solid ${d.site.verdict === "refacere" ? C.orange : "#16a34a"};font:14px/1.6 Arial,sans-serif;color:${C.ink};">
         <b>${d.site.verdict === "refacere" ? "Verdict: merită refăcut, construit de la zero pe tehnologii de ultimă generație." : d.site.verdict === "imbunatatire" ? "Verdict: îl îmbunătățim, nu e nevoie să-l refaci." : "Nu am putut verifica site-ul."}</b> ${esc(d.site.reasons.join("; "))}.
       </div>`
    : "";

  return `<div style="background:#fff;max-width:720px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.dark};border-radius:12px 12px 0 0;">
    <tr>
      <td style="padding:20px 8px 20px 22px;"><img src="${siteConfig.url}/brand/logo-liniar-480.png" width="180" alt="Imperial Media" style="display:block;border:0;width:180px;max-width:100%;height:auto;" /></td>
      <td style="padding:20px 22px 20px 8px;text-align:right;font:11px/1.6 Arial,sans-serif;color:#cfc8dc;">Analiză gratuită<br/><b style="color:#fff;font-size:12px;">${data}</b></td>
    </tr>
  </table>
  <div style="height:4px;background:${C.magenta};background:linear-gradient(90deg,${C.orange},${C.magenta},${C.purple});"></div>
  <div style="padding:0 26px 26px;">
    <div style="padding-top:24px;font:800 24px/1.2 Arial,sans-serif;color:${C.ink};">${d.firma ? esc(d.firma) : "Analiza afacerii tale"}</div>
    <div style="margin-top:6px;font:14px Arial,sans-serif;color:${C.muted};">${esc(d.domeniu)} · ${esc(d.oras)} · ${esc(d.prezenta)}</div>
    ${d.gasit ? `<div style="margin-top:18px;padding:12px 14px;border-radius:8px;background:${C.soft};border-left:4px solid ${C.purple};font:14px/1.6 Arial,sans-serif;color:${C.ink};"><b>Ce am găsit despre tine online:</b> ${esc(d.gasit)}</div>` : ""}
    ${d.intro ? `<div style="margin-top:16px;">${P(esc(d.intro))}</div>` : ""}
    ${site}
    ${d.puncteForte.length ? h("Ce faci deja bine") + list(d.puncteForte) : ""}
    ${d.deImbunatatit.length ? h("Ce poți îmbunătăți") + `<table role="presentation" cellpadding="0" cellspacing="0">${d.deImbunatatit.map((x) => bullet(esc(x), "→", C.orange)).join("")}</table>` : ""}
    ${d.concurenta.length ? h(`Cine apare pe Google în ${esc(d.oras)} în domeniul tău`) + `<table role="presentation" cellpadding="0" cellspacing="0">${d.concurenta.map((c) => bullet(`<b>${esc(c.nume)}</b> — ${esc(c.observatie)}`, "•", C.purple)).join("")}</table>` : ""}
    ${d.beneficii.length ? h("Ce ți-ar aduce") + list(d.beneficii) : ""}
    ${d.crestere.length ? h(`Cum te face cunoscut în ${esc(d.oras)}`) + numbered(d.crestere) : ""}
    ${d.plan30.length ? h("Planul tău pentru primele 30 de zile") + numbered(d.plan30) : ""}
    ${h("Recomandarea noastră")}
    ${d.recomandare ? `<p style="margin:0 0 10px;font:700 16px/1.5 Arial,sans-serif;color:${C.ink};">${esc(d.recomandare)}</p>` : ""}
    ${d.concluzie ? P(esc(d.concluzie)) : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:10px;">
      <tr><td style="padding:10px 14px;border-bottom:1px solid ${C.line};font:700 14px Arial,sans-serif;color:${C.ink};" colspan="2">${esc(d.pachet)}</td></tr>
      ${d.optiuni.map((o) => `<tr><td style="padding:8px 14px;border-bottom:1px solid ${C.line};font:14px Arial,sans-serif;color:${C.ink};">+ ${esc(o.name)}</td><td style="padding:8px 14px;border-bottom:1px solid ${C.line};font:13px Arial,sans-serif;color:${C.muted};text-align:right;white-space:nowrap;">${lei(o.price)}</td></tr>`).join("")}
      <tr><td style="padding:10px 14px;font:700 14px Arial,sans-serif;color:${C.ink};">Total orientativ</td><td style="padding:10px 14px;font:800 16px Arial,sans-serif;color:${C.magenta};text-align:right;white-space:nowrap;">${lei(d.total)}</td></tr>
    </table>
    <p style="margin:18px 0 0;"><a href="${esc(d.ofertaUrl)}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font:700 14px Arial,sans-serif;">Primește oferta exactă</a></p>
    <p style="margin:22px 0 0;font:11px/1.5 Arial,sans-serif;color:${C.muted};">Analiză orientativă, fără garanții de rezultat. Cifrele sunt calculate din datele introduse de tine. Imperial Media · ${siteConfig.email} · ${siteConfig.phone} · imperial-media.ro</p>
  </div>
</div>`;
}
