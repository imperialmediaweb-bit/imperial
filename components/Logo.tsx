import Link from "next/link";
import Image from "next/image";

// Logo-ul NOU — recreat vectorial după identitatea rotundă: inel în gradientul
// foc→magenta→violet pe negru, sigla-coroană angulară în același gradient,
// wordmark „IMPERIAL MEDIA” alături. SVG = crisp la orice mărime.

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="imRing" x1="0%" y1="85%" x2="100%" y2="15%">
          <stop offset="0%" stopColor="#FF8A1A" />
          <stop offset="50%" stopColor="#FF2E9A" />
          <stop offset="100%" stopColor="#8B2FF7" />
        </linearGradient>
        <linearGradient id="imWingL" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB020" />
          <stop offset="60%" stopColor="#FF6B1A" />
          <stop offset="100%" stopColor="#FF2E9A" />
        </linearGradient>
        <linearGradient id="imWingR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#B06CFF" />
          <stop offset="55%" stopColor="#8B2FF7" />
          <stop offset="100%" stopColor="#FF2E9A" />
        </linearGradient>
        <linearGradient id="imCore" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B1A" />
          <stop offset="55%" stopColor="#FF2E9A" />
          <stop offset="100%" stopColor="#FF7ADF" />
        </linearGradient>
        <filter id="imGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* discul negru + inelul cu glow */}
      <circle cx="50" cy="50" r="47" fill="#07060a" />
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="url(#imRing)" strokeWidth="2.6" filter="url(#imGlow)" />
      {/* aripa stângă — două lame în unghi (foc) */}
      <g filter="url(#imGlow)">
        <path d="M21 63 L31 33 L43 46 L39 55 L30 48 Z" fill="url(#imWingL)" />
        <path d="M30 66 L37 48 L45 56 L41 66 Z" fill="url(#imWingL)" opacity="0.9" />
        {/* aripa dreaptă — oglindit (violet) */}
        <path d="M79 63 L69 33 L57 46 L61 55 L70 48 Z" fill="url(#imWingR)" />
        <path d="M70 66 L63 48 L55 56 L59 66 Z" fill="url(#imWingR)" opacity="0.9" />
        {/* cristalul central cu vârf */}
        <path d="M50 24 L56 44 L50 68 L44 44 Z" fill="url(#imCore)" />
        <path d="M50 24 L56 44 L50 50 L44 44 Z" fill="#FF9ADF" opacity="0.55" />
        {/* scânteia de deasupra */}
        <path d="M50 13 L52.4 19 L50 24 L47.6 19 Z" fill="#FFD27A" />
        <line x1="50" y1="24" x2="50" y2="64" stroke="#FFE6F5" strokeWidth="1" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // doar sigla rotundă — numele e deja scris în interiorul ei
  const mark =
    size === "lg" ? "h-14 w-14 sm:h-16 sm:w-16" : size === "sm" ? "h-11 w-11" : "h-12 w-12 sm:h-14 sm:w-14";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center transition-all duration-300"
      aria-label="Imperial Media — Tu ai ideea. Noi o aducem la viață."
    >
      <Image
        src="/brand/logo-round-200.png"
        alt="Imperial Media"
        width={200}
        height={200}
        quality={100}
        unoptimized
        priority
        className={`${mark} rounded-full drop-shadow-[0_0_14px_rgba(255,46,154,0.35)] transition duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(255,46,154,0.6)]`}
      />
    </Link>
  );
}
