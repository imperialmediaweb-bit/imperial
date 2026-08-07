// Pagina de plată a Pachetului Start Online — consultantul trimite clientul aici după comandă.
// Simplă și clară: ce primește, cât costă, un buton.

import { getClientEmail } from "@/lib/client-auth";
import { startPriceRon } from "@/lib/stripe";
import { StartCheckout } from "@/components/StartCheckout";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pachet Start Online — plată | Imperial Media",
  robots: { index: false, follow: false },
};

const INCLUDED = [
  "Profil Google Business complet: categorie, descriere, program, poze, primele postări",
  "Pagină de Facebook cu design profesionist: cover + descriere + butoane + primele postări",
  "Logo simplu inclus — dacă nu ai deja unul",
  "Predare la cheie: paginile rămân ALE TALE (acces total), noi rămânem să te ajutăm",
  "Consultantul tău din cont te învață apoi ce să postezi și cum să faci reclame",
];

export default function PlataStartPage() {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  const price = startPriceRon();

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app flex min-h-[75vh] items-center justify-center py-14">
        <div className="w-full max-w-lg rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8 text-center shadow-card">
          <span className="chip">🚀 Pachet Start Online</span>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-text sm:text-3xl">
            Firma ta, vizibilă online în câteva zile
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
            <StartCheckout initialEmail={email ?? ""} price={price} />
          </div>
        </div>
      </section>
    </main>
  );
}
