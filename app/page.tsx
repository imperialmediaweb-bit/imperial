import { HomeSwitch } from "@/components/experience/HomeSwitch";
import { Estimator } from "@/components/experience/Estimator";
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
            <section className="section">
              <div className="container-app">
                <h2 className="section-title">
                  Cât ar costa <span className="text-gradient">site-ul tău?</span>
                </h2>
                <div className="mt-8">
                  <Estimator compact />
                </div>
              </div>
            </section>
            <ContactSection />
            <FAQ />
          </>
        }
      />
    </main>
  );
}
