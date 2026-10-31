"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare.");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Eroare.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-5 py-20">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-gradient shadow-glow-orange">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-text">
            Panou Admin
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Imperial Media — brief-uri primite
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-bg-border bg-bg-card p-6 shadow-card"
        >
          <label className="label" htmlFor="password">
            Parolă admin
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="btn-primary mt-5 w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verific...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Intră în admin
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-text-subtle">
          Pentru acces, parola e setată în Railway → Variables → ADMIN_PASSWORD
        </p>
      </div>
    </main>
  );
}
