"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-bg-border/60 bg-bg-soft/40"
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-orange/15 blur-[120px]" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-brand-purple/20 blur-[120px]" />

      <div className="container-app relative z-10 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text">
              Newsletter
            </h4>
            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-gradient" />
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Abonează-te la newsletter și primește cele mai noi știri,
              actualizări și oferte speciale direct pe email.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setDone(true);
                setEmail("");
                setTimeout(() => setDone(false), 3000);
              }}
              className="relative mt-5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Introdu adresa ta de email"
                className="w-full rounded-full border border-bg-border bg-bg-soft/80 py-3 pl-5 pr-14 text-sm text-text placeholder:text-text-subtle outline-none transition focus:border-brand-orange focus:bg-bg-soft"
              />
              <button
                type="submit"
                aria-label="Abonează-te"
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition hover:scale-110"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              {done && (
                <p className="mt-2 text-xs text-brand-orange">
                  Mulțumim! Te-am abonat cu succes.
                </p>
              )}
            </form>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text">
              Services
            </h4>
            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-gradient" />
            <ul className="mt-4 space-y-2.5">
              {["Despre", "Contact", "Servicii", "Proiecte"].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm text-text-muted transition hover:text-brand-orange"
                  >
                    <span className="text-brand-orange">›</span>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text">
              Contact
            </h4>
            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-gradient" />
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-text-muted">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                Aleea Parcului, Botoșani
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-sm text-text-muted transition hover:text-brand-orange"
                >
                  <Phone className="h-4 w-4 text-brand-orange" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-text-muted transition hover:text-brand-orange"
                >
                  <Mail className="h-4 w-4 text-brand-orange" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.mainSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-text-muted transition hover:text-brand-orange"
                >
                  <Globe className="h-4 w-4 text-brand-orange" />
                  imperial-media.ro
                </a>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <Logo size="lg" />
            <p className="mt-6 text-sm leading-relaxed text-text-muted">
              Promovăm afaceri prin idei și soluții digitale moderne.
              Urmărește-ne și rămâi conectat!
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: siteConfig.social.facebook, Icon: Facebook },
                { href: "#", Icon: Twitter },
                { href: siteConfig.social.instagram, Icon: Instagram },
              ].map(({ href, Icon }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-bg-border bg-white/5 text-text-muted transition hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-bg-border/60 pt-6">
          <p className="text-center text-xs text-text-subtle">
            Copyright Imperial Media © {new Date().getFullYear()}. Toate
            drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
