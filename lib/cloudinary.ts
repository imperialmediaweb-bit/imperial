// Upload de imagini în Cloudinary (REST, semnat) — fără SDK.
// Env: CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET
// (din dashboard-ul Cloudinary → API Keys). Fără ele, upload-ul e dezactivat grațios.

import crypto from "crypto";

export function cloudinaryEnabled(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadImageToCloudinary(
  dataUri: string,
  folder: string
): Promise<{ url: string } | null> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  // Semnătura Cloudinary: sha1 peste parametrii sortați (fără file/api_key) + secret
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + secret).digest("hex");

  const form = new FormData();
  form.set("file", dataUri);
  form.set("api_key", key);
  form.set("timestamp", String(timestamp));
  form.set("folder", folder);
  form.set("signature", signature);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    if (!res.ok || !data?.secure_url) {
      console.error("[cloudinary] upload failed:", data?.error?.message ?? res.status);
      return null;
    }
    return { url: String(data.secure_url) };
  } catch (e) {
    console.error("[cloudinary] upload error:", e);
    return null;
  }
}
