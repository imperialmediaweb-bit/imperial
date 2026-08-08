// Tester de scanare site pentru diagnoză — protejat cu sesiunea de admin.
// Deschizi /api/admin/test-scan?site=imperial-media.ro (logat în /admin) și vezi
// EXACT ce vede raportul: paginile parcurse, portofoliu/testimoniale detectate, semnalele tehnice.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { scanSite } from "@/lib/site-scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const site = String(searchParams.get("site") ?? "").trim();
  if (!site) {
    return NextResponse.json({ folosire: "adaugă ?site=domeniul-firmei.ro" });
  }

  const scan = await scanSite(site);
  if (!scan) {
    return NextResponse.json({ eroare: "URL invalid sau blocat (adrese private interzise)." });
  }

  return NextResponse.json({
    site,
    rezultat: scan,
    interpretare: !scan.reachable
      ? "❌ Site-ul nu a răspuns — raportul îl va marca drept picat."
      : [
          `✅ Scanat: ${scan.pagesScanned} pagini${scan.subpages?.length ? ` (homepage + ${scan.subpages.map((s) => s.path).join(", ")})` : " (doar homepage — n-am găsit linkuri interne relevante)"}`,
          `Portofoliu/proiecte: ${scan.hasPortfolioHint ? "✅ DETECTAT — raportul îl va recunoaște" : "⚠️ nedetectat — dacă firma ARE portofoliu, verifică dacă pagina e legată din homepage și numită standard (portofoliu/proiecte/lucrări)"}`,
          `Testimoniale/recenzii pe site: ${scan.hasTestimonialsHint ? "✅ DETECTAT" : "⚠️ nedetectat"}`,
          `Contact vizibil: ${scan.hasContactHint ? "✅" : "⚠️ nedetectat"}`,
        ].join(" · "),
  });
}
