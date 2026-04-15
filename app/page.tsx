import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Team } from "@/components/Team";
import { Marquee } from "@/components/Marquee";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingCards } from "@/components/PricingCards";
import { BriefForm } from "@/components/BriefForm";
import { ContactSection } from "@/components/ContactSection";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Skills />
      <Projects />
      <Team />
      <Marquee />
      <HowItWorks />
      <PricingCards />
      <BriefForm />
      <ContactSection />
      <Testimonials />
      <BlogPreview />
      <FAQ />
    </>
  );
}
