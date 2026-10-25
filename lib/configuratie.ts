// Configurația aleasă în calculator (tip + opțiuni) — sursa unică pentru prețuri.
// Folosită de calculator, de emailul cu cererea de ofertă și de contract,
// ca totalul să fie calculat la fel peste tot (pe server se recalculează, nu se ia din browser).

import { SITE_START_ADDONS } from "./site-start-addons";
import { SHOP_ADDONS } from "./shop-addons";

export type ConfigType = "start" | "prezentare" | "magazin";

export const CONFIG_TYPES: Record<ConfigType, { name: string; base: number }> = {
  start: { name: "Site Start", base: 1500 },
  prezentare: { name: "Site Custom", base: 3500 },
  magazin: { name: "Magazin online", base: 3000 },
};

export type ConfigOpt = { key: string; name: string; lei: number; monthly?: boolean };

const ADMIN: ConfigOpt = {
  key: "admin",
  name: "Administrare lunară — găzduire, domeniu, backup (200 lei/lună cu asistent AI)",
  lei: 100,
  monthly: true,
};

export function isConfigType(v: unknown): v is ConfigType {
  return v === "start" || v === "prezentare" || v === "magazin";
}

// Site Start și Site Custom folosesc opțiunile Site Start; magazinul are lista lui
export function optionsFor(type: ConfigType): ConfigOpt[] {
  const source =
    type === "magazin"
      ? SHOP_ADDONS
      : SITE_START_ADDONS.filter((a) => !a.onlyOnPage && !(type === "prezentare" && a.key === "ai"));
  const list = source.map((a) => ({
    key: a.key,
    name: a.unit ? `${a.name} (per ${a.unit})` : a.name,
    lei: a.price,
  }));
  return [...list, ADMIN];
}

// Asistentul AI e inclus la Site Custom; administrarea urcă la 200 lei/lună când există asistent AI
export function optionPrice(o: ConfigOpt, type: ConfigType, chosen: Record<string, boolean>): number {
  if (o.key === "ai" && type === "prezentare") return 0;
  if (o.key === "admin" && (chosen.ai || chosen["ai-shop"] || type === "prezentare")) return 200;
  return o.lei;
}

export type Config = {
  type: ConfigType;
  typeName: string;
  base: number;
  lines: { key: string; name: string; lei: number; monthly: boolean }[];
  once: number;
  monthly: number;
};

export function buildConfig(type: ConfigType, keys: string[]): Config {
  const chosen = Object.fromEntries(keys.map((k) => [k, true]));
  const t = CONFIG_TYPES[type];
  const lines = optionsFor(type)
    .filter((o) => chosen[o.key])
    .map((o) => ({ key: o.key, name: o.name, lei: optionPrice(o, type, chosen), monthly: !!o.monthly }));
  let once = t.base;
  let monthly = 0;
  for (const l of lines) {
    if (l.monthly) monthly += l.lei;
    else once += l.lei;
  }
  return { type, typeName: t.name, base: t.base, lines, once, monthly };
}

// Citește configurația din query (?tip=...&optiuni=a,b) sau din body; cheile necunoscute sunt ignorate
export function parseConfig(tip: unknown, optiuni: unknown): Config | null {
  if (!isConfigType(tip)) return null;
  const raw = Array.isArray(optiuni) ? optiuni.map(String) : String(optiuni ?? "").split(",");
  const valid = new Set(optionsFor(tip).map((o) => o.key));
  return buildConfig(tip, raw.map((k) => k.trim()).filter((k) => valid.has(k)).slice(0, 30));
}

export function configQuery(c: Config): string {
  return `tip=${c.type}&optiuni=${c.lines.map((l) => l.key).join(",")}`;
}

const lei = (n: number) => `${n.toLocaleString("ro-RO")} lei`;

// Rezumat pe un rând — pentru contract și subiecte de email
export function configSummary(c: Config): string {
  const extra = c.lines.filter((l) => !l.monthly).map((l) => l.name.replace(/ \(per .*\)$/, ""));
  return extra.length ? `${c.typeName} + ${extra.join(", ")}` : c.typeName;
}

export function configPriceText(c: Config): string {
  return c.monthly > 0 ? `${lei(c.once)} + ${lei(c.monthly)}/lună administrare` : lei(c.once);
}

// Tabelul din emailuri
export function configHtml(c: Config): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (name: string, val: string, bold = false) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;${bold ? "font-weight:700;" : ""}">${esc(name)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;white-space:nowrap;${bold ? "font-weight:700;" : ""}">${val}</td></tr>`;
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;">
    ${row(c.typeName, lei(c.base))}
    ${c.lines
      .filter((l) => !l.monthly)
      .map((l) => row(l.name.replace(/ — .*$/, ""), l.lei === 0 ? "inclus" : `+${lei(l.lei)}`))
      .join("")}
    ${row("Total (plată unică)", lei(c.once), true)}
    ${c.monthly > 0 ? row("Administrare lunară, de la lansare", `${lei(c.monthly)}/lună`, true) : ""}
  </table>`;
}
