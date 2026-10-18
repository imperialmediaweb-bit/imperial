// Logo și poze din brief-ul ofertei locale — urcate în Cloudinary înainte de trimitere.
// Fără cont: clientul încă n-a comandat, deci limităm pe IP și pe mărime.

import { NextResponse } from "next/server";
import { cloudinaryEnabled, uploadImageToCloudinary } from "@/lib/cloudinary";
import { getLocalOffer } from "@/lib/local-offer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_SIZE = 8 * 1024 * 1024; // 8MB / fișier

export async function POST(req: Request) {
  if (!cloudinaryEnabled()) {
    return NextResponse.json({ error: "Încărcarea nu merge acum — trimite pozele pe WhatsApp după ce trimiți cererea." }, { status: 503 });
  }
  if (!rateLimit(`oferta-upload:${getClientIp(req)}`, 25, 10 * 60_000)) {
    return NextResponse.json({ error: "Prea multe încărcări — încearcă în câteva minute." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Fișier invalid." }, { status: 400 });
  }
  const offer = getLocalOffer(String(form.get("oras") ?? ""));
  const file = form.get("file");
  if (!offer || !(file instanceof File)) {
    return NextResponse.json({ error: "Fișier invalid." }, { status: 400 });
  }
  if (!/^image\/(png|jpe?g|webp|svg\+xml|gif)$/.test(file.type)) {
    return NextResponse.json({ error: "Doar imagini (JPG, PNG, WEBP, SVG)." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Imaginea e mai mare de 8 MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
  const day = new Date().toISOString().slice(0, 10);
  const uploaded = await uploadImageToCloudinary(dataUri, `imperial/oferte-locale/${offer.slug}/${day}`);
  if (!uploaded) {
    return NextResponse.json({ error: "Nu am putut urca imaginea. Încearcă din nou." }, { status: 502 });
  }
  return NextResponse.json({ url: uploaded.url });
}
