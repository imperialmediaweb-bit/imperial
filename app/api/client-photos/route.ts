// Pozele clientului (pentru paginile/site-ul comandat) — urcate direct din cont în Cloudinary.
// Fără emailuri cu atașamente, fără telefoane: clientul urcă, tu primești linkurile pe email.

import { NextResponse } from "next/server";
import { getClientEmail } from "@/lib/client-auth";
import { cloudinaryEnabled, uploadImageToCloudinary } from "@/lib/cloudinary";
import { insertNotification } from "@/lib/monitoring";
import { sendSimpleEmail, ownerEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_FILES = 10;
const MAX_SIZE = 8 * 1024 * 1024; // 8MB / poză

export async function POST(req: Request) {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  if (!email) {
    return NextResponse.json({ error: "Intră întâi în contul tău." }, { status: 401 });
  }
  if (!cloudinaryEnabled()) {
    return NextResponse.json(
      { error: "Upload-ul de poze nu e configurat încă — trimite-le deocamdată pe office@imperial-media.ro." },
      { status: 503 }
    );
  }
  if (!rateLimit(`client-photos:${getClientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încărcări — încearcă în 10 minute." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Nu am putut citi fișierele." }, { status: 400 });
  }

  const files = form.getAll("photos").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Alege măcar o poză." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Maxim ${MAX_FILES} poze odată.` }, { status: 400 });
  }

  const folder = `clienti/${email.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
  const uploaded: string[] = [];
  const failed: string[] = [];
  // Păstrăm primele poze și ca base64 — pentru analiza AI (Premium), fără re-descărcare
  const forAnalysis: Array<{ media: string; data: string }> = [];

  // Loturi de câte 3 în paralel — de câteva ori mai rapid decât secvențial,
  // fără să ținem toate cele 10 poze în memorie simultan.
  const queue = [...files];
  while (queue.length > 0) {
    const batch = queue.splice(0, 3);
    const results = await Promise.all(
      batch.map(async (f) => {
        if (!f.type.startsWith("image/") || f.size > MAX_SIZE) {
          return { name: f.name, url: null as string | null };
        }
        const b64 = Buffer.from(await f.arrayBuffer()).toString("base64");
        const result = await uploadImageToCloudinary(`data:${f.type};base64,${b64}`, folder);
        if (result?.url && forAnalysis.length < 4 && ["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
          forAnalysis.push({ media: f.type, data: b64 });
        }
        return { name: f.name, url: result?.url ?? null };
      })
    );
    for (const r of results) {
      if (r.url) uploaded.push(r.url);
      else failed.push(r.name);
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json({ error: "Nicio poză nu a putut fi urcată — încearcă din nou." }, { status: 500 });
  }

  // Proprietarul primește linkurile; clientul — confirmarea în cont.
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: `📸 ${email} a urcat ${uploaded.length} poze`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#111;">
        <h2 style="margin:0 0 12px;">📸 Poze noi de la client</h2>
        <p><b>Client:</b> ${email}<br/><b>Folder Cloudinary:</b> ${folder}</p>
        <ol>${uploaded.map((u) => `<li><a href="${u}">${u}</a></li>`).join("")}</ol>
        ${failed.length ? `<p>⚠️ Nu au urcat: ${failed.join(", ")}</p>` : ""}
      </div>`,
      replyTo: email,
    });
  } catch (e) {
    console.error("[client-photos] owner email failed:", e);
  }
  insertNotification(
    email,
    "info",
    `📸 Am primit ${uploaded.length} ${uploaded.length === 1 ? "poză" : "poze"}`,
    "Le folosim la paginile/site-ul tău. Dacă mai ai altele, urcă-le oricând de aici."
  ).catch(() => {});

  // PREMIUM: analiza AI a pozelor, pe loc — vitrina/produsele văzute cu ochi de expert
  let analysis: string | null = null;
  try {
    const { getSubscription } = await import("@/lib/subscribers");
    const sub = await getSubscription(email).catch(() => null);
    const { isPremiumPlan } = await import("@/lib/plans");
    if (sub?.active && isPremiumPlan(sub.plan) && process.env.ANTHROPIC_API_KEY && forAnalysis.length > 0) {
      // Pozele de telefon depășesc des limitele API-ului (5MB / 8000px) — le micșorăm cu sharp.
      const { default: sharp } = await import("sharp");
      const prepared: Array<{ media: "image/jpeg"; data: string }> = [];
      for (const p of forAnalysis) {
        try {
          const resized = await sharp(Buffer.from(p.data, "base64"))
            .rotate()
            .resize({ width: 1568, height: 1568, fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
          prepared.push({ media: "image/jpeg", data: resized.toString("base64") });
        } catch (e) {
          console.error("[client-photos] resize failed, skipping one photo:", e);
        }
      }
      if (prepared.length === 0) throw new Error("no photos prepared");
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const { CLAUDE_MODEL } = await import("@/lib/ai");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 900,
        messages: [
          {
            role: "user",
            content: [
              ...prepared.map((p) => ({
                type: "image" as const,
                source: {
                  type: "base64" as const,
                  media_type: p.media,
                  data: p.data,
                },
              })),
              {
                type: "text" as const,
                text: "Ești expert în merchandising și amenajare pentru afaceri mici din România. Analizează pozele (vitrină/produse/local) SINCER și CONSTRUCTIV, în română: 1) prima impresie a unui trecător/client, 2) ce e bine, 3) top 3 schimbări concrete — întâi cele cu 0 lei, apoi cu buget mic, 4) o ofertă scurtă de pus pe geam, calibrată pe ce vezi. Compact, fără introduceri, max 200 de cuvinte.",
              },
            ],
          },
        ],
      });
      const block = resp.content.find((b) => b.type === "text");
      if (block && block.type === "text" && block.text.trim()) {
        analysis = block.text.trim();
        insertNotification(email, "advice", "🔍 Analiza pozelor tale e gata", analysis).catch(() => {});
      }
    }
  } catch (e) {
    console.error("[client-photos] premium analysis failed:", e);
  }

  return NextResponse.json({ ok: true, uploaded: uploaded.length, failed, analysis });
}
