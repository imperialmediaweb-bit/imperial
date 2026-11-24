import { Services } from "@/components/Services";
import { PricingCards } from "@/components/PricingCards";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";

export const metadata = {
  title: "Servicii: site-uri, magazine online și SEO",
  description:
    "Site-uri de prezentare, magazine online, branding, promovare și administrare. Pachete complete cu preț fix sau ofertă personalizată.",
};

export default function ServiciiPage() {
  return (
    <main>
      <Services headingLevel="h1" />
      <HowItWorks />
      <PricingCards />
      <FAQ />
    </main>
  );
}
