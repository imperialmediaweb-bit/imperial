import { HomeSwitch } from "@/components/experience/HomeSwitch";
import { HeroCrystal } from "@/components/HeroCrystal";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingCards } from "@/components/PricingCards";
import { ContactSection } from "@/components/ContactSection";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <main>
      <HomeSwitch
        fallback={
          <>
            <HeroCrystal />
            <Services />
            <Projects />
            <HowItWorks />
            <PricingCards />
            <ContactSection />
            <FAQ />
          </>
        }
      />
    </main>
  );
}
