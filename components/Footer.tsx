import Link from "next/link";
import { Phone, Mail, Globe, Facebook, Instagram } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-bg-border/60 bg-bg-soft/40">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Soluții web personalizate pentru afaceri care vor să crească
              online. Site-uri, magazine online, promovare și mentenanță.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Servicii
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#pachete"
                  className="text-sm text-text transition hover:text-brand-orange"
                >
                  Website Prezentare
                </a>
              </li>
              <li>
                <a
                  href="#pachete"
                  className="text-sm text-text transition hover:text-brand-orange"
                >
                  Magazin Online
                </a>
              </li>
              <li>
                <a
                  href="#pachete"
                  className="text-sm text-text transition hover:text-brand-orange"
                >
                  Promovare
                </a>
              </li>
              <li>
                <a
                  href="#pachete"
                  className="text-sm text-text transition hover:text-brand-orange"
                >
                  Administrare
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center gap-2 text-sm text-text transition hover:text-brand-orange"
                >
                  <Phone className="h-4 w-4 text-brand-orange" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 text-sm text-text transition hover:text-brand-orange"
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
                  className="inline-flex items-center gap-2 text-sm text-text transition hover:text-brand-orange"
                >
                  <Globe className="h-4 w-4 text-brand-orange" />
                  imperial-media.ro
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <Link
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-bg-border bg-white/5 text-text-muted transition hover:border-brand-orange hover:text-brand-orange"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-bg-border bg-white/5 text-text-muted transition hover:border-brand-orange hover:text-brand-orange"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-bg-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} Imperial Media. Toate drepturile
            rezervate.
          </p>
          <p className="text-xs text-text-subtle">
            Site făcut cu ❤ de echipa Imperial Media
          </p>
        </div>
      </div>
    </footer>
  );
}
