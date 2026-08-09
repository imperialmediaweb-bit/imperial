# PLAYBOOK Imperial Media — mesaje, poziționare, procese
*(documentul viu al părții „umane" a platformei — codul e în repo, aici e restul)*

## Poziționarea
- **„Coach-ul cu date al afacerii tale"** — nu concurăm coach-ii, îi completăm. Fără atacuri publice la coaching (suntem prieteni cu Bizz Club).
- Împărțirea cu Bizz Club: **ei cresc oamenii prin comunitate, noi ținem afacerea în cifre.**
- Fraza-cheie: *„Radiografia Afacerii — extensia cu date a întâlnirilor tale de la Bizz Club: la club îți iei direcția, noi îți ținem scorul între întâlniri."*

## Oferta (v. curentă)
- **Radiografia Afacerii — 299 lei**: raport complet pe date reale (Google, ANAF, site, Facebook, test de vizibilitate AI, poze vitrină, zona/vadul) + **CADOU campania de promovare în toate cele 50 de ziare online (Media Expres, valoare 300€)**. Banii se scad din orice pachet în 30 de zile. **Garanție**: minim 3 lucruri noi aflate sau banii înapoi (14 zile; dacă articolul s-a publicat, rambursare proporțională).
- Reduceri: membru Bizz Club (link /bizzclub) — 199 · recomandare (?ref=) — 249 · VIP (/vip) — gratuit (fiecare deblocare VIP îți vine pe email).
- **Abonamente**: Monitorizare — 99 lei/lună / 990 pe an · **Premium — 199 lei/lună / 1.990 pe an** (tot din Monitorizare + generator de postări nelimitat + analiza AI a pozelor la cerere). Preț Premium: env `PREMIUM_PRICE_RON`.
- **Pachet Start Online — 500 lei**: profil Google Business + pagină Facebook, cu design (logo simplu inclus). Comandă prin chatul consultantului, plată la **/plata-start**.
- Site-uri: de la 699€ → /brief. Campania 50 ziare gratuită la orice site nou.
- Raport-exemplu public: **/service/exemplu** (firmă fictivă „Kebab Meteor" — numele au fost verificate să nu existe real în Botoșani; Pizzeria Toscana și Istanbul Kebab EXISTĂ real, nu le folosi în demo-uri).

## Mesajul pentru Alina Sava (Bizz Club Botoșani) — versiunea finală, fără forțare
> Salut, Alina! 👋
>
> Am terminat de construit ceva la care am muncit mult în ultima vreme și m-am gândit la tine — aș vrea să fii printre primii care îl încearcă.
>
> Se cheamă **Radiografia Afacerii**: bagi o firmă, iar sistemul îi scanează pe loc datele reale — profilul Google, recenziile, competiția din zonă, bilanțul de la ANAF, site-ul — și scoate o analiză completă, cu plan de acțiune concret. Am integrat în el și Bizz Club: firmelor din zona Botoșani le recomandăm clubul la capitolul dezvoltare — îl văd ca pe o completare naturală a întâlnirilor voastre, voi creșteți oamenii, datele le confirmă drumul.
>
> Pentru tine e gratuit, link personal: 👉 **imperial-media.ro/vip**
>
> Testează când ai un moment liniștit, cu ce firmă vrei. Și dacă îți lasă vreo impresie — bună sau rea — chiar mi-ar prinde bine s-o aud. 🙂

Reguli de joc cu Alina:
- NU pomeni linkul de membri (/bizzclub) în primul mesaj — dacă îi place, cere ea.
- Linkul ei de recomandare și-l descoperă singură în cont — recomandarea din proprie inițiativă valorează.
- Trimite mesajul când are timp să-l savureze, nu între două întâlniri.
- ÎNAINTE de send: testezi tu /vip cap-coadă.
- Pas 2 (doar dacă mușcă): linkul de membri /bizzclub la 199. Pas 3 (viziune): recomandare Bizz Club național.

## Procesul Start Online (comandă → livrare, zero telefoane)
1. **Comanda**: consultantul din /cont strânge în chat: denumire, program, adresă, telefon public, servicii + **Gmail-ul** (pt. acces Google) + **profilul lui de Facebook** (pt. acces pagină) + logo (nu are → îl facem noi, întreabă culorile). Comanda pleacă automat → /admin + email.
2. **Plata**: /plata-start → 500 lei cu cardul → factură StartCo automată → notificare „în lucru" în contul lui.
3. **Materiale**: pozele le urcă din cont (cardul „📸 Trimite-ne poze") → Cloudinary → primești linkurile pe email.
4. **Munca ta (singura umană)**: creezi paginile. Predarea accesului:
   - *Facebook (sistemul nou de pagini)*: pagina → Manage → Page Access → People with Facebook access → Add New → bifezi „full control" → confirmi cu parola → el acceptă. Pagina devine A LUI; tu rămâi cu acces ca să postezi.
   - *Google Business*: profil → Settings → People and access → Add → Gmail-ul lui → rol **Owner** → Invite. 7 zile are funcții limitate (normal); după, poți transfera „Primary owner". Tu rămâi Manager. Verificarea locației (video cu fațada/interiorul) poate cere clientul — îi zici pe chat ce să filmeze.
5. **Livrarea**: /admin/rapoarte → „Livrează pagini create" → lipești linkurile + ce ai optimizat → email de predare + notificare în cont + consultantul/monitorizarea află de pagini.
6. **Modificări după livrare**: 30 de zile de ajustări mici incluse — cere prin consultant, lista îți vine în /admin ca „Modificări pagini livrate". Schimbări mari → /brief cu estimare.

## Ce scrie pe facturile StartCo (automate, la fiecare plată Stripe)
| Plata | Denumirea pe factură |
|---|---|
| Raport 299 | Radiografia afacerii + promovare în 50 de ziare online (rețeaua Media Expres) |
| Monitorizare 99/990 | Abonament monitorizare afacere Imperial Media (lunar/anual) |
| Premium 199/1990 | Abonament premium monitorizare & social media Imperial Media |
| Start Online 500 | Servicii creare și optimizare prezență online (profil Google Business + pagină Facebook) |

## Plase de siguranță (nimic manual)
- Plata vine DOAR după ce raportul există — client care plătește fără produs: imposibil prin design.
- Generare eșuată → retry automat → abia al 2-lea eșec: mesaj prietenos la client (formularul lui rămâne salvat local) + alertă INFORMATIVĂ la tine (email + /admin „⚠️ GENERARE EȘUATĂ (x2)"). O alertă izolată = ignoră. Mai multe la rând = problemă de sistem (chei/API-uri) — de investigat.
- Upgrade de abonament: vechiul abonament Stripe se anulează AUTOMAT (dacă anularea pică, primești email cu id-ul de anulat manual — singura excepție).
- Webhook-uri idempotente — facturi duble: imposibil.

## Checklist operare (o singură dată)
- [ ] Railway: `OPENAPI_RO_KEY` (sugestii firme după nume) — fără ea formularul merge, dar fără listă
- [ ] Railway: `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` (pozele din cont)
- [ ] Rotit cheile expuse în chat: Stripe live, StartCo token, Cloudinary, parola admin, webhook secret
- [ ] Verificat seria StartCo („imperial") = seria reală din contul StartCo
- [ ] Trimis CUI + Nr. Reg. Com. pentru completarea /termeni
- [ ] Test end-to-end cu plată reală (validează și prima factură StartCo)
- [ ] Conectorul nativ Stripe din StartCo să rămână INACTIV (altfel facturi duble fără CUI)

## Prețuri viitoare (decizii amânate, din ROADMAP)
- Raport: test 399 după 20-30 de vânzări
- Marketplace gen Fiverr (postări/design la comandă): NU acum — abonamentele acoperă nevoia

## Optimizarea Google Business Profile (Imperial Media) — checklist
0. **PINUL** (blocant): Edit profile → Location → Botoșani, România (era plasat în Asia!); sau Service area: Botoșani + județ + Suceava/Iași
1. Categorii: Website designer (principală) + Marketing agency, Advertising agency, Internet marketing service, E-commerce service
2. Descriere: textul din chat/PLAYBOOK (custom, 10+ ani, 200+ clienți, Rețeaua Media Expres, Radiografia, estimare AI)
3. Servicii cu prețuri: site 699€ · magazin 1.200€ · Radiografia 299 lei · promovare 50 ziare 300€ · Start Online 500 lei · mentenanță 50€/lună · branding
4. Poze: minim 10 la start (logo, cover, 6-8 proiecte, echipa), apoi 2-3/lună
5. Postări: 1/săptămână (consultantul din /cont le scrie); prima = Radiografia cu link ?utm_source=gbp
6. Recenzii: QR-ul din /cont la 10-15 clienți vechi pe WhatsApp; țintă 20+; răspuns la toate
7. Q&A seed (3 întrebări proprii) · program real (nu „Closed") · TELEFON ALINIAT site↔profil (0746 vs 0758!)
După fix pin: test-places + raport regenerat — profilul cu cele 5 recenzii trebuie să apară.
