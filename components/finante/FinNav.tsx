"use client";

import type { FinUser } from "@/lib/finante/auth";

type Firma = { id: number; name: string };

export function FinNav({ user, active, firme = [], firma, luna }: { user: FinUser; active: "luna" | "setari"; firme?: Firma[]; firma?: number; luna?: string }) {
  function alegeFirma(id: string) {
    document.cookie = `fin_firma=${id}; path=/; max-age=31536000; samesite=strict; secure`;
    window.location.href = `/finante?firma=${id}${luna ? `&luna=${luna}` : ""}`;
  }
  async function logout() {
    await fetch("/api/finante/logout", { method: "POST" });
    window.location.href = "/finante/login";
  }
  const tab = (href: string, key: string, label: string) => (
    <a href={href} className={`rounded-full px-4 py-2 text-sm font-medium ${active === key ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
      {label}
    </a>
  );
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div className="flex items-center gap-2">
        <span className="mr-3 text-lg font-bold">Imperial <span className="text-orange-400">Finanțe</span></span>
        {tab("/finante", "luna", "Luna")}
        {user.role === "admin" ? tab("/finante/setari", "setari", "Setări") : null}
        {firme.length > 1 && firma ? (
          <select aria-label="Firma" value={firma} onChange={(e) => alegeFirma(e.target.value)} className="ml-3 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-sm font-semibold">
            {firme.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        ) : firme.length === 1 ? (
          <span className="ml-3 text-sm font-semibold text-white/80">{firme[0].name}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-sm text-white/60">
        <span>
          {user.email} · {user.role === "admin" ? "administrator" : "contabil (doar citire)"}
        </span>
        <button onClick={logout} className="rounded-full border border-white/15 px-3 py-1.5 hover:border-white/40">Ieșire</button>
      </div>
    </header>
  );
}
