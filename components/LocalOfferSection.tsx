// Oferta locală pe județ, în capul paginii /creare-site-web/<oraș>.
// Reclamele de Facebook din județ duc aici; brief-ul de jos estimează în lei.

import Link from "next/link";
import { ArrowRight, CheckCircle2, Gift, MessageCircle, Zap } from "lucide-react";
import { BriefChat } from "@/components/BriefChat";
import { DemoAssistant } from "@/components/DemoAssistant";
import { LocalConfigurator } from "@/components/LocalConfigurator";
import { siteConfig } from "@/lib/site";
import {
  type LocalOffer,
  LOCAL_DEADLINE_DAYS,
  LOCAL_EXTRAS,
  LOCAL_INCLUDED,
  LOCAL_MONTHLY,
  LOCAL_SITE_PRICE,
  localGifts,
} from "@/lib/local-offer";

const price = LOCAL_SITE_PRICE.toLocaleString("ro-RO");

export function LocalOfferSection({ offer }: { offer: LocalOffer }) {
  const whatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Bună! Vreau un site pentru afacerea mea din ${offer.city}.`
  )}`;

  return (
    <>
      {/* ─── HERO OFERTĂ ─── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.12)_0%,transparent_55%)]" />
        <div className="container-app relative z-10 text-center">
          <span className="chip">📍 Ofertă pentru afaceri din {offer.city}</span>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Site pentru afacerea ta din {offer.city} —{" "}
            <span className="text-gradient">{price} lei</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted sm:text-lg">
            Gata în maximum {LOCAL_DEADLINE_DAYS} zile. Plus un asistent care răspunde clienților tăi
            non-stop, articol în {offer.newspaper.name} și campanie pe Facebook — cadou.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#estimare" className="btn-primary text-base">
              <Zap className="h-5 w-5" />
              Află prețul în 2 minute
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener" className="btn-ghost">
              <MessageCircle className="h-4 w-4" />
              Scrie-ne pe WhatsApp
            </a>
          </div>
          <p className="mt-4 text-xs text-text-subtle">
            Macheta în 5 zile · plată cu cardul sau transfer · factură automată
          </p>
        </div>
      </section>

      {/* ─── CADOURI ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app">
          <h2 className="section-title mx-auto text-center">
            <Gift className="mr-2 inline h-7 w-7 text-brand-orange" />
            Primești <span className="text-gradient">cadou</span> la orice site
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {localGifts(offer).map((g) => (
              <div key={g.title} className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <p className="font-semibold text-text">🎁 {g.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO ASISTENT ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">
            Încearcă <span className="text-gradient">asistentul</span> pe care îl primești
          </h2>
          <p className="section-subtitle mx-auto">
            Alege tipul afacerii și scrie ca un client. Așa va răspunde și pe site-ul tău — la orice oră.
          </p>
          <div className="mt-8">
            <DemoAssistant />
          </div>
        </div>
      </section>

      {/* ─── CE INCLUDE + OPȚIUNI ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-orange/30 bg-bg-card/60 p-6">
            <h3 className="font-display text-xl font-bold text-text">Ce include site-ul de {price} lei</h3>
            <ul className="mt-4 space-y-2.5">
              {LOCAL_INCLUDED.map((l) => (
                <li key={l} className="flex items-start gap-2 text-sm text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-bg-soft/50 p-3 text-xs leading-relaxed text-text-muted">
              Plus abonamentul „Site activ" de {LOCAL_MONTHLY} lei/lună (prima lună gratuită): găzduire,
              asistentul AI, backup, modificări mici și raport lunar.
            </p>
            <a href="#estimare" className="btn-primary mt-4 w-full justify-center">
              Alege ce vrei și vezi prețul
            </a>
          </div>
          <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-6">
            <h3 className="font-display text-xl font-bold text-text">Vrei mai mult? Adaugi doar ce-ți trebuie</h3>
            <ul className="mt-4 divide-y divide-bg-border/60">
              {LOCAL_EXTRAS.map((e) => (
                <li key={e.label} className="py-2.5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text">{e.label}</span>
                    <span className="whitespace-nowrap font-semibold text-text">{e.price}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-text-subtle">{e.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── PAȘI + PROIECTE LOCALE ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app">
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              ["1", "Azi", "Alegi ce vrei pe site, mai jos, sau ne scrii pe WhatsApp."],
              ["2", "În 5 zile", "Vezi site-ul tău pe o adresă de probă și ceri modificări."],
              ["3", `În max. ${LOCAL_DEADLINE_DAYS} zile`, `Site-ul e live, iar ${offer.newspaper.name} anunță lansarea.`],
            ].map(([nr, title, text]) => (
              <div key={nr} className="rounded-2xl border border-bg-border bg-bg-card/60 p-5 text-center">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-orange-gradient font-bold text-white">
                  {nr}
                </span>
                <p className="mt-3 font-semibold text-text">{title}</p>
                <p className="mt-1 text-sm text-text-muted">{text}</p>
              </div>
            ))}
          </div>
          {offer.projects.length > 0 && (
            <div className="mt-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-subtle">
                Site-uri făcute de noi în {offer.county}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {offer.projects.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="rounded-full border border-bg-border px-4 py-2 text-sm text-text-muted transition hover:border-brand-orange/50 hover:text-text"
                  >
                    {p.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── BRIEF: CONFIGURATORUL ─── */}
      <section id="estimare" className="section scroll-mt-20 border-t border-bg-border/40">
        <div className="container-app">
          <div className="text-center">
            <h2 className="section-title mx-auto">
              Alege ce vrei — <span className="text-gradient">vezi prețul pe loc</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Bifezi, ne spui despre afacere, încarci logo-ul și pozele. Nu plătești nimic acum.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <LocalConfigurator offer={offer} />
          </div>
        </div>
      </section>

      {/* ─── ÎNTREBĂRI: ASISTENTUL ─── */}
      <section className="section border-t border-bg-border/40">
        <div className="container-app">
          <div className="text-center">
            <h2 className="section-title mx-auto">
              Ai întrebări? <span className="text-gradient">Întreabă-l pe Imperial AI</span>
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <BriefChat offer={offer} />
          </div>
        </div>
      </section>
    </>
  );
}
