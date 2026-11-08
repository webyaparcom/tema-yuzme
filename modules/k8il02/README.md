# İlan Filtre (Emlak İlan Listesi) — `k8il02` (tema-yuzme)

## Amaç
Emlak ilan listesi: satılık/kiralık sekmeleri, tür, oda sayısı (çoklu), m² ve fiyat aralığı, semt, metin arama, sıralama ve sayfalama. Durum URL'de tutulur (?q=&deal=&type=&rooms=&m2=&price=&district=&sort=&p=). Her ilan kartında yetki belgesi no görünür (yoksa üç dilli «demo» notu). Kartlar sunucuda üç dilde çizilir, süzme/sıralama ham mx-filtre.js ile yapılır. Mobilde filtre paneli açılır-kapanır; para tr-TR ayraçlı ve <bdi dir=ltr> içinde.

## Meta
- version: `1.0.0`
- category: `page-list`
- tags: emlak, ilan, filtre, real-estate, listing, rtl
- icon: `real_estate_agent`

## Dosyalar
- `back.js` — sunucu tarafı çizim
- `index.html` — şablon
- `index.json` — tanım
- `README.md` — bu belge

## Not
Bu klasör siteye özel kurulum örneğidir; şablon kaynağı `projeler/webyapar/web/tema-set/icerik/yuzme/` altında tutulur, burası elle değiştirilmez.
