# İstatistik Bandı 1 — `k8st01` (tema-yuzme)

## Amaç
İstatistik / sayaç bandı modülü. Rakamlar görünür olduğunda 0'dan hedefe animasyonlu sayar (IntersectionObserver + easeOutCubic; prefers-reduced-motion'da animasyonsuz). İkon, sonek (+, /7) ve çok dilli etiket destekler. Görsel varyant desing.stil (31 Eki 2026): "" klasik (gradient bant, numbercolor/labelcolor, bugünkü görünüm) · "kartli" (sayfa zemininde yüzey kartları, üstte primary çizgi, hover'da yükselir) · "serit-renkli" (tek renk primary/primary-contrast şeridi, ikon solda rakam+etiket yanında, dikey ayraçlar). Varyant renkleri yalnız var(--mx-site-*) token çiftleri.

## Meta
- version: `1.1.0`
- category: `stats`
- icon: `monitoring`

## Dosyalar
- `back.js` — sunucu tarafı çizim
- `index.html` — şablon
- `index.jpeg` — önizleme görseli
- `index.json` — tanım
- `README.md` — bu belge

## Not
Bu klasör siteye özel kurulum örneğidir; şablon kaynağı `projeler/webyapar/web/tema-set/icerik/yuzme/` altında tutulur, burası elle değiştirilmez.
