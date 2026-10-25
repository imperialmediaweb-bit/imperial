import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, Instrument_Serif, Inter, JetBrains_Mono, Michroma } from "next/font/google";
import "./globals.css";

// Fonturile sunt servite de pe domeniul nostru (next/font) — fără cereri către
// Google la încărcare, fără FOUT; Archivo e fontul display din noul branding.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
  display: "swap",
  preload: false,
});
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { MetaPixel } from "@/components/MetaPixel";
import { DeferredEffects } from "@/components/effects/DeferredEffects";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · Creare site web profesional`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Creare site web profesional, magazine online, promovare în 50 ziare și consultanță digitală. Estimare gratuită cu AI în 2 minute. 10+ ani experiență, 200+ clienți.",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} · Creare site web profesional`,
    description:
      "Site-uri custom, magazine online, promovare în 50 ziare. Estimare gratuită cu AI. 10+ ani experiență.",
    type: "website",
    locale: "ro_RO",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Imperial Media — Creare site web profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · Creare site web profesional`,
    description:
      "Site-uri custom, magazine online, promovare în 50 ziare. Estimare gratuită cu AI.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/brand/apple-icon-180.png",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: siteConfig.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={`${inter.variable} ${archivo.variable} ${instrument.variable} ${jetbrains.variable} ${michroma.variable}`}>
      <head>
        {/* JSON-LD: Organization + LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteConfig.url}/#organization`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                  logo: `${siteConfig.url}/logo.png`,
                  email: siteConfig.email,
                  telephone: siteConfig.phone,
                  sameAs: [
                    siteConfig.social.facebook,
                    siteConfig.social.instagram,
                  ],
                },
                {
                  "@type": "ProfessionalService",
                  "@id": `${siteConfig.url}/#localbusiness`,
                  name: siteConfig.name,
                  description:
                    "Creare site web profesional, magazine online, promovare în 50 ziare și consultanță digitală.",
                  url: siteConfig.url,
                  telephone: siteConfig.phone,
                  email: siteConfig.email,
                  priceRange: "500 - 25000 RON",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Botoșani",
                    addressCountry: "RO",
                  },
                  areaServed: { "@type": "Country", name: "România" },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: siteConfig.reviews.ratingValue,
                    reviewCount: siteConfig.reviews.reviewCount,
                    bestRating: 5,
                    worstRating: 1,
                  },
                  knowsAbout: [
                    "creare site web",
                    "web design",
                    "magazine online",
                    "Dezvoltare web personalizată",
                    "aplicații SaaS",
                    "promovare presă online",
                    "SEO local România",
                  ],
                  slogan: "Site-uri construite de la zero, fără șabloane",
                },
              ],
            }),
          }}
        />
      </head>
      {/* Google Analytics 4 + Google Tag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TBV24GHJTD"
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
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
        <MetaPixel />
        <NoiseOverlay />
        <DeferredEffects />
        <Header />
        <div>{children}</div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
