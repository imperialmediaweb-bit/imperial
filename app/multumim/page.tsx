import Link from "next/link";
import { CheckCircle2, Phone, Mail, Home } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Mulțumim! · Imperial Media",
  description: "Am primit briefingul tău. Revenim cu oferta în maximum 24h.",
};

export default function MultumimPage() {
  return (
    <section className="section">
      <div className="container-app max-w-2xl text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-orange-gradient shadow-glow-orange">
          <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-4xl font-extrabold text-text sm:text-5xl">
          Mulțumim! Am primit <span className="text-gradient">briefingul tău</span>
        </h1>
        <p className="mt-5 text-base text-text-muted sm:text-lg">
          Echipa Imperial Media analizează cererea ta și revine cu oferta
          personalizată în maximum <strong>24 de ore</strong>, pe email și
          telefon.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="card flex items-center gap-4 text-left transition hover:border-brand-orange"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-gradient text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text-subtle">
                Sună-ne acum
              </p>
              <p className="font-semibold text-text">{siteConfig.phone}</p>
            </div>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="card flex items-center gap-4 text-left transition hover:border-brand-orange"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-gradient text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text-subtle">
                Scrie-ne pe email
              </p>
              <p className="font-semibold text-text">{siteConfig.email}</p>
            </div>
          </a>
        </div>

        <Link href="/" className="btn-ghost mt-10 inline-flex">
          <Home className="h-4 w-4" />
          Înapoi la pagina principală
        </Link>
      </div>
    </section>
  );
}
