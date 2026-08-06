# Imperial Media — Roadmap proiecte viitoare

_Actualizat: august 2026. Ordinea recomandată — fiecare treaptă se construiește pe dovezile celei dinainte._

## Acum (operațional, fără cod)
- [ ] Test plată reală cap-coadă pe /service (Stripe → raport → emailuri → factura StartCo → admin)
- [ ] Invitație VIP către Alina Sava (Bizz Club Botoșani): https://imperial-media.ro/vip
- [ ] Link membri Bizz Club în circulație: https://imperial-media.ro/bizzclub (199 lei)
- [ ] CUI + Nr. Reg. Com. de completat în /termeni (identificarea completă a operatorului)
- [ ] Verificare domeniu Resend (SPF/DKIM) ca emailurile automate să nu intre în Spam

## Următoarele module (o sesiune fiecare)
1. **Motorul de recenzii** — link direct de recenzie Google + cod QR printabil + mesaje
   WhatsApp gata scrise pentru clienți; efectul vizibil în monitorizare („+8 recenzii luna asta").
   Unealta care rezolvă problema pe care raportul o arată.
2. **Clientul misterios AI** — test real de răspuns (email către firmă + competitori, cronometrat
   și evaluat). Arma de marketing pentru demonstrații și postări virale.
3. **Alerte de avarie** — email către proprietar la eșec de webhook/facturare; evenimente GA4
   pe funnel (/service → preview → plată).
4. **Apeluri pierdute** — număr inteligent + SMS automat; se vinde la pachet cu site-urile
   (necesită integrare telefonie).

## Parteneriat Bizz Club — traseul național
- Pilot Botoșani (20-30 membri cu radiografia + testimoniale + cifre de progres)
- Președinta locală = ambasador către rețeaua națională
- Ofertă națională: link per filială (/bizzclub-cluj etc. — o linie de cod fiecare),
  comision 10-15% din vânzările prin linkurile lor, dashboard de club (progresul agregat
  al membrilor) — de construit la semnarea parteneriatului

## Proiecte mari (sesiuni dedicate)
- **Imperial Club** — club DIGITAL pentru clienții plătitori din toată țara (insignă, promovare
  trimestrială în rețea, top scoruri pe industrie, reduceri). Complementar cu Bizz Club (ei =
  fizicul, noi = digitalul); Alina = membru fondator. De pornit după ~30-50 clienți plătitori.
- **Facturare StartCo — verificare schema API** după prima factură reală (câmpul de CUI la
  partner + formatul răspunsului sunt scrise defensiv în lib/invoicing.ts).
- **Automatizare abonament complet** — dacă vin cereri: lunile gratis din recomandări scăzute
  automat la reînnoire (acum doar afișate).
- **Platforma Media Expres self-service** — publicarea articolelor de promovare fără muncă
  manuală (automatizează singura verigă umană rămasă).
- **Versiunea UK** — imperial-media.co.uk, middleware per domeniu (sesiune separată, plan existent).
- **AI Website Builder SaaS** — plan salvat în istoricul de planuri.

## Decizii de preț (istoric, să nu se repete discuțiile)
- Audit: 299 lei (test 399 după 20-30 vânzări) · membru Bizz Club 199 · recomandare 249 · VIP gratuit
- Abonament: 99 lei/lună lansare (149-199 la activarea încasării recurente) · anual 990 (2 luni gratis)
- Recomandări: 1 firmă plătită = 1 lună monitorizare gratis; cumpărătorul prin link = 249 lei
- Pachet Start Online (fără site): 500 lei — Google Business + Facebook cu design
- Site-uri: 699–4.500€ conform grilei din lib/ai.ts; campania 50 ziare (300€) gratuită la site
