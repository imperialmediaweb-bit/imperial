import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { sendLeadEmails } from "@/lib/email";
import { insertBrief } from "@/lib/briefs";
import { hasDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s: string) => /^[\d\s+()\-]{7,}$/.test(s);

function hashIp(ip: string | null): string | undefined {
  if (!ip) return undefined;
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: Request) {
  // Max 5 lead-uri per IP per 10 minute — suficient pentru orice client real
  if (!rateLimit(`lead:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Prea multe cereri. Așteaptă câteva minute și încearcă din nou." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  // Honeypot — orice valoare non-goală SAU câmp prezent dar gol trimis de bot
  if (typeof body?.hp === "string" && body.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body?.name ?? "").trim();
  const phoneRaw = String(body?.phone ?? "").trim();
  const email = String(body?.email ?? "").trim();

  if (name.length < 2 || !isEmail(email)) {
    return NextResponse.json(
      { error: "Nume și email valid obligatorii." },
      { status: 400 }
    );
  }

  const phone = phoneRaw ? (isPhone(phoneRaw) ? phoneRaw : "") : "";
  if (phoneRaw && !phone) {
    return NextResponse.json(
      { error: "Telefonul dat nu pare valid. Lasă gol sau corectează-l." },
      { status: 400 }
    );
  }

  // Estimare AI (opțional)
  const aiEstimateMin = Number.isFinite(body?.aiEstimateMin) ? body.aiEstimateMin : null;
  const aiEstimateMax = Number.isFinite(body?.aiEstimateMax) ? body.aiEstimateMax : null;
  const aiEstimateReason = String(body?.aiEstimateReason ?? "").trim();
  const aiRecommendedPackage = String(body?.aiRecommendedPackage ?? "").trim();
  const aiRecommendedReason = String(body?.aiRecommendedReason ?? "").trim();
  const source = String(body?.source ?? "classic-form").trim();

  const features = Array.isArray(body?.features)
    ? body.features.map(String).slice(0, 30)
    : [];

  // Construim secțiunea AI pentru email
  let aiBlock = "";
  if (source === "ai-chat") {
    aiBlock += "\n\n─── Date generate de Imperial AI ───";
    if (aiRecommendedPackage) {
      aiBlock += `\n▸ Pachet recomandat de AI: ${aiRecommendedPackage}`;
      if (aiRecommendedReason) aiBlock += ` — ${aiRecommendedReason}`;
    }
    if (aiEstimateMin !== null && aiEstimateMax !== null && (aiEstimateMin > 0 || aiEstimateMax > 0)) {
      aiBlock += `\n▸ Estimare orientativă AI: ${aiEstimateMin}–${aiEstimateMax} €`;
      if (aiEstimateReason) aiBlock += ` (${aiEstimateReason})`;
    } else if (aiEstimateReason) {
      aiBlock += `\n▸ Notă AI: ${aiEstimateReason}`;
    }
  }

  const userMessage = String(body?.message ?? "").trim().slice(0, 4000);
  const finalMessage = (userMessage + aiBlock).trim();

  const payload = {
    name,
    phone: phone || "—",
    email,
    selectedPackage: String(body?.selectedPackage ?? "personalizat"),
    industry: String(body?.industry ?? "").trim(),
    currentSite: String(body?.currentSite ?? "").trim(),
    pages: String(body?.pages ?? "").trim(),
    deadline: String(body?.deadline ?? "").trim(),
    hasLogo: String(body?.hasLogo ?? "").trim(),
    colorsPreference: String(body?.colorsPreference ?? "").trim(),
    features,
    inspiration: String(body?.inspiration ?? "").trim(),
    message: finalMessage.slice(0, 6000),
  };

  // ─── Salvează în DB dacă există (nu blochează pe eroare DB) ───
  let dbSaved = false;
  if (hasDb()) {
    try {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        null;
      await insertBrief({
        name,
        email,
        phone: phone || undefined,
        selected_package: payload.selectedPackage,
        industry: payload.industry,
        current_site: payload.currentSite,
        pages: payload.pages,
        deadline: payload.deadline,
        has_logo: payload.hasLogo,
        colors_preference: payload.colorsPreference,
        features,
        inspiration: payload.inspiration,
        message: userMessage,
        ai_estimate_min: aiEstimateMin,
        ai_estimate_max: aiEstimateMax,
        ai_estimate_reason: aiEstimateReason || undefined,
        ai_recommended_package: aiRecommendedPackage || undefined,
        ai_recommended_reason: aiRecommendedReason || undefined,
        source,
        ip_hash: hashIp(ip),
        user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? undefined,
      });
      dbSaved = true;
    } catch (e) {
      // Nu picăm request-ul — loghăm și continuăm cu email
      console.error("[/api/lead] DB insert FAILED:", e);
    }
  } else {
    console.warn("[/api/lead] DATABASE_URL missing — lead NOT saved to DB");
  }

  // ─── Trimite email-uri ───
  let emailSent = false;
  try {
    await sendLeadEmails(payload);
    emailSent = true;
  } catch (e: any) {
    console.error("[/api/lead] email send FAILED:", e?.message ?? e);
  }

  // Lead-ul e considerat primit dacă a ajuns MĂCAR pe un canal (DB sau email).
  // Eroare doar dacă au picat ambele — altfel am respinge lead-uri valide.
  if (dbSaved || emailSent) {
    if (!emailSent) {
      console.error(
        "[/api/lead] ATENȚIE: lead salvat în DB dar emailul NU a plecat — verifică RESEND_API_KEY/FROM_EMAIL"
      );
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "Nu am putut trimite mesajul. Sună-ne direct." },
    { status: 500 }
  );
}
