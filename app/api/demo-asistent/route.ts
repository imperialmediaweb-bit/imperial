// Demo-ul asistentului de pe paginile cu ofertă locală: patronul alege tipul
// afacerii și vorbește cu „asistentul lui" — vede pe loc ce primește cadou la site.
// Firmele sunt inventate și declarate ca exemplu; nu promitem nimic în numele cuiva real.

import { NextResponse } from "next/server";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BUSINESSES: Record<string, string> = {
  salon: `Salon „Bella" (exemplu). Program: L–V 9–19, S 9–15, D închis. Prețuri: tuns damă 60 lei, vopsit de la 150 lei, coafat 70 lei, manichiură semipermanentă 90 lei. Adresă: str. Exemplului 10. Programări: le preiei tu, apoi salonul confirmă telefonic.`,
  dentist: `Cabinet stomatologic „Zâmbet" (exemplu). Program: L–V 9–18. Servicii: consultație 100 lei, detartraj 200 lei, obturație de la 250 lei, albire 900 lei, implant — preț după consultație. Urgențe: în aceeași zi dacă e loc. Cererile de programare le preiei tu, cabinetul confirmă telefonic.`,
  restaurant: `Restaurant „La Masă" (exemplu). Program: zilnic 11–23. Meniul zilei 35 lei (supă + fel principal). Livrare în oraș peste 60 lei, gratuită. Rezervări pentru grupuri și evenimente: le preiei tu, restaurantul confirmă.`,
  service: `Service auto „Motor Plus" (exemplu). Program: L–V 8–18, S 8–13. Schimb ulei + filtre de la 150 lei manoperă, ITP, diagnoză computerizată 100 lei, vulcanizare. Cererile de programare le preiei tu (marca mașinii, problema, ziua dorită), service-ul confirmă telefonic.`,
};

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!rateLimit(`demo:${getClientIp(req)}`, 20, 10 * 60_000)) {
    return NextResponse.json({ error: "Ai încercat destul demo-ul 🙂 Revino în câteva minute." }, { status: 429 });
  }
  let body: { business?: string; messages?: Turn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }
  const info = BUSINESSES[body.business ?? ""];
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
  if (!info || messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Demo-ul nu e disponibil momentan." }, { status: 503 });
  }

  try {
    const resp = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: `Ești asistentul de pe site-ul acestei afaceri și răspunzi clienților în română, scurt (1-3 propoziții), cald și concret.
${info}
Reguli: folosește DOAR datele de mai sus; ce nu știi, spui că afacerea revine cu răspunsul și ceri numărul de telefon. Pentru programări sau rezervări ceri numele, telefonul și ziua/ora dorită, apoi confirmi că cererea a fost trimisă patronului pe WhatsApp.`,
      messages,
    });
    const reply = resp.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("")
      .trim();
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[demo-asistent]", e);
    return NextResponse.json({ error: "Demo-ul a avut o problemă. Încearcă din nou." }, { status: 502 });
  }
}
