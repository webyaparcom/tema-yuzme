/* team-1 — json.data uyelerini kartlara cevirir.
   item: { name, role: {tr,en}, bio: {tr,en}, img } */
function teamLang(val, lang) {
  if (val == null) {
    return "";
  }
  if (typeof val === "object") {
    return val[lang] || val.tr || "";
  }
  return String(val);
}

var backhtml = "";
if (json.data && json.data.length) {
  for (var ti = 0; ti < json.data.length; ti++) {
    var item = json.data[ti];
    var name = teamLang(item.name, json.lang);
    if (!name) {
      continue;
    }
    var role = teamLang(item.role, json.lang);
    var bio = teamLang(item.bio, json.lang);
    var avatarHtml = item.img
      ? '<img src="/img/' + json.id + "/" + item.img + '" alt="' + name + '" loading="lazy" />'
      : '<span class="material-symbols-outlined" aria-hidden="true">person</span>';

    backhtml +=
      '<div class="modulex-team-card" style="animation-delay:' + (ti * 0.08) + 's">' +
      '<div class="modulex-team-avatar">' + avatarHtml + "</div>" +
      '<h3 class="modulex-team-name">' + name + "</h3>" +
      (role ? '<div class="modulex-team-role">' + role + "</div>" : "") +
      (bio ? '<p class="modulex-team-bio">' + bio + "</p>" : "") +
      "</div>";
  }
}
html = html.replace(/{{html}}/g, backhtml);
