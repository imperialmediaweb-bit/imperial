// IndexNow — indexare INSTANT în Bing/Yandex (indexul Bing alimentează și căutarea
// din ChatGPT/Copilot → vizibilitate LLM). Google nu suportă IndexNow — acolo rămân
// sitemap + Search Console. Apelezi endpoint-ul ăsta după fiecare val de conținut nou.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { LOCATIONS } from "@/lib/locations";
import { getAllArticles } from "@/lib/blog-articles";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const INDEXNOW_KEY = "imperialmedia-a7f3e9c2b1d48056"; // servit public la /{key}.txt (cerința protocolului)

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }

  const base = siteConfig.url;
  const urlList = [
    base,
    `${base}/service`,
    `${base}/service/exemplu`,
    `${base}/brief`,
    `${base}/servicii`,
    `${base}/proiecte`,
    `${base}/blog`,
    `${base}/despre`,
    ...LOCATIONS.map((l) => `${base}/creare-site-web/${l.slug}`),
    ...getAllArticles().map((a) => `${base}/blog/${a.slug}`),
  ];

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "imperial-media.ro",
        key: INDEXNOW_KEY,
        keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return NextResponse.json({
      trimise: urlList.length,
      status: res.status,
      mesaj:
        res.status === 200 || res.status === 202
          ? `✅ ${urlList.length} URL-uri trimise la IndexNow (Bing/Yandex — și indexul din ChatGPT). Google nu suportă IndexNow: acolo folosești Search Console.`
          : `⚠️ IndexNow a răspuns cu ${res.status} — reîncearcă în câteva minute.`,
    });
  } catch (e: any) {
    return NextResponse.json({ eroare: String(e?.message ?? e) }, { status: 500 });
  }
}
