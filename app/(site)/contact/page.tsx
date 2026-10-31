import { ContactSection } from "@/components/ContactSection";
import { BriefForm } from "@/components/BriefForm";

export const metadata = {
  title: "Contact — Imperial Media",
  description:
    "Sună-ne, scrie-ne pe email sau completează briefing-ul. Răspundem în maxim 24 de ore cu ofertă personalizată.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactSection />
      <BriefForm />
    </main>
  );
}
