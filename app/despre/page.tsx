import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { Skills } from "@/components/Skills";
import { Marquee } from "@/components/Marquee";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorks } from "@/components/HowItWorks";
import { Aurora } from "@/components/effects/Aurora";
import { Meteors } from "@/components/effects/Meteors";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Despre noi — Imperial Media",
  description:
    "Cu peste 10 ani experiență și 240+ clienți în România și străinătate, Imperial Media livrează soluții digitale complete: web design, magazine online, SEO, promovare și mentenanță.",
};

const stats = [
  { n: "10+", label: "Ani experiență" },
  { n: "240+", label: "Clienți mulțumiți" },
  { n: "200+", label: "Proiecte livrate" },
  { n: "50+", label: "Publicații partenere" },
];

const reasons = [
  {
    title: "Profesionalism dovedit",
    text: "Am trecut prin multiple etape de dezvoltare digitală și am rămas mereu conectați la noile tehnologii.",
  },
  {
    title: "Rezultate reale",
    text: "Site-uri funcționale, magazine online performante, campanii de promovare care au adus conversii.",
  },
  {
    title: "Încrederea clienților",
    text: "Peste 240 de parteneri din România și din străinătate au ales să colaboreze cu noi.",
  },
  {
    title: "Expertiză diversă",
    text: "Fiecare membru al echipei aduce know-how în web design, dezvoltare, marketing digital, SEO, content și project management.",
  },
];

const services = [
  {
    title: "Web Design & Site-uri de Prezentare",
    text: "Creăm platforme moderne, responsive, rapide și adaptate nevoilor fiecărui client.",
  },
  {
    title: "Magazine Online & E-commerce",
    text: "Soluții complete de vânzare online cu plăți integrate, sisteme de livrare și panouri de administrare intuitive.",
  },
  {
    title: "SEO & Optimizare Conținut",
    text: "Strategii SEO care cresc vizibilitatea afacerilor și aduc trafic organic constant.",
  },
  {
    title: "Promovare în Social Media",
    text: "Administrăm pagini de Facebook și Instagram, creăm campanii targetate și gestionăm conținut care atrage.",
  },
  {
    title: "Advertoriale & Promovare în Presă",
    text: "Publicăm articole în rețeaua noastră de peste 50 de ziare online, cu linkuri dofollow și distribuire pe Facebook.",
  },
  {
    title: "Email Marketing & Automatizări",
    text: "Dezvoltăm campanii eficiente, personalizate, care mențin relația cu clienții.",
  },
  {
    title: "Administrare & Mentenanță Website-uri",
    text: "Asigurăm backup-uri, actualizări și suport tehnic permanent.",
  },
];

const benefits = [
  "Peste 10 ani de experiență continuă în domeniul digital",
  "240+ clienți mulțumiți din România și din străinătate",
  "Echipă multidisciplinară — designeri, developeri, specialiști SEO și marketing, project manageri",
  "Soluții personalizate pentru fiecare afacere, indiferent de industrie",
  "Parteneriat pe termen lung și consultanță constantă pentru dezvoltare",
];

export default function DesprePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Aurora />
        <Meteors count={10} />
        <div className="container-app relative z-10">
          <div className="flex justify-center">
            <div className="gradient-border rounded-full">
              <span className="relative inline-flex items-center gap-2 rounded-full bg-bg-card/90 px-4 py-1.5 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span className="text-shimmer font-semibold">
                  Despre Imperial Media
                </span>
              </span>
            </div>
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-center font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-7xl">
            Partenerul digital al{" "}
            <span className="text-shimmer">afacerii tale</span> de{" "}
            <span className="text-gradient">peste 10 ani</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-center text-base text-text-muted sm:text-lg">
            De peste un deceniu, echipa Imperial Media ajută companiile să-și
            construiască prezența online prin servicii moderne și eficiente —
            de la website-uri de prezentare și magazine online, până la
            promovare digitală și soluții IT integrate. Livrăm rezultate
            concrete și parteneriate de lungă durată.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-brand-orange sm:text-4xl">
                  {s.n}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POVESTEA NOASTRĂ */}
      <section className="section relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.08),transparent_60%)]" />
        <div className="container-app relative">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="chip">Povestea noastră</span>
              <h2 className="section-title mt-4">
                Totul a început cu o{" "}
                <span className="text-shimmer">singură idee</span>
              </h2>
            </div>

            <div className="mt-12 space-y-6 text-base leading-relaxed text-text-muted sm:text-lg">
              <p>
                Prin 2014, într-un oraș în care &bdquo;site-ul firmei&rdquo;
                încă mai era un lux, un grup mic de pasionați de design și
                cod s-a hotărât să schimbe felul în care afacerile locale
                arată online. Nu aveam birouri de sticlă, nici clienți
                celebri. Aveam doar{" "}
                <strong className="text-text">
                  convingerea că un site bine făcut poate schimba o afacere
                </strong>
                .
              </p>

              <p>
                Primul client a venit printr-o recomandare. Al doilea, la
                fel. La fel și al zecelea. Nu am făcut niciodată reclamă
                agresivă — am lăsat rezultatele să vorbească. Un restaurant
                care a dublat rezervările în două luni. O clinică medicală
                care a început să primească programări online zilnic. Un
                magazin de cartier care a devenit un e-commerce cu livrare
                în toată țara.
              </p>

              <p className="border-l-2 border-brand-orange pl-6 italic text-text">
                &bdquo;Nu vindem site-uri. Construim instrumente care aduc
                clienți reali, cât timp dormi.&rdquo;
              </p>

              <p>
                Au trecut <strong className="text-text">peste 10 ani</strong>.
                Echipa a crescut. În spatele proiectelor sunt acum
                designeri, developeri, specialiști SEO, copywriteri și
                project manageri — fiecare cu expertiza lui, toți cu
                aceeași obsesie pentru detaliu. Am livrat{" "}
                <strong className="text-text">peste 200 de proiecte</strong>{" "}
                pentru{" "}
                <strong className="text-text">240+ clienți</strong> din
                România și din străinătate: de la ONG-uri care strâng
                fonduri online, până la magazine cu mii de produse și
                platforme SaaS.
              </p>

              <p>
                Dar cel mai mult ne mândrim nu cu numărul de site-uri
                livrate, ci cu câți dintre clienții noștri au rămas alături
                de noi <strong className="text-text">ani la rând</strong>.
                Pentru că un site bun nu e un proiect &mdash; e începutul
                unei relații lungi.
              </p>

              <p>
                Astăzi, Imperial Media e o agenție completă: web design,
                magazine online, SEO, promovare în presa online, social
                media, mentenanță. Dar în esență am rămas aceeași echipă
                mică din 2014 — curioși, pragmatici și încăpățânați să
                livrăm fiecare pixel cum trebuie.
              </p>

              <p className="text-center text-xl font-semibold text-text">
                Iar dacă citești rândurile astea și ai o idee pe care vrei
                să o aduci online —{" "}
                <span className="text-shimmer">hai să stăm de vorbă</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DE CE IMPERIAL MEDIA */}
      <section className="section bg-bg-soft/30">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip">De ce noi</span>
            <h2 className="section-title mt-4">
              De ce să alegi{" "}
              <span className="text-shimmer">Imperial Media</span>?
            </h2>
            <p className="section-subtitle">
              Cu o experiență de peste un deceniu în domeniul digital, Imperial
              Media este mai mult decât o agenție de web design și marketing —
              este partenerul de încredere al afacerilor care vor să se
              dezvolte și să se impună online.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="group rounded-2xl border border-bg-border bg-bg-card/60 p-7 transition hover:border-brand-orange/60 hover:shadow-glow-orange"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-gradient text-white shadow-glow-orange">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-text">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICII */}
      <section className="section relative">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip">Servicii</span>
            <h2 className="section-title mt-4">
              Tot ce are nevoie <span className="text-shimmer">afacerea ta</span>{" "}
              online
            </h2>
            <p className="section-subtitle">
              De la idee la implementare și promovare. Acoperim complet ciclul
              digital printr-o echipă multidisciplinară.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="rounded-2xl border border-bg-border bg-bg-card/40 p-6 transition hover:border-brand-orange/40 hover:bg-bg-card/80"
              >
                <div className="mb-3 font-display text-sm font-bold text-brand-orange">
                  0{i + 1}.
                </div>
                <h3 className="font-display text-lg font-bold leading-tight text-text">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICII + CTA */}
      <section className="section bg-bg-soft/30">
        <div className="container-app grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="chip">Beneficii</span>
            <h2 className="section-title mt-4">
              Nu livrăm doar servicii — construim{" "}
              <span className="text-shimmer">povești de succes</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-text-muted">
              Fiecare site realizat, fiecare campanie lansată și fiecare
              strategie implementată reprezintă un pas înainte pentru client
              și o dovadă a profesionalismului nostru. Într-o lume unde
              tehnologia se schimbă rapid, experiența acumulată ne ajută să
              anticipăm tendințele, să inovăm și să livrăm rezultate măsurabile.
            </p>
          </div>

          <ul className="space-y-4">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-bg-border bg-bg-card/40 p-4"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-gradient text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-text">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DASHBOARD MOCKUP EXISTENT (Skills) */}
      <Skills />

      {/* MARQUEE */}
      <Marquee />

      {/* CUM PROCEDĂM */}
      <HowItWorks />

      {/* TESTIMONIALE */}
      <Testimonials />

      {/* CTA FINAL */}
      <section className="section border-t border-bg-border/50">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">
            Ești gata să <span className="text-shimmer">colaborăm</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Sună-ne la{" "}
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="font-semibold text-brand-orange hover:underline"
            >
              {siteConfig.phone}
            </a>{" "}
            sau trimite-ne brief-ul tău online. Răspundem în 24h cu propunere
            personalizată.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              <ArrowUpRight className="h-4 w-4" />
              Începe proiectul
            </Link>
            <Link
              href="/proiecte"
              className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card/40 px-5 py-3 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange hover:bg-bg-card/80"
            >
              Vezi proiecte
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
