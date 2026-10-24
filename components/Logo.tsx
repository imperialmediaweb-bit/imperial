import Link from "next/link";

// Logo-ul NOU — recreat vectorial după identitatea rotundă: inel în gradientul
// foc→magenta→violet pe negru, sigla-coroană angulară în același gradient,
// wordmark „IMPERIAL MEDIA” alături. SVG = crisp la orice mărime.

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="imRing" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B1A" />
          <stop offset="55%" stopColor="#FF2E9A" />
          <stop offset="100%" stopColor="#8B2FF7" />
        </linearGradient>
        <linearGradient id="imMark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8A42" />
          <stop offset="50%" stopColor="#FF2E9A" />
          <stop offset="100%" stopColor="#B06CFF" />
        </linearGradient>
      </defs>
      {/* discul negru */}
      <circle cx="50" cy="50" r="47" fill="#07060a" />
      {/* inelul în gradient */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#imRing)" strokeWidth="3.2" />
      {/* coroana angulară — aripă stângă, vârf central, aripă dreaptă */}
      <g fill="url(#imMark)">
        {/* aripa stângă */}
        <path d="M22 66 L30 34 L40 50 L36 66 Z" />
        {/* vârful central (diamant) */}
        <path d="M50 26 L58 46 L50 66 L42 46 Z" />
        {/* aripa dreaptă */}
        <path d="M78 66 L70 34 L60 50 L64 66 Z" />
      </g>
      {/* scânteia de deasupra */}
      <path d="M50 16 L52.2 21.5 L50 24 L47.8 21.5 Z" fill="#FFB020" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const mark =
    size === "lg" ? "h-12 w-12 sm:h-14 sm:w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const word =
    size === "lg" ? "text-lg sm:text-xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center gap-3 transition-all duration-300"
      aria-label="Imperial Media — Tu ai ideea. Noi o aducem la viață."
    >
      <span className="relative inline-block">
        <Mark className={`${mark} drop-shadow-[0_0_14px_rgba(255,46,154,0.35)] transition duration-300 group-hover:drop-shadow-[0_0_22px_rgba(255,46,154,0.6)]`} />
      </span>
      <span className="leading-none">
        <span className={`block font-display font-black uppercase tracking-[0.08em] text-text ${word}`}>
          Imperial
        </span>
        <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.42em] text-text-subtle sm:text-[10px]">
          Media
        </span>
      </span>
    </Link>
  );
}
