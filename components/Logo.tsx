import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Dimensiuni echilibrate — proporționale cu restul elementelor din navbar.
  const heightClass =
    size === "lg"
      ? "h-20 sm:h-24 md:h-28"
      : size === "sm"
        ? "h-14"
        : "h-16 sm:h-20";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center transition-all duration-300 hover:scale-[1.03]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <Image
        src="/logo.png"
        alt="Imperial Media — Creatori de Emoții"
        width={1600}
        height={640}
        priority
        quality={100}
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 440px"
        className={`${heightClass} w-auto max-w-none object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,107,26,0.35)]`}
      />
    </Link>
  );
}
