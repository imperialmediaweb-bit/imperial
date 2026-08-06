// Gardă anti-SSRF pentru fetch-urile către URL-uri date de utilizatori (site, Facebook).
// Blochează scheme non-http, porturi nestandard, localhost și rețelele private —
// serverul nu trebuie folosit ca sondă către rețeaua internă / metadata cloud.

export function safeExternalUrl(raw: string): string | null {
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let u: URL;
  try {
    u = new URL(withProto);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.port && u.port !== "80" && u.port !== "443") return null;
  if (u.username || u.password) return null;

  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  // IPv6 literal — respins din principiu (nu avem nevoie de el pentru site-uri de firme)
  if (host.includes(":")) return null;
  // IPv4 literal → respinge loopback/private/link-local/metadata
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (
      a === 0 || a === 10 || a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    ) {
      return null;
    }
  } else if (!host.includes(".")) {
    // hostname fără punct (nume intern de rețea) — respins
    return null;
  }
  return u.toString();
}
