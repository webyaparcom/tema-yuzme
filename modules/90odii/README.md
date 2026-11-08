# Zigzag Özellik — `90odii` (tema-yuzme)

## Amaç
Görsel-metin sırası satır satır değişen (sol/sağ) özellik anlatımı: numara rozeti, h3, paragraf, mini CTA; görsel kenarında dekoratif çerçeve/gölge. Kaydırmada satırlar sırayla belirir (IntersectionObserver; reduced-motion ya da JS yoksa hep görünür). desing.stil: cerceve | yuzen | sade. RTL'de sıra kendiliğinden aynalanır. Veri: data[] = [{baslik{tr,en,ar}, metin{}, img, alt{}, url, ctaLabel{}?}]. Renkler yalnız token; koyu mod otomatik.

## Meta
- version: `1.0.0`
- category: `ozellik`
- tags: özellik, zigzag, features, görsel-metin, ar
- icon: `view_agenda`

## Dosyalar
- `back.js` — sunucu tarafı çizim
- `index.html` — şablon
- `index.jpeg` — önizleme görseli
- `index.json` — tanım
- `README.md` — bu belge

## Not
Bu klasör siteye özel kurulum örneğidir; şablon kaynağı `projeler/webyapar/web/tema-set/icerik/yuzme/` altında tutulur, burası elle değiştirilmez.
