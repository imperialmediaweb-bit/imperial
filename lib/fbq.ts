// Meta Pixel — evenimente de conversie trimise DOAR dacă pixelul e configurat.
// Client-safe: fără pixel (env lipsă) totul e no-op, zero erori.

export function fbTrack(event: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", event, params ?? {});
  } catch {}
}
