/**
 * my-toybox-clip locale: same URL, ja/en from embedded JSON (#clip-i18n-data).
 * Inline boot sets window.__clipResolveLocale (must match logic here).
 */
(function () {
  var STORAGE_KEY = "clip_lang";
  var BOOT_CLASS = "clip-i18n-boot";

  function normalizeLang(tag) {
    if (!tag || typeof tag !== "string") return null;
    var t = tag.toLowerCase();
    if (t === "ja" || t.indexOf("ja-") === 0) return "ja";
    if (t === "en" || t.indexOf("en-") === 0) return "en";
    return null;
  }

  function resolveLocaleFromEnv() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      var st = normalizeLang(s);
      if (st) return st;
    } catch (e) {}
    var list =
      typeof navigator !== "undefined" && navigator.languages && navigator.languages.length
        ? navigator.languages
        : typeof navigator !== "undefined" && navigator.language
          ? [navigator.language]
          : [];
    for (var i = 0; i < list.length; i++) {
      var n = normalizeLang(list[i]);
      if (n) return n;
    }
    return "ja";
  }

  if (typeof window.__clipResolveLocale !== "function") {
    window.__clipResolveLocale = resolveLocaleFromEnv;
  }

  function getByPath(obj, path) {
    var parts = path.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function readPack() {
    var el = document.getElementById("clip-i18n-data");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  var _pack = null;
  var _locale = null;

  function getPack() {
    if (!_pack) _pack = readPack();
    return _pack;
  }

  function getLocale() {
    if (!_locale) _locale = window.__clipResolveLocale();
    return _locale;
  }

  function setLocale(next) {
    var n = normalizeLang(next);
    if (!n) return;
    try {
      localStorage.setItem(STORAGE_KEY, n);
    } catch (e) {}
    _locale = n;
    applyLocale(n);
  }

  function endBoot() {
    document.documentElement.classList.remove(BOOT_CLASS);
  }

  function updateLangButtons(locale) {
    var buttons = document.querySelectorAll("[data-clip-lang]");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var lang = b.getAttribute("data-clip-lang");
      var on = lang === locale;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) b.classList.add("is-active");
      else b.classList.remove("is-active");
    }
  }

  function applyLocale(locale) {
    var pack = getPack();
    if (!pack) {
      endBoot();
      return;
    }
    var table = pack[locale] || pack.ja;
    if (!table) {
      endBoot();
      return;
    }

    document.documentElement.lang = locale === "en" ? "en" : "ja";

    var textNodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < textNodes.length; i++) {
      var node = textNodes[i];
      if (node.tagName === "TITLE") continue;
      var key = node.getAttribute("data-i18n");
      var val = getByPath(table, key);
      if (typeof val === "string") node.textContent = val;
    }

    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    for (var h = 0; h < htmlNodes.length; h++) {
      var hn = htmlNodes[h];
      var hkey = hn.getAttribute("data-i18n-html");
      var hval = getByPath(table, hkey);
      if (typeof hval === "string") {
        var base = window.__CLIP_BASEURL__ || "";
        hn.innerHTML = hval.split("__BASE__").join(base);
      }
    }

    var titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      var tk = titleEl.getAttribute("data-i18n");
      var tv = getByPath(table, tk);
      if (typeof tv === "string") document.title = tv;
    }

    updateLangButtons(locale);
    endBoot();
    window.dispatchEvent(new CustomEvent("cliplocaleapplied", { detail: { locale: locale } }));
  }

  function init() {
    var locale = getLocale();
    applyLocale(locale);

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var langBtn = t.closest && t.closest("[data-clip-lang]");
      if (!langBtn) return;
      e.preventDefault();
      var lang = langBtn.getAttribute("data-clip-lang");
      setLocale(lang);
    });
  }

  window.clipLocale = {
    applyLocale: applyLocale,
    getLocale: getLocale,
    setLocale: setLocale,
    getString: function (locale, dottedKey) {
      var pack = getPack();
      if (!pack) return "";
      var table = pack[locale] || pack.ja;
      if (!table) return "";
      var v = getByPath(table, dottedKey);
      return typeof v === "string" ? v : "";
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
