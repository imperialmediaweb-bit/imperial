// Pagina de plată Site Start — consultantul/estimatorul trimite clientul aici după comandă.

import { getClientEmail } from "@/lib/client-auth";
import { siteStartPriceRon } from "@/lib/stripe";
import { StartCheckout } from "@/components/StartCheckout";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site Start — plată | Imperial Media",
  robots: { index: false, follow: false },
};

const INCLUDED = [
  "Site de prezentare cu 4 pagini: Acasă, Despre, Servicii, Contact (hartă + formular)",
  "Design pe brandul tău, construit pe Next.js — aceeași tehnologie ca site-urile mari, NU WordPress",
  "Domeniu + găzduire GRATUITE primul an · certificat SSL · optimizare de bază Google",
  "Livrare în câteva zile de la primirea conținutului (texte + poze de la tine)",
  "1 rundă de revizii inclusă + 14 zile corecturi mărunte",
  "Suma se scade INTEGRAL din site-ul complet dacă faci pasul în 6 luni",
];

export default function PlataSiteStartPage() {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  const price = siteStartPriceRon();

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app flex min-h-[75vh] items-center justify-center py-14">
        <div className="w-full max-w-lg rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8 text-center shadow-card">
          <span className="chip">🏗️ Site Start</span>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-text sm:text-3xl">
            Site-ul tău de prezentare, gata în câteva zile
          </h1>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-orange">{price} lei</p>
          <ul className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm text-text-muted">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" /> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <StartCheckout initialEmail={email ?? ""} price={price} endpoint="/api/site-start-checkout" />
          </div>
          <p className="mt-3 text-[11px] text-text-subtle">
            Plată securizată prin Stripe · factura vine automat pe email · fără telefoane, totul online
          </p>
        </div>
      </section>
    </main>
  );
}
