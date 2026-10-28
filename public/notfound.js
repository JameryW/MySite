(function () {
  var LANG_KEY = "site-lang";
  var LANG_LEGACY = "notes-lang";
  var THEME_KEY = "theme";

  var ARIA = {
    zh: {
      "aria.lang": "语言切换 Language",
      "aria.theme": "切换主题",
      "aria.socials": "社交主页",
      "aria.github": "GitHub 主页",
      "aria.x": "X 主页",
      "aria.xhs": "小红书"
    },
    en: {
      "aria.lang": "Language",
      "aria.theme": "Toggle theme",
      "aria.socials": "Social profiles",
      "aria.github": "GitHub Profile",
      "aria.x": "X Profile",
      "aria.xhs": "Xiaohongshu"
    }
  };

  function applyAria(lang) {
    var map = ARIA[lang] || ARIA.zh;
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (key && map[key]) el.setAttribute("aria-label", map[key]);
    });
  }

  function applyLang(lang) {
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
    applyAria(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
      localStorage.setItem(LANG_LEGACY, lang);
    } catch (e) {}
  }

  function applyTheme(theme) {
    var light = theme === "light";
    if (light) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", light ? "#f0f2f8" : "#050816");
    try {
      localStorage.setItem(THEME_KEY, light ? "light" : "dark");
    } catch (e) {}
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  }

  var savedLang = null;
  var savedTheme = null;
  try {
    savedLang = localStorage.getItem(LANG_KEY) || localStorage.getItem(LANG_LEGACY);
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {}

  applyLang(savedLang === "en" || savedLang === "zh" ? savedLang : "zh");
  if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-lang-zh]")) applyLang("zh");
    if (event.target.closest("[data-lang-en]")) applyLang("en");
    if (event.target.closest("[data-theme-toggle], .theme-toggle")) toggleTheme();
  });
})();
