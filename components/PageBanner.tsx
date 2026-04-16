import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Aurora } from "./effects/Aurora";
import { Meteors } from "./effects/Meteors";

type Crumb = { href?: string; label: string };

export function PageBanner({
  title,
  crumbs,
}: {
  title: string;
  crumbs: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Aurora />
      <Meteors count={8} />
      <div className="container-app relative z-10 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium"
        >
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <div key={`${c.label}-${i}`} className="flex items-center gap-2">
                {c.href && !isLast ? (
                  <Link
                    href={c.href}
                    className="text-text-muted transition hover:text-brand-orange"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-brand-orange underline decoration-brand-orange/50 underline-offset-4">
                    {c.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="h-4 w-4 text-brand-orange" />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
