/* ilan-filtre — emlak ilan listesi (Webyapar tema seti G2, 30 Eki 2026).
   Kartlar SUNUCUDA render dilinde cizilir (SEO + JS'siz gorunum); suzme/siralama/sayfalama istemcide ham
   mx-filtre.js ile yapilir ve kart DOM'unu yeniden siralar. Istemciye yalniz suzme verisi (JSON) basilir.
   Veri: json.data.listings (yoksa json.data dizisi). Etiket sozlukleri json.data.typeLabels, desing.* (uc dilli). */
var ilLang = json.lang || "tr";
var ilD = json.desing || {};
var ilData = json.data && !Array.isArray(json.data) ? json.data : {};
var ilListings = Array.isArray(ilData.listings) ? ilData.listings : (Array.isArray(json.data) ? json.data : []);
var ilTypeLabels = ilData.typeLabels || {};
var ilFacets = Array.isArray(ilData.facets) ? ilData.facets : ["type", "rooms", "m2", "price", "district"];

function ilEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/\{\{/g, "&#123;&#123;");
}
function ilPick(v) { return wmPickLang(v, ilLang); }
function ilL(key) { return ilPick(ilD[key]); }

/* Cogul formu: tablo { tr:{one,other}, en:{…}, ar:{zero,one,two,few,many,other} } → dile gore metin ({n} yer tutucu) */
function ilCogul(tablo, n) {
  var f = tablo && (tablo[ilLang] || tablo.tr || tablo.en);
  if (!f) { return String(n); }
  var kat = "other";
  try { kat = new Intl.PluralRules(ilLang).select(n); } catch (e) { kat = n === 1 ? "one" : "other"; }
  if (n === 0 && f.zero !== undefined) { kat = "zero"; }
  var m = f[kat] !== undefined ? f[kat] : f.other;
  return String(m === undefined ? "" : m).replace(/\{n\}/g, String(n));
}

/* Binlik ayraci tr-TR (Arapca sayfada da tek bicim — TASARIM § 10.4); tutar <bdi dir="ltr"> icinde basilir */
var ilNumFmt = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
var ilSymbols = { TRY: "₺", TL: "₺", USD: "$", EUR: "€", GBP: "£" };
var ilDateFmt = null;
try { ilDateFmt = new Intl.DateTimeFormat(ilLang + "-u-nu-latn-ca-gregory", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); } catch (e) { ilDateFmt = null; }

function ilImg(l) {
  var a = Array.isArray(l.img) ? l.img : (l.img ? [l.img] : []);
  var out = [];
  for (var i = 0; i < a.length; i++) {
    var v = String(a[i] || "");
    if (v) { out.push(v.charAt(0) === "/" || /^https?:\/\//i.test(v) ? v : "/img/" + v); }
  }
  return out;
}
function ilSlug(s) {
  var t = String(s || "").replace(/İ/g, "i").replace(/I/g, "i").toLowerCase();
  t = t.replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u");
  return t.replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-+|-+$/g, "");
}
function ilRoomsKey(r) {
  var m = String(r || "").match(/^(\d+)/);
  return m ? parseInt(m[1], 10) * 10 + (String(r).indexOf("+") > -1 ? parseInt(String(r).split("+")[1], 10) || 0 : 0) : 9999;
}

/* Varsayilan siralamayi sunucuda uygula: istemci ayni siralamayi yaptiginda kartlar yerinden oynamaz (ilk boyama dogru) */
var ilSortDefs = { date: { f: "date", d: -1 }, price: { f: "price", d: 1 }, priceDesc: { f: "price", d: -1 }, m2: { f: "m2", d: -1 }, m2Asc: { f: "m2", d: 1 } };
var ilSortDef = ilSortDefs[String(ilD.sort)] || ilSortDefs.date;
var ilOrdered = [];
for (var oi = 0; oi < ilListings.length; oi++) { ilOrdered.push({ o: ilListings[oi], i: oi }); }
ilOrdered.sort(function (x, y) {
  var a = x.o && x.o[ilSortDef.f];
  var b = y.o && y.o[ilSortDef.f];
  var c = 0;
  if (ilSortDef.f === "date") { c = String(a || "") < String(b || "") ? -1 : String(a || "") > String(b || "") ? 1 : 0; }
  else { c = (Number(a) || 0) - (Number(b) || 0); }
  return c !== 0 ? c * ilSortDef.d : x.i - y.i;
});
ilListings = [];
for (var oj = 0; oj < ilOrdered.length; oj++) { ilListings.push(ilOrdered[oj].o); }

var ilItems = [];
var ilCards = "";
var ilTypesSeen = [];
var ilRoomsSeen = [];
var ilDistricts = [];
var ilDistrictSeen = {};

for (var i = 0; i < ilListings.length; i++) {
  var l = ilListings[i];
  if (!l || typeof l !== "object") { continue; }
  var id = l.id != null && l.id !== "" ? String(l.id) : "ilan-" + (i + 1);
  var deal = l.deal === "rent" ? "rent" : "sale";
  var type = l.type ? String(l.type) : "";
  var rooms = l.rooms != null ? String(l.rooms) : "";
  var m2 = Number(l.m2);
  var price = Number(l.price);
  var districtTxt = ilPick(l.district);
  var dkey = ilSlug(l.district && typeof l.district === "object" ? (l.district.tr || l.district.en || districtTxt) : districtTxt);
  var cityTxt = ilPick(l.city);
  var titleTxt = ilPick(l.title);
  var imgs = ilImg(l);
  var sym = ilSymbols[String(l.currency || "TRY").toUpperCase()] || String(l.currency || "₺");
  var hasPrice = isFinite(price) && price > 0;
  var href = l.url ? wxLangInternalHref(String(l.url)) : "";
  var typeTxt = type ? (ilTypeLabels[type] ? ilPick(ilTypeLabels[type]) : type) : "";
  var dateTxt = "";
  if (l.date && ilDateFmt) {
    var dt = new Date(String(l.date));
    if (!isNaN(dt.getTime())) { dateTxt = ilDateFmt.format(dt); }
  }

  if (type && ilTypesSeen.indexOf(type) === -1) { ilTypesSeen.push(type); }
  if (rooms && ilRoomsSeen.indexOf(rooms) === -1) { ilRoomsSeen.push(rooms); }
  if (dkey && !ilDistrictSeen[dkey]) { ilDistrictSeen[dkey] = true; ilDistricts.push({ key: dkey, label: districtTxt }); }

  /* Istemci suzme verisi: metin alanlari tum dillerde (kullanici baska dilde arayabilir) */
  ilItems.push({
    id: id, deal: deal, type: type, rooms: rooms, m2: isFinite(m2) ? m2 : null, price: hasPrice ? price : null,
    dk: dkey, date: l.date ? String(l.date) : "",
    title: l.title || "", district: l.district || "", city: l.city || "", permit: l.permitNo ? String(l.permitNo) : ""
  });

  /* Yetki belgesi: varsa kartta gorunur; yoksa uc dilli «demo» notu (EİDS'siz ilan gorunumu yasak — TASARIM § 2.3) */
  var permit = l.permitNo
    ? '<span class="modulex-ilan-permit"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span>' +
      "<span>" + ilEsc(ilL("permitLabel")) + ': <bdi dir="ltr" class="modulex-ilan-permitno">' + ilEsc(l.permitNo) + "</bdi></span></span>"
    : '<span class="modulex-ilan-permit modulex-ilan-permit-demo"><span class="material-symbols-outlined" aria-hidden="true">info</span>' +
      "<span>" + ilEsc(ilL("permitDemo")) + "</span></span>";

  var c = '<article class="modulex-ilan-card" data-id="' + ilEsc(id) + '" data-deal="' + deal + '"' + (i >= (parseInt(ilD.pageSize, 10) || 9) ? " hidden" : "") + ">";
  c += '<div class="modulex-ilan-media">';
  if (imgs.length) {
    c += '<img src="' + ilEsc(imgs[0]) + '" alt="' + ilEsc(titleTxt) + '" loading="lazy" decoding="async" />';
  } else {
    c += '<span class="modulex-ilan-ph" aria-hidden="true"><span class="material-symbols-outlined">home_work</span></span>';
  }
  c += '<span class="modulex-ilan-badges"><span class="modulex-ilan-deal modulex-ilan-deal-' + deal + '">' + ilEsc(ilL(deal === "rent" ? "dealRent" : "dealSale")) + "</span>";
  if (l.badge) { c += '<span class="modulex-ilan-flag">' + ilEsc(ilPick(l.badge)) + "</span>"; }
  c += "</span>";
  if (imgs.length > 1) {
    c += '<span class="modulex-ilan-count"><span class="material-symbols-outlined" aria-hidden="true">photo_camera</span>' + ilEsc(ilCogul(ilD.photoCount, imgs.length)) + "</span>";
  }
  c += "</div>";
  c += '<div class="modulex-ilan-body">';
  if (hasPrice) {
    c += '<p class="modulex-ilan-price"><bdi dir="ltr">' + ilEsc(ilNumFmt.format(price)) + " " + ilEsc(sym) + "</bdi>" +
      (deal === "rent" ? ' <span class="modulex-ilan-per">' + ilEsc(ilL("perMonth")) + "</span>" : "") + "</p>";
  }
  c += '<h3 class="modulex-ilan-title">';
  if (href) { c += '<a class="modulex-ilan-link" href="' + ilEsc(href) + '">' + ilEsc(titleTxt) + "</a>"; } else { c += ilEsc(titleTxt); }
  c += "</h3>";
  c += '<p class="modulex-ilan-loc"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>' +
    ilEsc(districtTxt) + (districtTxt && cityTxt ? (ilLang === "ar" ? "، " : ", ") : "") + ilEsc(cityTxt) + "</p>";
  c += '<ul class="modulex-ilan-meta">';
  if (typeTxt) { c += '<li><span class="material-symbols-outlined" aria-hidden="true">home</span>' + ilEsc(typeTxt) + "</li>"; }
  if (rooms) { c += '<li><span class="material-symbols-outlined" aria-hidden="true">bed</span><bdi dir="ltr">' + ilEsc(rooms) + '</bdi><span class="modulex-ilan-vh"> ' + ilEsc(ilL("roomsTitle")) + "</span></li>"; }
  if (isFinite(m2) && m2 > 0) { c += '<li><span class="material-symbols-outlined" aria-hidden="true">square_foot</span><bdi dir="ltr">' + ilEsc(ilNumFmt.format(m2)) + " " + ilEsc(ilL("m2Unit")) + "</bdi></li>"; }
  c += "</ul>";
  c += '<p class="modulex-ilan-foot">' + permit + (dateTxt ? '<span class="modulex-ilan-date">' + ilEsc(ilL("dateLabel")) + ": " + ilEsc(dateTxt) + "</span>" : "") + "</p>";
  c += "</div></article>";
  ilCards += c;
}

/* Facet secenekleri: tur, oda (dogal sirada), semt */
var ilTypeHtml = "";
for (var ti = 0; ti < ilTypesSeen.length; ti++) {
  var tk = ilTypesSeen[ti];
  ilTypeHtml += '<label class="modulex-ilan-opt"><input type="checkbox" data-ilan-facet="type" value="' + ilEsc(tk) + '" />' +
    '<span class="modulex-ilan-opt-t">' + ilEsc(ilTypeLabels[tk] ? ilPick(ilTypeLabels[tk]) : tk) + '</span><span class="modulex-ilan-opt-n" data-ilan-count="type:' + ilEsc(tk) + '"></span></label>';
}
ilRoomsSeen.sort(function (a, b) { return ilRoomsKey(a) - ilRoomsKey(b); });
var ilRoomsHtml = "";
for (var ri = 0; ri < ilRoomsSeen.length; ri++) {
  ilRoomsHtml += '<label class="modulex-ilan-opt modulex-ilan-opt-chip"><input type="checkbox" data-ilan-facet="rooms" value="' + ilEsc(ilRoomsSeen[ri]) + '" />' +
    '<span class="modulex-ilan-opt-t"><bdi dir="ltr">' + ilEsc(ilRoomsSeen[ri]) + "</bdi></span></label>";
}
var ilDistrictHtml = '<option value="">' + ilEsc(ilL("districtAll")) + "</option>";
ilDistricts.sort(function (a, b) { return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
for (var di = 0; di < ilDistricts.length; di++) {
  ilDistrictHtml += '<option value="' + ilEsc(ilDistricts[di].key) + '">' + ilEsc(ilDistricts[di].label) + "</option>";
}

var ilSortHtml = "";
var ilSortKeys = [["date", "sortDate"], ["price", "sortPrice"], ["priceDesc", "sortPriceDesc"], ["m2", "sortM2"], ["m2Asc", "sortM2Asc"]];
for (var si = 0; si < ilSortKeys.length; si++) {
  ilSortHtml += '<option value="' + ilSortKeys[si][0] + '">' + ilEsc(ilL(ilSortKeys[si][1])) + "</option>";
}

/* Bolumleri facets[] listesine gore goster/gizle (yer tutucu → bos) */
/* Filtre grubu: role=group + gorunur baslik (fieldset/legend kenarligi cizgiyi keser; ham css.css ile uyumsuz) */
function ilGroup(name, titleKey, inner) {
  return '<div class="modulex-ilan-sec" role="group" aria-labelledby="modulex-ilan-{{id}}-g-' + name + '"><div class="modulex-ilan-leg" id="modulex-ilan-{{id}}-g-' + name + '">' + ilEsc(ilL(titleKey)) + "</div>" + inner + "</div>";
}
function ilSection(name, bodyHtml) {
  return ilFacets.indexOf(name) === -1 ? "" : bodyHtml;
}
var ilSecType = ilSection("type", ilGroup("type", "typeTitle", '<div class="modulex-ilan-opts">' + ilTypeHtml + "</div>"));
var ilSecRooms = ilRoomsSeen.length ? ilSection("rooms", ilGroup("rooms", "roomsTitle", '<div class="modulex-ilan-chips">' + ilRoomsHtml + "</div>")) : "";
function ilRange(name, titleKey) {
  return ilSection(name, ilGroup(name, titleKey, '<div class="modulex-ilan-range">' +
    '<label><span class="modulex-ilan-vh">' + ilEsc(ilL(titleKey)) + " – " + ilEsc(ilL("minLabel")) + '</span><input type="number" inputmode="numeric" min="0" dir="ltr" data-ilan-range="' + name + '" data-ilan-end="0" placeholder="' + ilEsc(ilL("minLabel")) + '" /></label>' +
    '<span class="modulex-ilan-dash" aria-hidden="true">–</span>' +
    '<label><span class="modulex-ilan-vh">' + ilEsc(ilL(titleKey)) + " – " + ilEsc(ilL("maxLabel")) + '</span><input type="number" inputmode="numeric" min="0" dir="ltr" data-ilan-range="' + name + '" data-ilan-end="1" placeholder="' + ilEsc(ilL("maxLabel")) + '" /></label>' +
    "</div>"));
}
var ilSecM2 = ilRange("m2", "m2Title");
var ilSecPrice = ilRange("price", "priceTitle");
var ilSecDistrict = ilDistricts.length ? ilSection("district", ilGroup("district", "districtTitle", '<select class="modulex-ilan-select" data-ilan-facet="district" aria-labelledby="modulex-ilan-{{id}}-g-district">' + ilDistrictHtml + "</select>")) : "";

/* Istemci yapilandirmasi: dile cozulmus etiketler (istemci dil bilmez) */
var ilCfg = {
  lang: ilLang,
  pageSize: parseInt(ilD.pageSize, 10) > 0 ? parseInt(ilD.pageSize, 10) : 9,
  sort: ["date", "price", "priceDesc", "m2", "m2Asc"].indexOf(String(ilD.sort)) > -1 ? String(ilD.sort) : "date",
  url: !(ilD.urlState === false || String(ilD.urlState).toLowerCase() === "false"),
  resultCount: ilD.resultCount || {},
  prevPage: ilL("prevPage"), nextPage: ilL("nextPage"), pageN: ilL("pageN")
};
var ilJson = JSON.stringify({ cfg: ilCfg, items: ilItems }).replace(/</g, "\\u003c").replace(/\{\{/g, "\\u007b\\u007b");

function ilSet(re, val) { html = html.replace(re, function () { return val; }); }
ilSet(/\{\{ilanCards\}\}/g, ilCards);
ilSet(/\{\{ilanSecType\}\}/g, ilSecType);
ilSet(/\{\{ilanSecRooms\}\}/g, ilSecRooms);
ilSet(/\{\{ilanSecM2\}\}/g, ilSecM2);
ilSet(/\{\{ilanSecPrice\}\}/g, ilSecPrice);
ilSet(/\{\{ilanSecDistrict\}\}/g, ilSecDistrict);
ilSet(/\{\{ilanSortOptions\}\}/g, ilSortHtml);
ilSet(/\{\{ilanJson\}\}/g, ilJson);
