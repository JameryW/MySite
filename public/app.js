const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const syncPageVisibility = () => {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
};
syncPageVisibility();
document.addEventListener("visibilitychange", syncPageVisibility);
const orbA = document.querySelector(".orb-a");
const orbB = document.querySelector(".orb-b");
let orbC = document.querySelector(".orb-c");
if (!orbC && !reduceMotion) {
  orbC = document.createElement("div");
  orbC.className = "orb orb-c";
  orbC.setAttribute("aria-hidden", "true");
  document.body.insertBefore(orbC, document.body.firstChild);
}
const currentPage = document.body.dataset.page;
const yearNodes = document.querySelectorAll("[data-year]");
const scrollProgressNode = document.querySelector("[data-scroll-progress]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const homeProjectsNode = document.querySelector("[data-home-projects]");
const homeNotesNode = document.querySelector("[data-home-notes]");
const projectLibraryNode = document.querySelector("[data-project-library]");
const noteLibraryNode = document.querySelector("[data-note-library]");
const showcaseNode = document.querySelector("[data-showcase]");
const nowBuildingNode = document.querySelector("[data-now-building]");
const projectCountNodes = document.querySelectorAll("[data-project-count]");
const noteCountNodes = document.querySelectorAll("[data-note-count]");
const projectDetailNode = document.querySelector("[data-project-detail]");
const noteDetailNode = document.querySelector("[data-note-detail]");
const siteData = window.siteData || { profile: {}, projects: [], notes: [] };
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && reduceMotion) cursorGlow.style.display = "none";

/* ── Page Loader ──
   The shell stays visible. The head boot script only raises the cover
   after 480ms, and this dismisses it as soon as the script runs. */
const loader = document.querySelector(".page-loader");
if (loader) {
  const dismiss = () => loader.classList.add("loaded");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", dismiss);
  } else {
    dismiss();
  }
}

/* ── Data Streams Background ── */
if (!reduceMotion && finePointer) {
  const dataStreams = document.createElement("div");
  dataStreams.className = "data-streams";
  dataStreams.setAttribute("aria-hidden", "true");
  dataStreams.innerHTML = "<span></span><span></span><span></span><span></span><span></span><span></span>";
  document.body.insertBefore(dataStreams, document.body.firstChild);
}

/* ── Unified Pointer Tracking (rAF-throttled) ── */
let pointerX = 0;
let pointerY = 0;
let pointerFrame = false;

let glowTarget = null;
let glowEvent = null;

const tiltSelector = ".ops-card, .stack-card, .track-card, .metric-panel, .lab-card";

if (finePointer) document.addEventListener("pointermove", (e) => {
  pointerX = e.clientX;
  pointerY = e.clientY;

  /* Card glow tracking */
  const card = e.target.closest(".repo-card, .note-card, .work-card");
  glowTarget = card;
  glowEvent = card ? e : null;

  /* Card tilt target */
  const tiltCard = !reduceMotion ? e.target.closest(tiltSelector) : null;

  if (!pointerFrame) {
    pointerFrame = true;
    requestAnimationFrame(() => {
      pointerFrame = false;
      if (cursorGlow) {
        /* transform, not left/top: transform is composited-only and never a
           layout shift; the trailing translate(-50%,-50%) keeps centering
           size-independent. cursor-breathe lives on ::after so it cannot
           fight this inline transform. */
        cursorGlow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      }
      if (!reduceMotion) {
        const x = (pointerX / window.innerWidth - 0.5) * 16;
        const y = (pointerY / window.innerHeight - 0.5) * 16;
        if (orbA) orbA.style.transform = `translate(${x * -1.6}px, ${y * -1.6}px)`;
        if (orbB) orbB.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
      }
      if (glowTarget && glowEvent) {
        const rect = glowTarget.getBoundingClientRect();
        glowTarget.style.setProperty("--glow-x", ((glowEvent.clientX - rect.left) / rect.width * 100) + "%");
        glowTarget.style.setProperty("--glow-y", ((glowEvent.clientY - rect.top) / rect.height * 100) + "%");
      }
      if (tiltCard) {
        const rect = tiltCard.getBoundingClientRect();
        const tx = (pointerX - rect.left) / rect.width - 0.5;
        const ty = (pointerY - rect.top) / rect.height - 0.5;
        tiltCard.style.transform = `perspective(800px) rotateY(${tx * 4}deg) rotateX(${-ty * 4}deg) translateZ(4px)`;
      }
    });
  }
});

/* Card tilt reset on pointerout */
if (finePointer && !reduceMotion) {
  document.addEventListener("pointerout", (e) => {
    const card = e.target.closest(tiltSelector);
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
  });
}

/* ── Theme Toggle ── */
const themeToggle = document.querySelector(".theme-toggle");
let themeTimer = 0;
function setTheme(theme, animate) {
  if (animate) {
    document.documentElement.classList.add("theme-transitioning");
    clearTimeout(themeTimer);
    themeTimer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 220);
  }
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", theme === "light" ? "#f0f2f8" : "#050816");
}
if (themeToggle) {
  /* Head boot script already applied a saved light theme before paint.
     Re-apply without the color transition so restore does not fade the page. */
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") setTheme(saved, false);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark", true);
  });
}

/* Palette hint: ⌘K on Apple platforms, Ctrl+K elsewhere (Linux/Windows). */
const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || "") ||
  (/Mac/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 0);
document.querySelectorAll(".palette-hint kbd").forEach((kbd) => {
  kbd.textContent = isApplePlatform ? "⌘K" : "Ctrl+K";
});

/* ── Terminal Command / Output Stagger ── */
document.querySelectorAll(".terminal-body").forEach((terminal) => {
  const children = Array.from(terminal.children);
  let delay = 120;
  children.forEach((child) => {
    if (child.classList.contains("terminal-cmd")) {
      child.style.animationDelay = `${delay}ms`;
      delay += 140;
    } else if (child.classList.contains("terminal-out")) {
      child.style.animationDelay = `${delay}ms`;
      delay += 60;
    }
  });
});

/* ── Button Ripple Effect ── */
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", (e) => {
    if (reduceMotion || !finePointer) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ── Mobile Menu Toggle ── */
const menuToggle = document.querySelector(".menu-toggle");
const topbarMeta = document.querySelector(".topbar-meta");
if (menuToggle && topbarMeta) {
  const topbar = menuToggle.closest(".topbar");
  const closeMenu = () => {
    menuToggle.classList.remove("open");
    topbarMeta.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("open");
    topbarMeta.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      const firstLink = topbarMeta.querySelector(".nav a");
      if (firstLink) firstLink.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!topbarMeta.classList.contains("open")) return;
    if (topbar && !topbar.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && topbarMeta.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  topbarMeta.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* ── Same-page Anchor Scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
    history.pushState(null, "", href);
  });
});

const createTagList = (items) =>
  items.map((item) => `<span>${item}</span>`).join("");

/* Soft-break CamelCase product names at token boundaries
   (Awesome<wbr>Workflows) so wraps stay intentional, not mid-glyph. */
const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const softBreakCamelTitle = (title) =>
  escapeHtml(title).replace(/([a-z0-9])([A-Z])/g, "$1<wbr>$2");

/* Long delivery-chain / path copy wraps at arrows and slashes instead of
   clipping mid-token inside highlight cards. */
const softBreakFlowText = (text) =>
  escapeHtml(text)
    .replace(/→/g, "<wbr>→")
    .replace(/\//g, "/<wbr>");

const projectHeroTitleClass = (title) => {
  const len = String(title || "").length;
  if (len > 18) return "page-title is-long";
  if (len > 12) return "page-title is-medium";
  return "page-title";
};

/* When the signal panel sits beside the hero, keep the product name on
   one line by easing font-size down. Soft <wbr> breaks remain for the
   stacked mobile layout. */
const fitProjectHeroTitle = (root) => {
  const hero = root && root.querySelector(".page-hero");
  const title = root && root.querySelector(".page-title");
  const panel = root && root.querySelector(".page-hero-panel");
  if (!hero || !title || !panel) return;

  title.style.fontSize = "";
  title.style.whiteSpace = "";

  const columns = getComputedStyle(hero).gridTemplateColumns.trim().split(/\s+/);
  if (columns.length < 2) return;

  const span = title.querySelector("span");
  const available = title.clientWidth;
  if (available <= 0) return;

  let low = 28;
  let high = parseFloat(getComputedStyle(title).fontSize) || 64;
  const gutter = 28;
  title.style.whiteSpace = "nowrap";

  for (let i = 0; i < 14; i += 1) {
    const mid = (low + high) / 2;
    title.style.fontSize = `${mid}px`;
    const range = document.createRange();
    range.setStart(title, 0);
    if (span) range.setEndBefore(span);
    else range.selectNodeContents(title);
    const width = range.getBoundingClientRect().width;
    if (width <= available - gutter) low = mid;
    else high = mid;
  }

  title.style.fontSize = `${low}px`;
  title.style.whiteSpace = "";
};

const pageHeroPanelMarkup = (title, items) => `
  <aside class="page-hero-panel reveal" aria-label="${title}">
    <p class="stack-label">${title}</p>
    <div class="page-hero-panel-grid">
      ${items
        .map(
          (item) => `
            <div>
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  </aside>
`;

const projectDetailHref = (project) => `./project.html?slug=${project.slug}`;
const noteDetailHref = (note) => `./note.html?slug=${note.slug}`;
const detailCanonicalHref = (kind, slug) =>
  `https://www.jameryw.dev/${kind}.html?slug=${encodeURIComponent(slug)}`;
const projectBySlug = new Map(siteData.projects.map((project) => [project.slug, project]));
const noteBySlug = new Map(siteData.notes.map((note) => [note.slug, note]));

/* ── Site bilingual (zh / en) ──
   One preference drives notes, projects, and chrome. Technical keywords
   (Agent, Kernel, DAG, Showcase, Replay, hy-memory, …) stay English in both. */
const SITE_LANG_KEY = "site-lang";
const LEGACY_NOTES_LANG_KEY = "notes-lang";
let siteLang = "zh";
try {
  const savedLang = localStorage.getItem(SITE_LANG_KEY) || localStorage.getItem(LEGACY_NOTES_LANG_KEY);
  if (savedLang === "en" || savedLang === "zh") siteLang = savedLang;
} catch (langLoadErr) {}
const notesLang = () => siteLang;

const I18N = {
  zh: {
    "nav.home": "首页",
    "nav.projects": "项目",
    "nav.showcase": "Showcase",
    "nav.notes": "笔记",
    "nav.about": "关于",
    "nav.repos": "仓库",
    "nav.allNotes": "全部笔记",
    "aria.search": "搜索",
    "aria.theme": "切换主题",
    "aria.menu": "菜单",
    "aria.lang": "语言切换 Language",
    "aria.backTop": "回到顶部",
    "aria.primary": "主导航",
    "aria.socials": "社交主页",
    "aria.github": "GitHub 主页",
    "aria.x": "X 主页",
    "aria.xhs": "小红书",
    "aria.focus": "当前焦点",
    "aria.work": "精选项目",
    "aria.latestNotes": "最新笔记",
    "cta.projects": "项目方向",
    "cta.showcase": "在线作品",
    "cta.work": "核心项目",
    "cta.notes": "最新笔记",
    "cta.demos": "进入演示",
    "cta.allProjects": "全部项目",
    "cta.viewSource": "查看源码",
    "cta.openDetail": "查看详情",
    "cta.tryDemo": "在线体验",
    "cta.backProjects": "返回项目",
    "cta.backNotes": "返回笔记",
    "cta.readNote": "阅读全文",
    "cta.all": "全部",
    "cta.repos": "仓库列表",
    "cta.home": "首页",
    "cta.thinkNotes": "思考笔记",
    "cta.top": "顶部",
    "filter.all": "全部",
    "home.tagline": "终端是第二个大脑，LLM 是第三个。跑通原型比写文档勤；debug Agent 比 debug 自己勤。",
    "home.lead": "扎根杭州，专注 Agent 内核、分层记忆与可观测执行面；量化策略与 Code-as-Policy 也在同一条验证链上——原型跑通才叫验证。",
    "home.workSummary": "当前主线上的增长 Agent、分布式编程与量化系统。",
    "home.notesSummary": "判断、失败和构建方法，沉淀成还能继续改的笔记。",
    "home.focus1Title": "执行优于解释",
    "home.focus2Title": "内核优于技巧",
    "home.focus3Title": "信号优于声明",
    "home.focus1": "把工具、记忆和多步执行串成可恢复的闭环，比把单轮回答写漂亮更重要。",
    "home.focus2": "上限由状态、上下文编译、调度和发布边界决定，不靠临时技巧。",
    "home.focus3": "让别人从运行结果里读到能力，而不是从简历声明里读到。",
    "about.lead": "终端是第二个大脑，LLM 是第三个。现在把精力放在内核、记忆和可观测执行面上——先跑通，再谈结构。",
    "about.nowSummary": "两条主线并行：增长 Agent 内核化，编程系统可观测化。",
    "about.nowTitle": "最新进展",
    "about.profileSummary": "工具偏好、构建方法和公开信号，压成一套可扫描的说明。",
    "about.profileTitle": "工作方式",
    "about.bias": "边搭边想，优先跑通。想法要落到可恢复的系统，而不是一次性演示。",
    "about.method": "用 Agent 原型验证假设；公开迭代留下可核对的执行痕迹。",
    "about.lens": "上限由状态、上下文编译、调度和发布边界决定，而不是单次技巧。",
    "about.homeBase": "GitHub 放源码，站点整理进展，邮箱收灵感。",
    "about.entryTitle": "从这里进入",
    "about.entrySummary": "源码、社交和邮箱——公开入口集中在这里。",
    "about.openProjects": "打开项目",
    "about.openNotes": "打开笔记",
    "projects.eyebrow": "Portfolio / Active Builds",
    "projects.titleSub": "Agent · Kernel · Quant",
    "projects.lead": "增长 Agent、分布式编程、量化引擎，以及复用型交付工作流。",
    "projects.libraryTitle": "全部项目",
    "projects.librarySummary": "直接进入详情，少讲概念，多看执行痕迹。",
    "projects.libraryKicker": "Library",
    "projects.indexed": "个项目",
    "projects.signalLabel": "Build Signal",
    "projects.signalOnSite": "站内",
    "projects.signalFocus": "焦点",
    "projects.signalSurface": "入口",
    "projects.signalBias": "偏好",
    "projects.signalFocusValue": "Kernel runtimes · DAG coding · Quant",
    "projects.signalSurfaceValue": "GitHub 源码 + Showcase",
    "projects.signalBiasValue": "先跑通闭环，再打磨结构",
    "projects.footerKicker": "Projects / Open Build Loop",
    "projects.signalAria": "项目信号面板",
    "palette.page": "页面",
    "palette.external": "外部",
    "palette.github": "GitHub 主页",
    "palette.project": "项目",
    "palette.note": "笔记",
    "showcase.eyebrow": "Showcase / Live Demos",
    "showcase.titleSub": "Live Demos",
    "showcase.lead": "可直接打开的运行面：Showcase、Replay，以及量化系统演示。",
    "showcase.demosTitle": "在线演示",
    "showcase.demosSummary": "先看运行结果，再按需打开源码。",
    "showcase.demosKicker": "Live Products",
    "showcase.badge": "在线演示",
    "showcase.signalLabel": "Demo Signal",
    "showcase.signalSurface": "界面",
    "showcase.signalAccess": "访问",
    "showcase.signalFocus": "焦点",
    "showcase.signalNext": "下一步",
    "showcase.signalSurfaceValue": "jameryw.dev 上的 Live 系统",
    "showcase.signalAccessValue": "公开只读面优先",
    "showcase.signalFocusValue": "Growth Agent · Quant demos",
    "showcase.signalNextValue": "先看输出，再打开源码",
    "showcase.footerKicker": "Showcase / Ship Then Show",
    "showcase.signalAria": "Showcase 信号面板",
    "notes.eyebrow": "Notes / Working Thoughts",
    "notes.titleSub": "Working Thoughts",
    "notes.topbarStatus": "工作笔记",
    "notes.metaTag": "公开思考",
    "notes.metaSuffix": " / 笔记更新中",
    "notes.lead": "关于 Agent、构建方法和界面判断的短笔记。",
    "notes.libraryTitle": "最新思考",
    "notes.librarySummary": "先留下判断，再让项目和后续复盘继续验证。",
    "notes.libraryKicker": "All Notes",
    "notes.signalLabel": "Notes Signal",
    "notes.signalModeLabel": "模式",
    "notes.signalPublishedLabel": "发布",
    "notes.signalScopeLabel": "范围",
    "notes.signalMode": "短笔记 → 深挖",
    "notes.signalPublished": "篇在线",
    "notes.signalScopeValue": "Agents · tools · failures · UI",
    "notes.footerKicker": "Notes / Think In Public",
    "notes.signalAria": "笔记信号面板",
    "section.work": "核心构建",
    "section.workKicker": "Selected Work",
    "section.notes": "工作笔记",
    "section.notesKicker": "Latest Notes",
    "section.now": "最新进展",
    "home.eyebrow": "AI Builder / Agents / Quant Systems",
    "home.focusLabel": "Current Focus",
    "home.footerKicker": "Jamery Wang / Personal Signal Site",
    "home.topbarStatus": "杭州 / 在线",
    "home.metaTag": "极客模式开启",
    "home.metaSuffix": " / 杭州 / 在线",
    "about.topbarStatus": "AI-Native 偏好",
    "about.footerKicker": "About / AI Geek Profile",
    "about.metaTag": "AI geek 画像",
    "about.metaSuffix": " / 杭州 / 在线",
    "projects.topbarStatus": "项目主线",
    "projects.metaTag": "开放构建循环",
    "projects.metaSuffix": " / GitHub 优先",
    "showcase.topbarStatus": "在线演示",
    "showcase.metaTag": "先交付再展示",
    "showcase.metaSuffix": " / 杭州 / 在线",
    "detail.projectTopbar": "项目详情",
    "detail.noteTopbar": "笔记详情",
    "detail.projectFooterKicker": "Project Detail / Internal Case Layer",
    "detail.noteFooterKicker": "Note Detail / Internal Thinking Layer",
    "detail.projectMetaTag": "案例页",
    "detail.projectMetaSuffix": " / 进行中",
    "detail.noteMetaTag": "思考层",
    "detail.noteMetaSuffix": " / 笔记更新中",
    "detail.highlights": "关键设计",
    "detail.highlightLabel": "要点",
    "detail.highlightsSummary": "核心设计选择和技术亮点。",
    "detail.relatedNotes": "相关笔记",
    "detail.relatedNotesSummary": "从项目继续跳到相关判断和方法论。",
    "detail.relatedProjects": "相关项目",
    "detail.relatedProjectsSummary": "从判断跳回对应的项目入口，让想法和构建产物互相解释。",
    "detail.keyPoints": "关键要点",
    "detail.overview": "概览",
    "detail.lens": "视角",
    "detail.prev": "上一条",
    "detail.next": "下一条",
    "detail.prevMeta": "返回上一条",
    "detail.nextMeta": "继续阅读",
    "detail.openProject": "打开项目详情",
    "detail.notFoundProject": "这个项目还不存在，或者 slug 不正确。",
    "detail.notFoundNote": "这篇笔记还不存在，或者 slug 不正确。",
    "detail.notFoundProjectTitle": "未找到项目",
    "detail.notFoundNoteTitle": "未找到笔记",
    "detail.notFoundProjectEyebrow": "Error 404 / Projects",
    "detail.notFoundNoteEyebrow": "Error 404 / Notes",
    "meta.status": "状态",
    "meta.role": "角色",
    "meta.output": "产出",
    "meta.focus": "焦点",
    "meta.period": "周期",
    "meta.points": "要点",
    "meta.read": "阅读",
    "meta.builds": "关联",
    "meta.min": "分钟",
    "detail.signal": "项目信号",
    "detail.highlightsKicker": "Highlights",
    "detail.relatedNotesKicker": "Related Notes",
    "detail.breakdownKicker": "Breakdown",
    "detail.relatedProjectsKicker": "Related Projects",
    "about.eyebrow": "About / AI-Native Profile",
    "about.nowKicker": "Now Building",
    "about.profileKicker": "Working Profile",
    "about.signalBase": "基地 / 在线",
    "about.signalProjects": "项目",
    "about.signalNotes": "笔记",
    "about.signalLens": "当前透镜",
    "about.signalAria": "个人快照",
    "about.nowAria": "最新进展",
    "about.entryKicker": "Entry Points",
    "about.signalsHeading": "构建信号",
    "about.signalBias": "偏好",
    "about.signalMethod": "方法",
    "about.signalLensLabel": "透镜",
    "about.signalHomeBase": "主场",
    "card.relatedBuilds": "关联项目",
    "card.openDetail": "查看详情",
    "card.openDemo": "打开演示",
    "palette.placeholder": "搜索项目、笔记或页面...",
    "palette.empty": "没有匹配结果",
    "footer.home": "围绕 AI、自动化、原型和公开构建过程持续迭代。",
    "footer.about": "兴趣、偏好和构建方法，整理成可读的公开说明。",
    "footer.projects": "从核心项目直接进入代码、设计选择和相关笔记。",
    "footer.showcase": "从代码到可运行系统，把原型变成可验证的在线体验。",
    "footer.notes": "把观察、失败和工作流判断留在公开轨迹里，方便继续迭代。",
    "footer.projectDetail": "把外部链接转换成站内可阅读的项目说明，逐步积累成更完整的作品资料。",
    "footer.noteDetail": "把短观察扩成站内可持续阅读的笔记条目，为后续长文和项目复盘打底。",
    "aria.skip": "跳到主要内容",
    "shipping": "推进中"
  },
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.showcase": "Showcase",
    "nav.notes": "Notes",
    "nav.about": "About",
    "nav.repos": "Repos",
    "nav.allNotes": "All Notes",
    "aria.search": "Search",
    "aria.theme": "Toggle theme",
    "aria.menu": "Menu",
    "aria.lang": "Language",
    "aria.backTop": "Back to top",
    "aria.primary": "Primary",
    "aria.socials": "Social profiles",
    "aria.github": "GitHub Profile",
    "aria.x": "X Profile",
    "aria.xhs": "Xiaohongshu",
    "aria.focus": "Current focus",
    "aria.work": "Selected work",
    "aria.latestNotes": "Latest notes",
    "cta.projects": "Project tracks",
    "cta.showcase": "Live work",
    "cta.work": "Core builds",
    "cta.notes": "Latest notes",
    "cta.demos": "Open demos",
    "cta.allProjects": "All projects",
    "cta.viewSource": "View source",
    "cta.openDetail": "Open detail",
    "cta.tryDemo": "Try demo",
    "cta.backProjects": "Back to projects",
    "cta.backNotes": "Back to notes",
    "cta.readNote": "Read note",
    "cta.all": "All",
    "cta.repos": "Repositories",
    "cta.home": "Home",
    "cta.thinkNotes": "Browse notes",
    "cta.top": "Top",
    "filter.all": "All",
    "home.tagline": "The terminal is my second brain, the LLM the third. Ship prototypes more than docs; debug Agents more than myself.",
    "home.lead": "Based in Hangzhou, focused on Agent kernels, layered memory, and observable execution — with quant strategies and Code-as-Policy on the same verification loop. A prototype only counts once it runs.",
    "home.workSummary": "Growth Agents, distributed coding systems, and quant builds on the current main line.",
    "home.notesSummary": "Judgment, failure, and build method — kept as notes you can still revise.",
    "home.focus1Title": "Execution Over Explanation",
    "home.focus2Title": "Kernel Over Tricks",
    "home.focus3Title": "Signal Over Claims",
    "home.focus1": "A recoverable loop of tools, memory, and multi-step execution beats a polished single-turn answer.",
    "home.focus2": "The ceiling is set by state, context compilation, scheduling, and publish boundaries — not one-off tricks.",
    "home.focus3": "Let people read ability from running results, not from resume claims.",
    "about.lead": "The terminal is the second brain, the LLM the third. Focus now sits on Kernel, memory, and observable execution — ship the loop, then refine structure.",
    "about.nowSummary": "Two tracks in parallel: Kernel-izing the growth Agent, and making the coding system observable.",
    "about.nowTitle": "Latest progress",
    "about.profileSummary": "Tool bias, build method, and public signal — compressed into a scannable profile.",
    "about.profileTitle": "How I work",
    "about.bias": "Build while thinking. Prefer a recoverable system over a one-shot demo.",
    "about.method": "Validate hypotheses with Agent prototypes; leave checkable execution traces in public.",
    "about.lens": "The ceiling is state, context compilation, scheduling, and publish boundaries — not a single trick.",
    "about.homeBase": "GitHub holds source, the site holds progress, email holds sparks.",
    "about.entryTitle": "Start here",
    "about.entrySummary": "Source, socials, and email — the public doors in one place.",
    "about.openProjects": "Open projects",
    "about.openNotes": "Open notes",
    "projects.eyebrow": "Portfolio / Active Builds",
    "projects.titleSub": "Agent · Kernel · Quant",
    "projects.lead": "Growth Agents, distributed coding, quant engines, and reusable delivery workflows.",
    "projects.libraryTitle": "All projects",
    "projects.librarySummary": "Jump into details. Less concept talk, more execution traces.",
    "projects.libraryKicker": "Library",
    "projects.indexed": "projects indexed",
    "projects.signalLabel": "Build Signal",
    "projects.signalOnSite": "On-site",
    "projects.signalFocus": "Focus",
    "projects.signalSurface": "Surface",
    "projects.signalBias": "Bias",
    "projects.signalFocusValue": "Kernel runtimes · DAG coding · Quant",
    "projects.signalSurfaceValue": "GitHub source + live Showcase",
    "projects.signalBiasValue": "Ship the loop, then refine structure",
    "projects.footerKicker": "Projects / Open Build Loop",
    "projects.signalAria": "Projects signal panel",
    "palette.page": "Page",
    "palette.external": "External",
    "palette.github": "GitHub Profile",
    "palette.project": "Project",
    "palette.note": "Note",
    "showcase.eyebrow": "Showcase / Live Demos",
    "showcase.titleSub": "Live Demos",
    "showcase.lead": "Live surfaces you can open now: Showcase, Replay, and quant demos.",
    "showcase.demosTitle": "Running surfaces",
    "showcase.demosSummary": "Inspect the running result first, then open the source if you want.",
    "showcase.demosKicker": "Live Products",
    "showcase.badge": "Live demo",
    "showcase.signalLabel": "Demo Signal",
    "showcase.signalSurface": "Surface",
    "showcase.signalAccess": "Access",
    "showcase.signalFocus": "Focus",
    "showcase.signalNext": "Next",
    "showcase.signalSurfaceValue": "Live systems on jameryw.dev",
    "showcase.signalAccessValue": "Public read surfaces first",
    "showcase.signalFocusValue": "Growth Agent · Quant demos",
    "showcase.signalNextValue": "Inspect output, then open source",
    "showcase.footerKicker": "Showcase / Ship Then Show",
    "showcase.signalAria": "Showcase signal panel",
    "notes.eyebrow": "Notes / Working Thoughts",
    "notes.titleSub": "Working Thoughts",
    "notes.topbarStatus": "Working Notes",
    "notes.metaTag": "Think in public",
    "notes.metaSuffix": " / Notes in progress",
    "notes.lead": "Short notes on Agents, build method, and interface judgment.",
    "notes.libraryTitle": "Latest thinking",
    "notes.librarySummary": "Leave the judgment first, then let projects and later reviews keep testing it.",
    "notes.libraryKicker": "All Notes",
    "notes.signalLabel": "Notes Signal",
    "notes.signalModeLabel": "Mode",
    "notes.signalPublishedLabel": "Published",
    "notes.signalScopeLabel": "Scope",
    "notes.signalMode": "Short notes → deep dives",
    "notes.signalPublished": "notes live",
    "notes.signalScopeValue": "Agents · tools · failures · UI",
    "notes.footerKicker": "Notes / Think In Public",
    "notes.signalAria": "Notes signal panel",
    "section.work": "Core Builds",
    "section.workKicker": "Selected Work",
    "section.notes": "Working Notes",
    "section.notesKicker": "Latest Notes",
    "section.now": "Now building",
    "home.eyebrow": "AI Builder / Agents / Quant Systems",
    "home.focusLabel": "Current Focus",
    "home.footerKicker": "Jamery Wang / Personal Signal Site",
    "home.topbarStatus": "Hangzhou / Online",
    "home.metaTag": "Geek mode enabled",
    "home.metaSuffix": " / Hangzhou / Online",
    "about.topbarStatus": "AI-Native Bias",
    "about.footerKicker": "About / AI Geek Profile",
    "about.metaTag": "AI geek profile",
    "about.metaSuffix": " / Hangzhou / Online",
    "projects.topbarStatus": "Project Surface",
    "projects.metaTag": "Open build loop",
    "projects.metaSuffix": " / GitHub first",
    "showcase.topbarStatus": "Live Demos",
    "showcase.metaTag": "Ship then show",
    "showcase.metaSuffix": " / Hangzhou / Online",
    "detail.projectTopbar": "Project Detail",
    "detail.noteTopbar": "Note Detail",
    "detail.projectFooterKicker": "Project Detail / Internal Case Layer",
    "detail.noteFooterKicker": "Note Detail / Internal Thinking Layer",
    "detail.projectMetaTag": "Case page",
    "detail.projectMetaSuffix": " / Work in progress",
    "detail.noteMetaTag": "Thinking layer",
    "detail.noteMetaSuffix": " / Notes in progress",
    "detail.highlights": "Key design",
    "detail.highlightLabel": "Point",
    "detail.highlightsSummary": "Key design choices and technical highlights.",
    "detail.relatedNotes": "Related notes",
    "detail.relatedNotesSummary": "Jump from the project into matching judgments and methods.",
    "detail.relatedProjects": "Related projects",
    "detail.relatedProjectsSummary": "Jump from the judgment back to the matching builds.",
    "detail.keyPoints": "Key points",
    "detail.overview": "Overview",
    "detail.lens": "Lens",
    "detail.prev": "Previous",
    "detail.next": "Next",
    "detail.prevMeta": "go back one",
    "detail.nextMeta": "keep reading",
    "detail.openProject": "open project detail",
    "detail.notFoundProject": "This project doesn't exist yet, or the slug is wrong.",
    "detail.notFoundNote": "This note doesn't exist yet, or the slug is wrong.",
    "detail.notFoundProjectTitle": "Project Not Found",
    "detail.notFoundNoteTitle": "Note Not Found",
    "detail.notFoundProjectEyebrow": "Error 404 / Projects",
    "detail.notFoundNoteEyebrow": "Error 404 / Notes",
    "meta.status": "Status",
    "meta.role": "Role",
    "meta.output": "Output",
    "meta.focus": "Focus",
    "meta.period": "Period",
    "meta.points": "Points",
    "meta.read": "Read",
    "meta.builds": "Builds",
    "meta.min": "min",
    "detail.signal": "Project Signal",
    "detail.highlightsKicker": "Highlights",
    "detail.relatedNotesKicker": "Related Notes",
    "detail.breakdownKicker": "Breakdown",
    "detail.relatedProjectsKicker": "Related Projects",
    "about.eyebrow": "About / AI-Native Profile",
    "about.nowKicker": "Now Building",
    "about.profileKicker": "Working Profile",
    "about.signalBase": "Base / online",
    "about.signalProjects": "Projects",
    "about.signalNotes": "Notes",
    "about.signalLens": "Current lens",
    "about.signalAria": "Profile snapshot",
    "about.nowAria": "Now building",
    "about.entryKicker": "Entry Points",
    "about.signalsHeading": "Build Signals",
    "about.signalBias": "Bias",
    "about.signalMethod": "Method",
    "about.signalLensLabel": "Lens",
    "about.signalHomeBase": "Home Base",
    "card.relatedBuilds": "builds",
    "card.openDetail": "Open detail",
    "card.openDemo": "Open demo",
    "palette.placeholder": "Search projects, notes, or pages...",
    "palette.empty": "No matches",
    "footer.home": "Iterating on AI, automation, prototypes, and building in public.",
    "footer.about": "Interests, bias, and build method — kept as a readable public profile.",
    "footer.projects": "Jump from core builds into code, design choices, and related notes.",
    "footer.showcase": "From code to a running system — prototypes you can verify online.",
    "footer.notes": "Leave observations, failures, and workflow judgment in a public trail.",
    "footer.projectDetail": "Turn external repos into readable on-site case notes that compound over time.",
    "footer.noteDetail": "Expand short observations into lasting note entries for later reviews.",
    "aria.skip": "Skip to main content",
    "shipping": "Shipping"
  }
};

const t = (key) => (I18N[siteLang] && I18N[siteLang][key]) || (I18N.zh && I18N.zh[key]) || key;

const noteText = (note, base) => {
  if (siteLang === "en" && note[`${base}En`]) return note[`${base}En`];
  return note[base];
};
const noteTitle = (note) => (siteLang === "en" ? note.titleEn || note.title : note.title);
const noteTitleSub = (note) => (siteLang === "en" ? "" : note.titleEn || "");
const noteDetailTitle = (note) => (siteLang === "en" ? note.detailTitleEn || note.detailTitle : note.detailTitle);
const noteDetailTitleSub = (note) => (siteLang === "en" ? "" : note.detailTitleEn || "");
/* EN mirror of the whole heading (title + detail title) as one small caption
   line — keeps the h1 down to two clear weights instead of three. */
const noteHeadingEn = (note) => [noteTitleSub(note), noteDetailTitleSub(note)].filter(Boolean).join(" — ");
const noteBullets = (note) => (siteLang === "en" && Array.isArray(note.bulletsEn) ? note.bulletsEn : note.bullets);
const noteLens = (note) => (siteLang === "zh" ? note.lensZh || note.lens : note.lens);
const projectText = (project, base) => {
  if (siteLang === "en" && project[`${base}En`]) return project[`${base}En`];
  return project[base];
};
const projectHighlights = (project) =>
  siteLang === "en" && Array.isArray(project.highlightsEn) ? project.highlightsEn : project.highlights;
/* note.meta is authored as "Focus: xxx" — the facts strip already labels the
   cell, so drop the inline prefix to avoid printing the word twice. */
const noteFocusValue = (note) => (note.meta || "").replace(/^\s*focus\s*[:：]\s*/i, "").trim();
const updateLangToggleUI = () => {
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    const active = btn.getAttribute("data-lang-toggle") === siteLang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".lang-toggle").forEach((group) => {
    group.setAttribute("aria-label", t("aria.lang"));
  });
};
const applyChromeI18n = () => {
  document.documentElement.lang = siteLang === "en" ? "en" : "zh-CN";
  document.documentElement.setAttribute("data-lang", siteLang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const value = t(key);
    if (value) el.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = t(key);
    if (value) el.setAttribute("placeholder", value);
  });
  const profileTitle = siteData.profile && (siteLang === "en" ? siteData.profile.titleEn : siteData.profile.title);
  document.querySelectorAll("[data-profile-title]").forEach((el) => {
    if (profileTitle) el.textContent = profileTitle;
  });
  document.querySelectorAll("[data-i18n-en-hint]").forEach((el) => {
    const key = el.getAttribute("data-i18n-en-hint");
    const enValue = (I18N.en && I18N.en[key]) || "";
    if (siteLang === "en" || !enValue) {
      el.hidden = true;
      el.textContent = "";
    } else {
      el.hidden = false;
      el.textContent = enValue;
    }
  });
};
const applyStoredFilter = (container) => {
  const cards = [...container.querySelectorAll(":scope > a")];
  const activeLabel = (container.dataset.activeFilter || "").trim();
  if (!activeLabel) return cards.length;
  let visible = 0;
  cards.forEach((card) => {
    const cardLabel = card.querySelector(".stack-label, .card-topline, .note-meta");
    const shown = cardLabel && cardLabel.textContent.includes(activeLabel);
    card.style.display = shown ? "" : "none";
    if (shown) visible++;
  });
  return visible;
};
function renderNoteLibraries(instant = false) {
  if (homeNotesNode) {
    homeNotesNode.innerHTML = siteData.notes.filter((note) => note.featured).reverse().slice(0, 4).map(noteCardMarkup).join("");
  }
  if (noteLibraryNode) {
    noteLibraryNode.innerHTML = siteData.notes.map(noteCardMarkup).join("");
    updateNoteCount(applyStoredFilter(noteLibraryNode));
  }
  updateLangToggleUI();
  if (instant) {
    [homeNotesNode, noteLibraryNode].forEach((node) => {
      if (node) node.querySelectorAll(".reveal").forEach((card) => card.classList.add("visible"));
    });
  }
}
const updateNoteCount = (visible) => {
  noteCountNodes.forEach((node) => {
    node.textContent = visible;
  });
};
const noteReadMinutes = (note) => {
  const text = [noteText(note, "overview"), noteLens(note), ...noteBullets(note)].join(" ");
  const cjk = (text.match(/[一-鿿豈-﫿]/g) || []).length;
  const words = (text.match(/[A-Za-z0-9']+/g) || []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 200));
};

const getSiblingEntries = (entries, currentSlug) => {
  const index = entries.findIndex((entry) => entry.slug === currentSlug);
  const safeIndex = index >= 0 ? index : 0;

  return {
    previous: entries[safeIndex - 1] || null,
    next: entries[safeIndex + 1] || null
  };
};

const capitalizeSentenceStart = (text) => {
  if (!text) return text;
  // Keep intentional lowercase product/code tokens (hy-memory, `$codex-…`, paths).
  if (/^(hy-|oh-|xai |\$|`|\.|\/)/i.test(text)) return text;
  return text.replace(/^([a-z])/, (ch) => ch.toUpperCase());
};

const detailItemParts = (item, fallbackTitle) => {
  const text = item.trim();
  const labeledMatch = text.match(/^(.{2,42}?)(?:\s+[—-]\s+|[:：]\s*)(.+)$/);
  if (labeledMatch) {
    return {
      title: labeledMatch[1].trim(),
      body: capitalizeSentenceStart(labeledMatch[2].trim())
    };
  }

  const sentenceMatch = text.match(/^(.{6,64}?)[，。,.]\s*(.+)$/);
  if (sentenceMatch) {
    return {
      title: sentenceMatch[1].trim(),
      body: capitalizeSentenceStart(sentenceMatch[2].trim())
    };
  }

  return {
    title: fallbackTitle || (text.length > 24 ? `${text.slice(0, 24)}...` : text),
    body: text
  };
};

/* Detail pages are JS-rendered shells: mirror title/description/canonical per
   slug so share cards and crawlers see the entry, not the empty shell. Canonical
   uses the clean ?slug= URL so extra params converge instead of splitting weight.
   The static head metas remain the no-slug / not-found fallback. */
const setDetailMeta = ({ title, description, canonical }) => {
  if (title) {
    document.title = `Jamery Wang | ${title}`;
    [
      document.querySelector('meta[property="og:title"]'),
      document.querySelector('meta[name="twitter:title"]')
    ].forEach((node) => {
      if (node) node.setAttribute("content", `Jamery Wang | ${title}`);
    });
  }
  if (description) {
    [
      document.querySelector('meta[name="description"]'),
      document.querySelector('meta[property="og:description"]'),
      document.querySelector('meta[name="twitter:description"]')
    ].forEach((node) => {
      if (node) node.setAttribute("content", description);
    });
  }
  if (canonical) {
    const canonicalNode = document.querySelector('link[rel="canonical"]');
    if (canonicalNode) canonicalNode.setAttribute("href", canonical);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonical);
  }
};

const relatedProjectMarkup = (project) => `
  <a class="track-card reveal related-card" href="${projectDetailHref(project)}">
    <p class="stack-label">${project.label}</p>
    <h3>${project.title}</h3>
    <p>${projectText(project, "summary")}</p>
    <div class="card-actions">
      <span class="repo-meta">${project.status}</span>
      <span class="card-inline-link">${t("detail.openProject")} <span aria-hidden="true">→</span></span>
    </div>
  </a>
`;

const relatedNoteMarkup = (note) => `
  <a class="track-card reveal related-card related-note-card" href="${noteDetailHref(note)}">
    <p class="stack-label">${note.code ? `${note.code} / ` : ""}${note.label}</p>
    <h3>${noteTitle(note)}</h3>
    <p>${noteText(note, "summary")}</p>
    <div class="card-actions">
      <span class="repo-meta">${note.timeframe || t("cta.readNote")}</span>
      <span class="card-inline-link">${t("cta.readNote")} <span aria-hidden="true">→</span></span>
    </div>
  </a>
`;

const entryDisplayTitle = (entry) => (entry && entry.titleEn ? noteTitle(entry) : entry?.title || "");

const detailPagerMarkup = (options) => {
  const { previous, next, previousHref, nextHref, previousLabel, nextLabel } = options;

  if (!previous && !next) {
    return "";
  }

  const mode = previous && next ? "" : previous ? " is-single-prev" : " is-single-next";

  return `
    <section class="section">
      <div class="detail-pager${mode}">
        ${
          previous
            ? `
              <a class="track-card reveal related-card pager-card" href="${previousHref(previous)}">
                <p class="stack-label">${t("detail.prev")}</p>
                <h3>${entryDisplayTitle(previous)}</h3>
                <p>${previousLabel(previous)}</p>
                <span class="repo-meta">${t("detail.prevMeta")}</span>
              </a>
            `
            : ""
        }
        ${
          next
            ? `
              <a class="track-card reveal related-card pager-card" href="${nextHref(next)}">
                <p class="stack-label">${t("detail.next")}</p>
                <h3>${entryDisplayTitle(next)}</h3>
                <p>${nextLabel(next)}</p>
                <span class="repo-meta">${t("detail.nextMeta")}</span>
              </a>
            `
            : ""
        }
      </div>
    </section>
  `;
};

const projectCardMarkup = (project, variant) => {
  const summary = projectText(project, "summary");
  const openDetail = t("card.openDetail");
  if (variant === "home") {
    const homeLiveDot =
      project.status.toLowerCase().includes("active") ||
      project.status.toLowerCase().includes("production") ||
      project.status.toLowerCase().includes("live")
        ? "live"
        : "dev";
    return `
      <a class="work-card reveal" href="${projectDetailHref(project)}">
        <div class="work-index">${project.code}</div>
        <div class="work-copy">
          <p class="card-topline">
            ${project.label}
            <span class="card-status-dot ${homeLiveDot}" aria-hidden="true"></span>
            <span class="work-status-pill">${project.status}</span>
            ${project.demoUrl ? `<span class="showcase-demo-badge">${t("showcase.badge")}</span>` : ""}
          </p>
          <h3>${project.title}</h3>
          <p class="work-summary">${summary}</p>
          <div class="card-tags">${createTagList(project.stack)}</div>
          <div class="card-actions">
            <span class="work-link">${openDetail} <span class="work-arrow" aria-hidden="true">→</span></span>
          </div>
        </div>
      </a>
    `;
  }

  const liveDot =
    project.status.toLowerCase().includes("active") ||
    project.status.toLowerCase().includes("production") ||
    project.status.toLowerCase().includes("live")
      ? "live"
      : "dev";
  return `
    <a class="repo-card reveal project-entry-card" href="${projectDetailHref(project)}">
      <div class="project-entry-head">
        <p class="stack-label">
          ${project.label}
          <span class="card-status-dot ${liveDot}" aria-hidden="true"></span>
        </p>
        ${project.demoUrl ? `<span class="showcase-demo-badge">${t("showcase.badge")}</span>` : ""}
      </div>
      <h3>${project.title}</h3>
      <p>${summary}</p>
      <div class="project-entry-meta">
        <span class="project-entry-status">${project.status}</span>
        <div class="card-tags">${createTagList(project.stack)}</div>
      </div>
      <div class="card-actions">
        <span class="repo-meta">${project.timeframe}</span>
        <span class="card-inline-link">${openDetail} <span aria-hidden="true">→</span></span>
      </div>
    </a>
  `;
};

const noteStatusKind = (status) =>
  String(status || "")
    .toLowerCase()
    .replace(/\s+note$/i, "")
    .trim()
    .replace(/\s+/g, "-");
const noteStatusLabel = (status) =>
  String(status || "")
    .replace(/\s+note$/i, "")
    .trim();

const noteCardMarkup = (note) => {
  const buildCount = Array.isArray(note.relatedProjects) ? note.relatedProjects.length : 0;
  const teaser = noteText(note, "summary") || noteText(note, "overview") || "";
  const title = noteTitle(note);
  const titleSub = noteTitleSub(note);
  const buildWord = siteLang === "en" ? (buildCount === 1 ? "build" : t("card.relatedBuilds")) : t("card.relatedBuilds");
  const readWord = t("cta.readNote");
  const statusLabel = noteStatusLabel(note.status);
  const statusKind = noteStatusKind(note.status);
  /* Skip universal bullet counts — every note ships 4 points, so the
     number is noise. Related-project counts still vary and stay useful. */
  return `
  <a class="note-card reveal note-entry-card" href="${noteDetailHref(note)}">
    <div class="note-card-head">
      <p class="stack-label"><span class="note-code">${note.code || "Note"}</span><span class="note-label-rest"> / ${note.label || ""}</span></p>
      ${note.timeframe ? `<span class="note-timeframe">${note.timeframe}</span>` : ""}
    </div>
    <h3>${title}${titleSub ? `<span class="title-en">${titleSub}</span>` : ""}</h3>
    <p class="note-summary">${teaser}</p>
    <div class="card-actions">
      <span class="note-meta-inline">
        ${
          statusLabel
            ? `<span class="note-status-pill" data-kind="${statusKind}">${statusLabel}</span>`
            : ""
        }
        ${buildCount > 0 ? `<span class="repo-meta">${buildCount} ${buildWord}</span>` : ""}
      </span>
      <span class="card-inline-link">${readWord} <span aria-hidden="true">→</span></span>
    </div>
  </a>
  `;
};

document.querySelectorAll(".nav a").forEach((link) => {
  const href = link.getAttribute("href");
  const pageMap = {
    "./index.html": "home",
    "./projects.html": "projects",
    "./showcase.html": "showcase",
    "./notes.html": "notes",
    "./about.html": "about"
  };

  if (href && pageMap[href] === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

if (homeProjectsNode) {
  const featuredProjects = siteData.projects.filter((project) => project.featured);
  homeProjectsNode.innerHTML = featuredProjects.map((project) => projectCardMarkup(project, "home")).join("");
}

if (projectLibraryNode) {
  projectLibraryNode.innerHTML = siteData.projects.map((project) => projectCardMarkup(project, "library")).join("");
}

renderNoteLibraries();

if (projectCountNodes.length > 0) {
  projectCountNodes.forEach((node) => {
    node.textContent = siteData.projects.length;
  });
}

if (noteCountNodes.length > 0) {
  noteCountNodes.forEach((node) => {
    node.textContent = siteData.notes.length;
  });
}

/* ── Filter/Tag System for Library Pages ── */
function setupFilter(container, items, onFilter) {
  const allLabels = new Set();
  items.forEach((item) => {
    if (item.label) allLabels.add(item.label);
  });

  if (allLabels.size < 2 || !container) return;

  const applyFilter = (activeLabel) => {
    container.dataset.activeFilter = activeLabel || "";
    const cards = container.querySelectorAll(":scope > a");
    let visible = 0;
    cards.forEach((card) => {
      if (!activeLabel) {
        card.style.display = "";
        visible++;
        return;
      }
      const cardLabel = card.querySelector(".stack-label, .card-topline, .note-meta");
      const shown = cardLabel && cardLabel.textContent.includes(activeLabel);
      card.style.display = shown ? "" : "none";
      if (shown) visible++;
    });
    if (typeof onFilter === "function") onFilter(activeLabel, visible, cards.length);
    return visible;
  };

  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const allPill = document.createElement("button");
  allPill.className = "filter-pill active";
  allPill.textContent = `${t("filter.all")} (${items.length})`;
  allPill.setAttribute("aria-pressed", "true");
  filterBar.appendChild(allPill);

  allLabels.forEach((label) => {
    const pill = document.createElement("button");
    pill.className = "filter-pill";
    pill.textContent = label;
    pill.dataset.filterLabel = label;
    pill.setAttribute("aria-pressed", "false");
    filterBar.appendChild(pill);
  });

  container.parentNode.insertBefore(filterBar, container);

  filterBar.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;

    filterBar.querySelectorAll(".filter-pill").forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-pressed", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-pressed", "true");

    const activeLabel = pill.dataset.filterLabel || null;
    applyFilter(activeLabel);
  });
}

if (projectLibraryNode) {
  setupFilter(projectLibraryNode, siteData.projects);
}

if (noteLibraryNode) {
  setupFilter(noteLibraryNode, siteData.notes, (label, visible) => updateNoteCount(visible));
}

const renderProjectDetail = (instant = false) => {
  if (!projectDetailNode) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const project = projectBySlug.get(slug);
  const relatedNotes = project ? (project.relatedNotes || [])
    .map((entrySlug) => noteBySlug.get(entrySlug))
    .filter(Boolean) : [];
  const siblings = project ? getSiblingEntries(siteData.projects, project.slug) : { previous: null, next: null };

  if (!project) {
    projectDetailNode.innerHTML = `
      <section class="page-hero notfound-hero">
        <p class="eyebrow">${t("detail.notFoundProjectEyebrow")}</p>
        <h1 class="page-title">
          ${t("detail.notFoundProjectTitle")}
          <span>404</span>
        </h1>
        <p class="page-lead">${t("detail.notFoundProject")}</p>
        <div class="page-actions">
          <a class="button primary" href="./projects.html">${t("cta.backProjects")}</a>
          <a class="button secondary" href="./index.html">${t("cta.home")}</a>
        </div>
      </section>
    `;
  } else {
    const overview = projectText(project, "overview");
    const highlights = projectHighlights(project) || [];
    setDetailMeta({
      title: project.title,
      description: overview,
      canonical: detailCanonicalHref("project", project.slug)
    });
    projectDetailNode.setAttribute("aria-busy", "true");
    projectDetailNode.innerHTML = `
      <section class="page-hero reveal">
        <p class="eyebrow">${project.label} / ${project.timeframe} / ${project.status}</p>
        <h1 class="${projectHeroTitleClass(project.title)}">
          ${softBreakCamelTitle(project.title)}
          <span>${escapeHtml(project.detailTitle)}</span>
        </h1>
        <p class="page-lead">${overview}</p>
        <div class="page-actions">
          ${
            project.demoUrl
              ? `<a class="button primary" href="${project.demoUrl}" target="_blank" rel="noreferrer">${t("cta.tryDemo")}</a>
          <a class="button secondary" href="${project.href}" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="vertical-align:-3px;margin-right:6px;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            ${t("cta.viewSource")}
          </a>`
              : `<a class="button primary" href="${project.href}" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="vertical-align:-3px;margin-right:6px;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            ${t("cta.viewSource")}
          </a>`
          }
          <a class="button secondary" href="./projects.html">${t("cta.backProjects")}</a>
        </div>
        ${pageHeroPanelMarkup(t("detail.signal"), [
          { label: t("meta.status"), value: project.status },
          { label: t("meta.role"), value: project.role },
          { label: t("meta.output"), value: project.outputs.slice(0, 2).join(" / ") }
        ])}
      </section>

      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">${t("detail.highlightsKicker")}</p>
          <h2>${t("detail.highlights")}</h2>
          <p class="section-summary">${project.title} — ${t("detail.highlightsSummary")}</p>
        </div>
        <div class="build-track-grid">
          ${highlights
            .map((item, index) => {
              const highlight = detailItemParts(item);

              return `
                <article class="track-card reveal">
                  <p class="stack-label">${t("detail.highlightLabel")} 0${index + 1}</p>
                  <h3>${escapeHtml(highlight.title)}</h3>
                  <p>${softBreakFlowText(highlight.body)}</p>
                  <span class="repo-meta">${escapeHtml(project.outputs[index] || project.stack[index] || project.status)}</span>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>

      ${relatedNotes.length > 0 ? `
      <section class="section">
        <div class="section-head reveal">
          <p class="section-kicker">${t("detail.relatedNotesKicker")}</p>
          <h2>${t("detail.relatedNotes")}</h2>
          <p class="section-summary">${t("detail.relatedNotesSummary")}</p>
        </div>
        <div class="build-track-grid related-track-grid">
          ${relatedNotes.map((note) => relatedNoteMarkup(note)).join("")}
        </div>
      </section>
      ` : ''}

      ${detailPagerMarkup({
        previous: siblings.previous,
        next: siblings.next,
        previousHref: projectDetailHref,
        nextHref: projectDetailHref,
        previousLabel: (entry) => entry.label,
        nextLabel: (entry) => entry.label
       })}
    `;
    projectDetailNode.setAttribute("aria-busy", "false");
    requestAnimationFrame(() => fitProjectHeroTitle(projectDetailNode));
    if (!instant) {
      const mainContent = document.getElementById("main-content");
      if (mainContent) mainContent.focus({ preventScroll: true });
    }
  }
  updateLangToggleUI();
  if (instant) {
    projectDetailNode.querySelectorAll(".reveal").forEach((node) => node.classList.add("visible"));
  }
};
renderProjectDetail();

let projectHeroFitTimer = 0;
window.addEventListener("resize", () => {
  if (!projectDetailNode) return;
  clearTimeout(projectHeroFitTimer);
  projectHeroFitTimer = window.setTimeout(() => fitProjectHeroTitle(projectDetailNode), 120);
});

const renderNoteDetail = (instant = false) => {
  if (!noteDetailNode) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const note = noteBySlug.get(slug);
  const relatedProjects = note ? (note.relatedProjects || [])
    .map((entrySlug) => projectBySlug.get(entrySlug))
    .filter(Boolean) : [];
  const siblings = note ? getSiblingEntries(siteData.notes, note.slug) : { previous: null, next: null };

  if (!note) {
    noteDetailNode.innerHTML = `
      <section class="page-hero notfound-hero">
        <p class="eyebrow">${t("detail.notFoundNoteEyebrow")}</p>
        <h1 class="page-title">
          ${t("detail.notFoundNoteTitle")}
          <span>404</span>
        </h1>
        <p class="page-lead">${t("detail.notFoundNote")}</p>
        <div class="page-actions">
          <a class="button primary" href="./notes.html">${t("cta.backNotes")}</a>
          <a class="button secondary" href="./index.html">${t("cta.home")}</a>
        </div>
      </section>
    `;
  } else {
    setDetailMeta({
      title: noteTitle(note),
      description: noteText(note, "overview"),
      canonical: detailCanonicalHref("note", note.slug)
    });
    noteDetailNode.setAttribute("aria-busy", "true");
    noteDetailNode.innerHTML = `
      <section class="page-hero note-detail-hero reveal">
        <p class="eyebrow">${note.code ? `${note.code} / ` : ""}${note.label}</p>
        <h1 class="page-title">
          ${noteTitle(note)}
          <span>${noteDetailTitle(note)}</span>
        </h1>
        ${noteHeadingEn(note) ? `<p class="note-detail-en">${noteHeadingEn(note)}</p>` : ""}
        <ul class="note-facts reveal">
          ${[
            { label: t("meta.status"), value: note.status },
            { label: t("meta.focus"), value: noteFocusValue(note) },
            { label: t("meta.period"), value: note.timeframe },
            { label: t("meta.points"), value: String(noteBullets(note).length) },
            { label: t("meta.read"), value: `${noteReadMinutes(note)} ${t("meta.min")}` },
            { label: t("meta.builds"), value: String(relatedProjects.length) }
          ]
            .filter((fact) => fact.value)
            .map(
              (fact) => `
            <li class="note-fact">
              <span class="note-fact-label">${fact.label}</span>
              <strong class="note-fact-value">${fact.value}</strong>
            </li>
          `
            )
            .join("")}
        </ul>
        <div class="page-actions">
          <a class="button primary" href="./notes.html">${t("cta.backNotes")}</a>
          <a class="button secondary" href="${relatedProjects.length > 0 ? "#linked-builds" : "./projects.html"}">${t("detail.relatedProjects")}</a>
        </div>
      </section>

      <section class="section note-overview-section">
        <blockquote class="note-lens reveal">
          <span class="note-lens-label">${t("detail.lens")}</span>
          <p>${noteLens(note)}</p>
        </blockquote>
        <div class="note-overview-card reveal">
          <p class="note-overview-label">${t("detail.overview")}</p>
          <p class="note-overview-text">${noteText(note, "overview")}</p>
        </div>
      </section>

      <section class="section note-detail-body">
        <div class="section-head reveal">
          <p class="section-kicker">${t("detail.breakdownKicker")}</p>
          <h2>${t("detail.keyPoints")}</h2>
        </div>
        <ol class="note-points">
          ${noteBullets(note)
            .map((item, index) => `
                <li class="note-point reveal" id="note-point-${String(index + 1).padStart(2, "0")}">
                  <span class="note-point-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                  <p>${item}</p>
                </li>
            `)
            .join("")}
        </ol>
      </section>

      ${relatedProjects.length > 0 ? `
      <section class="section" id="linked-builds">
        <div class="section-head reveal">
          <p class="section-kicker">${t("detail.relatedProjectsKicker")}</p>
          <h2>${t("detail.relatedProjects")}</h2>
          <p class="section-summary">${t("detail.relatedProjectsSummary")}</p>
        </div>
        <div class="build-track-grid related-track-grid">
          ${relatedProjects.map((project) => relatedProjectMarkup(project)).join("")}
        </div>
      </section>
      ` : ''}

      ${detailPagerMarkup({
        previous: siblings.previous,
        next: siblings.next,
        previousHref: noteDetailHref,
        nextHref: noteDetailHref,
        previousLabel: (entry) => noteText(entry, "summary"),
        nextLabel: (entry) => noteText(entry, "summary")
       })}
    `;
    noteDetailNode.setAttribute("aria-busy", "false");
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.focus({ preventScroll: true });
  }
  updateLangToggleUI();
  if (instant) {
    noteDetailNode.querySelectorAll(".reveal").forEach((node) => node.classList.add("visible"));
  }
};
renderNoteDetail();

const renderProjectSurfaces = (instant = false) => {
  if (homeProjectsNode) {
    const featuredProjects = siteData.projects.filter((project) => project.featured);
    homeProjectsNode.innerHTML = featuredProjects.map((project) => projectCardMarkup(project, "home")).join("");
  }
  if (projectLibraryNode) {
    projectLibraryNode.innerHTML = siteData.projects.map((project) => projectCardMarkup(project, "library")).join("");
  }
  if (showcaseNode) {
    const demoProjects = siteData.projects.filter((project) => project.demoUrl);
    showcaseNode.innerHTML = demoProjects.map((project) => {
      return `
      <a class="showcase-card reveal" href="${project.demoUrl}" target="_blank" rel="noreferrer">
        <div class="showcase-card-header">
          <p class="card-topline">
            ${project.label}
            <span class="card-status-dot live" aria-hidden="true"></span>
          </p>
          <div class="showcase-demo-badge">${t("showcase.badge")}</div>
        </div>
        <h3>${project.title}</h3>
        <p>${projectText(project, "summary")}</p>
        <div class="card-tags">${createTagList(project.stack)}</div>
        <div class="showcase-url">${project.demoUrl}</div>
        <div class="card-actions">
          <span class="repo-meta">${project.status}</span>
          <span class="work-link">${t("cta.tryDemo")} <span aria-hidden="true">→</span></span>
        </div>
      </a>
    `;
    }).join("");
  }
  if (nowBuildingNode) {
    const nowItems = Array.isArray(siteData.profile?.now) ? siteData.profile.now : [];
    nowBuildingNode.innerHTML = nowItems
      .map((item, index) => {
        const project = projectBySlug.get(item.slug);
        const href = project ? projectDetailHref(project) : "./projects.html";
        const demoHref = project?.demoUrl || "";
        const order = String(index + 1).padStart(2, "0");
        const label = project?.label || item.code || "Now";
        const beat = siteLang === "en" ? item.beatEn || item.beat : item.beat;
        return `
        <article class="about-now-row reveal">
          <div class="about-now-row-meta">
            <span class="about-now-index">${order}</span>
            ${item.when ? `<span class="about-now-when">${item.when}</span>` : ""}
          </div>
          <div class="about-now-row-body">
            <div class="about-now-row-head">
              <p class="about-now-label">
                ${label}
                <span class="card-status-dot live" aria-hidden="true"></span>
                <span class="work-status-pill">${t("shipping")}</span>
              </p>
              <h3><a href="${href}">${item.title}</a></h3>
            </div>
            <p>${beat}</p>
            <div class="about-now-row-actions">
              <a class="card-inline-link" href="${href}">${t("cta.openDetail")} <span aria-hidden="true">→</span></a>
              ${
                demoHref
                  ? `<a class="card-inline-link" href="${demoHref}" target="_blank" rel="noreferrer">${t("cta.tryDemo")}</a>`
                  : ""
              }
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }
  if (projectLibraryNode) applyStoredFilter(projectLibraryNode);
  if (instant) {
    [homeProjectsNode, projectLibraryNode, showcaseNode, nowBuildingNode].forEach((node) => {
      if (node) node.querySelectorAll(".reveal").forEach((card) => card.classList.add("visible"));
    });
  }
};

const setSiteLang = (lang, instant = false) => {
  if ((lang !== "en" && lang !== "zh") || lang === siteLang) return;
  siteLang = lang;
  try {
    localStorage.setItem(SITE_LANG_KEY, lang);
    localStorage.setItem(LEGACY_NOTES_LANG_KEY, lang);
  } catch (persistErr) {}
  applyChromeI18n();
  updateLangToggleUI();
  renderNoteLibraries(instant);
  renderNoteDetail(instant);
  renderProjectSurfaces(instant);
  renderProjectDetail(instant);
  // Refresh filter "全部" label if present
  document.querySelectorAll(".filter-bar .filter-pill").forEach((pill) => {
    if (!pill.dataset.filterLabel) {
      const countMatch = pill.textContent.match(/\((\d+)\)/);
      const count = countMatch ? countMatch[1] : "";
      pill.textContent = count ? `${t("filter.all")} (${count})` : t("filter.all");
    }
  });
  const paletteEmpty = document.querySelector(".palette-empty");
  if (paletteEmpty) paletteEmpty.textContent = t("palette.empty");
  if (typeof window.__refreshPaletteLang === "function") window.__refreshPaletteLang();
};

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-lang-toggle]");
  if (!toggle) return;
  const lang = toggle.getAttribute("data-lang-toggle");
  setSiteLang(lang, true);
});

applyChromeI18n();
updateLangToggleUI();
renderProjectSurfaces();

const revealNodes = document.querySelectorAll(".reveal");
const emphasisNodes = document.querySelectorAll(".work-card, .command-list p, .ops-command-list p");

if (reduceMotion) {
  revealNodes.forEach((node) => node.classList.add("visible"));
} else {
  /* Safety net: a `.reveal` node must never stay stranded at opacity 0.
     Registered before the observer so it still runs if the IntersectionObserver
     constructor itself throws. If the observer never fires within 4s, force-show
     everything; if it is alive, only rescue nodes currently in the viewport so
     below-fold content keeps its staggered scroll entrance. */
  let observerFired = false;
  setTimeout(() => {
    if (!observerFired) {
      revealNodes.forEach((node) => node.classList.add("visible"));
      return;
    }
    revealNodes.forEach((node) => {
      if (node.classList.contains("visible")) return;
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) node.classList.add("visible");
    });
  }, 4000);

  const observer = new IntersectionObserver(
    (entries) => {
      observerFired = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
    observer.observe(node);
  });

  emphasisNodes.forEach((node, index) => {
    node.style.transitionDelay = `${80 + Math.min(index * 40, 240)}ms`;
  });
}

if (yearNodes.length > 0) {
  const year = new Date().getFullYear();
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

  if (scrollProgressNode) {
    scrollProgressNode.style.width = `${progress * 100}%`;
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("visible", scrollTop > 480);
  }
};

let scrollTicking = false;
updateScrollUI();
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
  }
}, { passive: true });

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

/* ── Keyboard Navigation ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuToggle && topbarMeta) {
    const wasOpen = menuToggle.classList.contains("open");
    menuToggle.classList.remove("open");
    topbarMeta.classList.remove("open");
    if (wasOpen) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  }
});

/* ── Command Palette ── */
const palette = document.querySelector("[data-palette]");
const paletteOverlay = document.querySelector("[data-palette-overlay]");
const paletteInput = document.querySelector("[data-palette-input]");
const paletteResults = document.querySelector("[data-palette-results]");

if (palette && paletteInput) {
  let activeIndex = 0;
  let currentResults = [];
  let paletteTriggerEl = null;

  const pages = () => [
    { title: t("nav.home"), label: t("palette.page"), href: "./index.html" },
    { title: t("nav.projects"), label: t("palette.page"), href: "./projects.html" },
    { title: t("nav.showcase"), label: t("palette.page"), href: "./showcase.html" },
    { title: t("nav.notes"), label: t("palette.page"), href: "./notes.html" },
    { title: t("nav.about"), label: t("palette.page"), href: "./about.html" },
    { title: t("palette.github"), label: t("palette.external"), href: "https://github.com/jameryw" }
  ];

  function openPalette() {
    paletteTriggerEl = document.activeElement;
    palette.classList.add("open");
    paletteOverlay.classList.add("open");
    paletteInput.value = "";
    paletteInput.focus();
    renderResults("");
  }

  window.__refreshPaletteLang = () => {
    if (!palette.classList.contains("open")) return;
    renderResults(paletteInput.value || "");
  };

  function closePalette() {
    palette.classList.remove("open");
    paletteOverlay.classList.remove("open");
    paletteInput.value = "";
    if (paletteTriggerEl) {
      paletteTriggerEl.focus();
      paletteTriggerEl = null;
    }
  }

  function buildItems(query) {
    const q = query.toLowerCase().trim();
    const items = [];

    /* Pages */
    pages().forEach((p) => {
      if (!q || p.title.toLowerCase().includes(q)) {
        items.push({ title: p.title, label: p.label, href: p.href });
      }
    });

    /* Projects — search both locales so EN queries hit summaryEn too */
    siteData.projects.forEach((p) => {
      const hay = [p.title, p.summary, p.summaryEn, p.label, ...(p.stack || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!q || hay.includes(q)) {
        items.push({ title: p.title, label: t("palette.project"), href: projectDetailHref(p) });
      }
    });

    /* Notes — prefer the active-locale title in results */
    siteData.notes.forEach((n) => {
      const hay = [n.title, n.titleEn, n.summary, n.summaryEn, n.label]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!q || hay.includes(q)) {
        items.push({ title: noteTitle(n), label: t("palette.note"), href: noteDetailHref(n) });
      }
    });

    return items;
  }

  function renderResults(query) {
    currentResults = buildItems(query);
    activeIndex = 0;

    if (currentResults.length === 0) {
      paletteResults.textContent = "";
      const empty = document.createElement("div");
      empty.className = "palette-empty";
      empty.textContent = t("palette.empty");
      paletteResults.appendChild(empty);
      return;
    }

    paletteResults.textContent = "";

    const grouped = {};
    currentResults.forEach((item) => {
      if (!grouped[item.label]) grouped[item.label] = [];
      grouped[item.label].push(item);
    });

    Object.entries(grouped).forEach(([label, items]) => {
      const groupLabel = document.createElement("div");
      groupLabel.className = "palette-group-label";
      groupLabel.textContent = label;
      paletteResults.appendChild(groupLabel);

      items.forEach((item) => {
        const el = document.createElement("div");
        el.className = "palette-item";
        el.setAttribute("role", "option");
        el.innerHTML = `<span class="palette-item-title">${item.title}</span><span class="palette-item-label">${item.label}</span>`;
        el.addEventListener("click", () => {
          window.location.href = item.href;
        });
        paletteResults.appendChild(el);
      });
    });

    updateActiveItem();
  }

  function updateActiveItem() {
    const items = paletteResults.querySelectorAll(".palette-item");
    items.forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  /* Open with Cmd+K or Ctrl+K */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (palette.classList.contains("open")) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  /* Open from topbar hint button */
  const paletteTrigger = document.querySelector("[data-palette-trigger]");
  if (paletteTrigger) {
    paletteTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openPalette();
    });
  }

  /* Focus trap: Tab / Shift+Tab cycles within palette */
  palette.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      const focusable = [paletteInput, ...Array.from(items)];
      const idx = focusable.indexOf(document.activeElement);
      let next;
      if (e.shiftKey) {
        next = idx <= 0 ? focusable.length - 1 : idx - 1;
      } else {
        next = idx >= focusable.length - 1 ? 0 : idx + 1;
      }
      focusable[next].focus();
    }
  });

  /* Close with Escape, Arrow navigation, Enter */
  palette.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveItem();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const items = paletteResults.querySelectorAll(".palette-item");
      if (items[activeIndex]) {
        items[activeIndex].click();
      }
    }
  });

  paletteInput.addEventListener("input", () => {
    renderResults(paletteInput.value);
  });

  paletteOverlay.addEventListener("click", closePalette);
}

/* ── Particle Background ── */
const particleCanvas = document.querySelector("[data-particles]");
const saveData = navigator.connection && navigator.connection.saveData;
if (particleCanvas && !reduceMotion && !saveData && finePointer) {
  const ctx = particleCanvas.getContext("2d");
  let particles = [];
  let animId = 0;
  let lastFrame = 0;
  let lastActivity = performance.now();
  const idleAfter = 2000;
  const frameInterval = 1000 / 24; // cap at 24fps
  let isLight = document.documentElement.getAttribute("data-theme") === "light";

  function wakeParticles() {
    lastActivity = performance.now();
    if (!animId && !document.hidden) {
      lastFrame = 0;
      animId = requestAnimationFrame(drawParticles);
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = window.innerWidth * dpr;
    particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = window.innerWidth + "px";
    particleCanvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    const area = window.innerWidth * window.innerHeight;
    const maxCount = window.innerWidth < 760 ? 18 : 46;
    const count = Math.min(Math.floor(area / 22000), maxCount);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        baseSize: Math.random() * 1.4 + 0.6,
        size: 0,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  function drawParticles(timestamp) {
    if (document.hidden || timestamp - lastActivity > idleAfter) {
      animId = 0;
      return;
    }
    animId = requestAnimationFrame(drawParticles);

    // Throttle to ~24fps
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const dotColor = isLight ? "80, 90, 140" : "108, 242, 255";
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxDistSq = 14400;
    const maxDist = 120;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += p.pulseSpeed;
      p.size = p.baseSize + Math.sin(p.phase) * 0.35;

      let vx = p.vx;
      let vy = p.vy;

      // Subtle mouse interaction: particles drift away from cursor
      if (!reduceMotion) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const distSq = dx * dx + dy * dy;
        const interactRadius = 140;
        if (distSq < interactRadius * interactRadius) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / interactRadius) * 0.12;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }
      }

      p.x += vx;
      p.y += vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const flicker = 0.42 + Math.sin(p.phase * 1.7) * 0.22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, ${Math.max(0.18, flicker).toFixed(3)})`;
      ctx.fill();
    }

    // Spatial grid for O(n) line drawing
    const cols = Math.ceil(w / maxDist);
    const rows = Math.ceil(h / maxDist);
    const grid = new Array(cols * rows);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cx = Math.min(Math.floor(p.x / maxDist), cols - 1);
      const cy = Math.min(Math.floor(p.y / maxDist), rows - 1);
      const idx = cy * cols + cx;
      if (!grid[idx]) grid[idx] = [];
      grid[idx].push(i);
    }

    const lineColor = isLight ? "80, 90, 140" : "108, 242, 255";

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cell = grid[cy * cols + cx];
        if (!cell) continue;

        // Check same cell + neighboring cells (right, bottom, bottom-right, bottom-left)
        const neighbors = [cell];
        const right = cx + 1 < cols ? grid[cy * cols + cx + 1] : null;
        const below = cy + 1 < rows ? grid[(cy + 1) * cols + cx] : null;
        const belowRight = cx + 1 < cols && cy + 1 < rows ? grid[(cy + 1) * cols + cx + 1] : null;
        const belowLeft = cx - 1 >= 0 && cy + 1 < rows ? grid[(cy + 1) * cols + cx - 1] : null;
        if (right) neighbors.push(right);
        if (below) neighbors.push(below);
        if (belowRight) neighbors.push(belowRight);
        if (belowLeft) neighbors.push(belowLeft);

        // Lines within same cell
        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            const pa = particles[cell[a]];
            const pb = particles[cell[b]];
            const dx = pa.x - pb.x;
            const dy = pa.y - pb.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${(0.22 * (1 - distSq / maxDistSq)).toFixed(3)})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }

        // Lines to neighboring cells
        for (let n = 1; n < neighbors.length; n++) {
          const neighbor = neighbors[n];
          for (let a = 0; a < cell.length; a++) {
            const pa = particles[cell[a]];
            for (let b = 0; b < neighbor.length; b++) {
              const pb = particles[neighbor[b]];
              const dx = pa.x - pb.x;
              const dy = pa.y - pb.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < maxDistSq) {
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = `rgba(${lineColor}, ${(0.22 * (1 - distSq / maxDistSq)).toFixed(3)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
              }
            }
          }
        }
      }
    }
  }

  resizeCanvas();
  createParticles();
  animId = requestAnimationFrame(drawParticles);

  window.addEventListener("pointermove", wakeParticles, { passive: true });
  window.addEventListener("scroll", wakeParticles, { passive: true });

  /* Pause while the tab is hidden. Coming back counts as activity. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      animId = 0;
    } else {
      wakeParticles();
    }
  });

  /* Debounced resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    animId = 0;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createParticles();
      wakeParticles();
    }, 200);
  });

  /* Update theme color for particles */
  const themeObserver = new MutationObserver(() => {
    isLight = document.documentElement.getAttribute("data-theme") === "light";
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ── Service Worker Registration + Update Reload ──
   When a NEW sw.js takes control from a previous one (post-deploy), the
   open page still shows the old shell — reload once so fresh HTML applies.
   First-ever installs have no previous controller, so they never reload.
   The flag guards against reload loops. */
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (swRefreshing || !hadController) return;
    swRefreshing = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* ── Umami Session Replay Loader (lazy, CSP-safe) ──
   recorder.js (~186KB) must not compete with first paint: inject it after
   window load once the main thread goes idle. Attributes mirror the static
   head tag this loader replaced on every page. */
const RECORDER_SRC = "https://stats.jameryw.dev/recorder.js";
const loadRecorder = () => {
  if (document.querySelector(`script[src="${RECORDER_SRC}"]`)) return;
  const script = document.createElement("script");
  script.src = RECORDER_SRC;
  script.defer = true;
  script.setAttribute("data-website-id", "9f2c6bb7-954c-4c5c-beb2-fe362b28958e");
  script.setAttribute("data-sample-rate", "0.15");
  script.setAttribute("data-mask-level", "moderate");
  script.setAttribute("data-max-duration", "300000");
  document.head.appendChild(script);
};
const idleLoadRecorder = () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadRecorder, { timeout: 4000 });
  } else {
    setTimeout(loadRecorder, 2000);
  }
};
if (document.readyState === "complete") {
  idleLoadRecorder();
} else {
  window.addEventListener("load", idleLoadRecorder);
}
