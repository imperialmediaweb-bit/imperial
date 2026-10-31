import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Newspaper, Zap } from "lucide-react";
import { DespreHero } from "@/components/despre/DespreHero";
import { ReasonsCards } from "@/components/despre/ReasonsCards";
import { Testimonials } from "@/components/Testimonials";
import { IconBadge } from "@/components/IconBadge";

export const metadata = {
  title: "Despre noi — Imperial Media",
  description:
    "Cu peste 10 ani experiență, 384+ proiecte livrate și parteneriatul cu rețeaua Media Expres, de 50 de ziare online, Imperial Media construiește site-uri, magazine online și campanii care aduc clienți reali.",
};

/* povestea, pe firul de lumină */
const milestones = [
  {
    k: "2014",
    title: "Începutul",
    text: "Imperial Media a pornit în 2014 ca o echipă mică de designeri și programatori, cu un obiectiv simplu: site-uri care aduc rezultate reale pentru afacerile locale.",
  },
  {
    k: "Creșterea",
    title: "Din recomandare în recomandare",
    text: "Am crescut în primul rând din recomandări. Un restaurant care și-a dublat rezervările, o clinică cu programări online zilnice, un magazin local care astăzi livrează în toată țara.",
  },
  {
    k: "Rețeaua",
    title: "Parteneri cu 50 de ziare online",
    text: "Suntem parteneri cu Media Expres, o rețea de 50 de publicații online locale și naționale. Clienții noștri beneficiază de articole editoriale care cresc vizibilitatea și autoritatea în Google.",
  },
  {
    k: "Azi",
    title: "384+ proiecte livrate",
    text: "Astăzi construim totul de la zero, pe tehnologii de ultimă generație, folosite de YouTube și Netflix, cu 3D și inteligență artificială, și oferim tot ce ține de prezența online: design, dezvoltare, SEO, presă și administrare.",
  },
];

const services = [
  ["01", "Web design & site-uri de prezentare", "Platforme moderne, rapide, scrise de la zero."],
  ["02", "Magazine online", "Plăți integrate, livrare, panouri de administrare intuitive."],
  ["03", "SEO & vizibilitate AI", "Trafic organic constant + prezență în ChatGPT/Gemini."],
  ["04", "Promovare în presă", "Articole în rețeaua parteneră Media Expres, de 50 de ziare, cu linkuri dofollow."],
  ["05", "Social media & email", "Campanii targetate și automatizări care mențin relația cu clienții."],
  ["06", "Administrare & mentenanță", "Backup-uri, actualizări și suport tehnic permanent."],
];

export default function DesprePage() {
  return (
    <main className="bg-[#050507]">
      <DespreHero />

      {/* ───── POVESTEA — pe firul de lumină ───── */}
      <section className="section relative">
        <div className="container-app">
          <div className="max-w-xl">
            <span className="chip">Povestea noastră</span>
            <h2 className="section-title mt-4">
              Un deceniu, <span className="font-serifd italic text-gradient">pe scurt.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="relative max-w-3xl">
            {/* firul vertical gradient */}
            <div className="absolute bottom-4 left-[7px] top-2 w-px bg-gradient-to-b from-brand-orange via-brand-magenta to-brand-purple opacity-70" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div key={m.k} className="relative pl-10">
                  <span
                    className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 bg-[#050507]"
                    style={{
                      borderColor: ["#FF9A1A", "#FF2E9A", "#B04CF7", "#8B2FF7"][i],
                      boxShadow: `0 0 14px ${["#FF9A1A", "#FF2E9A", "#B04CF7", "#8B2FF7"][i]}80`,
                    }}
                  />
                  <span className="font-jmono text-[10px] uppercase tracking-[0.28em] text-white/50">
                    {m.k}
                  </span>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-text">{m.title}</h3>
                  <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-text-muted">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* colajul foto din atelier */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="group relative rotate-[1.5deg] overflow-hidden rounded-2xl border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/proiecte/clinica-sf-gheorghe/home.jpg" alt="Site-ul Clinicii Sf. Gheorghe — lucrare reală" className="shot-img block w-full" />
                <div className="shot-fade" />
                <span className="absolute bottom-3 left-4 font-jmono text-[9px] uppercase tracking-[0.2em] text-white/80">Clinica Sf. Gheorghe — livrat</span>
              </div>
              <div className="group relative -rotate-2 overflow-hidden rounded-2xl border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/proiecte/sarami/home.jpg" alt="Site-ul Sarami Production — lucrare reală" className="shot-img block w-full" />
                <div className="shot-fade" />
                <span className="absolute bottom-3 left-4 font-jmono text-[9px] uppercase tracking-[0.2em] text-white/80">Sarami Production — livrat</span>
              </div>
            </div>
          </div>
          </div>

          <blockquote className="mt-16 max-w-2xl border-l-2 border-brand-magenta/60 pl-6 font-serifd text-2xl italic leading-snug text-white/85 sm:text-[1.7rem]">
            „Un site bun nu se măsoară în pagini, ci în clienții pe care îi aduce.”
          </blockquote>
        </div>
      </section>

      {/* ───── DE CE NOI ───── */}
      <section className="section relative">
        <div className="container-app">
          <div className="max-w-xl">
            <span className="chip">De ce Imperial Media</span>
            <h2 className="section-title mt-4">
              De ce să <span className="font-serifd italic text-gradient">lucrezi cu noi.</span>
            </h2>
          </div>
          <ReasonsCards />
        </div>
      </section>

      {/* ───── BANDA FOTO — atelierul noaptea ───── */}
      <section className="relative h-[340px] overflow-hidden sm:h-[420px]">
        <Image src="/video/hero-poster.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,7,0.6)_100%)]" />
        <div className="container-app relative z-10 flex h-full items-end pb-10">
          <p className="max-w-md font-serifd text-xl italic leading-snug text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)] sm:text-2xl">
            Atenție la <span className="text-gradient">detalii</span>, de la machetă la lansare.
          </p>
        </div>
      </section>

      {/* ───── CE FACEM — rânduri editoriale ───── */}
      <section className="section relative">
        <div className="container-app">
          <div className="max-w-xl">
            <span className="chip">Ce facem</span>
            <h2 className="section-title mt-4">
              Totul, <span className="font-serifd italic text-gradient">sub un singur acoperiș.</span>
            </h2>
          </div>
          <div className="mt-10 max-w-3xl border-t border-white/[0.07]">
            {services.map(([n, title, text]) => (
              <div
                key={n}
                className="group flex items-baseline gap-5 border-b border-white/[0.07] py-4 transition hover:border-brand-magenta/40"
              >
                <span className="font-jmono text-[11px] text-white/45">{n}</span>
                <span className="font-display text-base font-semibold text-text sm:text-lg">
                  {title}
                </span>
                <span className="ml-auto hidden max-w-[300px] text-right text-[12.5px] leading-snug text-white/60 sm:block">
                  {text}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/servicii"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-text transition hover:border-brand-orange/70"
          >
            Vezi serviciile și prețurile
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ───── REȚEAUA DE PRESĂ ───── */}
      <section className="section relative">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-2xl border border-bg-border glass-card p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-magenta/10 blur-3xl" />
            <div className="flex flex-wrap items-center gap-6">
              <IconBadge icon={Newspaper} className="!h-14 !w-14" />
              <div className="min-w-[240px] flex-1">
                <h2 className="font-display text-2xl font-bold text-text">
                  Suntem parteneri cu rețeaua <span className="text-gradient">Media Expres</span> — 50 de ziare online.
                </h2>
                <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-text-muted">
                  Publicații locale și naționale în toată România. Articolele despre clienții noștri
                  aduc vizibilitate reală și linkuri valoroase pentru poziționarea în Google.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-magenta">
                <BadgeCheck className="h-5 w-5" />
                Partener de presă
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ───── CTA ───── */}
      <section className="section relative">
        <div className="container-app text-center">
          <span className="font-jmono text-[10px] uppercase tracking-[0.3em] text-white/60">
            Hai să vorbim
          </span>
          <h2 className="section-title mt-5 !text-4xl sm:!text-5xl">
            Ai un proiect în minte? <span className="font-serifd italic text-gradient">Hai să-l discutăm.</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/estimare"
              className="inline-flex items-center gap-2.5 rounded-full bg-orange-gradient px-8 py-4 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.05]"
            >
              <Zap className="h-5 w-5" />
              Calculează prețul pe loc
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-medium text-text transition hover:border-brand-orange/70"
            >
              Scrie-ne direct
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
