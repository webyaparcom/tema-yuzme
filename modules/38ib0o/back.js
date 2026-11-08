/* contact-7 — Bölünmüş iletişim (31 Eki 2026, G8-C).
   Yer tutucular: c7stil c7map c7panelitems c7maplink c7social c7subjects c7kvkklink c7formattrs c7submit c7submiticon c7veri.
   Veri yoksa satır HİÇ basılmaz (uydurma yok). Görünür metinlerin tümü index.json desing'inden (W1). */
var c7D = json.desing || {};
var c7L = json.lang || "tr";

function c7T(v) { return wmPickLang(v, c7L); }
function c7Esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* yalnız http(s) ya da kök-göreli adres; javascript: vb. reddedilir */
function c7Url(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s || /^\s*(javascript|vbscript|data|file):/i.test(s)) { return ""; }
  return s;
}

/* --- varyant --- */
var c7Stil = String(c7D.stil || "bolunmus").trim();
if (c7Stil !== "bolunmus" && c7Stil !== "kart-ustte" && c7Stil !== "harita-arka") { c7Stil = "bolunmus"; }
var c7Gonderim = String(c7D.gonderim || "mailto").trim() === "whatsapp" ? "whatsapp" : "mailto";

/* --- iletişim satırları (yalnız dolu olanlar) --- */
var c7Setting = webmakerdata.setting || {};
var c7Address = c7T(c7D.address).trim();
var c7Phone = c7T(c7D.phone).trim() || (typeof c7Setting.phone === "string" ? c7Setting.phone.trim() : "");
var c7Email = c7T(c7D.email).trim() || (typeof c7Setting.email === "string" ? c7Setting.email.trim() : "");
var c7Hours = c7T(c7D.hours).trim();
var c7Wa = String(c7D.whatsapp || "").replace(/\D/g, "") || c7Phone.replace(/\D/g, "");

function c7Item(ikon, etiket, icHtml) {
  return '<li class="modulex-c7__item"><span class="modulex-c7__icon"><span class="material-symbols-outlined" aria-hidden="true">' + ikon + "</span></span>" +
    '<div class="modulex-c7__ibody"><span class="modulex-c7__ilabel">' + c7Esc(etiket) + "</span>" + icHtml + "</div></li>";
}
var c7Items = "";
if (c7Address) { c7Items += c7Item("location_on", c7T(c7D.addressTitle), '<span class="modulex-c7__ivalue">' + c7Esc(c7Address) + "</span>"); }
if (c7Phone) { c7Items += c7Item("call", c7T(c7D.phoneTitle), '<a class="modulex-c7__ivalue" href="tel:' + c7Esc(c7Phone.replace(/[^+\d]/g, "")) + '" dir="ltr">' + c7Esc(c7Phone) + "</a>"); }
if (c7Email) { c7Items += c7Item("mail", c7T(c7D.emailTitle), '<a class="modulex-c7__ivalue" href="mailto:' + c7Esc(c7Email) + '">' + c7Esc(c7Email) + "</a>"); }
if (c7Hours) { c7Items += c7Item("schedule", c7T(c7D.hoursTitle), '<span class="modulex-c7__ivalue">' + c7Esc(c7Hours) + "</span>"); }

/* --- harita bağlantısı: mapUrl; yoksa adresten arama bağlantısı --- */
var c7MapUrl = c7Url(c7D.mapUrl);
if (!c7MapUrl && c7Address) { c7MapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c7Address); }
var c7MapLink = c7MapUrl
  ? '<a class="modulex-c7__maplink" href="' + c7Esc(c7MapUrl) + '" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">map</span><span>' + c7Esc(c7T(c7D.mapLink)) + "</span></a>"
  : "";

/* --- sosyal ---
   8 Kas 2026 (argeatolyesi ham dönüşüm): şablon örneği yalnız alan adı (https://instagram.com/) — gerçek hesap sayılmaz, basılmaz.
   Ölçüt sosyalBar.js ile aynı: http(s), alan adından sonra yol, example.* değil. */
function c7GercekHesap(u) {
  var m = /^https?:\/\/([^\/?#\s]+)(\/[^?#\s]*)?/i.exec(String(u || ""));
  if (!m || /(^|\.)example\./i.test(m[1])) { return false; }
  return !!(m[2] && m[2].replace(/\//g, ""));
}
var c7Social = "";
if (Array.isArray(c7D.social)) {
  for (var c7i = 0; c7i < c7D.social.length; c7i++) {
    var c7S = c7D.social[c7i] || {};
    var c7Ad = c7T(c7S.ad || c7S.name).trim();
    var c7Su = c7GercekHesap(c7S.url) ? c7Url(c7S.url) : "";
    if (c7Ad && c7Su) {
      c7Social += '<a class="modulex-c7__chip" href="' + c7Esc(c7Su) + '" target="_blank" rel="noopener noreferrer">' +
        (c7S.icon ? '<span class="material-symbols-outlined" aria-hidden="true">' + c7Esc(c7S.icon) + "</span>" : "") + "<span>" + c7Esc(c7Ad) + "</span></a>";
    }
  }
}
var c7SocialHtml = c7Social ? '<div class="modulex-c7__socialwrap"><p class="modulex-c7__stitle">' + c7Esc(c7T(c7D.socialTitle)) + '</p><div class="modulex-c7__social">' + c7Social + "</div></div>" : "";

/* --- harita arka planı (yalnız harita-arka): mapEmbed https ise iframe, yoksa nötr yer tutucu --- */
var c7Map = "";
if (c7Stil === "harita-arka") {
  var c7Embed = c7Url(c7D.mapEmbed);
  if (c7Embed && /^https:\/\//i.test(c7Embed)) {
    c7Map = '<div class="modulex-c7__map" aria-hidden="true"><iframe src="' + c7Esc(c7Embed) + '" title="' + c7Esc(c7T(c7D.mapTitle)) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" tabindex="-1"></iframe></div>';
  } else {
    c7Map = '<div class="modulex-c7__map" aria-hidden="true"><div class="modulex-c7__mapph"><span class="material-symbols-outlined">location_on</span></div></div>';
  }
}

/* --- konu seçenekleri --- */
var c7Subjects = "";
if (Array.isArray(c7D.subjects)) {
  for (var c7k = 0; c7k < c7D.subjects.length; c7k++) {
    var c7Sb = c7D.subjects[c7k] || {};
    var c7SbAd = c7T(c7Sb.name).trim();
    if (c7SbAd) { c7Subjects += '<option value="' + c7Esc(c7Sb.id != null ? c7Sb.id : c7SbAd) + '">' + c7Esc(c7SbAd) + "</option>"; }
  }
}

/* --- KVKK bağlantısı --- */
var c7KvkkHref = c7Url(c7D.kvkkHref);
var c7KvkkLink = c7KvkkHref ? '<a href="' + c7Esc(wxLangInternalHref(c7KvkkHref)) + '" target="_blank" rel="noopener">' + c7Esc(c7T(c7D.kvkkLinkText)) + "</a>" : "";

/* --- form nitelikleri + istemci verisi --- */
var c7FormAttrs = ' data-c7-gonderim="' + c7Gonderim + '"';
var c7Veri = JSON.stringify({
  gonderim: c7Gonderim,
  mailto: c7Email,
  wa: c7Gonderim === "whatsapp" ? c7Wa : "",
  subject: c7T(c7D.mailSubject),
  waIntro: c7T(c7D.waIntro),
  m: {
    required: c7T(c7D.errRequired), email: c7T(c7D.errEmail), phone: c7T(c7D.errPhone), kvkk: c7T(c7D.errKvkk), summary: c7T(c7D.errSummary),
    ok: c7T(c7D.okText), okWa: c7T(c7D.okWhatsappText),
    name: c7T(c7D.nameLabel), emailL: c7T(c7D.emailLabel), phoneL: c7T(c7D.phoneLabel), subjectL: c7T(c7D.subjectLabel)
  }
}).replace(/</g, "\\u003c");

/* --- formAction (8 Kas 2026): form JSON POST ucu — sevgane.com form-worker sözleşmesi (projeler/yunus/web/form-worker):
   { name, email, phone, topic, message, kvkk:true, lang, page, website (honeypot), t (doldurma süresi ms) } → { ok:true }.
   Yalnız kök-göreli yol ya da https adresi. Verilmezse istemci betiğine dokunulmaz (mailto / WhatsApp aynen).
   Başarısızlıkta durum satırı e-posta yedek bağlantısı gösterir (veri.mailto). Metinler: sendingText · sentText · sendErrText. --- */
var c7Action = String(c7D.formAction == null ? "" : c7D.formAction).trim();
if (!/^\/(?!\/)[A-Za-z0-9_\-.\/]*$/.test(c7Action) && !/^https:\/\/[^\s"'<>\\]+$/i.test(c7Action)) { c7Action = ""; }
var C7_GONDER = {
  sending: { tr: "Gönderiliyor…", en: "Sending…", ar: "جارٍ الإرسال…", de: "Wird gesendet…", es: "Enviando…" },
  sent: { tr: "Mesajınız iletildi. En kısa sürede dönüş yapacağız.", en: "Your message has been sent. We will get back to you soon.", ar: "تم إرسال رسالتك. سنعود إليك قريبًا.", de: "Ihre Nachricht wurde gesendet. Wir melden uns bald.", es: "Tu mensaje se ha enviado. Te responderemos pronto." },
  err: { tr: "Mesaj gönderilemedi. E-postayla yazabilirsiniz:", en: "The message could not be sent. You can e-mail us:", ar: "تعذّر إرسال الرسالة. يمكنك مراسلتنا عبر البريد:", de: "Die Nachricht konnte nicht gesendet werden. Schreiben Sie uns per E-Mail:", es: "No se pudo enviar el mensaje. Puedes escribirnos por correo:" }
};
if (c7Action) {
  var c7Ac = function (k, d) { var v = c7T(c7D[k]).trim(); return v || c7T(C7_GONDER[d]); };
  html = html.replace("var m = veri.m || {};", function () {
    return "var m = veri.m || {}; var c7Bas = Date.now();";
  });
  html = html.replace('if (veri.gonderim === "whatsapp" && veri.wa) {', function () {
    return 'if (veri.action) {' +
      'var c7Btn = form.querySelector("[type=submit]"); if (c7Btn) { c7Btn.disabled = true; } durumYaz(veri.ac.sending, false);' +
      'var c7Hata = function () { if (c7Btn) { c7Btn.disabled = false; } durumYaz(veri.ac.err, true);' +
      'if (durum && veri.mailto) { var c7A = document.createElement("a"); c7A.href = "mailto:" + veri.mailto + "?subject=" + encodeURIComponent((veri.subject || "") + (konuMetin ? " - " + konuMetin : "")) + "&body=" + encodeURIComponent(govde.replace(/\\n/g, "\\r\\n")); c7A.textContent = " " + veri.mailto; durum.appendChild(c7A); } };' +
      'var c7Yuk = { name: deger("name"), email: deger("email"), phone: deger("phone"), topic: konuMetin, message: deger("message"), kvkk: true, lang: document.documentElement.lang || "", page: location.pathname, website: deger("website"), t: Date.now() - c7Bas };' +
      'fetch(veri.action, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c7Yuk) })' +
      '.then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j && j.ok !== false; }); })' +
      '.then(function (tamam) { if (!tamam) { c7Hata(); return; } if (c7Btn) { c7Btn.disabled = false; } durumYaz(veri.ac.sent, false); form.reset(); c7Bas = Date.now(); })' +
      '.catch(c7Hata);' +
      "} else " + 'if (veri.gonderim === "whatsapp" && veri.wa) {';
  });
  html = html.replace("</form>", function () {
    return '<div aria-hidden="true" style="position:absolute;inset-inline-start:-9999px;width:1px;height:1px;overflow:hidden"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div></form>';
  });
  c7Veri = c7Veri.replace(/^\{/, function () {
    return "{" + JSON.stringify("action").replace(/</g, "\\u003c") + ":" + JSON.stringify(c7Action).replace(/</g, "\\u003c") + "," +
      JSON.stringify("ac") + ":" + JSON.stringify({ sending: c7Ac("sendingText", "sending"), sent: c7Ac("sentText", "sent"), err: c7Ac("sendErrText", "err") }).replace(/</g, "\\u003c") + ",";
  });
}

html = html.replace(/\{\{c7stil\}\}/g, function () { return c7Stil; });
html = html.replace(/\{\{c7map\}\}/g, function () { return c7Map; });
html = html.replace(/\{\{c7panelitems\}\}/g, function () { return c7Items; });
html = html.replace(/\{\{c7maplink\}\}/g, function () { return c7MapLink; });
html = html.replace(/\{\{c7social\}\}/g, function () { return c7SocialHtml; });
html = html.replace(/\{\{c7subjects\}\}/g, function () { return c7Subjects; });
html = html.replace(/\{\{c7kvkklink\}\}/g, function () { return c7KvkkLink; });
html = html.replace(/\{\{c7formattrs\}\}/g, function () { return c7FormAttrs; });
html = html.replace(/\{\{c7submit\}\}/g, function () { return c7Esc(c7T(c7Gonderim === "whatsapp" ? c7D.submitWhatsappText : c7D.submitText)); });
html = html.replace(/\{\{c7submiticon\}\}/g, function () { return c7Gonderim === "whatsapp" ? "chat" : "send"; });
html = html.replace(/\{\{c7veri\}\}/g, function () { return c7Veri; });
