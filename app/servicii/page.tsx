import { Services } from "@/components/Services";
import { PricingCards } from "@/components/PricingCards";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";

export const metadata = {
  title: "Servicii — Imperial Media",
  description:
    "Site-uri de prezentare, magazine online, branding, promovare și administrare. Pachete complete cu preț fix sau ofertă personalizată.",
};

export default function ServiciiPage() {
  return (
    <main>
      <Services />
      <HowItWorks />
      <PricingCards />
      <FAQ />
    </main>
  );
}
