import { NextResponse } from "next/server";
import { LOCATIONS } from "@/lib/locations";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages = [
    { url: base, priority: "1.0", freq: "weekly" },
    { url: `${base}/brief`, priority: "0.9", freq: "weekly" },
    { url: `${base}/servicii`, priority: "0.8", freq: "monthly" },
    { url: `${base}/proiecte`, priority: "0.7", freq: "weekly" },
    { url: `${base}/despre`, priority: "0.6", freq: "monthly" },
    { url: `${base}/blog`, priority: "0.6", freq: "weekly" },
    { url: `${base}/contact`, priority: "0.5", freq: "monthly" },
  ];

  const locationPages = LOCATIONS.map((loc) => ({
    url: `${base}/creare-site-web/${loc.slug}`,
    priority: loc.isCountySeat ? "0.8" : "0.6",
    freq: "monthly",
  }));

  const allPages = [...staticPages, ...locationPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${now}</lastmod>
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
