# Repository Guidelines

## Project Structure

This is a zero-dependency static personal website. All site files live in `public/` — there is no `src/`, no compilation, no bundler.

```
public/                 # everything shipped to production
├── index.html          # homepage
├── projects.html       # project listing
├── notes.html          # notes listing
├── about.html          # about page
├── project.html        # project detail (JS-rendered from ?slug=)
├── note.html           # note detail (JS-rendered from ?slug=)
├── 404.html            # custom 404 page
├── data.js             # all content data (window.siteData)
├── app.js              # rendering, interactions, animations
├── styles.css          # single shared stylesheet
├── sw.js               # service worker
└── manifest.json       # PWA manifest

deploy/nginx.conf       # source of truth for the production VPS nginx config
scripts/                # release checks + deploy scripts (zero dependencies)
.github/workflows/      # CI checks on every PR/push
```

Root config: `package.json`, `CLAUDE.md`, `.editorconfig`, `.gitignore`

## Development Commands

- `npm run dev` — start local dev server at `http://localhost:4173` (Python HTTP server)
- `npm run check` — release checks: CSP hashes, cache-version consistency, service-worker precache keys, broken local refs, external scripts, sitemap coverage, SEO/GEO asset freshness, content dates, i18n zh/en key parity + reference resolution (also runs in CI)
- `npm run gen:seo` — regenerate `llms.txt`, `llms-full.txt`, `feed.xml`, `archive.html`, `sitemap.xml` from `data.js`
- `npm run deploy` — verify, back up, rsync `public/` to the production VPS, verify deployed versions (`-- --dry-run` to preview)
- `npm run deploy:nginx` — validate + install `deploy/nginx.conf` on the VPS and reload nginx
- No test suite, linter, or build step is configured

## Coding Style

- 2-space indentation for HTML, CSS, JS, JSON
- Content is data-driven: all projects/notes live in `data.js`, never hardcoded in HTML
- CSS custom properties for theming (`--bg`, `--cyan`, `--pink`, `--lime`, etc.)
- Bilingual: Chinese primary, English secondary for user-facing content
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`

## Key Patterns

- `data-*` attributes on DOM nodes drive page rendering in `app.js`
- Detail pages (`project.html`, `note.html`) are empty shells — content injected by JS from `?slug=`. `npm run gen:seo` additionally emits `public/p/<slug>.html` and nginx serves it through `try_files /p/$arg_slug.html /project.html` for the *same* `?slug=` URL, so the hero — the LCP element — paints before `data.js`/`app.js` load and English visitors see an English hero (the block is wrapped in `.prerender-hero` and its text carries the same `data-lang-zh`/`data-lang-en` pairs as the static pages; do not hide it for EN). The generated copy also rewrites the shell head with the entry's own `<title>`, description, canonical (`?slug=`), OG/Twitter tags, zh/en hreflang alternates and CreativeWork/BlogPosting JSON-LD — `verify-site` fails if any of that drifts from `data.js` or if the canonical stops matching the sitemap. `/p/` is `Disallow`ed in robots.txt and excluded from the sitemap
- `window.siteData` from `data.js` is the single source of truth
- Theme switching via `[data-theme="light"]` attribute on `<html>`
- Scroll animations via IntersectionObserver (add `.reveal` class to new sections)
- Fonts: self-hosted latin variable woff2 (Syne, Space Grotesk) + system CJK stack (PingFang SC / Microsoft YaHei) — no Google Fonts requests anywhere. The `Syne Fallback` metric-override face carries `size-adjust: 121%` (re-measured 2026-11-16): the original 96.8% came from an average advance width and rendered ~25% narrower than Syne, so the English hero title wrapped one line in the fallback and two in Syne, moving the page 60px on font swap. Do not "restore" the older value without re-measuring fallback-vs-loaded line counts at 1440 and 390. Do **not** preload them: on a slow/cross-border link the 57 KB of fonts competes with the render-blocking stylesheet. Measured on the live path (4 runs each), dropping the preloads takes cold FCP/LCP from 2588 ms → 1944 ms for +0.016 CLS (still "good"), so they are left to be discovered from CSS
- `public/boot-guard.js` is the last-resort notice for "JavaScript is enabled but nothing rendered": if `app.js` never runs (a WebView that cannot parse it, a blocked script, a CSP slip) the page keeps its static hero and silently loses every card. `<noscript>` does not cover that case. The guard is loaded with `defer`, waits 2.5s, checks for rendered cards inside the listing/detail containers, and injects a bilingual banner pointing at `archive.html` / `llms-full.txt`; it removes the banner if `app.js` lands late. Both scripts are deferred and execute in document order, so the guard cannot run before `app.js` has finished downloading — that is what keeps it quiet on slow networks: measured under throttling with a cold cache, cards appeared at 2.2 s / 6.0 s / 9.8 s / **14.7 s** and the banner never showed once, while a blocked `app.js` produced it immediately. Keep it ES5 and dependency-free — it has to run on exactly the engines that failed — and bump `boot-guard.js?v=` (pages + `sw.js` SHELL) when you change it.
- `recorder.js` (umami session replay, 191 KB raw / **58.7 KB gzip**) is lazy-injected by `app.js` after `window load` + idle — never a static head script, and it starts +4…+99 ms after `load` in every measured run, so it is never on the FCP/LCP path. Measured post-load cost at 4× CPU: ~+0.2 s main thread, one ~59 ms long task, ~1 s of extra network activity; vitals are unchanged. It is skipped when `navigator.connection.saveData` is set, when `effectiveType` is 2g/slow-2g, or when `navigator.deviceMemory < 4` (low-RAM Chromium pays the parse/exec tax for a replay nobody scrubs). Do **not** add an `effectiveType === "3g"` clause: Chrome classifies this site's own 300 ms-RTT cross-border link as 3g, so that would drop replay for essentially every real visitor
- Cache versioning: bump `styles.css?v=` / `app.js?v=` / `data.js?v=` in every page head together with the matching `sw.js` SHELL keys (exact URLs, query string included) and the `sw.js` CACHE name. `npm run check` fails on any mismatch in CI.
- `data.js` is split for delivery: `npm run gen:seo` emits `data-list.js` (the same shape with detail-only copy stripped — 5.5 KB gzip vs 21.9 KB) which the five listing pages load, while `project.html` / `note.html` keep the full `data.js`. `verify-site` fails if a listing page loads the full file or a detail shell loads the pruned one
- SEO/GEO artifacts are **derived** from `data.js`: after editing content run `npm run gen:seo`; the generator also mints the sitemap and the no-JS `archive.html`, and CI fails if they are stale. Never hand-edit `llms.txt`, `llms-full.txt`, `feed.xml`, `archive.html`, or `sitemap.xml`.
- SW strategy: network-first for navigations (deploys land on the next online visit, offline falls back to cache), cache-first for versioned `?v=` statics; `controllerchange` in `app.js` reloads once when a new SW takes over (first installs excluded); `navigationPreload` fetches documents in parallel with SW startup. **The precache list may only contain URLs that return HTTP 200 anonymously** — `/404.html` is internal in nginx, so including it silently broke the whole SW install until 2026-11-01. Offline detail URLs (`?slug=`) fall back to their cached `project.html` / `note.html` shell so the client router still renders the entry.
- Command palette: opened by any `[data-palette-trigger]` — the desktop hint inside `.topbar-meta` plus the `.mobile-search` button that is visible ≤980px (the hint is inside the collapsed menu there). Both are bound in `app.js`, the close handler hands focus to whichever trigger is on-screen, and the touch button's aria-label carries no keyboard-shortcut suffix
- `archive.html` opts out of the webfonts (`body[data-page="archive"]` overrides `--font-sans` / `--font-display` with the system stack): it is the no-JS fallback and crawler surface, so it takes zero font requests and cannot suffer the fallback-face swap that cost it 0.161 CLS;
- `.page-title` line rules must use **direct-child** combinators (`> span`): the static bilingual pairs are nested spans, so a descendant `span` selector also hits them. When it did, the listing H1 (`.page-title-main > span[data-lang-*]`) inherited the 0.42em outlined-subtitle treatment from the subtitle rule and `h1 span`, and the title rendered at 39px hollow instead of 93.6px solid. Pair spans that are direct children of `h1` (the no-JS detail title string) get title ink from the reset rule next to `.page-title-main`. Check computed font-size/`-webkit-text-stroke` on `h1 .page-title-main` after touching any title rule;
- Type system: roles live as tokens on `:root` — `--type-display` (listing h1), `--type-hero` (detail h1), `--type-h2`, `--type-h3` (card titles), `--type-lead` (1.14rem), `--type-body` (1.13rem), `--type-label` (0.86rem), `--type-micro` (0.76rem), `--lh-display` / `--lh-body` — and the "Type system" block at the end of `styles.css` applies them. Readings sit at 20.3px (detail highlights/points, cards, section summaries, home summaries), card titles at 35.1px, labels at 15.5px, mobile detail body at 1.04rem. If a rule needs a different size it should either use one of these tokens or justify a new role — the pre-2026-11 audit found 20+ distinct sizes on one page;
- Type scale: `html { font-size: 112.5% }` (18px at the browser default). Every font size in `styles.css` / `styles-home.css` / `styles-about.css` is rem/em — there are no px font sizes — so one root value scales the whole system and still honours a visitor's own browser font preference. The reading surface is deliberately consistent: library card body / home work + note summaries / section summaries / hero tagline all sit at `1.13rem` (20.3px), about lead `1.14rem`, detail lead `1.14rem`. Do not drop a body-copy rule back to `1rem` — that is what made the pages read small. The home hero h1 is capped at `3.1rem` on purpose: 3.5rem wraps the one-line title at 1440 with the 18px root (60px shift); re-measure the title line count before changing either value
- Cross-document view transitions are enabled in CSS (`@view-transition`); they are progressive enhancement (Chrome 126+) and disabled under `prefers-reduced-motion`
- Home hero is a two-column stage in `styles-home.css`: identity copy left, `.hero-console` right holding the `profile.now` rows that `app.js` injects. Two rules keep it free of cold-load shift, both found by measurement — **never cap a text block with `ch`** (`ch` resolves against the *current* font, so before Syne arrived the fallback capped the h1 at 603 px, the title wrapped to two lines, and it flipped to one on swap: 60 px of movement; the grid column already bounds the width), and **keep JS-filled panels top-aligned** (`align-self: start`) so they grow downwards rather than moving their own origin — a vertically centred console moved its top by 83 px when its rows landed. Cold-load CLS on the home page: 0.247 before the rebuild → 0.057 after it; with the static bilingual pairs in place the throttled profile reads **0.062 zh / 0.030 en** (was 0.209 en before the pairs), and `about.html` 0.023 zh / 0.015 en (was 0.128 en). The residue is `#demos` (and `#notes` on shorter viewports) being pushed down when `app.js` mounts the work cards — inherent to JS-rendered listings, so reserve space or prerender before chasing it. Verify a change here by blocking one resource at a time (`Network.setBlockedURLs`) and reading `layout-shift` entries, not by eye

### Measured performance ceiling (2026-11-14)

Cold-start waterfall on the live site under CDP throttling (300 ms RTT, 200 KB/s, cold profile): **TTFB 3101 ms → CSS done 4159 ms → FCP 4260 ms → load 13.3 s**. Unthrottled from the same line: TCP connect 7 ms, **TLS 1.669 s / 0.815 s**, TTFB 2.46 s / 2.00 s. So the cost is the cross-border round trips, not the server (nginx answers a page in 75 ms on loopback).

Things that were tried and did **not** pay off — do not re-litigate them without new numbers:

- **Inlining the stylesheets.** Prototype inlined `styles.css` + `styles-home.css` into `index.html` and dropped both links: FCP 2032 → 1680 ms (−352 ms) and one fewer round trip, and total gzip actually fell 35.4 KB → 34.5 KB. It was still rejected: it makes the home HTML 34.5 KB gzip instead of 5.3 KB, so repeat visitors and every other page lose the immutable 1-year CSS cache to buy one page one round trip.
- **Inlining only a critical subset.** A strict selector allowlist (`:root`, `body`, `.site-frame`, `.topbar*`, `.hero-*`, `.button`, …) still extracts **51.6 KB raw / ~11 KB gzip** because the hero, topbar and buttons pull in most of the shared layer — more inline bytes than the two files it would replace. Extraction is not worth a generator here.
- **manifest.json looked broken** (10 s under throttling, 0 KB) but serves in 828 B / 75 ms on the box and 1.25 s over the real link; the stall is a CDP bandwidth-emulation artifact, not a server or SW problem.
- **TLS tuning.** The cert is Let's Encrypt with **no OCSP URL**, so stapling is moot. `ssl_session_cache` is unset (nginx default `none`) but TLS 1.3 session tickets are issued with a 300 s lifetime, so resumption already works for browsers; adding a shared cache only helps TLS 1.2 Session-ID clients.
- **Minifying / pruning the CSS.** Measured on the same cold profile: a comments-and-whitespace-only minification of `styles.css` saves **100 ms FCP (−9.5 %)** locally, and blocking *both* stylesheets recovers 220 ms — but a Chrome trace puts the whole style/parse/layout/paint budget at **5 % of FCP**, with 93 % being network wait (`navStart → HTML 413 ms`, `→ CSS done 996 ms`, `→ FCP 1177 ms`; `ParseAuthorStyleSheet` 7.2 ms, style recalc 27 ms, layout 10 ms, paint 7 ms). On the production path (−11 KB gzip ≈ 55 ms transfer) that is 1.5–2 % of FCP, and it would add the project's first build step. Headless "unused CSS" audits that report ~half the rules dead are dominated by `:hover`/`:focus`/light-theme state a dark static load cannot trigger; a careful audit might recover 5–7 KB gzip. Not worth it while the ceiling is network
- **Removing the `<link rel=preload as=script>` tags.** They are **kept**: on a 300 ms / 200 KB/s profile, dropping both costs **+44 ms FCP (4.3 %)** and at 100 KB/s **+80 ms (6.1 %)** with non-overlapping ranges, even though the preload scanner discovers the `<script>` tags at the same instant. They cost ~+63 ms DCL and ~+82 ms load (they reorder work) and 18 gzip bytes; they do not steal CSS bandwidth (CSS done 957 ms with vs 993 ms without)
- **`load` is set by the third-party analytics script.** `stats.jameryw.dev/script.js` is an injected async script, so Chrome counts it toward `load` (median 1755 ms, seen up to 5.6 s on the real link). Moving the loader after `load` does not help (the replacement loader is the same low-priority deferred fetch), FCP is identical in every variant, and `load` is not a vitals metric — the only effect is a later recorder/idle start. Document it; do not chase it

The honest levers left are infra-level and need a decision: a CDN in front (moves TTFB off the cross-border path), or HTTP/3 — which this box cannot do, `nginx/1.24.0 (Ubuntu)` is compiled **without** `http_v3_module`, so it needs the nginx.org repo (≥1.25) first.

## Adding Content

Edit `data.js` — add an entry to `projects[]` or `notes[]`. No HTML changes needed.

### Site-wide bilingual contract

Language is site-wide (`localStorage` key `site-lang`, legacy `notes-lang` still read) and mirrored into the URL: `?lang=en` is the English view, the clean URL is Chinese (`x-default`). The inline boot script reads `?lang=` first (so shared links open in the right language), and `syncLangSeo()` keeps `canonical`, `og:url` and the three `hreflang` alternates in sync with whichever language is shown — otherwise zh and en compete for the same page. Pages that don't load `app.js` (404, archive) must not advertise alternates they can't honour. Chrome strings use `data-i18n` / `data-i18n-aria` / `data-i18n-placeholder` plus `I18N` in `app.js`. Keep product keywords in English in both locales (Agent, Kernel, DAG, Showcase, Replay, hy-memory, LangGraph, etc.).

**Static copy ships in both languages.** Every `<x data-i18n="key">` node in the hand-authored pages (index, projects, notes, about, showcase, project, note — and therefore the generated `p/*.html` shells) contains exactly
`<span data-lang-zh>中文</span><span data-lang-en>English</span>`, and `styles.css` shows one of them from `html[data-lang]`, which the head boot script sets before first paint. Do **not** let `app.js` rewrite these nodes: `applyChromeI18n()` skips elements that contain `[data-lang-zh]`, because replacing the text after the script lands is what used to reflow the English hero (measured CLS 0.209 on home, 0.128 on about) and flash Chinese on cross-border links. The wrapper spans are `display: contents`, so flow/flex/grid boxes measure exactly as before; the cost is ~0.2–0.5 KB gzip per page. `npm run check` compares both spans against the `I18N` dictionary and fails on any missing pair or drifted text, so edit the dictionary and the markup together. `data-i18n-aria` / `data-i18n-placeholder` still swap at runtime (aria attributes cannot be switched by CSS). The never-swapping pages (404, archive) stay hand-bilingual, as before.

**Projects** — every `projects[]` entry needs:
- `date` + `updated` (ISO `YYYY-MM-DD`) — flow into RSS `pubDate`, JSON-LD `datePublished/dateModified`, and sitemap `lastmod`
- `summaryEn`, `overviewEn`, `highlightsEn[]` (same length as `highlights[]`)
- `title`, `label`, `status`, `stack`, `detailTitle`, `role`, `outputs` stay English-only
- Profile `now[]` items need `beatEn`; profile needs `titleEn`

**Demo previews** — the home page has a "LIVE DEMOS" band built from `projects[]`. Any project with a `demoUrl` also needs `preview` (a screenshot path under `public/shots/`, 800×500 WebP, ~25 KB, browser-framed by CSS) or the band silently skips it; `npm run check` (check 16) fails when a `demoUrl` has no `preview`, when a `preview` points at a missing file, and when a `preview` has no `demoUrl`. Capture with the demo's real UI (1280–1440 wide, then crop to 16:10 and `cwebp -q 80`), not a mockup. The images are `loading="lazy"` with declared dimensions so they cannot shift layout or touch LCP.

**Notes** — every `notes[]` entry needs:
- `date` + `updated` (ISO `YYYY-MM-DD`) — flow into RSS `pubDate`, JSON-LD `datePublished/dateModified`, and sitemap `lastmod`
- `titleEn`, `detailTitleEn` (EN titles; `title` / `detailTitle` stay Chinese)
- `summaryEn`, `overviewEn`, `bulletsEn[]` (same length as `bullets[]`)
- `lensZh` (`lens` stays English)
- `label`, `status`, `timeframe`, `meta`, `outputs` stay English-only
- Tone: direct, contracted forms (`isn't`, `don't`, `can't` — never `is not`, `cannot`); shared terms: `closed loop`, `flywheel`, `moat`, `hundred-million-scale`, `build in public`
- After editing, toggle EN on home / projects / notes / one detail page and check for blanks or `undefined`

## Deployment

- **Production = one VPS** (`jwip`, `142.93.21.26`): nginx serves `/var/www/html` from `public/`; TLS via acme.sh DNS-01 (Aliyun), certs in `/root/.acme.sh/jameryw.dev_ecc/`, renewed by cron. GitHub Pages is **not a deploy target** — it only holds a read-only mirror of `public/` (next bullet); the VPS stays the single indexable origin.
- nginx behavior lives in `deploy/nginx.conf`: port 80 → HTTPS redirect, apex → www 301, custom 404 (`/404.html`), gzip, `Cache-Control: max-age=60` for HTML (repeat navigations skip revalidation; deploys still land within a minute), `no-cache` for `sw.js`, 1-year caching for `?v=` statics/fonts, 1-hour for the machine-readable `.txt/.xml/.json` assets (robots, llms, sitemap, feed, manifest), 1 day for `security.txt`, the box's `/xray` gRPC proxy (keep it), and response-hardening headers (HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy) declared per HTTPS server block — a server-level `add_header` suppresses the ones inherited from `http`, so never move them to a location. The old `/ws` proxy was removed server-side as a dead route.
- Deploy with `npm run deploy` (script runs `npm run check`, backs up the web root to `/root/deploy-backups/`, rsyncs, and verifies the deployed versions). Roll back with `ssh jwip 'tar xzf /root/deploy-backups/mysite-html-<stamp>.tgz -C /var/www'`. Each archive is the state **before** its own deploy, so undoing deploy N means restoring the archive N wrote — its `index.html` carries the previous version numbers (verified 2026-11-09: archives root at `html/`, pass `gzip -t`, and every `?v=` asset they reference is inside the archive, so a restore cannot leave the site pointing at a missing file).
- GitHub Pages runs as a read-only **mirror** (`https://jameryw.github.io/MySite/`) via `.github/workflows/pages.yml`, publishing `public/` on every push to `main`. Canonical URLs and the sitemap still point at `www.jameryw.dev`, so the mirror must never be treated as the primary deploy target.
- Server config changes go through `deploy/nginx.conf` + `npm run deploy:nginx`; never hand-edit `/etc/nginx/nginx.conf` without syncing it back into the repo. Two things that bite when re-syncing: `fastopen=3` may only be declared on **one** server block per address — repeating it on the apex block fails `nginx -t` with "duplicate listen options for 0.0.0.0:443" (this bit on 2026-11-09), and the `/xray` gRPC blocks take no `grpc_set_header`. `npm run deploy:nginx` validates the candidate with `nginx -t -c /tmp/…` before installing, so a bad candidate never reaches `/etc`; validate by hand the same way with `scp deploy/nginx.conf jwip:/tmp/nginx.conf.check && ssh jwip 'nginx -t -c /tmp/nginx.conf.check; rm -f /tmp/nginx.conf.check'` when you only want to check.

## Security

- Do not commit secrets, API keys, or credentials
- CSP is declared in every page `<head>` **and** as an nginx response header (same policy + `frame-ancestors 'none'`, `base-uri`, `form-action`, `object-src`); keep the inline-script hash in sync in both places
- `public/.well-known/security.txt` is the public security contact document (expires yearly — refresh the `Expires:` date when it lapses)
- No external scripts allowed
- `script-src` allows `'self'` plus the sha256 of the inline boot script. If you touch that inline script (theme/lang restore, loader timeouts), recompute the hash for all 9 pages (the 7 app pages plus `404.html` and `archive.html`) or the browser silently blocks the boot script and light/EN users get a flash of the wrong theme/language:
  `node -e 'const c=require("crypto"),s=require("fs").readFileSync("public/about.html","utf8").match(/<script>([\s\S]*?)<\/script>/)[1];console.log("sha256-"+c.createHash("sha256").update(s).digest("base64"))'`

<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->
