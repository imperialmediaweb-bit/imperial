import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Logo-ul e banner (lat). Setăm înălțimi mari pe lg — prezență puternică.
  const heightClass =
    size === "lg"
      ? "h-20 sm:h-24 md:h-28 lg:h-32"
      : size === "sm"
        ? "h-14"
        : "h-16 sm:h-20";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.05]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <Image
        src="/logo.png"
        alt="Imperial Media — Creatori de Emoții"
        width={1000}
        height={400}
        priority
        sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 560px"
        className={`${heightClass} w-auto max-w-none object-contain drop-shadow-[0_0_24px_rgba(255,107,26,0.4)] transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(255,107,26,0.7)]`}
      />
    </Link>
  );
}
