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

/* Summary */
console.log(results.join("\n"));
if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll release checks passed");
