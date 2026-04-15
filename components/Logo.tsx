import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Logo-ul e banner (lățime > înălțime) — fixăm înălțimea, lăsăm lățimea auto.
  // Sizes mari pentru prezență "profi" în navbar & footer.
  const heightClass =
    size === "lg" ? "h-20 sm:h-24" : size === "sm" ? "h-12" : "h-14 sm:h-16";

  return (
    <Link
      href="/"
      className="group inline-flex items-center transition-transform duration-300 hover:scale-[1.04]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <span
        className={`${heightClass} relative block transition-all duration-500 group-hover:drop-shadow-[0_0_28px_rgba(255,107,26,0.55)] drop-shadow-[0_0_18px_rgba(255,107,26,0.35)]`}
      >
        {/* Glow halo subtil în spate pentru prezență premium */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-orange/25 via-brand-purple/20 to-brand-orange/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <Image
          src="/logo.png"
          alt="Imperial Media"
          width={720}
          height={300}
          priority
          sizes="(max-width: 640px) 220px, 320px"
          className="h-full w-auto object-contain"
        />
      </span>
    </Link>
  );
}
