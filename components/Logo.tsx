import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="Imperial Media"
    >
      {/* Shield SVG — placeholder, ușor de înlocuit cu logo real */}
      <span
        className={`${dim} relative grid place-items-center rounded-lg bg-orange-gradient shadow-glow-orange transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${text} font-display font-extrabold tracking-tight text-text`}
        >
          IMPERIAL
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-orange">
          MEDIA
        </span>
      </span>
    </Link>
  );
}
