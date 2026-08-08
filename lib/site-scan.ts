// Scanarea site-ului unei firme — MULTI-PAGINĂ, nu doar homepage.
// Dovezile (portofoliu, testimoniale, galerie) stau de obicei pe subpagini:
// le găsim din linkurile interne și le scanăm și pe ele. Anti-SSRF peste tot.

import { safeExternalUrl } from "./url-guard";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

// Paginile unde stau de obicei dovezile unei firme
const RELEVANT_LINK = /(portofoli|proiecte|portfolio|lucrari|galerie|gallery|testimonial|recenzii|pareri|despre|about|servicii|services|echipa|team|referinte|clienti|realizari)/i;

const PORTFOLIO_RE = /portofoli|proiecte(le)? (noastre|realizate)|portfolio|lucr[aă]ri(le)?|case stud|galerie|realiz[aă]ri/i;
const TESTIMONIALS_RE = /testimonial|recenzi|p[aă]reri(le)? clien|ce spun clien|feedback|review/i;
const CONTACT_RE = /contact|tel:|wa\.me|whatsapp/i;

export type SiteScan = {
  reachable: boolean;
  loadTimeMs?: number;
  isHttps?: boolean;
  hasViewport?: boolean;
  hasMetaDesc?: boolean;
  hasH1?: boolean;
  pagesScanned?: number;
  subpages?: Array<{ path: string; portfolio: boolean; testimonials: boolean; imgCount: number }>;
  hasPortfolioHint?: boolean;
  hasTestimonialsHint?: boolean;
  hasContactHint?: boolean;
};

async function fetchPage(url: string): Promise<{ ok: boolean; ms: number; html: string }> {
  const start = Date.now();
  const res = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { "User-Agent": UA } });
  const html = (await res.text()).slice(0, 80000);
  return { ok: res.ok, ms: Date.now() - start, html };
}

export async function scanSite(rawUrl: string): Promise<SiteScan | null> {
  const safeUrl = safeExternalUrl(String(rawUrl));
  if (!safeUrl) return null;
  try {
    const home = await fetchPage(safeUrl);
    const base = new URL(safeUrl);

    // Subpaginile relevante din linkurile interne ale homepage-ului
    const hrefs = Array.from(home.html.matchAll(/href=["']([^"'#]+)["']/gi)).map((m) => m[1]);
    const targets: string[] = [];
    for (const h of hrefs) {
      if (!RELEVANT_LINK.test(h)) continue;
      try {
        const u = new URL(h, base);
        if (u.hostname !== base.hostname) continue;
        u.search = "";
        const su = safeExternalUrl(u.toString());
        if (su && su !== safeUrl && !targets.includes(su)) targets.push(su);
      } catch {}
    }

    const subpages: NonNullable<SiteScan["subpages"]> = [];
    let combined = home.html;
    for (const u of targets.slice(0, 5)) {
      try {
        const p = await fetchPage(u);
        if (!p.ok) continue;
        combined += "\n" + p.html;
        subpages.push({
          path: u.replace(base.origin, "") || "/",
          portfolio: PORTFOLIO_RE.test(p.html),
          testimonials: TESTIMONIALS_RE.test(p.html),
          imgCount: (p.html.match(/<img/gi) ?? []).length,
        });
      } catch {}
    }

    return {
      reachable: home.ok,
      loadTimeMs: home.ms,
      isHttps: safeUrl.startsWith("https"),
      hasViewport: /name=["']viewport["']/i.test(home.html),
      hasMetaDesc: /name=["']description["']/i.test(home.html),
      hasH1: /<h1[\s>]/i.test(home.html),
      pagesScanned: 1 + subpages.length,
      subpages,
      hasPortfolioHint: PORTFOLIO_RE.test(combined),
      hasTestimonialsHint: TESTIMONIALS_RE.test(combined),
      hasContactHint: CONTACT_RE.test(combined),
    };
  } catch {
    return { reachable: false };
  }
}
