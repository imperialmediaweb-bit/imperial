// Verificarea unui site existent, din fapte măsurate (nu estimate de AI):
// timp de răspuns, HTTPS, versiune de telefon, SEO de bază, tehnologia pe care e făcut,
// anul din subsol și — dacă e disponibil — scorul real Google PageSpeed (Lighthouse, mobil).
// Din fapte iese verdictul: îl îmbunătățim sau îl refacem pe tehnologii noi.

export type Check = { key: string; label: string; ok: boolean; detail: string };

// Reparațiile pe care le oferim, legate de verificarea care le declanșează. Prețuri în lei.
// Toate împreună au plafon (REPARATIE_PLAFON) — sub prețul unui site nou.
export const REPARATII: { key: string; name: string; price: number; checks: string[]; doarWordPress?: boolean }[] = [
  { key: "viteza", name: "Optimizare viteză", price: 350, checks: ["viteza", "pagespeed"] },
  { key: "seo", name: "SEO de bază (titluri, descrieri, hartă site, date firmă)", price: 250, checks: ["titlu", "descriere", "h1", "sitemap", "schema"] },
  { key: "wordpress", name: "Securizare WordPress (actualizări, backup)", price: 250, checks: [], doarWordPress: true },
  { key: "legal", name: "Conformitate legală (cookies, GDPR, ANPC)", price: 200, checks: ["legal"] },
  { key: "imagini", name: "Descrieri la imagini", price: 100, checks: ["alt"] },
  { key: "https", name: "Certificat HTTPS", price: 100, checks: ["https"] },
  { key: "statistici", name: "Statistici Google (Analytics + Search Console)", price: 100, checks: ["statistici"] },
  { key: "distribuire", name: "Imagine la distribuire + iconiță", price: 100, checks: ["distribuire"] },
  { key: "linkuri", name: "Legături stricate", price: 100, checks: ["linkuri"] },
];
export const REPARATIE_PLAFON = 990;

export function reparatiiNecesare(c: SiteCheck): { key: string; name: string; price: number }[] {
  const failed = new Set(c.checks.filter((x) => !x.ok).map((x) => x.key));
  return REPARATII.filter((r) => (r.doarWordPress ? c.tech === "WordPress" : r.checks.some((k) => failed.has(k)))).map(({ key, name, price }) => ({ key, name, price }));
}

export type SiteCheck = {
  url: string;
  reachable: boolean;
  responseMs: number | null;
  tech: string | null; // WordPress, Wix, Joomla...
  copyrightYear: number | null;
  pagespeed: number | null; // 0-100, mobil
  checks: Check[];
  verdict: "refacere" | "imbunatatire" | "necunoscut";
  continut?: string; // ce scrie pe site (titlu, descriere, titluri, primul text) — pentru analiza AI
  reasons: string[]; // de ce verdictul, în cuvinte simple
};

const TECH: [RegExp, string][] = [
  [/wp-content|wp-includes|wordpress/i, "WordPress"],
  [/wix\.com|wixstatic/i, "Wix"],
  [/joomla/i, "Joomla"],
  [/drupal/i, "Drupal"],
  [/squarespace/i, "Squarespace"],
  [/shopify/i, "Shopify"],
  [/prestashop/i, "PrestaShop"],
  [/opencart/i, "OpenCart"],
  [/gomag/i, "Gomag"],
];

export function normalizeUrl(raw: string): URL | null {
  try {
    const u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    // fără adrese interne
    if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(u.hostname) || !u.hostname.includes(".")) return null;
    return u;
  } catch {
    return null;
  }
}

async function timedFetch(url: string, ms: number): Promise<{ res: Response | null; ms: number }> {
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; ImperialMediaAnaliza/1.0)" } });
    return { res, ms: Date.now() - t0 };
  } catch {
    return { res: null, ms: Date.now() - t0 };
  } finally {
    clearTimeout(timer);
  }
}

async function pagespeed(url: string): Promise<number | null> {
  const key = process.env.PAGESPEED_API_KEY ? `&key=${process.env.PAGESPEED_API_KEY}` : "";
  const { res } = await timedFetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance${key}`,
    40_000
  );
  if (!res?.ok) return null;
  try {
    const j = await res.json();
    const s = j?.lighthouseResult?.categories?.performance?.score;
    return typeof s === "number" ? Math.round(s * 100) : null;
  } catch {
    return null;
  }
}

export async function checkSite(raw: string): Promise<SiteCheck | null> {
  const u = normalizeUrl(raw);
  if (!u) return null;
  const url = u.toString();

  const [main, psi, sitemap] = await Promise.all([
    timedFetch(url, 12_000),
    pagespeed(url),
    timedFetch(`${u.origin}/sitemap.xml`, 8_000),
  ]);

  if (!main.res || !main.res.ok) {
    return { url, reachable: false, responseMs: null, tech: null, copyrightYear: null, pagespeed: psi, checks: [], verdict: "necunoscut", reasons: ["Site-ul nu a putut fi deschis acum — poate fi oprit, expirat sau blochează verificările automate."] };
  }

  const html = (await main.res.text()).slice(0, 600_000);
  const finalUrl = main.res.url || url;
  const tech = TECH.find(([re]) => re.test(html))?.[1] ?? null;
  const years = [...html.matchAll(/(?:©|&copy;|copyright)[^0-9]{0,20}((?:19|20)\d{2})(?:\s*[-–]\s*((?:19|20)\d{2}))?/gi)].map((m) => Number(m[2] ?? m[1]));
  const copyrightYear = years.length ? Math.max(...years) : null;
  const now = new Date().getFullYear();

  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const noAlt = imgs.filter((t) => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).length;
  const desc = /<meta[^>]+name=["']description["'][^>]*content=["'][^"']{30,}/i.test(html) || /<meta[^>]+content=["'][^"']{30,}["'][^>]*name=["']description["']/i.test(html);
  const decode = (t: string) =>
    t.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&nbsp;/g, " ");
  const title = decode((html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim());
  const h1 = (html.match(/<h1\b/gi) ?? []).length;
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const https = finalUrl.startsWith("https://");
  const schema = /application\/ld\+json/i.test(html);
  const sitemapOk = !!sitemap.res?.ok && /<(urlset|sitemapindex)/i.test((await sitemap.res.text()).slice(0, 2000));
  const flashOrTables = /\.swf\b|<frameset|<table[^>]+width=["']?\d{3}/i.test(html);
  const oldJquery = /jquery[.-]?1\.\d/i.test(html);

  // Distribuire, iconiță, statistici, conformitate legală — din HTML
  const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html);
  const favicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
  const analytics = /googletagmanager\.com|google-analytics\.com|gtag\(/i.test(html);
  const cookies = /cookie/i.test(html);
  const gdpr = /confiden[tț]ialitate|gdpr|privacy|date(lor)? cu caracter personal/i.test(html);
  const anpc = /anpc/i.test(html);

  // Legături interne stricate: verificăm până la 12 linkuri de pe prima pagină
  const origin = new URL(finalUrl).origin;
  const links = [...new Set([...html.matchAll(/href=["']([^"'#]+)["']/gi)].map((m) => m[1]))]
    .map((h) => { try { return new URL(h, finalUrl); } catch { return null; } })
    .filter((x): x is URL => !!x && x.origin === origin && !/\.(jpg|jpeg|png|gif|webp|svg|pdf|css|js|xml|ico)$/i.test(x.pathname))
    .map((x) => x.toString())
    .slice(0, 12);
  const linkResults = await Promise.all(links.map((l) => timedFetch(l, 6000).then((r) => (r.res ? r.res.status : 0))));
  const broken = linkResults.filter((st) => st >= 400).length;

  const checks: Check[] = [
    { key: "viteza", label: "Răspuns rapid", ok: main.ms < 1500, detail: `a răspuns în ${(main.ms / 1000).toFixed(1)} s` },
    ...(psi !== null ? [{ key: "pagespeed", label: "Scor Google PageSpeed pe telefon", ok: psi >= 70, detail: `${psi} din 100` }] : []),
    { key: "mobil", label: "Adaptat pentru telefon", ok: viewport, detail: viewport ? "are versiune pentru telefon" : "nu e adaptat pentru telefon" },
    { key: "https", label: "Conexiune sigură (HTTPS)", ok: https, detail: https ? "are lacătul de siguranță" : "browserul îl arată ca nesigur" },
    { key: "titlu", label: "Titlu pentru Google", ok: title.length >= 10 && title.length <= 70, detail: title ? `„${title.slice(0, 60)}”` : "lipsește" },
    { key: "descriere", label: "Descriere pentru Google", ok: desc, detail: desc ? "există" : "lipsește — Google alege singur un text" },
    { key: "h1", label: "Titlu principal pe pagină", ok: h1 === 1, detail: h1 === 1 ? "corect" : h1 === 0 ? "lipsește" : `${h1} titluri principale în loc de unul` },
    { key: "sitemap", label: "Harta site-ului pentru Google", ok: sitemapOk, detail: sitemapOk ? "există" : "lipsește" },
    { key: "schema", label: "Date despre firmă pentru Google și AI", ok: schema, detail: schema ? "există" : "lipsesc" },
    { key: "alt", label: "Descrieri la imagini", ok: imgs.length === 0 || noAlt / imgs.length < 0.2, detail: imgs.length ? `${noAlt} din ${imgs.length} imagini fără descriere` : "fără imagini" },
    { key: "distribuire", label: "Imagine la distribuire și iconiță", ok: ogImage && favicon, detail: ogImage && favicon ? "există" : !ogImage && !favicon ? "lipsesc amândouă" : !ogImage ? "lipsește imaginea pentru Facebook/WhatsApp" : "lipsește iconița" },
    { key: "statistici", label: "Statistici Google", ok: analytics, detail: analytics ? "instalate" : "lipsesc — nu știi câți vizitatori ai" },
    { key: "legal", label: "Cookies, GDPR, ANPC", ok: cookies && gdpr && anpc, detail: [!cookies ? "fără mesaj cookies" : "", !gdpr ? "fără politică de confidențialitate" : "", !anpc ? "fără linkurile ANPC" : ""].filter(Boolean).join(", ") || "în regulă" },
    ...(links.length ? [{ key: "linkuri", label: "Legături care funcționează", ok: broken === 0, detail: broken ? `${broken} din ${links.length} legături verificate dau eroare` : `${links.length} legături verificate, toate funcționează` }] : []),
    ...(copyrightYear ? [{ key: "an", label: "Actualizat recent", ok: copyrightYear >= now - 1, detail: `anul din subsol: ${copyrightYear}` }] : []),
  ];

  // Verdict: refacere când problemele țin de fundație (telefon, viteză, tehnologie veche);
  // altfel se îmbunătățește ce există.
  const reasons: string[] = [];
  if (!viewport) reasons.push("nu e făcut pentru telefon, de unde vin majoritatea vizitatorilor");
  if (psi !== null && psi < 50) reasons.push(`scorul de viteză pe telefon e ${psi} din 100 — o problemă de construcție, nu de detaliu`);
  if (main.ms > 3000) reasons.push("se încarcă foarte greu");
  if (flashOrTables || oldJquery) reasons.push("e construit pe o tehnologie veche");
  if (copyrightYear && copyrightYear <= now - 4) reasons.push(`pare neactualizat din ${copyrightYear}`);
  if (!https) reasons.push("nu are conexiune sigură");
  const verdict: SiteCheck["verdict"] = reasons.length >= 2 || !viewport ? "refacere" : "imbunatatire";
  if (verdict === "imbunatatire") {
    const fix = checks.filter((c) => !c.ok).map((c) => c.label);
    reasons.splice(0, reasons.length, fix.length ? `baza e bună; de reparat: ${fix.join(" · ")}` : "e într-o formă bună — pasul următor e să fie găsit mai des");
  }

  // Conținutul vizibil, ca AI-ul să judece și textele, nu doar tehnica
  const headings = [...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)].map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 12);
  const text = html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1800);
  const continut = `Titlu: ${title || "—"}\nTitluri pe pagină: ${headings.join(" | ") || "—"}\nText de pe prima pagină: ${text}`;

  return { continut, url: finalUrl, reachable: true, responseMs: main.ms, tech, copyrightYear, pagespeed: psi, checks, verdict, reasons };
}
