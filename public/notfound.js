(function () {
  var KEY = "site-lang";
  var LEGACY = "notes-lang";

  function apply(lang) {
    if (lang !== "en" && lang !== "zh") return;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.querySelectorAll("[data-lang-zh], [data-lang-en]").forEach(function (btn) {
      var active =
        (btn.hasAttribute("data-lang-zh") && lang === "zh") ||
        (btn.hasAttribute("data-lang-en") && lang === "en");
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    try {
      localStorage.setItem(KEY, lang);
      localStorage.setItem(LEGACY, lang);
    } catch (e) {}
  }

  var saved = null;
  try {
    saved = localStorage.getItem(KEY) || localStorage.getItem(LEGACY);
  } catch (e) {}
  apply(saved === "en" || saved === "zh" ? saved : "zh");

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-lang-zh]")) apply("zh");
    if (event.target.closest("[data-lang-en]")) apply("en");
  });
})();
