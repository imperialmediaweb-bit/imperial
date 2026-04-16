import { PageBanner } from "@/components/PageBanner";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export const metadata = {
  title: "Servicii — Imperial Media",
  description:
    "Creare website-uri, magazine online, branding, dezvoltare web, PR & marketing și mentenanță web. Soluții digitale complete de la Imperial Media.",
};

export default function ServiciiPage() {
  return (
    <>
      <PageBanner
        title="Servicii"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Servicii" },
        ]}
      />
      <ServicesGrid />
    </>
  );
}
