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
  const phone = String(body?.phone ?? "").trim();
  const email = String(body?.email ?? "").trim();

  if (name.length < 2 || !isPhone(phone) || !isEmail(email)) {
    return NextResponse.json(
      { error: "Câmpurile obligatorii lipsesc sau sunt invalide." },
      { status: 400 }
    );
  }

  const payload = {
    name,
    phone,
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
    message: String(body?.message ?? "").trim().slice(0, 4000),
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
