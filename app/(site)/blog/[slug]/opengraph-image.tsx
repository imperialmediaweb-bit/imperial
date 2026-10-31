// Coperta generată automat pentru fiecare articol — branduită Imperial Media.
// Folosită ca og:image (share Facebook/WhatsApp) și ca imagine hero în pagină.

import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blog-articles";

export const runtime = "nodejs";
export const alt = "Articol Imperial Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  const title = article?.title ?? "Blog Imperial Media";
  const category = article?.category ?? "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #170b2e 0%, #241242 55%, #3b1a5e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", letterSpacing: 2 }}>
              IMPERIAL MEDIA
            </div>
            <div style={{ fontSize: 16, color: "#c9b8e8", letterSpacing: 1 }}>Creatori de Emoții!</div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 26px",
              borderRadius: 999,
              background: "rgba(255,107,26,0.18)",
              border: "2px solid rgba(255,107,26,0.6)",
              color: "#ffa163",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 52 : 62,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 10,
              borderRadius: 999,
              background: "linear-gradient(90deg, #ff6b1a, #a855f7)",
            }}
          />
          <div style={{ fontSize: 26, color: "#c9b8e8", fontWeight: 600 }}>imperial-media.ro/blog</div>
        </div>
      </div>
    ),
    size
  );
}
