"use client";

// Formularul cu datele site-ului — clientul completează AICI tot ce ne trebuie ca să-i construim site-ul.
// Linkuit de pe pagina de după semnarea contractului (/site-start/date?tip=...&optiuni=...&e=email).

import { useEffect, useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { parseConfig, configSummary, type Config } from "@/lib/configuratie";

const FIELDS_INIT = {
  email: "", companyName: "", industry: "", domain: "", description: "", services: "",
  schedule: "", phone: "", address: "", colors: "", hasLogo: "", photosWhere: "", extras: "", other: "",
  hasDomain: "", oferta: "",
};

const choice = (on: boolean) =>
  `flex-1 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${
    on ? "border-brand-orange bg-brand-orange/15 text-text" : "border-bg-border bg-bg-card/60 text-text-muted hover:border-brand-orange/50"
  }`;

export default function SiteStartDatePage() {
  const [f, setF] = useState(FIELDS_INIT);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof FIELDS_INIT, v: string) => setF((p) => ({ ...p, [k]: v }));
  // Ce a ales în ofertă — vine din linkul de după semnare
  const [config, setConfig] = useState<Config | null>(null);
  const logoOrdered = !!config?.lines.some((l) => l.key === "logo");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = parseConfig(q.get("tip"), q.get("optiuni"));
    setConfig(c);
    setF((p) => ({
      ...p,
      email: q.get("e") ?? p.email,
      oferta: c ? configSummary(c) : "",
      hasLogo: c?.lines.some((l) => l.key === "logo") ? "L-am comandat în ofertă" : p.hasLogo,
    }));
  }, []);

  async function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
      setError("Lasă emailul cu care ai semnat contractul — după el legăm comanda.");
      return;
    }
    if (!f.companyName.trim() || !f.description.trim()) {
      setError("Numele firmei și descrierea sunt obligatorii — restul se pot completa și din mers.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/site-start-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Ceva n-a mers — încearcă din nou.");
      setDone(true);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="container-app flex min-h-[70vh] items-center justify-center py-14">
        <div className="max-w-md rounded-3xl border border-green-500/40 bg-green-500/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-text">Am primit tot! 🎉</h1>
          <p className="mt-2 text-sm text-text-muted">
            Ne apucăm de site-ul tău. Mai rămâne un singur pas: <b className="text-text">urcă pozele</b> (logo,
            firma, lucrările) din contul tău — cardul „📸 Trimite-ne poze".
          </p>
          <a href="/cont" className="btn-primary mt-5 inline-flex">Urcă pozele în cont →</a>
          <p className="mt-3 text-[11px] text-text-subtle">Primești linkul de previzualizare pe email în câteva zile.</p>
        </div>
      </main>
    );
  }

  const L = ({ children }: { children: React.ReactNode }) => (
    <label className="mb-1.5 block text-sm font-semibold text-text">{children}</label>
  );

  return (
    <main className="container-app max-w-2xl py-12">
      <span className="chip">🏗️ Datele site-ului tău</span>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-text sm:text-3xl">
        Spune-ne ce să punem în site
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        5 minute, o singură dată. <b className="text-text">Textele site-ului le scriem NOI</b> din ce ne
        povestești aici — tu nu trebuie să scrii nimic „frumos", doar să ne spui despre firmă, cu cuvintele tale.
        Pozele și logo-ul le urci separat, din contul tău.
      </p>
      {config ? (
        <div className="mt-5 rounded-2xl border border-bg-border bg-bg-card/60 px-4 py-3 text-sm text-text">
          Ai ales: <b>{configSummary(config)}</b>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5">
        <div>
          <L>Emailul cu care ai semnat contractul *</L>
          <input className="input rounded-2xl" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="emailul comenzii" />
        </div>
        <div>
          <L>Numele firmei / brandului *</L>
          <input className="input rounded-2xl" value={f.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="ex: Pizzeria La Mario" />
        </div>
        <div>
          <L>Domeniul de activitate *</L>
          <input className="input rounded-2xl" value={f.industry} onChange={(e) => set("industry", e.target.value)} placeholder="ex: restaurant, service auto, salon, construcții, avocatură..." />
        </div>
        <div>
          <L>Adresa site-ului (domeniul)</L>
          <div className="mb-2 flex gap-2">
            {["Am deja domeniu", "Nu am încă"].map((o) => (
              <button key={o} type="button" onClick={() => set("hasDomain", o)} className={choice(f.hasDomain === o)}>
                {o}
              </button>
            ))}
          </div>
          <input className="input rounded-2xl" value={f.domain} onChange={(e) => set("domain", e.target.value)}
            placeholder={
              f.hasDomain === "Am deja domeniu"
                ? "ex: firma-mea.ro — și unde e înregistrat, dacă știi (ROTLD, GoDaddy...)"
                : "ex: pizzerialamario.ro — o verificăm și o înregistrăm noi (inclusă în administrare)"
            } />
          {f.hasDomain === "Am deja domeniu" ? (
            <p className="mt-1.5 text-[11px] text-text-subtle">Te ajutăm noi să-l legi de site-ul nou — îți spunem exact ce ai de făcut.</p>
          ) : null}
        </div>
        <div>
          <L>Descrie firma ta — ce faci, pentru cine, de când *</L>
          <textarea className="input min-h-[110px] resize-y rounded-2xl" maxLength={2000} value={f.description} onChange={(e) => set("description", e.target.value)}
            placeholder="Cu cuvintele tale: ce face firma, ce te diferențiază, povestea pe scurt..." />
        </div>
        <div>
          <L>Serviciile / produsele (listă simplă)</L>
          <textarea className="input min-h-[90px] resize-y rounded-2xl" maxLength={1500} value={f.services} onChange={(e) => set("services", e.target.value)}
            placeholder="ex: Pizza la cuptor cu lemne · Paste proaspete · Livrare în oraș · Meniul zilei" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <L>Program de lucru</L>
            <input className="input rounded-2xl" value={f.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="ex: L-V 9-18, S 9-14" />
          </div>
          <div>
            <L>Telefonul de afișat pe site</L>
            <input className="input rounded-2xl" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="ex: 07xx xxx xxx" />
          </div>
        </div>
        <div>
          <L>Adresa punctului de lucru (pentru hartă)</L>
          <input className="input rounded-2xl" value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="strada, numărul, orașul — sau «doar online»" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <L>Culorile brandului / cum vrei să se simtă</L>
            <input className="input rounded-2xl" value={f.colors} onChange={(e) => set("colors", e.target.value)} placeholder="ex: verde închis + auriu, elegant" />
          </div>
          <div>
            <L>Logo</L>
            <div className="flex gap-2">
              {(logoOrdered ? ["L-am comandat în ofertă"] : ["Am logo — îl urc la poze", "Nu am logo"]).map((o) => (
                <button key={o} type="button" onClick={() => set("hasLogo", o)} className={choice(f.hasLogo === o)}>
                  {o}
                </button>
              ))}
            </div>
            {f.hasLogo === "Nu am logo" ? (
              <p className="mt-1.5 text-[11px] text-text-subtle">Ți-l putem crea noi: +300 lei. Scrie-ne mai jos dacă îl vrei.</p>
            ) : null}
          </div>
        </div>
        <div>
          <L>Pozele — ce ai și unde le-ai vrea?</L>
          <textarea className="input min-h-[70px] resize-y rounded-2xl" maxLength={600} value={f.photosWhere} onChange={(e) => set("photosWhere", e.target.value)}
            placeholder="ex: poze cu localul pe Acasă, echipa pe Despre, lucrările la Servicii... sau scrie «folosiți voi poze» și alegem noi imagini profesionale de stock, potrivite domeniului tău — gratuit" />
          <p className="mt-1.5 text-[11px] text-text-subtle">
            📷 Nu ai poze bune? Nicio problemă — completăm cu imagini profesionale de stock (incluse), iar pozele tale reale le poți adăuga oricând mai târziu.
          </p>
        </div>
        <div>
          <L>Vrei ceva în plus față de oferta ta?</L>
          <textarea className="input min-h-[70px] resize-y rounded-2xl" maxLength={800} value={f.extras} onChange={(e) => set("extras", e.target.value)}
            placeholder="ex: o pagină în plus cu galerie, a doua limbă... scrie ce vrei și ce să conțină" />
          <p className="mt-1.5 text-[11px] text-text-subtle">Îți spunem prețul în scris înainte să ne apucăm; se facturează separat.</p>
        </div>
        <div>
          <L>Altceva ce trebuie să știm?</L>
          <textarea className="input min-h-[70px] resize-y rounded-2xl" maxLength={1000} value={f.other} onChange={(e) => set("other", e.target.value)}
            placeholder="site-uri care îți plac, ce să NU punem, orice detaliu..." />
        </div>

        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">⚠️ {error}</p>}

        <button type="button" onClick={submit} disabled={busy} className="btn-primary justify-center">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Trimite datele — ne apucăm de site
        </button>
        <p className="text-center text-[11px] text-text-subtle">
          După trimitere: urci pozele și logo-ul din cont → primești linkul de previzualizare pe email.
        </p>
      </div>
    </main>
  );
}
