// RSS feed pentru blog — canal de descoperire pentru Google, agregatoare și crawlere AI.
// LLM-urile și motoarele îl folosesc ca listă „ce e nou" — accelerează indexarea.

import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/blog-articles";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const items = getAllArticles()
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${siteConfig.url}/blog/${a.slug}</link>
      <guid>${siteConfig.url}/blog/${a.slug}</guid>
      <description>${esc(a.description)}</description>
      <category>${esc(a.category)}</category>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog Imperial Media — web design, SEO și marketing digital</title>
    <link>${siteConfig.url}/blog</link>
    <description>Ghiduri de prețuri, promovare online și creștere pentru afaceri din România.</description>
    <language>ro-RO</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
