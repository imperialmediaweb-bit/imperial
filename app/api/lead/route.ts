import { NextResponse } from "next/server";
import { sendLeadEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s: string) => /^[\d\s+()\-]{7,}$/.test(s);

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  // Honeypot
  if (body?.hp) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body?.name ?? "").trim();
  const phoneRaw = String(body?.phone ?? "").trim();
  const email = String(body?.email ?? "").trim();

  // Email OBLIGATORIU. Numele obligatoriu. Telefonul OPȚIONAL.
  if (name.length < 2 || !isEmail(email)) {
    return NextResponse.json(
      { error: "Nume și email valid obligatorii." },
      { status: 400 }
    );
  }

  // Dacă telefonul e dat, trebuie să fie valid. Altfel, "-" (neindicat).
  const phone = phoneRaw ? (isPhone(phoneRaw) ? phoneRaw : "") : "";
  if (phoneRaw && !phone) {
    return NextResponse.json(
      { error: "Telefonul dat nu pare valid. Lasă gol sau corectează-l." },
      { status: 400 }
    );
  }

  // Estimare AI (opțional) — o punem în câmpul "message" ca extra pentru echipă
  const aiEstimateMin = Number.isFinite(body?.aiEstimateMin) ? body.aiEstimateMin : null;
  const aiEstimateMax = Number.isFinite(body?.aiEstimateMax) ? body.aiEstimateMax : null;
  const aiEstimateReason = String(body?.aiEstimateReason ?? "").trim();
  const aiRecommendedPackage = String(body?.aiRecommendedPackage ?? "").trim();
  const aiRecommendedReason = String(body?.aiRecommendedReason ?? "").trim();
  const source = String(body?.source ?? "classic-form").trim();

  // Construim secțiunea AI ca append la mesaj (vizibil în email)
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
    features: Array.isArray(body?.features)
      ? body.features.map(String).slice(0, 30)
      : [],
    inspiration: String(body?.inspiration ?? "").trim(),
    message: finalMessage.slice(0, 6000),
  };

  try {
    await sendLeadEmails(payload);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[/api/lead] send error:", e);
    return NextResponse.json(
      { error: "Nu am putut trimite mesajul. Sună-ne direct." },
      { status: 500 }
    );
  }
}
