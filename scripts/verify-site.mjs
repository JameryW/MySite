#!/usr/bin/env node
/**
 * Zero-dependency release checks for the static site.
 *
 * Verifies the invariants that are easy to break by hand:
 *   1. The inline boot script hash in every page matches its CSP meta.
 *   2. styles.css / app.js / data.js cache versions are identical site-wide.
 *   3. public/sw.js precache keys match those versions and every file exists.
 *   4. Every local href/src and @font-face asset referenced by the pages exists.
 *   5. No external scripts/stylesheets are loaded.
 *   6. sitemap.xml URLs map to real files.
 *   7. No literal "undefined" leaked into titles/descriptions.
 *
 * Run: node scripts/verify-site.mjs   (also used by the GitHub Actions checks)
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const SITE = "https://www.jameryw.dev";

const results = [];
let failures = 0;
const pass = (msg) => results.push(`  ok  ${msg}`);
const fail = (msg) => {
  failures += 1;
  results.push(`FAIL  ${msg}`);
};

const htmlNames = readdirSync(PUBLIC).filter((name) => name.endsWith(".html")).sort();
const pages = htmlNames.map((name) => ({
  name,
  html: readFileSync(join(PUBLIC, name), "utf8"),
}));

/* 1. CSP inline boot-script hash */
for (const { name, html } of pages) {
  const csp = html.match(/script-src[^"]*?sha256-([A-Za-z0-9+/=]+)/);
  const boot = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!boot) {
    // Static pages (archive.html) ship no inline boot script, so no hash is needed.
    if (csp) fail(`${name}: CSP hash declared but page has no inline boot script`);
    continue;
  }
  if (!csp) {
    fail(`${name}: missing script-src sha256 in CSP`);
    continue;
  }
  const actual = createHash("sha256").update(boot[1], "utf8").digest("base64");
  if (actual !== csp[1]) {
    fail(`${name}: CSP hash mismatch (meta ${csp[1]}, actual ${actual})`);
  }
}
if (failures === 0) pass(`${pages.length} pages: CSP hash matches the inline boot script`);

/* 2. Cache versions consistent across pages */
const versions = { styles: null, app: null, data: null };
const patterns = {
  styles: /styles\.css\?v=(\d+)/,
  app: /app\.js\?v=(\d+)/,
  data: /data\.js\?v=(\d+)/,
};
for (const { name, html } of pages) {
  for (const key of Object.keys(patterns)) {
    const match = html.match(patterns[key]);
    if (!match) {
      // 404.html intentionally ships no app.js/data.js
      if (key === "styles") fail(`${name}: missing styles.css?v= reference`);
      continue;
    }
    if (versions[key] === null) versions[key] = match[1];
    else if (versions[key] !== match[1]) {
      fail(`${name}: ${key} version v=${match[1]} != v=${versions[key]}`);
    }
  }
}
if (versions.styles && versions.app) {
  pass(`cache versions: styles v${versions.styles}, app v${versions.app}, data v${versions.data}`);
}

/* 3. Service worker cache name + precache list */
const sw = readFileSync(join(PUBLIC, "sw.js"), "utf8");
const cacheName = sw.match(/const CACHE = '([^']+)'/);
if (!cacheName) fail("sw.js: CACHE name not found");
const shellBlock = sw.match(/const SHELL = \[([\s\S]*?)\];/);
if (!shellBlock) {
  fail("sw.js: SHELL list not found");
} else {
  const shellPaths = [...shellBlock[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  for (const entry of shellPaths) {
    if (entry === "./") continue;
    if (versions.styles && entry === `./styles.css?v=${versions.styles}`) continue;
    if (versions.app && entry === `./app.js?v=${versions.app}`) continue;
    if (versions.data && entry === `./data.js?v=${versions.data}`) continue;
    if (!/^\.\/[^?]+\?v=\d+$/.test(entry)) {
      const local = join(PUBLIC, entry.replace(/^\.\//, ""));
      if (!existsSync(local)) fail(`sw.js: precache target missing: ${entry}`);
    }
  }
  if (versions.styles && !shellPaths.includes(`./styles.css?v=${versions.styles}`)) {
    fail(`sw.js: styles.css?v=${versions.styles} missing from SHELL`);
  }
  if (versions.app && !shellPaths.includes(`./app.js?v=${versions.app}`)) {
    fail(`sw.js: app.js?v=${versions.app} missing from SHELL`);
  }
  if (versions.data && !shellPaths.includes(`./data.js?v=${versions.data}`)) {
    fail(`sw.js: data.js?v=${versions.data} missing from SHELL`);
  }
  pass(`sw.js: ${cacheName[1]}, ${shellPaths.length} precache entries`);
}

/* 4. Local asset references exist */
const localRef = /(?:src|href)="\.\/([^"#?]+)/g;
let refCount = 0;
for (const { name, html } of pages) {
  for (const match of html.matchAll(localRef)) {
    const target = match[1];
    if (!target || target.endsWith("/")) continue;
    refCount += 1;
    if (!existsSync(join(PUBLIC, target))) fail(`${name}: broken local reference ./${target}`);
  }
}
const fontUrls = [...readFileSync(join(PUBLIC, "styles.css"), "utf8").matchAll(/url\("\.\/([^"]+)"\)/g)];
for (const match of fontUrls) {
  if (!existsSync(join(PUBLIC, match[1]))) fail(`styles.css: missing font ./${match[1]}`);
}
pass(`${refCount} local page references + ${fontUrls.length} font files resolve`);

/* 5. No external scripts / stylesheets */
for (const { name, html } of pages) {
  if (/<script[^>]+src="https?:\/\//.test(html)) fail(`${name}: external <script> found`);
  if (/<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//.test(html)) fail(`${name}: external stylesheet found`);
}
pass("no external scripts or stylesheets");

/* 6. sitemap URLs map to real files */
const sitemap = readFileSync(join(PUBLIC, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
let sitemapCount = 0;
let sitemapFailures = 0;
for (const loc of locs) {
  if (!loc.startsWith(`${SITE}/`) && loc !== `${SITE}/` && loc !== SITE) {
    fail(`sitemap.xml: URL outside the canonical host: ${loc}`);
    sitemapFailures += 1;
    continue;
  }
  // Detail pages are query-param views of project.html / note.html.
  const rawPath = loc.replace(`${SITE}/`, "").replace(SITE, "");
  const path = rawPath.split("?")[0].split("#")[0] || "index.html";
  const file = path.endsWith("/") ? `${path}index.html` : path;
  sitemapCount += 1;
  if (!existsSync(join(PUBLIC, file))) {
    fail(`sitemap.xml: no file for ${loc}`);
    sitemapFailures += 1;
  }
}
if (sitemapFailures === 0) pass(`sitemap.xml: ${sitemapCount} URLs resolve to files`);

/* 7. No literal "undefined" in document metadata */
for (const { name, html } of pages) {
  const title = html.match(/<title>([^<]*)<\/title>/);
  if (title && /undefined/i.test(title[1])) fail(`${name}: "undefined" in <title>`);
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (desc && /undefined/i.test(desc[1])) fail(`${name}: "undefined" in description`);
}
pass("document metadata clean");

/* 8. SEO / GEO surface */
const dataSandbox = { window: {} };
runInNewContext(readFileSync(join(PUBLIC, "data.js"), "utf8"), dataSandbox, { filename: "data.js" });
const siteData = dataSandbox.window.siteData || { projects: [], notes: [] };
const projectSlugs = (siteData.projects || []).map((project) => project.slug);
const noteSlugs = (siteData.notes || []).map((note) => note.slug);

const entryDates = [...(siteData.projects || []), ...(siteData.notes || [])];
for (const entry of entryDates) {
  for (const field of ["date", "updated"]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry[field] || "")) {
      fail(`data.js: ${entry.slug} is missing a valid ISO ${field}`);
    }
  }
}
if (existsSync(join(PUBLIC, "feed.xml"))) {
  const feed = readFileSync(join(PUBLIC, "feed.xml"), "utf8");
  for (const note of siteData.notes || []) {
    if (!feed.includes(`note.html?slug=${note.slug}`)) fail(`feed.xml: missing ${note.slug}`);
  }
  if ((feed.match(/<pubDate>/g) || []).length !== (siteData.notes || []).length) {
    fail("feed.xml: every note needs a <pubDate>");
  }
}
if (existsSync(join(PUBLIC, "sitemap.xml"))) {
  const map = readFileSync(join(PUBLIC, "sitemap.xml"), "utf8");
  for (const entry of entryDates) {
    if (!map.includes(`slug=${entry.slug}</loc>`)) fail(`sitemap.xml: missing ${entry.slug}`);
    if (!map.includes(`<lastmod>${entry.updated || entry.date}</lastmod>`)) {
      fail(`sitemap.xml: missing lastmod for ${entry.slug}`);
    }
  }
}
pass(`content dates: ${entryDates.length} entries carry date/updated (feed pubDate + sitemap lastmod)`);

const securityTxt = join(PUBLIC, ".well-known/security.txt");
if (!existsSync(securityTxt)) fail("missing public/.well-known/security.txt");
else if (!/Expires: \d{4}-\d{2}-\d{2}T/.test(readFileSync(securityTxt, "utf8"))) {
  fail("security.txt: missing RFC3339 Expires field");
}

const seoFiles = ["llms.txt", "llms-full.txt", "feed.xml", "archive.html", "robots.txt"];
for (const file of seoFiles) {
  if (!existsSync(join(PUBLIC, file))) fail(`missing SEO asset public/${file}`);
}

const robots = existsSync(join(PUBLIC, "robots.txt")) ? readFileSync(join(PUBLIC, "robots.txt"), "utf8") : "";
for (const bot of ["GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "Sitemap:"]) {
  if (!robots.includes(bot)) fail(`robots.txt: missing ${bot}`);
}

const archiveHtml = existsSync(join(PUBLIC, "archive.html")) ? readFileSync(join(PUBLIC, "archive.html"), "utf8") : "";
const feedXml = existsSync(join(PUBLIC, "feed.xml")) ? readFileSync(join(PUBLIC, "feed.xml"), "utf8") : "";
const llmsTxt = existsSync(join(PUBLIC, "llms-full.txt")) ? readFileSync(join(PUBLIC, "llms-full.txt"), "utf8") : "";
for (const slug of projectSlugs) {
  if (!archiveHtml.includes(`project.html?slug=${slug}`)) fail(`archive.html: missing project slug ${slug}`);
  if (!sitemap.includes(`project.html?slug=${slug}`)) fail(`sitemap.xml: missing project slug ${slug}`);
}
for (const slug of noteSlugs) {
  if (!archiveHtml.includes(`note.html?slug=${slug}`)) fail(`archive.html: missing note slug ${slug}`);
  if (!sitemap.includes(`note.html?slug=${slug}`)) fail(`sitemap.xml: missing note slug ${slug}`);
  if (!feedXml.includes(`note.html?slug=${slug}`)) fail(`feed.xml: missing note slug ${slug}`);
}
for (const entry of [...(siteData.projects || []), ...(siteData.notes || [])]) {
  if (!llmsTxt.includes(entry.title)) fail(`llms-full.txt: missing entry ${entry.title}`);
}
if (!sitemap.includes("archive.html")) fail("sitemap.xml: missing archive.html");

/* Every <loc> must match a canonical URL: a sitemap entry that disagrees with
   the page's canonical sends search engines two different preferred URLs. */
const canonicalSet = new Set();
for (const { html } of pages) {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (match) canonicalSet.add(match[1]);
}
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const mismatched = sitemapLocs.filter((loc) => !canonicalSet.has(loc) && !loc.includes("?slug="));
if (mismatched.length) fail(`sitemap.xml <loc> without a matching canonical: ${mismatched.slice(0, 3).join(", ")}`);
pass(`sitemap/canonical alignment: ${sitemapLocs.length} URLs, ${mismatched.length} mismatched`);

/* hreflang pairs: a page that advertises translations must list zh-CN, en and
   x-default, and the en target must be the `?lang=en` view of its canonical. */
for (const { name, html } of pages) {
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map((m) => [m[1], m[2]]);
  if (!alternates.length) {
    // Static pages without app.js must not advertise language alternates they can't honour.
    if (name !== "404.html" && name !== "archive.html" && !name.includes("project.html") && !name.includes("note.html")) {
      fail(`${name}: missing hreflang alternates`);
    }
    continue;
  }
  const langs = alternates.map(([lang]) => lang);
  for (const required of ["zh-CN", "en", "x-default"]) {
    if (!langs.includes(required)) fail(`${name}: hreflang missing ${required}`);
  }
  const enHref = (alternates.find(([lang]) => lang === "en") || [])[1] || "";
  if (canonical && !enHref.startsWith(canonical.split("?")[0])) {
    fail(`${name}: hreflang en target does not match the canonical path`);
  }
  if (canonical && !enHref.includes("lang=en")) fail(`${name}: hreflang en target must carry ?lang=en`);
}
pass(`hreflang: ${pages.filter(({ html }) => html.includes("hreflang=")).length} pages advertise zh-CN / en / x-default`);

/* The nginx response-level CSP pins the same inline-script hash as the page
   meta tags; if they drift, browsers enforce both and block the boot script. */
const nginxConf = existsSync(join(ROOT, "deploy/nginx.conf"))
  ? readFileSync(join(ROOT, "deploy/nginx.conf"), "utf8")
  : "";
const nginxHashes = [...new Set([...nginxConf.matchAll(/sha256-([A-Za-z0-9+/=]+)/g)].map((m) => m[1]))];
const pageHashes = [...new Set(pages.map(({ html }) => (html.match(/sha256-([A-Za-z0-9+/=]+)/) || [])[1]).filter(Boolean))];
for (const hash of nginxHashes) {
  if (!pageHashes.includes(hash)) {
    fail(`deploy/nginx.conf CSP pins a stale inline-script hash (${hash.slice(0, 12)}…) — run deploy:nginx after recomputing`);
  }
}
if (nginxHashes.length) pass(`CSP header parity: nginx pins the same inline-script hash as the pages`);

for (const { name, html } of pages) {
  if (!/<link rel="canonical"/.test(html)) fail(`${name}: missing canonical link`);
  if (!/<meta name="description"/.test(html)) fail(`${name}: missing meta description`);
  if (!/<meta property="og:title"/.test(html)) fail(`${name}: missing og:title`);
  if (!/<link rel="alternate" type="application\/rss\+xml"/.test(html)) fail(`${name}: missing RSS discovery link`);
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      fail(`${name}: invalid JSON-LD block (${error.message})`);
    }
  }
  if (name === "404.html") {
    if (!/<meta name="robots" content="noindex/.test(html)) fail("404.html: missing noindex robots meta");
  } else if (jsonLdBlocks.length === 0) {
    fail(`${name}: missing JSON-LD structured data`);
  }
}
pass(`SEO/GEO surface: ${projectSlugs.length} projects + ${noteSlugs.length} notes wired into llms/feed/archive/sitemap`);

/* 9. i18n parity: both locales expose the same keys, and every referenced
      key resolves (a missing key silently renders an empty string). */
const appSrc = readFileSync(join(PUBLIC, "app.js"), "utf8");
const dictStart = appSrc.indexOf("const I18N = {");
if (dictStart === -1) {
  fail("app.js: I18N dictionary not found");
} else {
  let depth = 0;
  let dictEnd = dictStart;
  for (let i = appSrc.indexOf("{", dictStart); i < appSrc.length; i += 1) {
    if (appSrc[i] === "{") depth += 1;
    else if (appSrc[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        dictEnd = i + 1;
        break;
      }
    }
  }
  const dict = appSrc.slice(dictStart, dictEnd);
  const enIndex = dict.indexOf("\n  en:");
  const keyOf = (segment) => [...segment.matchAll(/^\s+"([^"]+)":/gm)].map((m) => m[1]);
  const zhKeys = keyOf(dict.slice(0, enIndex));
  const enKeys = keyOf(dict.slice(enIndex, dict.lastIndexOf("\n}")));
  const missingEn = zhKeys.filter((key) => !enKeys.includes(key));
  const missingZh = enKeys.filter((key) => !zhKeys.includes(key));
  if (missingEn.length) fail(`i18n: keys missing in en: ${missingEn.slice(0, 5).join(", ")}`);
  if (missingZh.length) fail(`i18n: keys missing in zh: ${missingZh.slice(0, 5).join(", ")}`);

  /* Pages that never load app.js cannot translate data-i18n text, so any
     such attribute there would stay in the hard-coded language. */
  for (const { name, html } of pages) {
    if (html.includes("app.js?")) continue;
    const stray = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
    if (stray.length) fail(`${name}: uses data-i18n text without app.js (${stray.slice(0, 3).join(", ")})`);
  }

  const referenced = new Set();
  for (const { html } of pages) {
    for (const match of html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)) referenced.add(match[1]);
  }
  for (const match of appSrc.matchAll(/\bt\("([^"]+)"\)/g)) referenced.add(match[1]);
  const allKeys = new Set([...zhKeys, ...enKeys]);
  const unresolved = [...referenced].filter((key) => !allKeys.has(key));
  if (unresolved.length) fail(`i18n: referenced keys missing from the dictionary: ${unresolved.slice(0, 5).join(", ")}`);
  pass(`i18n: ${zhKeys.length} keys with zh/en parity, ${referenced.size} references resolve`);
}

/* 10. Dead code: a top-level declaration that is never referenced again. */
const jsFiles = ["app.js", "sw.js", "notfound.js"].filter((file) => existsSync(join(PUBLIC, file)));
for (const file of jsFiles) {
  const src = readFileSync(join(PUBLIC, file), "utf8");
  const declared = [...src.matchAll(/^(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
  const orphans = declared.filter((name) => {
    const hits = src.match(new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`, "g"));
    return (hits ? hits.length : 0) <= 1;
  });
  if (orphans.length) fail(`${file}: unreferenced declaration(s): ${orphans.slice(0, 5).join(", ")}`);
}

/* 11. CSS: no duplicated property inside a single rule. */
const cssSrc = readFileSync(join(PUBLIC, "styles.css"), "utf8");
const repeatedProps = [];
for (const rule of cssSrc.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = rule[1].trim().replace(/\s+/g, " ");
  if (selector.startsWith("@")) continue;
  const props = [...rule[2].matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
  const dupes = props.filter((prop, index) => props.indexOf(prop) !== index);
  if (dupes.length) repeatedProps.push(`${selector.slice(0, 40)} → ${[...new Set(dupes)].join(", ")}`);
}
if (repeatedProps.length) fail(`styles.css: duplicated property in rule: ${repeatedProps.slice(0, 3).join(" | ")}`);
pass(`dead code: ${jsFiles.length} scripts and styles.css free of unreferenced declarations / repeated properties`);

/* 12. CSS split invariant: a rule whose selectors are all page-scoped must
       live in that page's stylesheet, so pages that don't load it stay slim. */
const splitFiles = {
  home: "styles-home.css",
  about: "styles-about.css"
};
for (const [page, file] of Object.entries(splitFiles)) {
  const target = join(PUBLIC, file);
  if (!existsSync(target)) {
    fail(`missing ${file} — the ${page}-page CSS split was removed without updating the pages`);
    continue;
  }
  const own = readFileSync(target, "utf8");
  const strayInShared = [];
  for (const rule of cssSrc.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = rule[1].trim().replace(/\s+/g, " ");
    if (selector.startsWith("@")) continue;
    const sels = selector.split(",").map((x) => x.trim()).filter(Boolean);
    if (!sels.length) continue;
    if (sels.every((sel) => sel.includes(`data-page="${page}"`))) {
      strayInShared.push(selector.slice(0, 40));
      break;
    }
  }
  if (strayInShared.length) {
    fail(`styles.css still carries ${page}-only rules (move them to ${file}): ${strayInShared[0]}`);
  }
  const loadedOn = pages.filter(({ html }) => html.includes(file));
  if (!loadedOn.length) fail(`${file} is generated but no page loads it`);
}
pass("CSS split: page-scoped rules live in their own stylesheet (home / about)");

/* 13. Prerendered detail pages: one file per slug, carrying the hero, and
       never added to the sitemap (they are served under the ?slug= URL). */
const prerenderDir = join(PUBLIC, "p");
const prerenderSlugs = [...projectSlugs, ...noteSlugs];
if (existsSync(prerenderDir)) {
  for (const slug of prerenderSlugs) {
    const file = join(prerenderDir, `${slug}.html`);
    if (!existsSync(file)) {
      fail(`prerender: missing public/p/${slug}.html`);
      continue;
    }
    const html = readFileSync(file, "utf8");
    if (!html.includes('class="prerender-hero"')) fail(`prerender: public/p/${slug}.html has no hero block`);
    if (!/<h1[^>]*>/.test(html)) fail(`prerender: public/p/${slug}.html has no h1`);
    if (/<link rel="canonical" href="[^"]*\/p\//.test(html)) fail(`prerender: public/p/${slug}.html must keep the ?slug= canonical`);
  }
  for (const loc of sitemapLocs) {
    if (loc.includes("/p/")) fail(`sitemap.xml must not list prerendered file ${loc}`);
  }
  const orphanFiles = readdirSync(prerenderDir)
    .filter((file) => file.endsWith(".html") && !prerenderSlugs.includes(file.replace(/\.html$/, "")));
  if (orphanFiles.length) fail(`prerender: orphaned file(s) for removed slugs: ${orphanFiles.slice(0, 5).join(", ")}`);
  pass(`prerender: ${prerenderSlugs.length} detail pages carry the hero in HTML (not in the sitemap, no orphans)`);

/* 14. Data split: listing pages must not ship the detail-only copy. */
const dataListPath = join(PUBLIC, "data-list.js");
if (!existsSync(dataListPath)) {
  fail("missing public/data-list.js — run npm run gen:seo");
} else {
  const listFileSize = readFileSync(dataListPath, "utf8").length;
  const fullSize = readFileSync(join(PUBLIC, "data.js"), "utf8").length;
  if (listFileSize >= fullSize) fail("data-list.js is not smaller than data.js");
  for (const { name, html } of pages) {
    const detailShell = name === "project.html" || name === "note.html";
    if (detailShell && !html.includes("data.js?")) fail(`${name}: detail shell must load the full data.js`);
    if (!detailShell && html.includes("data.js?")) fail(`${name}: listings must load the pruned data-list.js`);
    if (!detailShell && /class="(?:work-card|note-card|track-card)"/.test(html) && false) continue;
  }
  pass(`data split: listing pages use data-list.js (${Math.round(listFileSize / 1024)} KB) instead of data.js (${Math.round(fullSize / 1024)} KB)`);
}
}

/* Summary */
console.log(results.join("\n"));
if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll release checks passed");
