"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await fetch("/api/finante/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) window.location.href = "/finante";
    else {
      setErr(j.error ?? "Nu a mers.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-orange-400" type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-orange-400" type="password" autoComplete="current-password" placeholder="Parolă" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-fuchsia-600 py-3 text-sm font-semibold disabled:opacity-60">
        {busy ? "Se verifică…" : "Intră"}
      </button>
    </form>
  );
}
