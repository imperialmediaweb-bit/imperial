"use client";

import type { FinUser } from "@/lib/finante/auth";

export function FinNav({ user, active }: { user: FinUser; active: "luna" | "setari" }) {
  async function logout() {
    await fetch("/api/finante/logout", { method: "POST" });
    window.location.href = "/login";
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
        {tab("/", "luna", "Luna")}
        {user.role === "admin" ? tab("/setari", "setari", "Setări") : null}
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
