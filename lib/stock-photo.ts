// Poze de stock (Pexels) pentru articolele de blog — licență liberă, hotlink permis.
// Env: PEXELS_API_KEY (gratuit, pexels.com/api). Fără cheie → null, iar pagina
// folosește coperta generată automat. Fetch cu cache de 24h (la SSG = build-time).

export type StockPhoto = {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
};

export async function getStockPhoto(query: string, alt: string): Promise<StockPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=large`,
      { headers: { Authorization: key }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.photos?.[0];
    if (!photo?.src) return null;
    return {
      url: String(photo.src.large2x ?? photo.src.large ?? photo.src.original),
      alt,
      photographer: String(photo.photographer ?? "Pexels"),
      photographerUrl: String(photo.photographer_url ?? "https://www.pexels.com"),
    };
  } catch {
    return null;
  }
}
