import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="Imperial Media"
    >
      {/* Crown + Shield emblem */}
      <span
        className={`${dim} relative grid place-items-center transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-[0_0_20px_rgba(255,107,26,0.5)]"
          aria-hidden="true"
        >
          {/* Shield outline with gradient stroke */}
          <defs>
            <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B1A" />
              <stop offset="100%" stopColor="#7B2FF7" />
            </linearGradient>
            <linearGradient id="crown-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFB020" />
              <stop offset="100%" stopColor="#FF6B1A" />
            </linearGradient>
          </defs>
          {/* Crown above shield */}
          <path
            d="M18 13 L24 7 L30 12 L36 7 L42 13 L40 17 L20 17 Z"
            fill="url(#crown-grad)"
            stroke="#FFB020"
            strokeWidth="0.6"
          />
          <circle cx="24" cy="7" r="1.4" fill="#FFB020" />
          <circle cx="36" cy="7" r="1.4" fill="#FFB020" />
          <circle cx="30" cy="12" r="1.6" fill="#FF6B1A" />
          {/* Shield body */}
          <path
            d="M30 19 L46 22 L46 36 C46 44 38 50 30 53 C22 50 14 44 14 36 L14 22 Z"
            fill="rgba(15,8,30,0.95)"
            stroke="url(#shield-grad)"
            strokeWidth="2"
          />
          {/* M monogram inside */}
          <path
            d="M22 38 L22 28 L26 33 L30 28 L34 33 L38 28 L38 38"
            stroke="#FF6B1A"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${text} font-display font-extrabold tracking-tight text-text`}
        >
          IMPERIAL MEDIA
        </span>
        <span className="mt-0.5 text-[10px] font-medium italic tracking-[0.15em] text-brand-orange">
          Creatori de Emoții
        </span>
      </span>
    </Link>
  );
}
