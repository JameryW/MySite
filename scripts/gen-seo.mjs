#!/usr/bin/env node
/**
 * Generate the machine-readable SEO / GEO surface from data.js:
 *
 *   public/llms.txt        compact index for LLM crawlers (llmstxt.org)
 *   public/llms-full.txt   the whole site content as plain markdown
 *   public/feed.xml        RSS 2.0 feed for the notes
 *   public/archive.html    static, JS-free index of every project & note
 *   public/sitemap.xml     canonical URLs derived from data.js + static pages
 *
 * Content lives only in data.js — these files are derived artifacts. Re-run:
 *   npm run gen:seo          (rewrite)
 *   npm run gen:seo -- --check   (CI: fail when stale)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const SITE = "https://www.jameryw.dev";
const CHECK = process.argv.includes("--check");

/* ── Load content (data.js writes window.siteData) ── */
const sandbox = { window: {} };
runInNewContext(readFileSync(join(PUBLIC, "data.js"), "utf8"), sandbox, { filename: "data.js" });
const data = sandbox.window.siteData;
const profile = data.profile || {};
const projects = data.projects || [];
const notes = data.notes || [];

const esc = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const oneLine = (value) => String(value || "").replace(/\s+/g, " ").trim();

/* Reuse the exact cache-busted asset URLs the pages ship with. */
const indexHtml = readFileSync(join(PUBLIC, "index.html"), "utf8");
const stylesHref = `./styles.css${(indexHtml.match(/styles\.css(\?v=\d+)/) || [])[1] || ""}`;

const projectUrl = (project) => `${SITE}/project.html?slug=${project.slug}`;
const noteUrl = (note) => `${SITE}/note.html?slug=${note.slug}`;

const focus = Array.isArray(profile.focus) ? profile.focus : [];
const socials = [
  ["GitHub", profile.github].filter(Boolean),
  ["X", "https://x.com/JameryWang"],
  ["小红书 / Xiaohongshu", "https://xhslink.com/m/5WfdZrtFi4K"],
  ["Email", "mailto:jameryw@gmail.com"]
];

const siteSummary =
  "Jamery Wang is AI-native builder based in Hangzhou, building agent kernels, layered memory, and observable execution surfaces (Kernel runtime, LangGraph, DAG, hy-memory). The site collects project case notes, working notes, and live demos in Chinese with an English toggle.";

/* ── llms.txt ── */
const llms = [
  "# Jamery Wang — Personal Site",
  "",
  `> ${siteSummary}`,
  "",
  `Canonical: ${SITE}`,
  "Languages: Chinese (primary), English (site-wide toggle via localStorage `site-lang`)",
  `Machine-readable: ${SITE}/llms-full.txt (full text) · ${SITE}/feed.xml (notes RSS) · ${SITE}/archive.html (static index) · ${SITE}/sitemap.xml`,
  "",
  "## Profile",
  "",
  `- Name: ${profile.name}`,
  `- Title: ${profile.title} / ${profile.titleEn}`,
  `- Base: ${profile.base}`,
  `- Status: ${profile.status}`,
  `- Focus: ${focus.join(", ")}`,
  ...socials.map(([label, url]) => `- ${label}: ${url}`),
  "",
  "## Now building",
  "",
  ...(profile.now || []).map((item) => `- ${item.title} (${item.when}): ${oneLine(item.beatEn || item.beat)}`),
  "",
  "## Pages",
  "",
  `- [Home](${SITE}/) — featured projects and notes`,
  `- [Projects](${SITE}/projects.html) — all ${projects.length} projects`,
  `- [Notes](${SITE}/notes.html) — ${notes.length} working notes`,
  `- [Showcase](${SITE}/showcase.html) — runnable demos`,
  `- [About](${SITE}/about.html) — profile, latest progress, entry points`,
  `- [Archive](${SITE}/archive.html) — static text index of everything`,
  "",
  "## Projects",
  "",
  ...projects.map(
    (project) =>
      `- [${project.title}](${projectUrl(project)}) — ${project.label} · ${project.status}${project.date ? ` · ${project.date}` : ""}. ${oneLine(
        project.summaryEn || project.summary
      )}`
  ),
  "",
  "## Notes",
  "",
  ...notes.map(
    (note) =>
      `- [${note.titleEn || note.title}](${noteUrl(note)}) — ${note.label} · ${note.timeframe}${note.date ? ` · ${note.date}` : ""}. ${oneLine(
        note.summaryEn || note.summary
      )}`
  ),
  ""
].join("\n");

/* ── llms-full.txt ── */
const mdList = (items, fallback) =>
  items && items.length ? items.map((item) => `- ${oneLine(item)}`).join("\n") : `- ${fallback}`;

const llmsFull = [
  "# Jamery Wang — full site content",
  "",
  `> ${siteSummary}`,
  "",
  `Canonical: ${SITE} · Languages: zh (primary) + en · Generated from public/data.js`,
  "",
  "## Profile",
  "",
  `- Name: ${profile.name}`,
  `- Title: ${profile.title}`,
  `- Title (EN): ${profile.titleEn}`,
  `- Base: ${profile.base}`,
  `- Status: ${profile.status}`,
  `- Focus: ${focus.join(", ")}`,
  ...socials.map(([label, url]) => `- ${label}: ${url}`),
  "",
  "## Now building",
  "",
  ...(profile.now || []).map(
    (item) => `- **${item.title}** (${item.when}): ${oneLine(item.beat)}\n  EN: ${oneLine(item.beatEn)}`
  ),
  "",
  "## Projects",
  "",
  ...projects.map((project) =>
    [
      `### ${project.title} (${project.code} / ${project.label})`,
      "",
      `URL: ${projectUrl(project)}`,
      `Status: ${project.status} · Timeframe: ${project.timeframe} · Role: ${project.role}`,
      project.date ? `Published: ${project.date} · Updated: ${project.updated || project.date}` : "",
      `Stack: ${(project.stack || []).join(", ")}`,
      "",
      `Summary: ${oneLine(project.summary)}`,
      `Summary (EN): ${oneLine(project.summaryEn)}`,
      "",
      `Overview: ${oneLine(project.overview)}`,
      "",
      `Overview (EN): ${oneLine(project.overviewEn)}`,
      "",
      "Highlights:",
      mdList(project.highlights || [], "(none)"),
      "",
      "Highlights (EN):",
      mdList(project.highlightsEn || [], "(none)"),
      "",
      "Outputs:",
      mdList(project.outputs || [], project.cta || "(none)"),
      ""
    ].join("\n")
  ),
  "## Notes",
  "",
  ...notes.map((note) =>
    [
      `### ${note.code} / ${note.label} — ${note.title}`,
      "",
      `URL: ${noteUrl(note)}`,
      `Title (EN): ${note.titleEn} · Detail: ${note.detailTitle} / ${note.detailTitleEn}`,
      `Status: ${note.status} · Timeframe: ${note.timeframe} · Meta: ${oneLine(note.meta)}`,
      note.date ? `Published: ${note.date} · Updated: ${note.updated || note.date}` : "",
      "",
      `Summary: ${oneLine(note.summary)}`,
      `Summary (EN): ${oneLine(note.summaryEn)}`,
      "",
      `Overview: ${oneLine(note.overview)}`,
      "",
      `Overview (EN): ${oneLine(note.overviewEn)}`,
      "",
      "Bullets:",
      mdList(note.bullets || [], "(none)"),
      "",
      "Bullets (EN):",
      mdList(note.bulletsEn || [], "(none)"),
      "",
      `Lens: ${note.lens} / ${note.lensZh}`,
      "",
      "Related projects:",
      mdList(
        (note.relatedProjects || []).map((slug) => {
          const related = projects.find((project) => project.slug === slug);
          return related ? `${related.title} — ${projectUrl(related)}` : slug;
        }),
        "(none)"
      ),
      ""
    ].join("\n")
  )
].join("\n");

/* ── feed.xml (notes, newest first as authored in data.js) ── */
const rfc822 = (isoDate) => new Date(`${isoDate}T00:00:00Z`).toUTCString();
const maxUpdated = [...projects, ...notes]
  .map((entry) => entry.updated || entry.date)
  .filter(Boolean)
  .sort()
  .pop();

const feedItems = notes.map((note) => {
  const link = noteUrl(note);
  return [
    "    <item>",
    `      <title>${esc(`${note.code} / ${note.label} — ${note.title}`)}</title>`,
    `      <link>${esc(link)}</link>`,
    `      <guid isPermaLink="true">${esc(link)}</guid>`,
    (note.updated || note.date) ? `      <pubDate>${rfc822(note.updated || note.date)}</pubDate>` : "",
    `      <description>${esc(oneLine(note.summaryEn || note.summary))}</description>`,
    `      <category>${esc(note.label)}</category>`,
    "    </item>"
  ].filter(Boolean).join("\n");
});

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  "  <channel>",
  "    <title>Jamery Wang — Notes</title>",
  `    <link>${SITE}/notes.html</link>`,
  "    <description>Working notes on Agent engineering, kernels, memory, and build-in-public.</description>",
  "    <language>zh-cn</language>",
  maxUpdated ? `    <lastBuildDate>${rfc822(maxUpdated)}</lastBuildDate>` : "",
  `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />`,
  ...feedItems,
  "  </channel>",
  "</rss>",
  ""
].join("\n");

/* ── archive.html (static, no JS) ── */
const stamp = (entry) => entry.updated || entry.date || "";

const projectItems = projects
  .map(
    (project) => `        <li class="archive-item">
          <p class="archive-kicker">${esc(project.code)} / ${esc(project.label)} · ${esc(project.status)}${stamp(project) ? ` · ${esc(stamp(project))}` : ""}</p>
          <h3><a href="./project.html?slug=${esc(project.slug)}">${esc(project.title)}</a></h3>
          <p>${esc(oneLine(project.summary))}</p>
          <p class="archive-en">${esc(oneLine(project.summaryEn))}</p>
        </li>`
  )
  .join("\n");

const noteItems = notes
  .map(
    (note) => `        <li class="archive-item">
          <p class="archive-kicker">${esc(note.code)} / ${esc(note.label)} · ${esc(note.timeframe)}${stamp(note) ? ` · ${esc(stamp(note))}` : ""}</p>
          <h3><a href="./note.html?slug=${esc(note.slug)}">${esc(note.title)}</a> <span class="archive-en-inline">${esc(
      note.titleEn
    )}</span></h3>
          <p>${esc(oneLine(note.summary))}</p>
        </li>`
  )
  .join("\n");

const demoItems = projects
  .filter((project) => project.demoUrl)
  .map(
    (project) =>
      `        <li class="archive-item"><h3><a href="${esc(project.demoUrl)}" target="_blank" rel="noreferrer">${
        esc(project.title)
      }</a></h3><p>${esc(project.demoUrl)}</p></li>`
  )
  .join("\n");

const archive = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>站点索引 / Site Archive — Jamery Wang</title>
    <meta name="description" content="Jamery Wang 站点的静态纯文本索引：全部项目、笔记与在线演示，无需 JavaScript 即可阅读。" />
    <meta name="author" content="Jamery Wang" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <link rel="canonical" href="${SITE}/archive.html" />
    <link rel="alternate" hreflang="zh-CN" href="${SITE}/archive.html" />
    <link rel="alternate" hreflang="en" href="${SITE}/archive.html?lang=en" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/archive.html" />
    <meta property="og:title" content="站点索引 / Site Archive — Jamery Wang" />
    <meta property="og:description" content="Static text index of every project, note, and live demo on jameryw.dev." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE}/archive.html" />
    <meta property="og:site_name" content="Jamery Wang" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta property="og:image:type" content="image/png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@JameryWang" />
    <meta name="twitter:creator" content="@JameryWang" />
    <meta name="twitter:title" content="站点索引 / Site Archive — Jamery Wang" />
    <meta name="twitter:description" content="Static text index of every project, note, and live demo on jameryw.dev." />
    <meta name="twitter:image" content="${SITE}/og-image.png" />
    <meta name="theme-color" content="#050816" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-vkhMS1n7yPrJZZuX7L/KbZwsI7/sQOe7r5ffim/TlX4='; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:;" />
    <script>try{if(localStorage.getItem("theme")==="light"){document.documentElement.setAttribute("data-theme","light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#f0f2f8")}}catch(e){}try{var Q=new URLSearchParams(location.search).get("lang");var L=(Q==="en"||Q==="zh")?Q:(localStorage.getItem("site-lang")||localStorage.getItem("notes-lang"));if(L==="en"||L==="zh"){document.documentElement.setAttribute("data-lang",L);document.documentElement.lang=L==="en"?"en":"zh-CN";if(Q==="en"||Q==="zh"){localStorage.setItem("site-lang",Q)}}}catch(e){}setTimeout(function(){var el=document.querySelector(".page-loader");if(el&&!el.classList.contains("loaded"))el.classList.add("is-slow")},480);setTimeout(function(){var el=document.querySelector(".page-loader");if(el)el.classList.add("loaded")},2400);</script>
    <link rel="stylesheet" href="${stylesHref}" />
    <link rel="alternate" type="application/rss+xml" title="Jamery Wang — Notes" href="./feed.xml" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Site Archive — Jamery Wang",
      "url": "${SITE}/archive.html",
      "isPartOf": { "@type": "WebSite", "name": "Jamery Wang", "url": "${SITE}" },
      "description": "Static text index of every project, note, and live demo on jameryw.dev."
    }
    </script>
  </head>
  <body data-page="archive">
    <a class="skip-link" href="#main-content">跳到主要内容 · Skip to content</a>
    <main class="site-frame archive-page" id="main-content" tabindex="-1">
      <header class="archive-head">
        <p class="eyebrow">Index / 站点索引</p>
        <h1>Site Archive</h1>
        <p class="page-lead">无需 JavaScript 的静态索引：全部项目、笔记和在线演示。机器可读版本见
          <a href="./llms.txt">llms.txt</a>、<a href="./llms-full.txt">llms-full.txt</a> 与
          <a href="./feed.xml">feed.xml</a>。</p>
        <nav class="archive-actions" aria-label="站点导航">
          <a class="button secondary" href="./index.html">首页 / Home</a>
          <a class="button secondary" href="./projects.html">项目 / Projects</a>
          <a class="button secondary" href="./showcase.html">Showcase / 在线演示</a>
          <a class="button secondary" href="./notes.html">笔记 / Notes</a>
          <a class="button secondary" href="./about.html">关于 / About</a>
        </nav>
      </header>
      <section class="section archive-section" aria-labelledby="archive-projects">
        <h2 id="archive-projects">项目 / Projects</h2>
        <ul class="archive-list">
${projectItems}
        </ul>
      </section>
      <section class="section archive-section" aria-labelledby="archive-notes">
        <h2 id="archive-notes">笔记 / Notes</h2>
        <ul class="archive-list">
${noteItems}
        </ul>
      </section>
      <section class="section archive-section" aria-labelledby="archive-demos">
        <h2 id="archive-demos">在线演示 / Showcase</h2>
        <ul class="archive-list">
${demoItems}
        </ul>
      </section>
      <footer class="archive-footer">
        <p>Jamery Wang · ${profile.base} · <a href="./index.html">jameryw.dev</a></p>
        <p><a href="./feed.xml">RSS</a> · <a href="./llms.txt">llms.txt</a> · <a href="./llms-full.txt">llms-full.txt</a> · <a href="./sitemap.xml">sitemap.xml</a></p>
      </footer>
    </main>
  </body>
</html>
`;

/* ── sitemap.xml (deterministic: no volatile lastmod) ── */
const entry = (loc, changefreq, priority, lastmod) =>
  `  <url>\n    <loc>${SITE}/${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entry("", "weekly", "1.0"),
  entry("projects.html", "weekly", "0.8"),
  entry("notes.html", "weekly", "0.8"),
  entry("showcase.html", "weekly", "0.7"),
  entry("about.html", "monthly", "0.6"),
  entry("archive.html", "monthly", "0.5"),
  ...projects.map((project) =>
    entry(`project.html?slug=${project.slug}`, "monthly", "0.6", project.updated || project.date)
  ),
  ...notes.map((note) => entry(`note.html?slug=${note.slug}`, "monthly", "0.6", note.updated || note.date)),
  "</urlset>",
  ""
].join("\n");

/* ── Prerendered detail hero (LCP) ──
   Both detail pages are JS-rendered shells, so the largest contentful paint
   waits for data.js + app.js. For every slug we emit a copy of the shell with
   the hero already in the HTML; nginx serves it via try_files for the same
   /project.html?slug= URL, so the URL space does not change. app.js still
   renders the full page on top of it. */
const softBreak = (title) => esc(title).replace(/([a-z0-9])([A-Z])/g, "$1<wbr>$2");
const heroTitleClass = (title) => {
  const len = String(title || "").length;
  if (len > 18) return "page-title is-long";
  if (len > 12) return "page-title is-medium";
  return "page-title";
};

const projectHero = (project) => {
  const overview = oneLine(project.overview);
  return [
    '<section class="page-hero">',
    '  <nav class="detail-breadcrumb" aria-label="面包屑导航">',
    '    <a href="./index.html">首页</a><span aria-hidden="true">/</span>',
    '    <a href="./projects.html">项目</a><span aria-hidden="true">/</span>',
    `    <span aria-current="page">${esc(project.title)}</span>`,
    '  </nav>',
    `  <p class="eyebrow">${esc(project.label)} / ${esc(project.status)}</p>`,
    `  <h1 class="${heroTitleClass(project.title)}">${softBreak(project.title)}<span>${esc(project.detailTitle)}</span></h1>`,
    `  <p class="page-lead">${esc(overview)}</p>`,
    '  <p class="listing-hero-meta detail-hero-meta" aria-label="内容信号">',
    `    <span>${esc(project.role)}</span>`,
    project.updated ? `    <span>更新 ${esc(project.updated)}</span>` : null,
    '  </p>',
    '</section>'
  ].filter((line) => line != null).join("\n      ");
};

const noteHero = (note) => {
  const summary = oneLine(note.summary);
  return [
    '<section class="page-hero note-detail-hero">',
    '  <nav class="detail-breadcrumb" aria-label="面包屑导航">',
    '    <a href="./index.html">首页</a><span aria-hidden="true">/</span>',
    '    <a href="./notes.html">笔记</a><span aria-hidden="true">/</span>',
    `    <span aria-current="page">${esc(note.title)}</span>`,
    '  </nav>',
    `  <p class="eyebrow">${note.code ? `${esc(note.code)} / ` : ""}${esc(note.label)}</p>`,
    `  <h1 class="page-title">${esc(note.title)}<span>${esc(note.detailTitle)}</span></h1>`,
    `  <p class="page-lead">${esc(summary)}</p>`,
    '</section>'
  ].join("\n      ");
};

const prerenderDetail = (shellFile, containerAttr, heroHtml) => {
  const shell = readFileSync(join(PUBLIC, shellFile), "utf8");
  const marker = `<main id="main-content" ${containerAttr} tabindex="-1"></main>`;
  if (!shell.includes(marker)) throw new Error(`prerender: container not found in ${shellFile}`);
  // Wrapped so the boot script's language can suppress it: an English
  // visitor must never see the Chinese hero flash before app.js swaps it.
  return shell.replace(
    marker,
    `<main id="main-content" ${containerAttr} tabindex="-1">\n      <div class="prerender-hero">${heroHtml}</div>\n    </main>`
  );
};

const detailFiles = {};
for (const project of projects) {
  detailFiles[`p/${project.slug}.html`] = prerenderDetail("project.html", "data-project-detail", projectHero(project));
}
for (const note of notes) {
  detailFiles[`p/${note.slug}.html`] = prerenderDetail("note.html", "data-note-detail", noteHero(note));
}

/* ── data-list.js ──
   77% of data.js is detail-only copy (overviews, highlight bullets) that the
   listing pages never touch. Ship a pruned copy for them and keep the full
   file for the two detail shells, which are the only pages that render it. */
const DETAIL_ONLY = {
  projects: ["detailTitle", "role", "overview", "overviewEn", "highlights", "highlightsEn", "outputs", "relatedNotes"],
  notes: ["detailTitle", "detailTitleEn", "overview", "overviewEn", "lens", "lensZh", "bullets", "bulletsEn", "outputs", "relatedProjects"]
};
const pruneEntry = (entry, dropList) => {
  const copy = {};
  for (const key of Object.keys(entry)) {
    if (!dropList.includes(key)) copy[key] = entry[key];
  }
  return copy;
};
const listData = {
  profile,
  projects: projects.map((project) => pruneEntry(project, DETAIL_ONLY.projects)),
  notes: notes.map((note) => pruneEntry(note, DETAIL_ONLY.notes))
};
const dataList = `/* Generated by scripts/gen-seo.mjs from data.js — do not edit.
   Listing pages (home / projects / notes / showcase / about) load this pruned
   copy; the detail shells load the full data.js. */
window.siteData = ${JSON.stringify(listData, null, 2)};
`;

/* ── write / check ── */
const outputs = {
  "data-list.js": dataList,
  "llms.txt": llms,
  "llms-full.txt": llmsFull,
  "feed.xml": feed,
  "archive.html": archive,
  "sitemap.xml": sitemap
};

// nested detail files live under public/p/
const nestedDir = join(PUBLIC, "p");
if (!CHECK && !existsSync(nestedDir)) mkdirSync(nestedDir, { recursive: true });

let stale = 0;
for (const [name, content] of Object.entries(outputs)) {
  const target = join(PUBLIC, name);
  if (CHECK) {
    const current = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (current !== content) {
      stale += 1;
      console.error(`stale: public/${name}`);
    }
  } else {
    writeFileSync(target, content, "utf8");
    console.log(`wrote public/${name} (${Buffer.byteLength(content)} bytes)`);
  }
}

for (const [name, content] of Object.entries(detailFiles)) {
  const target = join(PUBLIC, name);
  if (CHECK) {
    const current = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (current !== content) {
      stale += 1;
      console.error(`stale: public/${name}`);
    }
  } else {
    writeFileSync(target, content, "utf8");
  }
}
if (!CHECK) console.log(`wrote ${Object.keys(detailFiles).length} prerendered detail pages under public/p/`);

/* Pruned slugs: a renamed or deleted entry would otherwise keep serving its old
   prerendered hero from public/p/ forever. Remove anything not in data.js. */
if (existsSync(nestedDir)) {
  const expected = new Set(Object.keys(detailFiles).map((name) => name.replace(/^p\//, "")));
  const orphans = readdirSync(nestedDir).filter((file) => file.endsWith(".html") && !expected.has(file));
  if (orphans.length) {
    if (CHECK) {
      stale += orphans.length;
      console.error(`orphaned prerender file(s): ${orphans.slice(0, 5).join(", ")}`);
    } else {
      for (const file of orphans) {
        unlinkSync(join(nestedDir, file));
        console.log(`removed orphaned public/p/${file}`);
      }
    }
  }
}

if (CHECK) {
  if (stale > 0) {
    console.error(`\n${stale} SEO asset(s) out of date — run: npm run gen:seo`);
    process.exit(1);
  }
  console.log("SEO assets are up to date");
}
