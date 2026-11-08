/* logo-bandi — Referans logo bandı (31 Eki 2026, G8-C).
   Yer tutucular: lbstil lbvars lbhead lbset lbkopya. data[] = {name, img, url}; img yoksa metin rozeti. */
var lbD = json.desing || {};
var lbL = json.lang || "tr";
function lbT(v) { return wmPickLang(v, lbL); }
function lbEsc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function lbUrl(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) { return ""; }
  if (/^data:/i.test(s)) { return /^data:image\//i.test(s) ? s : ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + json.id + "/" + s;
}
function lbBool(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}

var lbStil = String(lbD.stil || "kayan").trim();
if (lbStil !== "kayan" && lbStil !== "izgara" && lbStil !== "cerceveli-kartlar") { lbStil = "kayan"; }
var lbSpeed = parseFloat(lbD.speed);
if (!isFinite(lbSpeed) || lbSpeed < 5) { lbSpeed = 32; }
if (lbSpeed > 240) { lbSpeed = 240; }
var lbH = String(lbD.logoH || "48px").replace(/[^0-9a-z.%]/gi, "") || "48px";
var lbVars = "--lb-sure:" + lbSpeed + "s;--lb-h:" + lbH + ";";
var lbSinif = lbBool(lbD.grayscale, true) ? "" : " modulex-lb--renkli";

var lbItems = Array.isArray(json.data) ? json.data : [];
function lbSet(kopya) {
  var out = "";
  for (var i = 0; i < lbItems.length; i++) {
    var it = lbItems[i] || {};
    var ad = lbT(it.name).trim();
    var img = lbUrl(it.img);
    var url = lbUrl(it.url);
    if (!ad && !img) { continue; }
    var ic = img
      ? '<img class="modulex-lb__img" src="' + lbEsc(img) + '" alt="' + lbEsc(ad) + '" loading="lazy" decoding="async" height="48" />'
      : '<span class="modulex-lb__word">' + lbEsc(ad) + "</span>";
    if (url && !kopya) {
      ic = '<a class="modulex-lb__link" href="' + lbEsc(url) + '" target="_blank" rel="noopener noreferrer"' + (img ? ' aria-label="' + lbEsc(ad) + '"' : "") + ">" + ic + "</a>";
    } else if (url) {
      ic = '<a class="modulex-lb__link" href="' + lbEsc(url) + '" tabindex="-1" aria-hidden="true">' + ic + "</a>";
    }
    out += '<li class="modulex-lb__item"' + (img && !kopya ? ' title="' + lbEsc(ad) + '"' : "") + (kopya ? ' aria-hidden="true"' : "") + ">" + ic + "</li>";
  }
  return out;
}
var lbSetHtml = lbSet(false);
/* kayan: ikinci kopya kesintisiz döngü için (ekran okuyucuya gizli); diğer varyantlarda kopya yok */
var lbKopya = lbStil === "kayan" && lbSetHtml ? '<ul class="modulex-lb__set modulex-lb__set--kopya" aria-hidden="true">' + lbSet(true) + "</ul>" : "";

var lbHead = "";
if (lbBool(lbD.showTitle, true)) {
  var lbTitle = lbT(lbD.title);
  var lbDesc = lbT(lbD.description);
  if (lbTitle || lbDesc) {
    lbHead = '<header class="modulex-lb__head">' + (lbTitle ? '<h2 class="modulex-lb__title">' + lbEsc(lbTitle) + "</h2>" : "") + (lbDesc ? '<p class="modulex-lb__desc">' + lbEsc(lbDesc) + "</p>" : "") + "</header>";
  }
}

html = html.replace(/\{\{lbstil\}\}/g, function () { return lbStil + lbSinif; });
html = html.replace(/\{\{lbvars\}\}/g, function () { return lbVars; });
html = html.replace(/\{\{lbhead\}\}/g, function () { return lbHead; });
html = html.replace(/\{\{lbset\}\}/g, function () { return lbSetHtml; });
html = html.replace(/\{\{lbkopya\}\}/g, function () { return lbKopya; });
