# Spec tehnic — Modul de publicare automată (Imperial Media × Rețeaua Media Expres)
# Document de dat echipei tehnice a rețelei. Partea Imperial Media (feed + confirmare)
# se construiește imediat ce rețeaua confirmă implementarea.

## Ce face
Publică automat, în ziarul local potrivit, articolele pregătite de Imperial Media
pentru fiecare oraș — fără intervenție manuală per articol.

## Flux
1. Feed JSON securizat: GET https://imperial-media.ro/api/presa-feed?key=CHEIE_SECRETA
2. Modulul rețelei citește feed-ul o dată pe zi. Format articol:
   {
     "id": "art_12345",
     "titlu": "...",
     "continut_html": "<p>...</p>",
     "imagine_url": "https://.../poza.jpg",
     "judet": "Botoșani",
     "distributie": "local" | "toata-reteaua",
     "publica_dupa": "2026-08-20",
     "link_obligatoriu": "https://imperial-media.ro/service"
   }
3. Reguli:
   - "local" → doar ziarul județului (Botoșani → Botoșani Expres)
   - "toata-reteaua" → toate cele 50 de ziare
   - nu se publică înainte de "publica_dupa"
   - linkurile din continut_html se păstrează exact (dofollow)
4. Confirmare: POST https://imperial-media.ro/api/presa-feed/publicat
   body: { "id": "art_12345", "url_publicat": "https://..." }
   → previne dublarea + permite trimiterea automată a linkurilor către client
5. Securitate: cheie secretă schimbată pe canal direct; fără cheie → 401

## Volum estimat
5-30 articole/lună la început (abonați lunari + campanii incluse în rapoarte), în creștere.
