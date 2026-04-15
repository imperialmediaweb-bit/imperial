import { Hero } from "@/components/Hero";
import { PricingCards } from "@/components/PricingCards";
import { HowItWorks } from "@/components/HowItWorks";
import { BriefForm } from "@/components/BriefForm";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PricingCards />
      <HowItWorks />
      <BriefForm />
      <FAQ />
    </>
  );
}
