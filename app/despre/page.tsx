import { Skills } from "@/components/Skills";
import { Marquee } from "@/components/Marquee";
import { Testimonials } from "@/components/Testimonials";

export const metadata = {
  title: "Despre noi — Imperial Media",
  description:
    "Echipă cu peste 10 ani experiență. Peste 200 de site-uri lansate pentru clienți reali. Designeri, dezvoltatori și strategi care transformă idei în rezultate.",
};

export default function DesprePage() {
  return (
    <>
      <Skills />
      <Marquee />
      <Testimonials />
    </>
  );
}
