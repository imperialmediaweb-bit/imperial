# Imperial Media — `tools.imperial-media.ro`

Landing pentru capturarea lead-urilor de pe OLX. Vizitatorul intră pe link-ul din anunț, vede pachetele, completează un brief în 3 pași și echipa Imperial Media primește pe email toate detaliile.

Stack: **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS** + **Framer Motion** + **Resend** (email). Deploy pe **Railway** prin Dockerfile.

---

## 🚀 Quick start (local)

```bash
npm install
cp .env.example .env.local
# editează .env.local cu cheia Resend și emailul
npm run dev
```

Aplicația rulează pe http://localhost:3000

---

## ☁️ Deploy pe Railway

1. **Push branch-ul** pe GitHub (ex: `claude/nsu-eface-deployment-RcGHO` sau merge în `main`)
2. Intră pe [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Selectează repo-ul `imperialmediaweb-bit/imperial`
4. Selectează branch-ul dorit (sau merge-uiește în `main`)
5. Railway detectează automat `Dockerfile`-ul (multi-stage + Next.js `output: standalone`) și buildează
6. Setează **Variables** în Railway:
   - `RESEND_API_KEY` — cheia de la resend.com
   - `LEAD_EMAIL` — `office@imperial-media.ro`
   - `FROM_EMAIL` — `Imperial Media <noreply@domeniul-tau.ro>`

### Custom domain `tools.imperial-media.ro`

1. În Railway → Settings → Networking → Custom Domain → adaugă `tools.imperial-media.ro`
2. Railway îți dă un **CNAME target** (ex: `xxx.up.railway.app`)
3. La registrarul tău (unde ai imperial-media.ro) adaugă un record **CNAME**:
   - Name: `tools`
   - Value: (CNAME-ul de la Railway)
   - TTL: 3600
4. Așteaptă 5-30 min să se propage DNS-ul

---

## ✉️ Configurare Resend (gratuit până la 3000 mail/lună)

1. Creează cont pe [resend.com](https://resend.com)
2. **Adaugă domeniul** `imperial-media.ro` în Domains
3. Adaugă DNS records (TXT, MX) la registrar — Resend îți spune exact ce
4. După verificare, generează un **API Key** și pune-l în Railway ca `RESEND_API_KEY`
5. `FROM_EMAIL` trebuie să folosească domeniul verificat

---

## 📂 Structură proiect

```
app/
  layout.tsx              # Shell cu Header + Footer + WhatsApp
  page.tsx                # Landing principal
  multumim/page.tsx       # Pagina de confirmare după brief
  api/lead/route.ts       # Endpoint POST care trimite emailurile
  globals.css
components/
  Header.tsx              # Logo + nav + buton telefon
  Footer.tsx              # Contact + social + copyright
  Hero.tsx                # Headline + CTA + stats
  PricingCards.tsx        # 4 carduri pachete (cu preselect brief)
  HowItWorks.tsx          # 3 pași: brief → calcul preț → ofertă
  BriefForm.tsx           # Wizard 3 pași cu progress bar
  FAQ.tsx                 # Întrebări frecvente
  WhatsAppButton.tsx      # Floating button bottom-right
  Logo.tsx                # Logo Imperial Media (placeholder)
lib/
  packages.ts             # Date statice 4 pachete (modifică prețuri aici)
  site.ts                 # Date contact + brand (telefon, email, social)
  email.ts                # Wrapper Resend + template-uri HTML
```

---

## 🎨 Customizare rapidă

| Vrei să schimbi | Editează |
|---|---|
| Prețurile pachetelor | `lib/packages.ts` |
| Telefon, email, WhatsApp | `lib/site.ts` |
| Culorile brand | `tailwind.config.ts` (cheile `bg.*` și `brand.*`) |
| Logo-ul | `components/Logo.tsx` (înlocuiește SVG-ul cu `<img>` real) |
| Întrebări FAQ | `components/FAQ.tsx` (array `items`) |
| Câmpurile briefului | `components/BriefForm.tsx` |

---

## ✅ Checklist înainte de live

- [ ] Înlocuit logo-ul placeholder cu varianta reală (PNG/SVG în `/public/`)
- [ ] Verificat domeniul în Resend
- [ ] Setate variabile env în Railway
- [ ] Custom domain activ pe `tools.imperial-media.ro`
- [ ] Făcut un test cu un brief real → verificat că ajunge mailul la `office@imperial-media.ro`
- [ ] Pus link-ul în anunțul OLX 🚀

---

## 📞 Contact

Imperial Media · 0748 858 201 · office@imperial-media.ro
