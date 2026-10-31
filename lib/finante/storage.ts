// Fișierele facturilor în Cloudinary, PRIVAT (type "authenticated"): nu au link public.
// Descărcarea se face doar prin link semnat, generat pe server, valabil 10 minute.
// Fără chei Cloudinary → fișierul rămâne în baza de date (coloana file_data).

import crypto from "crypto";
import { cloudinaryEnabled } from "@/lib/cloudinary";

const env = () => ({ cloud: process.env.CLOUDINARY_CLOUD_NAME!, key: process.env.CLOUDINARY_API_KEY!, secret: process.env.CLOUDINARY_API_SECRET! });
const sign = (params: Record<string, string | number>, secret: string) =>
  crypto
    .createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + secret
    )
    .digest("hex");

export function storageEnabled(): boolean {
  return cloudinaryEnabled();
}

// folder ex.: imperial-finante/2026-10/primite
export async function storeFile(buf: Buffer, fileName: string, mime: string, folder: string): Promise<string | null> {
  if (!cloudinaryEnabled()) return null;
  const { cloud, key, secret } = env();
  const timestamp = Math.floor(Date.now() / 1000);
  const base = fileName.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[^\w.-]+/g, "_").slice(0, 60) || "factura";
  const ext = (fileName.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? (mime === "application/pdf" ? "pdf" : "bin")).toLowerCase();
  const public_id = `${base}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const params = { folder, public_id, timestamp, type: "authenticated" };
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array(buf)], { type: mime }), fileName);
  for (const [k, v] of Object.entries(params)) form.set(k, String(v));
  form.set("api_key", key);
  form.set("signature", sign(params, secret));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/raw/upload`, { method: "POST", body: form, signal: AbortSignal.timeout(60_000) });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.public_id) {
    console.error("[finante/storage] upload eșuat:", data?.error?.message ?? res.status);
    return null;
  }
  return String(data.public_id);
}

// Link de descărcare semnat, valabil 10 minute
export function signedUrl(publicId: string): string {
  const { cloud, key, secret } = env();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { expires_at: timestamp + 600, public_id: publicId, timestamp, type: "authenticated" };
  const q = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), api_key: key, signature: sign(params, secret) });
  return `https://api.cloudinary.com/v1_1/${cloud}/raw/download?${q}`;
}

export async function fetchFile(publicId: string): Promise<Buffer | null> {
  const res = await fetch(signedUrl(publicId), { signal: AbortSignal.timeout(60_000) }).catch(() => null);
  if (!res?.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}
