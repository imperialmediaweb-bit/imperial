import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
      {/* Google Analytics 4 + Google Tag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TBV24GHJTD"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TBV24GHJTD');
          gtag('config', 'G-MB9S50SJZ8');
          gtag('config', 'GT-NS8RS5P');
        `}
      </Script>
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
