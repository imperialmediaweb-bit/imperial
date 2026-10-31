// Cursul BNR pentru o monedă la o dată (facturi în EUR/USD plătite în lei).
// Sursa: fișierul anual oficial BNR; păstrăm în memorie cât rulează serverul.
const cache = new Map<number, Map<string, Record<string, number>>>();

async function year(y: number): Promise<Map<string, Record<string, number>>> {
  if (cache.has(y)) return cache.get(y)!;
  const map = new Map<string, Record<string, number>>();
  try {
    const xml = await (await fetch(`https://www.bnr.ro/files/xml/years/nbrfxrates${y}.xml`, { signal: AbortSignal.timeout(20_000) })).text();
    for (const cube of xml.split("<Cube ").slice(1)) {
      const date = cube.match(/date="(\d{4}-\d{2}-\d{2})"/)?.[1];
      if (!date) continue;
      const rates: Record<string, number> = {};
      for (const m of cube.matchAll(/<Rate currency="([A-Z]{3})"(?: multiplier="(\d+)")?>([\d.]+)<\/Rate>/g)) rates[m[1]] = Number(m[3]) / Number(m[2] ?? 1);
      map.set(date, rates);
    }
  } catch {}
  cache.set(y, map);
  return map;
}

// Rezervă: cursul BCE (Frankfurter) — BNR blochează uneori serverele din afara țării.
// Diferența față de BNR e sub 0,5%, suficient pentru potrivirea pe sumă (toleranță 3%).
const ecb = new Map<string, number | null>();
async function ecbRate(currency: string, date: string): Promise<number | null> {
  const k = `${currency}:${date}`;
  if (ecb.has(k)) return ecb.get(k)!;
  let r: number | null = null;
  try {
    const j = await (await fetch(`https://api.frankfurter.dev/v1/${date}?base=${currency}&symbols=RON`, { signal: AbortSignal.timeout(15_000) })).json();
    r = Number(j?.rates?.RON) || null;
  } catch {}
  ecb.set(k, r);
  return r;
}

// lei pentru 1 unitate de monedă, cel mai recent curs ≤ data (weekend → vineri)
export async function rateRon(currency: string, date: string): Promise<number | null> {
  if (currency === "RON") return 1;
  return (await bnrRate(currency, date)) ?? (await ecbRate(currency, date));
}

async function bnrRate(currency: string, date: string): Promise<number | null> {
  const y = Number(date.slice(0, 4));
  const m = await year(y);
  const d = new Date(`${date}T00:00:00Z`);
  for (let i = 0; i < 10; i++) {
    const k = d.toISOString().slice(0, 10);
    const r = m.get(k)?.[currency];
    if (r) return r;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return null;
}
