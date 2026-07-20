// Rate limiting simplu în memorie (per instanță).
// Suficient pentru o singură instanță Railway; pentru scale orizontal → Redis.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Curățăm periodic bucket-urile expirate ca să nu crească memoria
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

/**
 * Returnează true dacă cererea e permisă, false dacă a depășit limita.
 * @param key identificator (ex: `lead:{ip}`)
 * @param limit câte cereri permise per fereastră
 * @param windowMs durata ferestrei în ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

/** Extrage IP-ul din request (Railway/proxy aware). */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
