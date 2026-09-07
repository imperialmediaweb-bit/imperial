import { NextResponse } from "next/server";
import { LOCATIONS } from "@/lib/locations";
import { getAllArticles } from "@/lib/blog-articles";
import { importedProjects } from "@/lib/projects-data";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

// lastmod STABIL — Google ignoră sitemap-urile care mint că totul s-a schimbat „acum".
// Actualizează data la release-uri mari de conținut.
const CONTENT_UPDATED = "2026-08-09";

export async function GET() {
  const base = siteConfig.url;
  const now = CONTENT_UPDATED;

  const staticPages = [
    { url: base, priority: "1.0", freq: "weekly" },
    { url: `${base}/brief`, priority: "0.9", freq: "weekly" },
    { url: `${base}/service`, priority: "0.9", freq: "weekly" },
    { url: `${base}/service/exemplu`, priority: "0.7", freq: "monthly" },
    { url: `${base}/servicii`, priority: "0.8", freq: "monthly" },
    { url: `${base}/proiecte`, priority: "0.7", freq: "weekly" },
    { url: `${base}/audit`, priority: "0.6", freq: "monthly" },
    { url: `${base}/consultanta`, priority: "0.6", freq: "monthly" },
    { url: `${base}/despre`, priority: "0.6", freq: "monthly" },
    { url: `${base}/blog`, priority: "0.6", freq: "weekly" },
    { url: `${base}/site-start`, priority: "0.8", freq: "monthly" },
    { url: `${base}/contact`, priority: "0.5", freq: "monthly" },
    { url: `${base}/termeni`, priority: "0.2", freq: "yearly" },
    { url: `${base}/confidentialitate`, priority: "0.2", freq: "yearly" },
  ];

  const locationPages = LOCATIONS.map((loc) => ({
    url: `${base}/creare-site-web/${loc.slug}`,
    priority: loc.isCountySeat ? "0.8" : "0.6",
    freq: "monthly",
  }));

  const blogPages = getAllArticles().map((a) => ({
    url: `${base}/blog/${a.slug}`,
    priority: "0.6",
    freq: "monthly",
    lastmod: a.date,
  }));

  const projectPages = importedProjects.map((p) => ({
    url: `${base}/proiecte/${p.slug}`,
    priority: "0.5",
    freq: "monthly",
  }));

  const allPages = [...staticPages, ...locationPages, ...blogPages, ...projectPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${(p as any).lastmod ?? now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
