import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Dimensiuni echilibrate — proporționale cu restul elementelor din navbar.
  const heightClass =
    size === "lg"
      ? "h-14 sm:h-16 md:h-20"
      : size === "sm"
        ? "h-10"
        : "h-12 sm:h-14";

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center transition-all duration-300 hover:scale-[1.03]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <Image
        src="/logo.png"
        alt="Imperial Media — Creatori de Emoții"
        width={1000}
        height={400}
        priority
        sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
        className={`${heightClass} w-auto max-w-none object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,107,26,0.35)]`}
      />
    </Link>
  );
}
