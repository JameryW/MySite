# MySite

A geek-themed, AI-focused personal website — zero dependencies, no build step, pure vanilla HTML/CSS/JS. Installable PWA with offline support.

🌐 **Live:** [jameryw.dev](https://www.jameryw.dev)

## Features

- **Data-driven rendering** — all content from a single `data.js`, new entries need zero HTML changes
- **Dark / Light theme** — CSS custom properties with `[data-theme]` switching
- **Glass-morphism UI** — `backdrop-filter: blur()` panels with console aesthetics
- **Scroll reveal** — IntersectionObserver-powered entrance animations
- **Command palette** — `⌘K` global search across projects, notes, and pages
- **PWA support** — service worker + web app manifest for offline-capable install
- **Self-hosted analytics** — Umami pageviews + session replays (15% sample), no third-party trackers
- **Strict CSP** — `default-src 'self'; script-src 'self' https://stats.jameryw.dev` on every page
- **Responsive** — breakpoints at 980px and 760px, mobile menu with hamburger toggle
- **Accessible** — skip links, ARIA labels, `prefers-reduced-motion` support
- **Social profile links** — GitHub, X, and Xiaohongshu (小红书) entries in topbar, about contact card, and footer with brand icons (inline SVG for GitHub/X, image for Xiaohongshu)

## Quick Start

```bash
# clone
git clone https://github.com/JameryW/MySite.git
cd MySite

# start dev server (Python 3)
npm run dev
# → http://localhost:4173
```

No install step. No dependencies. The `dev` script runs `python3 -m http.server 4173 --directory public`.

## Project Structure

```
public/
├── index.html          # homepage (hero, #work [Core Builds], #notes)
├── projects.html       # project listing
├── showcase.html       # showcase / live demos page
├── notes.html          # notes listing
├── about.html          # about page
├── project.html        # project detail shell (JS-rendered from ?slug=)
├── note.html           # note detail shell (JS-rendered from ?slug=)
├── 404.html            # custom 404 page
├── data.js             # all content data (window.siteData = {profile, projects[5], notes[10]})
├── app.js              # rendering, interactions, nav, animations
├── styles.css          # single shared stylesheet
├── sw.js               # service worker (cache-first, CACHE = 'mysite-v65')
├── manifest.json       # PWA manifest
├── umami-config.js     # Umami analytics configuration
├── favicon.svg         # site icon
├── sitemap.xml         # SEO sitemap
└── robots.txt          # crawler rules
```

## Architecture

**Zero-build static site + PWA.** All files live in `public/`. Content is data-driven via `data.js`, which sets `window.siteData = { profile, projects[5], notes[10] }`. `app.js` reads `data-*` DOM attributes to render per-page content. Detail pages (`project.html`, `note.html`) are empty shells filled by JS from the `?slug=` query param. Cross-referencing between entries uses `relatedNotes[]` / `relatedProjects[]` slug arrays.

**7 HTML pages** plus 404: `index`, `projects`, `showcase`, `notes`, `about`, `project` (detail shell), `note` (detail shell).

**Shared chrome:** topbar nav (Home / Projects / Showcase / Notes / About), decorative overlays (noise, particle-bg canvas, parallax orbs, cursor-glow, scroll-progress), ⌘K command palette, dark/light theme, glass-morphism.

**PWA:** `manifest.json` + `sw.js` (cache-first, `CACHE = 'mysite-v65'`).

**SEO:** JSON-LD, Open Graph tags, `sitemap.xml`, `robots.txt`.

**Fonts:** Space Grotesk + Syne + Noto Sans SC.

The 5 projects map 1:1 to other `~/aiworks` repos.

## Adding Content

Edit `data.js` — add an entry to `projects[]` or `notes[]` with required fields:

```js
{
  slug: "my-project",       // URL-friendly identifier
  code: "A1",               // display code
  label: "Category",
  title: "My Project",
  summary: "One-line description",
  href: "https://github.com/...",
  cta: "view source",
  status: "Active",
  stack: ["Tech1", "Tech2"],
  // ... see data.js for full schema
}
```

The rendering, listing pages, detail pages, and search all update automatically.

## Analytics

Self-hosted [Umami](https://umami.is/) at `stats.jameryw.dev`:

- **Pageviews** — `script.js` loaded on every page
- **Session replays** — `recorder.js` at 15% sample rate
- Blocked by no third-party trackers; CSP allows only `self` and `stats.jameryw.dev`

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) uploads `public/` to GitHub Pages on push. No build step — static files served as-is.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 |
| Styling | CSS custom properties, glass-morphism, no preprocessors |
| Scripting | Vanilla JS (ES2020+), no framework |
| Fonts | Space Grotesk + Syne + Noto Sans SC |
| PWA | Service Worker + Web App Manifest |
| Analytics | Self-hosted Umami (pageviews + session replays) |
| Security | Strict CSP per page |
| Deploy | GitHub Actions → GitHub Pages |
| Hosting | GitHub Pages |

## Browser Support

Modern browsers with `backdrop-filter` and CSS custom properties support:
Chrome 80+, Firefox 103+, Safari 15.4+, Edge 80+

## License

[MIT](./LICENSE)
