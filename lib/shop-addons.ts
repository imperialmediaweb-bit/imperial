// Opțiunile magazinului online — sursă unică pentru pachete, calculator și consultantul AI.
// Magazin Start (3.000 lei) include: design unic, până la 30 de produse încărcate de noi,
// coș și comenzi, plata ramburs, panou pentru produse și comenzi, SEO tehnic.

import type { Addon } from "./site-start-addons";

export const SHOP_BASE = 3000;

export const SHOP_ADDONS: Addon[] = [
  { key: "card", name: "Plăți online cu cardul", price: 800, desc: "Stripe sau Netopia, banii direct în contul tău" },
  { key: "awb", name: "AWB automat la curieri", price: 700, desc: "Fan Courier, Sameday și alții — AWB generat din comandă" },
  { key: "factura", name: "Facturare automată", price: 600, desc: "SmartBill sau Oblio — factura pleacă singură la comandă" },
  { key: "variante", name: "Variante de produs + filtre", price: 500, desc: "mărimi, culori și filtre de căutare în magazin" },
  { key: "produse", name: "Încărcare produse peste 30", price: 200, unit: "30 de produse", desc: "le încărcăm noi, cu poze și descrieri" },
  { key: "ai-shop", name: "Asistent AI smart (comenzi + urmărire colet)", price: 1000, desc: "răspunde despre produse, spune stadiul comenzii și unde e coletul, după numărul comenzii" },
  { key: "logo", name: "Logo", price: 300, desc: "dacă nu ai deja unul — creat pe brandul tău" },
];
