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
- `npm run check` — release checks: CSP hashes, cache-version consistency, service-worker precache keys, broken local refs, external scripts, sitemap coverage (also runs in CI)
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
- Detail pages (`project.html`, `note.html`) are empty shells — content injected by JS from `?slug=`
- `window.siteData` from `data.js` is the single source of truth
- Theme switching via `[data-theme="light"]` attribute on `<html>`
- Scroll animations via IntersectionObserver (add `.reveal` class to new sections)
- Fonts: self-hosted latin variable woff2 (Syne, Space Grotesk) + system CJK stack (PingFang SC / Microsoft YaHei) — no Google Fonts requests anywhere
- `recorder.js` (umami session replay) is lazy-injected by `app.js` after `window load` + idle; never a static head script
- Cache versioning: bump `styles.css?v=` / `app.js?v=` / `data.js?v=` in every page head together with the matching `sw.js` SHELL keys (exact URLs, query string included) and the `sw.js` CACHE name. `npm run check` fails on any mismatch in CI.
- SW strategy: network-first for navigations (deploys land on the next online visit, offline falls back to cache), cache-first for versioned `?v=` statics; `controllerchange` in `app.js` reloads once when a new SW takes over (first installs excluded)

## Adding Content

Edit `data.js` — add an entry to `projects[]` or `notes[]`. No HTML changes needed.

### Site-wide bilingual contract

Language is site-wide (`localStorage` key `site-lang`, legacy `notes-lang` still read). Chrome strings use `data-i18n` / `data-i18n-aria` / `data-i18n-placeholder` plus `I18N` in `app.js`. Keep product keywords in English in both locales (Agent, Kernel, DAG, Showcase, Replay, hy-memory, LangGraph, etc.).

**Projects** — every `projects[]` entry needs:
- `summaryEn`, `overviewEn`, `highlightsEn[]` (same length as `highlights[]`)
- `title`, `label`, `status`, `stack`, `detailTitle`, `role`, `outputs` stay English-only
- Profile `now[]` items need `beatEn`; profile needs `titleEn`

**Notes** — every `notes[]` entry needs:
- `titleEn`, `detailTitleEn` (EN titles; `title` / `detailTitle` stay Chinese)
- `summaryEn`, `overviewEn`, `bulletsEn[]` (same length as `bullets[]`)
- `lensZh` (`lens` stays English)
- `label`, `status`, `timeframe`, `meta`, `outputs` stay English-only
- Tone: direct, contracted forms (`isn't`, `don't`, `can't` — never `is not`, `cannot`); shared terms: `closed loop`, `flywheel`, `moat`, `hundred-million-scale`, `build in public`
- After editing, toggle EN on home / projects / notes / one detail page and check for blanks or `undefined`

## Deployment

- **Production = one VPS** (`jwip`, `142.93.21.26`): nginx serves `/var/www/html` from `public/`; TLS via acme.sh DNS-01 (Aliyun), certs in `/root/.acme.sh/jameryw.dev_ecc/`, renewed by cron. GitHub Pages is not used (the old Pages workflow was removed).
- nginx behavior lives in `deploy/nginx.conf`: port 80 → HTTPS redirect, apex → www 301, custom 404 (`/404.html`), gzip, `Cache-Control: no-cache` for HTML + `sw.js`, 1-year immutable caching for `?v=` statics/fonts, and the box's `/ws` / `/xray` proxies (do not drop them).
- Deploy with `npm run deploy` (script runs `npm run check`, backs up the web root to `/root/deploy-backups/`, rsyncs, and verifies the deployed versions). Roll back with `ssh jwip 'tar xzf /root/deploy-backups/mysite-html-<stamp>.tgz -C /var/www'`.
- Server config changes go through `deploy/nginx.conf` + `npm run deploy:nginx`; never hand-edit `/etc/nginx/nginx.conf` without syncing it back into the repo.

## Security

- Do not commit secrets, API keys, or credentials
- CSP is declared in every page `<head>` — no external scripts allowed
- `script-src` allows `'self'` plus the sha256 of the inline boot script. If you touch that inline script (theme/lang restore, loader timeouts), recompute the hash for all 8 pages or the browser silently blocks the boot script and light/EN users get a flash of the wrong theme/language:
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
