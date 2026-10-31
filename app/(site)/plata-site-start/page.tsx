// Plata se face acum doar prin transfer, după ofertă și contract — un singur drum pentru orice pachet:
// calculator → ofertă pe email → contract → factură și plată prin transfer. Linkurile vechi duc în calculator.

import { redirect } from "next/navigation";

export default function PlataSiteStartPage() {
  redirect("/estimare?tip=start");
}
