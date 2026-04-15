import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Logo-ul e banner (lățime > înălțime) — fixăm înălțimea, lăsăm lățimea auto.
  // Dimensiuni mari pentru prezență premium.
  const heightClass =
    size === "lg"
      ? "h-16 sm:h-20 md:h-24"
      : size === "sm"
        ? "h-12"
        : "h-14 sm:h-16 md:h-20";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.04]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <span
        className={`${heightClass} relative block drop-shadow-[0_0_18px_rgba(255,107,26,0.35)] transition-all duration-500 group-hover:drop-shadow-[0_0_32px_rgba(255,107,26,0.6)]`}
      >
        {/* Halo gradient subtil în spate pentru prezență premium */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-brand-orange/20 via-brand-purple/20 to-brand-orange/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <Image
          src="/logo.png"
          alt="Imperial Media — Creatori de Emoții"
          width={800}
          height={320}
          priority
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
          className="h-full w-auto max-w-none object-contain"
        />
      </span>
    </Link>
  );
}
