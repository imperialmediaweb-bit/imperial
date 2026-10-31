"use client";

import { useState } from "react";

type Props = {
  me: number;
  bank: { configured: boolean; connected: boolean; validUntil: string | null; lastSync: string | null; accounts: string[] };
  users: { id: number; email: string; name: string | null; role: string; active: boolean; last_login: string | null }[];
  boxes: { id: number; email: string; host: string; last_sync: string | null; last_error: string | null }[];
  startco: boolean;
  log: { at: string; user_email: string | null; action: string; detail: string | null; ip: string | null }[];
};

const card = "mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5";
const input = "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-orange-400";
const btn = "rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-600 px-4 py-2 text-sm font-semibold disabled:opacity-50";

async function post(url: string, body: unknown, method = "POST") {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: method === "DELETE" ? undefined : JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, ...j };
}

export function SettingsPanels({ me, bank, users, boxes, startco, log }: Props) {
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [box, setBox] = useState({ email: "", password: "", host: "" });
  const [acc, setAcc] = useState({ email: "", name: "", password: "" });
  const [paths, setPaths] = useState<string[] | null>(null);

  async function connectBank() {
    setBusy("bank");
    const r = await post("/api/finante/banca/conectare", {});
    if (r.url) window.location.href = r.url;
    else {
      setMsg((m) => ({ ...m, bank: r.error ?? "Nu a mers." }));
      setBusy(null);
    }
  }
  async function addBox(e: React.FormEvent) {
    e.preventDefault();
    setBusy("box");
    const r = await post("/api/finante/casute", box);
    setBusy(null);
    if (r.ok) window.location.reload();
    else setMsg((m) => ({ ...m, box: r.error ?? "Nu a mers." }));
  }
  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setBusy("user");
    const r = await post("/api/finante/utilizatori", { ...acc, role: "contabil" });
    setBusy(null);
    if (r.ok) window.location.reload();
    else setMsg((m) => ({ ...m, user: r.error ?? "Nu a mers." }));
  }
  async function loadPaths() {
    const r = await fetch("/api/finante/startco").then((x) => x.json()).catch(() => ({ paths: [] }));
    setPaths(r.paths ?? []);
  }

  return (
    <>
      <section className={card}>
        <h2 className="text-lg font-semibold">Banca Transilvania</h2>
        {!bank.configured ? (
          <p className="mt-2 text-sm text-amber-200">Lipsesc ENABLEBANKING_APP_ID și ENABLEBANKING_PRIVATE_KEY în Railway (serviciul imperial).</p>
        ) : bank.connected ? (
          <div className="mt-2 text-sm text-white/70">
            <p>✓ Conectată · conturi: {bank.accounts.join(", ") || "—"}</p>
            <p>Acces valabil până la: <b>{bank.validUntil ?? "—"}</b> · ultima sincronizare: {bank.lastSync ?? "niciodată"}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-white/60">Nu e conectată. Te autentifici o singură dată în aplicația BT; accesul e doar de citire.</p>
        )}
        {bank.configured ? (
          <button onClick={connectBank} disabled={busy === "bank"} className={`${btn} mt-4`}>
            {bank.connected ? "Reconectează" : "Conectează Banca Transilvania"}
          </button>
        ) : null}
        {msg.bank ? <p className="mt-2 text-sm text-rose-300">{msg.bank}</p> : null}
      </section>

      <section className={card}>
        <h2 className="text-lg font-semibold">Căsuțele de email cu facturi</h2>
        <p className="mt-1 text-sm text-white/55">
          Folosește o <b>parolă de aplicație</b>, nu parola contului. La Gmail: Contul Google → Securitate → Verificare în doi pași → Parole pentru aplicații. Se salvează criptat.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {boxes.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2">
              <span>
                {b.email} <span className="text-white/40">· {b.host}</span>
                <span className="block text-xs text-white/45">{b.last_error ? <span className="text-rose-300">Eroare: {b.last_error}</span> : `Ultima căutare: ${b.last_sync ?? "niciodată"}`}</span>
              </span>
              <button onClick={async () => { await post(`/api/finante/casute?id=${b.id}`, null, "DELETE"); window.location.reload(); }} className="text-xs text-white/40 hover:text-rose-300">Șterge</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addBox} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input className={input} type="email" placeholder="adresa@email.ro" value={box.email} onChange={(e) => setBox({ ...box, email: e.target.value })} required />
          <input className={input} type="password" placeholder="Parola de aplicație" value={box.password} onChange={(e) => setBox({ ...box, password: e.target.value })} required autoComplete="off" />
          <input className={input} placeholder="Server IMAP (gol = Gmail)" value={box.host} onChange={(e) => setBox({ ...box, host: e.target.value })} />
          <button disabled={busy === "box"} className={btn}>{busy === "box" ? "Verific…" : "Adaugă"}</button>
        </form>
        {msg.box ? <p className="mt-2 text-sm text-rose-300">{msg.box}</p> : null}
      </section>

      <section className={card}>
        <h2 className="text-lg font-semibold">Conturi în panou</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2">
              <span className={u.active ? "" : "text-white/35 line-through"}>
                {u.email} <span className="text-white/45">· {u.role === "admin" ? "administrator" : "contabil, doar citire"} · ultima intrare: {u.last_login ?? "niciodată"}</span>
              </span>
              {u.id !== me && u.active ? (
                <button onClick={async () => { await post(`/api/finante/utilizatori?id=${u.id}`, null, "DELETE"); window.location.reload(); }} className="text-xs text-white/40 hover:text-rose-300">Dezactivează</button>
              ) : null}
            </li>
          ))}
        </ul>
        <form onSubmit={addUser} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input className={input} type="email" placeholder="Emailul contabilei" value={acc.email} onChange={(e) => setAcc({ ...acc, email: e.target.value })} required />
          <input className={input} placeholder="Nume (opțional)" value={acc.name} onChange={(e) => setAcc({ ...acc, name: e.target.value })} />
          <input className={input} type="password" placeholder="Parolă (min. 12 caractere)" value={acc.password} onChange={(e) => setAcc({ ...acc, password: e.target.value })} required minLength={12} autoComplete="new-password" />
          <button disabled={busy === "user"} className={btn}>Creează cont</button>
        </form>
        {msg.user ? <p className="mt-2 text-sm text-rose-300">{msg.user}</p> : null}
      </section>

      <section className={card}>
        <h2 className="text-lg font-semibold">StartCo</h2>
        <p className="mt-1 text-sm text-white/55">{startco ? "Conectat (cheia stă doar pe server). Facturile emise de site se salvează automat aici." : "Lipsește STARTCO_TOKEN în Railway."}</p>
        {startco ? (
          <button onClick={loadPaths} className="mt-3 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40">Vezi ce oferă API-ul StartCo</button>
        ) : null}
        {paths ? <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-white/70">{paths.length ? paths.join("\n") : "API-ul nu a întors lista de căi."}</pre> : null}
      </section>

      <section className={card}>
        <h2 className="text-lg font-semibold">Jurnal de acces</h2>
        <div className="mt-3 max-h-80 overflow-auto text-xs">
          {log.map((l, i) => (
            <p key={i} className="border-b border-white/[0.06] py-1.5 text-white/60">
              <span className="text-white/40">{l.at}</span> · {l.user_email ?? "—"} · <b className="text-white/80">{l.action}</b> {l.detail ? `· ${l.detail}` : ""} <span className="text-white/30">· {l.ip}</span>
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
