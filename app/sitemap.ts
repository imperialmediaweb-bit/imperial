import type { MetadataRoute } from "next";
import { LOCATIONS } from "@/lib/locations";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/brief`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/servicii`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/proiecte`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/despre`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map((loc) => ({
    url: `${base}/creare-site-web-${loc.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: loc.isCountySeat ? 0.8 : 0.6,
  }));

  return [...staticPages, ...locationPages];
}
