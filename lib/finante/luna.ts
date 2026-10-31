// Luna aleasă în panou („2026-10”) → interval de date.
export function lunaRange(luna: string | null | undefined): { luna: string; from: string; to: string; fromDate: Date; toDate: Date } {
  const now = new Date();
  const def = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const l = /^\d{4}-\d{2}$/.test(luna ?? "") ? (luna as string) : def;
  const [y, m] = l.split("-").map(Number);
  const fromDate = new Date(Date.UTC(y, m - 1, 1));
  const toDate = new Date(Date.UTC(y, m, 1)); // exclusiv
  const last = new Date(Date.UTC(y, m, 0));
  return { luna: l, from: fromDate.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10), fromDate, toDate };
}

export function lunaAnterioara(luna: string): string {
  const [y, m] = luna.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
