"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Palette,
  User,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { packages, type PackageKey } from "@/lib/packages";

type FormState = {
  // Step 1 — date contact
  name: string;
  phone: string;
  email: string;
  // Step 2 — despre proiect
  selectedPackage: PackageKey | "personalizat";
  industry: string;
  currentSite: string; // url existent sau "nu am"
  pages: string;
  deadline: string;
  // Step 3 — design + detalii
  hasLogo: "da" | "nu" | "";
  colorsPreference: string;
  features: string[];
  inspiration: string;
  message: string;
  // honeypot
  hp: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  selectedPackage: "website",
  industry: "",
  currentSite: "",
  pages: "",
  deadline: "",
  hasLogo: "",
  colorsPreference: "",
  features: [],
  inspiration: "",
  message: "",
  hp: "",
};

const featureOptions = [
  "Blog",
  "Rezervări online",
  "Plăți online",
  "Multilimbă",
  "CRM / Newsletter",
  "Zonă de membri",
  "Formular contact avansat",
  "Galerie / Portofoliu",
  "Hartă Google Maps",
  "Integrare social media",
];

const STEP_TITLES = [
  { icon: User, label: "Date contact" },
  { icon: Briefcase, label: "Despre proiect" },
  { icon: Palette, label: "Design și detalii" },
];

export function BriefForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Ascultă evenimente de la cardurile de pricing — preselectează pachet
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<PackageKey>;
      setData((d) => ({ ...d, selectedPackage: ce.detail }));
    };
    window.addEventListener("brief:setPackage", handler);
    return () => window.removeEventListener("brief:setPackage", handler);
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleFeature = (f: string) =>
    setData((d) => ({
      ...d,
      features: d.features.includes(f)
        ? d.features.filter((x) => x !== f)
        : [...d.features, f],
    }));

  const isStepValid = useMemo(() => {
    if (step === 0) {
      const phoneOk = /^[\d\s+()\-]{7,}$/.test(data.phone);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      return data.name.trim().length >= 2 && phoneOk && emailOk;
    }
    if (step === 1) {
      return (
        !!data.selectedPackage && data.industry.trim().length >= 2
      );
    }
    return true;
  }, [step, data]);

  async function submit() {
    if (data.hp) return; // honeypot
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "A apărut o eroare. Reîncearcă, te rugăm.");
      }
      router.push("/multumim");
    } catch (e: any) {
      setError(e?.message ?? "Eroare necunoscută.");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / 3) * 100;

  return (
    <section id="brief" className="section relative">
      <div className="container-app max-w-3xl">
        <div className="text-center">
          <span className="chip">Briefing rapid</span>
          <h2 className="section-title mt-4 mx-auto">
            Spune-ne <span className="text-gradient">ce vrei</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Completează cei 3 pași și revenim cu oferta personalizată în
            maximum 24 de ore. Durează aproximativ 2 minute.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-10">
          {/* Progress bar */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              {STEP_TITLES.map((s, i) => {
                const Active = s.icon;
                const reached = i <= step;
                return (
                  <div
                    key={s.label}
                    className={`flex items-center gap-2 text-xs font-medium transition ${
                      reached ? "text-text" : "text-text-subtle"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full transition ${
                        i < step
                          ? "bg-orange-gradient text-white"
                          : i === step
                            ? "border-2 border-brand-orange bg-brand-orange/10 text-brand-orange"
                            : "border border-bg-border bg-bg-soft text-text-subtle"
                      }`}
                    >
                      {i < step ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        <Active className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-soft">
              <motion.div
                className="h-full bg-orange-gradient"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={data.hp}
            onChange={(e) => update("hp", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="mt-8 min-h-[340px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="label">Nume complet *</label>
                    <input
                      className="input"
                      placeholder="Ion Popescu"
                      value={data.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Telefon *</label>
                    <input
                      className="input"
                      type="tel"
                      placeholder="0712 345 678"
                      value={data.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="email@exemplu.ro"
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-5"
                >
                  <div>
                    <label className="label">Pachet de interes *</label>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        ...packages.map((p) => ({
                          key: p.key,
                          name: p.name,
                          price: p.price,
                        })),
                        {
                          key: "personalizat" as const,
                          name: "Altceva / Personalizat",
                          price: "—",
                        },
                      ].map((opt) => {
                        const active = data.selectedPackage === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() =>
                              update("selectedPackage", opt.key as any)
                            }
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                              active
                                ? "border-brand-orange bg-brand-orange/10 text-text"
                                : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-purple/50 hover:text-text"
                            }`}
                          >
                            <span className="font-medium">{opt.name}</span>
                            <span
                              className={`text-xs ${active ? "text-brand-orange" : "text-text-subtle"}`}
                            >
                              {opt.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label">Domeniu de activitate *</label>
                      <input
                        className="input"
                        placeholder="ex: stomatologie, restaurant, magazin haine"
                        value={data.industry}
                        onChange={(e) => update("industry", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Ai deja site? (opțional)</label>
                      <input
                        className="input"
                        placeholder="link sau lasă gol"
                        value={data.currentSite}
                        onChange={(e) => update("currentSite", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Număr pagini estimate</label>
                      <select
                        className="input"
                        value={data.pages}
                        onChange={(e) => update("pages", e.target.value)}
                      >
                        <option value="">Alege...</option>
                        <option>1-5 pagini</option>
                        <option>5-15 pagini</option>
                        <option>15+ pagini</option>
                        <option>Nu știu încă</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Termen dorit</label>
                      <select
                        className="input"
                        value={data.deadline}
                        onChange={(e) => update("deadline", e.target.value)}
                      >
                        <option value="">Alege...</option>
                        <option>Cât mai repede</option>
                        <option>În 2-4 săptămâni</option>
                        <option>În 1-2 luni</option>
                        <option>Flexibil</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label">Ai logo / identitate vizuală?</label>
                      <div className="flex gap-2">
                        {(["da", "nu"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update("hasLogo", opt)}
                            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                              data.hasLogo === opt
                                ? "border-brand-orange bg-brand-orange/10 text-text"
                                : "border-bg-border bg-bg-soft/60 text-text-muted hover:text-text"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">Culori preferate</label>
                      <input
                        className="input"
                        placeholder="ex: albastru și alb, sau dă-mi sugestii"
                        value={data.colorsPreference}
                        onChange={(e) =>
                          update("colorsPreference", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Ce funcționalități vrei?</label>
                    <div className="flex flex-wrap gap-2">
                      {featureOptions.map((f) => {
                        const active = data.features.includes(f);
                        return (
                          <button
                            type="button"
                            key={f}
                            onClick={() => toggleFeature(f)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                              active
                                ? "border-brand-orange bg-brand-orange/15 text-text"
                                : "border-bg-border bg-bg-soft/60 text-text-muted hover:border-brand-purple/50 hover:text-text"
                            }`}
                          >
                            {active && (
                              <Check className="mr-1 inline h-3 w-3" strokeWidth={3} />
                            )}
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Site-uri care îți plac (inspirație, opțional)
                    </label>
                    <input
                      className="input"
                      placeholder="ex: link-uri, nume de site-uri, brand-uri"
                      value={data.inspiration}
                      onChange={(e) => update("inspiration", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label">Detalii suplimentare</label>
                    <textarea
                      className="input min-h-[100px] resize-y"
                      placeholder="Spune-ne orice altceva e important pentru proiect..."
                      value={data.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-bg-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-ghost"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </button>
            ) : (
              <span className="text-xs text-text-subtle">
                Pasul {step + 1} din 3
              </span>
            )}

            {step < 2 ? (
              <button
                type="button"
                disabled={!isStepValid}
                onClick={() => setStep((s) => s + 1)}
                className="btn-primary"
              >
                Continuă
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={submit}
                className="btn-primary"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    Trimite briefingul
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
