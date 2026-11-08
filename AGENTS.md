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
- Detail pages (`project.html`, `note.html`) are empty shells — content injected by JS from `?slug=`. `npm run gen:seo` additionally emits `public/p/<slug>.html` (a copy of the shell with the hero already rendered) and nginx serves it through `try_files /p/$arg_slug.html /project.html` for the *same* `?slug=` URL, so the hero — the LCP element — paints before `data.js`/`app.js` load. The block is wrapped in `.prerender-hero`, which `[data-lang="en"]` hides so English visitors never see a Chinese flash; `/p/` is `Disallow`ed in robots.txt and excluded from the sitemap
- `window.siteData` from `data.js` is the single source of truth
- Theme switching via `[data-theme="light"]` attribute on `<html>`
- Scroll animations via IntersectionObserver (add `.reveal` class to new sections)
- Fonts: self-hosted latin variable woff2 (Syne, Space Grotesk) + system CJK stack (PingFang SC / Microsoft YaHei) — no Google Fonts requests anywhere. Do **not** preload them: on a slow/cross-border link the 57 KB of fonts competes with the render-blocking stylesheet. Measured on the live path (4 runs each), dropping the preloads takes cold FCP/LCP from 2588 ms → 1944 ms for +0.016 CLS (still "good"), so they are left to be discovered from CSS
- `recorder.js` (umami session replay, ~186 KB) is lazy-injected by `app.js` after `window load` + idle; never a static head script. It is skipped entirely when `navigator.connection.saveData` is set or `effectiveType` is 2g/slow-2g
- Cache versioning: bump `styles.css?v=` / `app.js?v=` / `data.js?v=` in every page head together with the matching `sw.js` SHELL keys (exact URLs, query string included) and the `sw.js` CACHE name. `npm run check` fails on any mismatch in CI.
- `data.js` is split for delivery: `npm run gen:seo` emits `data-list.js` (the same shape with detail-only copy stripped — 5.5 KB gzip vs 21.9 KB) which the five listing pages load, while `project.html` / `note.html` keep the full `data.js`. `verify-site` fails if a listing page loads the full file or a detail shell loads the pruned one
- SEO/GEO artifacts are **derived** from `data.js`: after editing content run `npm run gen:seo`; the generator also mints the sitemap and the no-JS `archive.html`, and CI fails if they are stale. Never hand-edit `llms.txt`, `llms-full.txt`, `feed.xml`, `archive.html`, or `sitemap.xml`.
- SW strategy: network-first for navigations (deploys land on the next online visit, offline falls back to cache), cache-first for versioned `?v=` statics; `controllerchange` in `app.js` reloads once when a new SW takes over (first installs excluded); `navigationPreload` fetches documents in parallel with SW startup. **The precache list may only contain URLs that return HTTP 200 anonymously** — `/404.html` is internal in nginx, so including it silently broke the whole SW install until 2026-11-01. Offline detail URLs (`?slug=`) fall back to their cached `project.html` / `note.html` shell so the client router still renders the entry.
- Cross-document view transitions are enabled in CSS (`@view-transition`); they are progressive enhancement (Chrome 126+) and disabled under `prefers-reduced-motion`
- Home hero is a two-column stage in `styles-home.css`: identity copy left, `.hero-console` right holding the `profile.now` rows that `app.js` injects. Two rules keep it free of cold-load shift, both found by measurement — **never cap a text block with `ch`** (`ch` resolves against the *current* font, so before Syne arrived the fallback capped the h1 at 603 px, the title wrapped to two lines, and it flipped to one on swap: 60 px of movement; the grid column already bounds the width), and **keep JS-filled panels top-aligned** (`align-self: start`) so they grow downwards rather than moving their own origin — a vertically centred console moved its top by 83 px when its rows landed. Cold-load CLS on the home page: 0.247 before the rebuild → 0.057 after; the residue is `#notes` being pushed down when `app.js` mounts the work cards, which sits below the fold and is inherent to JS-rendered listings. Verify a change here by blocking one resource at a time (`Network.setBlockedURLs`) and reading `layout-shift` entries, not by eye

## Adding Content

Edit `data.js` — add an entry to `projects[]` or `notes[]`. No HTML changes needed.

### Site-wide bilingual contract

Language is site-wide (`localStorage` key `site-lang`, legacy `notes-lang` still read) and mirrored into the URL: `?lang=en` is the English view, the clean URL is Chinese (`x-default`). The inline boot script reads `?lang=` first (so shared links open in the right language), and `syncLangSeo()` keeps `canonical`, `og:url` and the three `hreflang` alternates in sync with whichever language is shown — otherwise zh and en compete for the same page. Pages that don't load `app.js` (404, archive) must not advertise alternates they can't honour. Chrome strings use `data-i18n` / `data-i18n-aria` / `data-i18n-placeholder` plus `I18N` in `app.js`. Keep product keywords in English in both locales (Agent, Kernel, DAG, Showcase, Replay, hy-memory, LangGraph, etc.).

**Projects** — every `projects[]` entry needs:
- `date` + `updated` (ISO `YYYY-MM-DD`) — flow into RSS `pubDate`, JSON-LD `datePublished/dateModified`, and sitemap `lastmod`
- `summaryEn`, `overviewEn`, `highlightsEn[]` (same length as `highlights[]`)
- `title`, `label`, `status`, `stack`, `detailTitle`, `role`, `outputs` stay English-only
- Profile `now[]` items need `beatEn`; profile needs `titleEn`

**Notes** — every `notes[]` entry needs:
- `date` + `updated` (ISO `YYYY-MM-DD`) — flow into RSS `pubDate`, JSON-LD `datePublished/dateModified`, and sitemap `lastmod`
- `titleEn`, `detailTitleEn` (EN titles; `title` / `detailTitle` stay Chinese)
- `summaryEn`, `overviewEn`, `bulletsEn[]` (same length as `bullets[]`)
- `lensZh` (`lens` stays English)
- `label`, `status`, `timeframe`, `meta`, `outputs` stay English-only
- Tone: direct, contracted forms (`isn't`, `don't`, `can't` — never `is not`, `cannot`); shared terms: `closed loop`, `flywheel`, `moat`, `hundred-million-scale`, `build in public`
- After editing, toggle EN on home / projects / notes / one detail page and check for blanks or `undefined`

## Deployment

- **Production = one VPS** (`jwip`, `142.93.21.26`): nginx serves `/var/www/html` from `public/`; TLS via acme.sh DNS-01 (Aliyun), certs in `/root/.acme.sh/jameryw.dev_ecc/`, renewed by cron. GitHub Pages is not used (the old Pages workflow was removed).
- nginx behavior lives in `deploy/nginx.conf`: port 80 → HTTPS redirect, apex → www 301, custom 404 (`/404.html`), gzip, `Cache-Control: max-age=60` for HTML (repeat navigations skip revalidation; deploys still land within a minute), `no-cache` for `sw.js`, 1-year caching for `?v=` statics/fonts, 1-hour for the machine-readable `.txt/.xml/.json` assets (robots, llms, sitemap, feed, manifest), 1 day for `security.txt`, the box's `/xray` gRPC proxy (keep it), and response-hardening headers (HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy) declared per HTTPS server block — a server-level `add_header` suppresses the ones inherited from `http`, so never move them to a location. The old `/ws` proxy was removed server-side as a dead route.
- Deploy with `npm run deploy` (script runs `npm run check`, backs up the web root to `/root/deploy-backups/`, rsyncs, and verifies the deployed versions). Roll back with `ssh jwip 'tar xzf /root/deploy-backups/mysite-html-<stamp>.tgz -C /var/www'`.
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
