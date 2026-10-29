// Trimiterea brief-ului din oferta locală (configuratorul cu bife).
// Totalul se recalculează aici, din aceleași prețuri ca în pagină — nu ne bazăm
// pe ce trimite browserul. Proprietarul primește tot, cu buton de WhatsApp.

import { NextResponse } from "next/server";
import { insertBrief } from "@/lib/briefs";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  CONFIG_OPTIONS,
  LOCAL_MONTHLY,
  SITE_TYPES,
  type SiteType,
  configTotal,
  getLocalOffer,
} from "@/lib/local-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const cloudinaryUrl = (u: unknown) =>
  typeof u === "string" && /^https:\/\/res\.cloudinary\.com\//.test(u) ? u.slice(0, 500) : null;

function waNumber(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (/^07\d{8}$/.test(d)) return `4${d}`;
  if (/^407\d{8}$/.test(d)) return d;
  return null;
}

export async function POST(req: Request) {
  if (!rateLimit(`oferta-trimite:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe trimiteri — încearcă în câteva minute." }, { status: 429 });
  }
  let b: any;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const offer = getLocalOffer(str(b?.oras, 40));
  if (!offer) return NextResponse.json({ error: "Ofertă necunoscută." }, { status: 400 });

  const name = str(b?.name, 120);
  const email = str(b?.email, 160).toLowerCase();
  const phone = str(b?.phone, 30);
  const firma = str(b?.firma, 160);
  const domeniu = str(b?.domeniu, 120);
  const descriere = str(b?.descriere, 3000);
  if (name.length < 2 || !isEmail(email) || phone.replace(/\D/g, "").length < 9 || firma.length < 2 || descriere.length < 10) {
    return NextResponse.json(
      { error: "Completează numele, emailul, telefonul, numele firmei și câteva rânduri despre ce faci." },
      { status: 400 }
    );
  }

  const type = (SITE_TYPES.find((t) => t.id === b?.tip)?.id ?? "prezentare") as SiteType;
  const options: Record<string, number> = {};
  for (const o of CONFIG_OPTIONS) {
    const v = Number(b?.optiuni?.[o.id] ?? 0);
    if (Number.isFinite(v) && v > 0) options[o.id] = v;
  }
  const { lines, total } = configTotal({ type, options });

  const logo = cloudinaryUrl(b?.logo);
  const poze = (Array.isArray(b?.poze) ? b.poze : []).map(cloudinaryUrl).filter(Boolean).slice(0, 10) as string[];

  const detalii: [string, string][] = [
    ["Firma", firma],
    ["Domeniu", domeniu],
    ["Ce face firma", descriere],
    ["Servicii / produse", str(b?.servicii, 3000)],
    ["Adresă", str(b?.adresa, 300)],
    ["Program", str(b?.program, 300)],
    ["Telefon public pe site", str(b?.telefonPublic, 40)],
    ["Email public pe site", str(b?.emailPublic, 160)],
    ["Site actual", str(b?.siteActual, 300)],
    ["Facebook / Instagram", str(b?.social, 300)],
    ["Culori preferate", str(b?.culori, 300)],
    ["Site-uri care îi plac", str(b?.exemple, 600)],
    ["Domeniu dorit", str(b?.domeniuDorit, 120)],
    ["Alte detalii", str(b?.mesaj, 2000)],
  ].filter(([, v]) => v) as [string, string][];

  const totalText = `${total.toLocaleString("ro-RO")} lei + ${LOCAL_MONTHLY} lei/lună (prima lună gratuită)`;

  await insertBrief({
    name,
    email,
    phone,
    selected_package: `Oferta ${offer.city}: ${SITE_TYPES.find((t) => t.id === type)!.label}`,
    industry: domeniu || undefined,
    current_site: str(b?.siteActual, 300) || undefined,
    has_logo: logo ? "da" : options.logo ? "nu" : undefined,
    colors_preference: str(b?.culori, 300) || undefined,
    features: lines.slice(1).map((l) => l.label),
    inspiration: str(b?.exemple, 600) || undefined,
    message: [...detalii.map(([k, v]) => `${k}: ${v}`), logo ? `Logo: ${logo}` : "", ...poze.map((p, i) => `Poza ${i + 1}: ${p}`)]
      .filter(Boolean)
      .join("\n"),
    ai_estimate_min: total,
    ai_estimate_max: total,
    ai_estimate_reason: totalText,
    source: `oferta-${offer.slug}`,
  }).catch((e) => console.error("[oferta-locala] insertBrief", e));

  const wa = waNumber(phone);
  const waText = encodeURIComponent(
    `Bună ziua, ${name.split(" ")[0]}! Sunt de la Imperial Media. Am primit cererea pentru site-ul ${firma}. Totalul e ${totalText}, cu cadourile incluse. În 5 zile vă trimit site-ul să-l vedeți. Când vă pot suna 5 minute?`
  );
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 10px;color:#666;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 10px;white-space:pre-wrap">${esc(v)}</td></tr>`;

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px">Cerere nouă — oferta ${esc(offer.city)}</h2>
      <p style="margin:0 0 16px;color:#666">${esc(name)} · ${esc(phone)} · ${esc(email)}</p>
      <p style="font-size:20px;margin:0 0 8px"><b>${esc(totalText)}</b></p>
      <table style="border-collapse:collapse;margin-bottom:16px">${lines.map((l) => row(l.label, `${l.price} lei`)).join("")}</table>
      <table style="border-collapse:collapse">${detalii.map(([k, v]) => row(k, v)).join("")}</table>
      ${logo ? `<p><b>Logo:</b><br><a href="${logo}"><img src="${logo}" alt="logo" style="max-height:80px"></a></p>` : `<p><b>Logo:</b> ${options.logo ? "nu are — vrea logo nou" : "nu a încărcat"}</p>`}
      ${poze.length ? `<p><b>Poze (${poze.length}):</b><br>${poze.map((p) => `<a href="${p}"><img src="${p}" alt="" style="height:70px;margin:2px"></a>`).join("")}</p>` : "<p><b>Poze:</b> nu a încărcat</p>"}
      <p style="margin-top:20px">
        ${wa ? `<a href="https://wa.me/${wa}?text=${waText}" style="background:#25D366;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">💬 Scrie-i pe WhatsApp</a>&nbsp;` : ""}
        <a href="tel:${esc(phone)}" style="background:#FF6B1A;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">📞 Sună</a>
      </p>
    </div>`;

  const clientHtml = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2>Am primit cererea pentru site-ul ${esc(firma)}</h2>
      <p>Mulțumim, ${esc(name.split(" ")[0])}! Te contactăm azi sau mâine pe telefon sau WhatsApp.</p>
      <p><b>Ce ai ales:</b></p>
      <ul>${lines.map((l) => `<li>${esc(l.label)} — ${l.price} lei</li>`).join("")}</ul>
      <p><b>Total: ${esc(totalText)}</b></p>
      <p>Cadou: articol de lansare în ${esc(offer.newspaper.name)}, campanie pe Facebook de 5 zile, buton WhatsApp pe site și 30 de zile de modificări.</p>
      <p>Pașii: vorbim pe scurt, în 5 zile vezi site-ul pe o adresă de probă, iar după ce îți place îl publicăm pe domeniul tău — în maximum 14 zile.</p>
      <p>Imperial Media · 0741 970 247 · office@imperial-media.ro</p>
    </div>`;

  await Promise.all([
    sendSimpleEmail({ to: ownerEmail(), subject: `[Oferta ${offer.city}] ${firma} — ${total} lei`, html: ownerHtml, replyTo: email }),
    sendSimpleEmail({ to: email, subject: `Am primit cererea pentru site-ul ${firma} — Imperial Media`, html: clientHtml }),
  ]).catch((e) => console.error("[oferta-locala] email", e));

  return NextResponse.json({ ok: true, total });
}
