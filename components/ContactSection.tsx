"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { Aurora } from "./effects/Aurora";

export function ContactSection() {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    siteType: "",
    message: "",
    hp: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const update = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (data.hp) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          selectedPackage: data.siteType || "personalizat",
          industry: "",
          message: data.message,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "A apărut o eroare. Reîncearcă.");
      }
      router.push("/multumim");
    } catch (e: any) {
      setError(e?.message ?? "Eroare necunoscută.");
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section relative overflow-hidden">
      <Aurora />
      <div className="container-app relative z-10 grid items-stretch gap-8 lg:grid-cols-2">
        {/* LEFT — Contactează-ne */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex h-full flex-col rounded-3xl border border-bg-border bg-bg-card/40 p-7 backdrop-blur sm:p-9"
        >
          <span className="chip self-start">Scrie-ne</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
            Contactează-ne pentru{" "}
            <span className="text-gradient">soluții digitale eficiente</span>
          </h2>
          <p className="mt-4 text-base text-text-muted">
            Consultanță, oferte personalizate și suport rapid. Echipa noastră
            te ajută în maximum 24 de ore.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="group flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-card p-4 transition hover:border-brand-orange hover:bg-bg-card/80"
            >
              <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110">
                <Phone className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                  Sună acum
                </p>
                <p className="text-base font-semibold text-text">
                  {siteConfig.phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-card p-4 transition hover:border-brand-orange hover:bg-bg-card/80"
            >
              <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110">
                <Mail className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                  Email
                </p>
                <p className="truncate text-base font-semibold text-text">
                  {siteConfig.email}
                </p>
              </div>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Bună! Am văzut site-ul Imperial Media și aș vrea să discutăm despre un site.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/[0.07] p-4 transition hover:border-[#25D366] hover:bg-[#25D366]/[0.12]"
            >
              <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-[#25D366] text-white transition group-hover:scale-110">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                  WhatsApp — cel mai rapid
                </p>
                <p className="text-base font-semibold text-text">
                  Scrie-ne direct, poți trimite și poze
                </p>
              </div>
            </a>

          </div>

          {/* Spacer to fill column height */}
          <div className="mt-auto pt-7">
            <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4">
              <p className="text-sm text-text">
                💬 <strong className="text-brand-orange">Răspuns garantat în 24h</strong> sau te contactăm
                gratuit pentru consultanță.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Form rapid */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex h-full flex-col rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-7 shadow-card sm:p-9"
        >
          <div className="mb-6">
            <span className="chip">Contact rapid</span>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-text sm:text-3xl">
              Suntem aici pentru orice întrebare
            </h3>
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

          <div className="grid gap-4">
            <div>
              <label className="label" htmlFor="contact-nume">Nume *</label>
              <input
                id="contact-nume"
                required
                autoComplete="name"
                className="input"
                placeholder="Numele tău"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="contact-telefon">Telefon *</label>
                <input
                  id="contact-telefon"
                  required
                  type="tel"
                  autoComplete="tel"
                  className="input"
                  placeholder="0712 345 678"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="contact-email">
                  Email <span className="font-normal text-text-subtle">(opțional)</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="input"
                  placeholder="email@exemplu.ro"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="contact-tip-site">
                Tip site <span className="font-normal text-text-subtle">(opțional)</span>
              </label>
              <select
                id="contact-tip-site"
                className="input"
                value={data.siteType}
                onChange={(e) => update("siteType", e.target.value)}
              >
                <option value="">Alege tipul de site</option>
                <option value="website">Website Prezentare</option>
                <option value="shop">Magazin Online</option>
                <option value="promo">Promovare</option>
                <option value="admin">Administrare</option>
                <option value="personalizat">Personalizat / Altceva</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="contact-mesaj">Mesaj (opțional)</label>
              <textarea
                id="contact-mesaj"
                className="input min-h-[80px] resize-y"
                placeholder="Spune-ne despre proiectul tău..."
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-6 w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Se trimite...
              </>
            ) : (
              <>
                Trimite cererea
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
