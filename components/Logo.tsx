import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Înălțime fixă, lățime auto — logo-ul e banner (lat), păstrăm proporția.
  const heightClass =
    size === "lg" ? "h-14" : size === "sm" ? "h-9" : "h-11";

  return (
    <Link
      href="/"
      className="group inline-flex items-center transition-transform duration-300 hover:scale-[1.03]"
      aria-label="Imperial Media — Creatori de Emoții"
    >
      <span
        className={`${heightClass} relative block drop-shadow-[0_0_20px_rgba(255,107,26,0.35)]`}
      >
        <Image
          src="/logo.png"
          alt="Imperial Media"
          width={520}
          height={220}
          priority={size === "lg"}
          className="h-full w-auto object-contain"
        />
      </span>
    </Link>
  );
}
