"use client";

import { useRef, useState } from "react";

const LUNI = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

export function MonthToolbar({ luna, prev, next, bankConnected, isAdmin }: { luna: string; prev: string; next: string; bankConnected: boolean; isAdmin: boolean }) {
  const extrasRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [y, m] = luna.split("-").map(Number);

  async function sync() {
    setBusy(true);
    setMsg("Sincronizez banca, emailurile și StartCo… poate dura un minut.");
    const r = await fetch("/api/finante/sincronizare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ luna }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setMsg(j.error ?? "Sincronizarea a eșuat.");
      setBusy(false);
      return;
    }
    const parts: string[] = [];
    if (j.banca?.added != null) parts.push(`${j.banca.added} tranzacții noi`);
    else if (j.banca?.note || j.banca?.error) parts.push(`Banca: ${j.banca.note ?? j.banca.error}`);
    for (const e of j.email ?? []) parts.push(e.error ? `${e.email}: eroare` : `${e.email}: ${e.added} facturi noi`);
    if (j.startco?.added != null) parts.push(`StartCo: ${j.startco.added} facturi`);
    if (j.startco?.note) parts.push(`StartCo: ${j.startco.note}`);
    parts.push(`${j.potrivite ?? 0} potrivite automat`);
    setMsg(parts.join(" · "));
    setBusy(false);
    setTimeout(() => window.location.reload(), 1200);
  }

  async function uploadExtras(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    setMsg(`Citesc extrasul „${f.name}” și caut facturile… poate dura un minut.`);
    const fd = new FormData();
    fd.append("file", f);
    const r = await fetch("/api/finante/extras", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg(j.error ?? "Importul a eșuat.");
    const mails = (j.email ?? []).map((x: any) => (x.error ? `${x.email}: eroare` : `${x.email}: ${x.added} facturi noi`)).join(" · ");
    setMsg(`${j.added} tranzacții noi din ${j.total} (${j.from} → ${j.to}) · ${mails || "nicio căsuță de email adăugată"} · ${j.potrivite} potrivite automat`);
    setTimeout(() => (window.location.href = `/?luna=${String(j.to).slice(0, 7)}`), 1500);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <a href={`/?luna=${prev}`} className="rounded-full border border-white/15 px-3 py-1.5 text-sm hover:border-white/40">←</a>
        <h1 className="min-w-[180px] text-center text-xl font-bold capitalize">{LUNI[m - 1]} {y}</h1>
        <a href={`/?luna=${next}`} className="rounded-full border border-white/15 px-3 py-1.5 text-sm hover:border-white/40">→</a>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isAdmin ? (
          <>
            <input ref={extrasRef} type="file" accept=".csv,text/csv,application/pdf,.pdf" className="hidden" onChange={uploadExtras} />
            <button onClick={() => extrasRef.current?.click()} disabled={busy} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/40 disabled:opacity-50">
              Încarcă extrasul BT
            </button>
          </>
        ) : null}
        <button onClick={sync} disabled={busy} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-50">
          {busy ? "Se sincronizează…" : bankConnected ? "Sincronizează luna" : "Caută facturile din email"}
        </button>
        <a href={`/api/finante/export?luna=${luna}`} className="rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-600 px-4 py-2 text-sm font-semibold">
          Descarcă pachetul pentru contabilitate
        </a>
      </div>
      {msg ? <p className="w-full text-sm text-white/60">{msg}</p> : null}
    </div>
  );
}
