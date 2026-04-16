import { PageBanner } from "@/components/PageBanner";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutWhy } from "@/components/about/AboutWhy";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Marquee } from "@/components/Marquee";
import { HowItWorks } from "@/components/HowItWorks";
import { ContactSection } from "@/components/ContactSection";

export const metadata = {
  title: "Despre — Imperial Media",
  description:
    "De peste 10 ani, Imperial Media ajută afaceri din România și din străinătate să-și dezvolte prezența online prin web design, marketing și soluții digitale integrate.",
};

export default function DesprePage() {
  return (
    <>
      <PageBanner
        title="Despre"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Despre" },
        ]}
      />
      <AboutHero />
      <AboutWhy />
      <AboutTeam />
      <Marquee />
      <HowItWorks />
      <ContactSection />
    </>
  );
}
