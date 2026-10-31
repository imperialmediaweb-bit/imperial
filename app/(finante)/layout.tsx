// Layout separat pentru panoul Finanțe: fără meniul site-ului, fără statistici, neindexat.
import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Imperial Finanțe",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#0b0a10", width: "device-width", initialScale: 1 };

export default function FinanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.variable}>
      <body className="min-h-screen bg-[#0b0a10] font-sans text-white antialiased">{children}</body>
    </html>
  );
}
