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

  for (const f of files) {
    if (!f.type.startsWith("image/") || f.size > MAX_SIZE) {
      failed.push(f.name);
      continue;
    }
    const b64 = Buffer.from(await f.arrayBuffer()).toString("base64");
    const result = await uploadImageToCloudinary(`data:${f.type};base64,${b64}`, folder);
    if (result?.url) uploaded.push(result.url);
    else failed.push(f.name);
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

  return NextResponse.json({ ok: true, uploaded: uploaded.length, failed });
}
