// Feed-ul JSON pentru modulul de publicare al rețelei Media Expres.
// Rețeaua îl citește zilnic (cu cheia secretă) și publică articolele „ready".
// Format: exact cel din presa/spec-modul-publicare-retea.md — NU-l schimba fără
// să anunți rețeaua (endpoint-ul lor /api/cron/imperial-feed îl consumă ca atare).

import { NextResponse } from "next/server";
import { getPool, ensureSchema, hasDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = process.env.PRESA_FEED_KEY;
  if (!key) {
    return NextResponse.json({ error: "PRESA_FEED_KEY neconfigurat" }, { status: 503 });
  }
  const given = new URL(req.url).searchParams.get("key");
  if (given !== key) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!hasDb()) return NextResponse.json({ articole: [] });

  await ensureSchema();
  // Doar „ready" și din ultimele 60 de zile — feed-ul rămâne mic; rețeaua
  // oricum nu dublează (evidența lor e pe perechea articol+site).
  const res = await getPool()!.query(
    `SELECT token, title, content_html, image_url, judet, distributie, publica_dupa
     FROM press_articles
     WHERE status = 'ready' AND created_at > NOW() - INTERVAL '60 days'
     ORDER BY created_at ASC LIMIT 100`
  );

  return NextResponse.json({
    articole: res.rows.map((r: any) => ({
      id: r.token,
      titlu: r.title,
      continut_html: r.content_html,
      imagine_url: r.image_url ?? null,
      judet: r.judet ?? null,
      distributie: r.distributie === "toata-reteaua" ? "toata-reteaua" : "local",
      publica_dupa: r.publica_dupa ? String(r.publica_dupa).slice(0, 10) : null,
      link_obligatoriu: `${siteConfig.url}/service`,
    })),
  });
}
