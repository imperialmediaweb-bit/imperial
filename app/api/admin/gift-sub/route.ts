// Abonament CADOU — activat manual de proprietar pentru parteneri/VIP-uri.
// Deschizi /api/admin/gift-sub?email=cineva@email.ro&plan=premium (logat în /admin)
// și contul respectiv primește abonamentul activ, fără plată. Discret, ca /vip.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { upsertSubscriber } from "@/lib/subscribers";
import { insertNotification } from "@/lib/monitoring";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Fără bază de date." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") ?? "").trim().toLowerCase();
  const plan = searchParams.get("plan") === "premium" ? "premium-cadou" : "cadou";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ folosire: "adaugă ?email=adresa@client.ro și opțional &plan=premium" });
  }

  try {
    await upsertSubscriber({ email, plan });
    await insertNotification(
      email,
      "info",
      "🎁 Abonamentul tău e activ — cadou de la Imperial Media",
      plan === "premium-cadou"
        ? "Ai acces PREMIUM: monitorizare lunară, consultantul dedicat, generatorul de postări și analiza AI a pozelor — totul activ, din partea casei."
        : "Monitorizarea lunară e activă pentru firma ta: scor, recenzii, competiție, site + sfaturile lunii și consultantul dedicat — din partea casei."
    ).catch(() => {});
    return NextResponse.json({
      ok: true,
      mesaj: `✅ ${email} are acum abonamentul „${plan}" activ, gratuit. Monitorizarea îl include de la următoarea scanare; toate funcțiile din cont sunt deschise.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
