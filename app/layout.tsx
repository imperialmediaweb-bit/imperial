import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · Cere ofertă pentru site profesional`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Cere ofertă pentru site profesional. Pachete complete: site prezentare, magazin online, promovare, administrare. Răspundem în 24h.",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} · Soluții web personalizate`,
    description:
      "Cere ofertă pentru site profesional. Răspundem în 24h cu propunere personalizată.",
    type: "website",
    locale: "ro_RO",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E0617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="min-h-screen bg-bg text-text antialiased">
        {/* Global premium effects */}
        <NoiseOverlay />
        <ScrollProgress />

        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
