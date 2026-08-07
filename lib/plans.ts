// Regula unică pentru treptele de abonament — folosită și pe server, și în UI.
// (separată de lib/stripe.ts ca să poată fi importată în componente client, fără node:crypto)

export function isPremiumPlan(plan: string | null | undefined): boolean {
  return String(plan ?? "").startsWith("premium");
}
