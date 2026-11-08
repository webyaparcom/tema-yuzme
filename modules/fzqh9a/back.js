/* hero-5 — Tam ekran parallax/video hero (31 Eki 2026, G8-A).
   Yer tutucular: h5stil h5hiza h5yk h5medya h5ctalar — koşulsuz yerleştirilir. Metinler desing {tr,en,ar} (moduleRender çözer).
   Medya: video varsa poster ZORUNLU (yoksa video basılmaz, img'e düşer); reduced-motion'da CSS videoyu gizler → poster/img görünür.
   wmPickLang güvenli sarmal; yalnız var + klasik for (rust.md § Modul teknik). */
function h5Dil(v) {
  if (v == null) { return ""; }
  if (typeof v !== "object") { return String(v); }
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return v[json.lang] != null ? String(v[json.lang]) : (v.tr != null ? String(v.tr) : (v.en != null ? String(v.en) : ""));
}
function h5Esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function h5Url(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file):/i.test(s)) { return ""; }
  if (/^data:/i.test(s)) { return /^data:(image|video)\//i.test(s) ? s : ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}
function h5Href(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|data):/i.test(s)) { return ""; }
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) { return s; }
  return wxLangInternalHref(s);
}

var h5Des = json.desing || {};

var h5Stil = String(h5Des.stil || "ortali").trim();
if (h5Stil !== "ortali" && h5Stil !== "sol" && h5Stil !== "alt-serit") { h5Stil = "ortali"; }
var h5Hiza = String(h5Des.hiza || "orta").trim();
if (h5Hiza !== "orta" && h5Hiza !== "sol") { h5Hiza = "orta"; }

/* yükseklik: vh sayısı, 50–100 arası; CSS min 480px ayrıca uygular */
var h5Yk = parseInt(h5Des.yukseklik, 10);
if (!isFinite(h5Yk)) { h5Yk = 88; }
h5Yk = Math.min(100, Math.max(50, h5Yk));

/* medya */
var h5Img = h5Url(h5Des.img);
var h5Video = h5Url(h5Des.video);
var h5Poster = h5Url(h5Des.poster) || h5Img;
var h5Alt = h5Dil(h5Des.alt);
var h5Medya = "";
if (h5Video && h5Poster) {
  h5Medya = '<img src="' + h5Esc(h5Poster) + '" alt="" width="1920" height="1080" loading="eager" fetchpriority="high" decoding="async" />' +
    '<video muted loop playsinline autoplay preload="metadata" poster="' + h5Esc(h5Poster) + '" tabindex="-1">' +
    '<source src="' + h5Esc(h5Video) + '" /></video>';
} else if (h5Img) {
  h5Medya = '<img src="' + h5Esc(h5Img) + '" alt="' + h5Esc(h5Alt) + '" width="1920" height="1080" loading="eager" fetchpriority="high" decoding="async" />';
} else {
  h5Medya = '<div class="modulex-h5-ph" role="img" aria-label="' + h5Esc(h5Alt) + '"></div>';
}

/* CTA'lar */
var h5Ctalar = "";
var h5C1 = h5Dil(h5Des.cta1).trim();
var h5C1Url = h5Href(h5Des.cta1_url);
if (h5C1 && h5C1Url) {
  h5Ctalar += '<a class="modulex-h5-cta modulex-h5-cta--dolgu" href="' + h5Esc(h5C1Url) + '">' + h5Esc(h5C1) +
    '<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>';
}
var h5C2 = h5Dil(h5Des.cta2).trim();
var h5C2Url = h5Href(h5Des.cta2_url);
if (h5C2 && h5C2Url) {
  h5Ctalar += '<a class="modulex-h5-cta modulex-h5-cta--cerceve" href="' + h5Esc(h5C2Url) + '">' + h5Esc(h5C2) + "</a>";
}

html = html
  .replace(/\{\{h5stil\}\}/g, function () { return h5Stil; })
  .replace(/\{\{h5hiza\}\}/g, function () { return h5Hiza; })
  .replace(/\{\{h5yk\}\}/g, function () { return String(h5Yk); })
  .replace(/\{\{h5medya\}\}/g, function () { return h5Medya; })
  .replace(/\{\{h5ctalar\}\}/g, function () { return h5Ctalar; });
