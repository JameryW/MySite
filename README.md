# MySite

A geek-themed, AI-focused personal website — zero dependencies, no build step, pure vanilla HTML/CSS/JS.

🌐 **Live:** [jameryw.github.io](https://jameryw.github.io)

## Features

- **Data-driven rendering** — all content from a single `data.js`, new entries need zero HTML changes
- **Dark / Light theme** — CSS custom properties with `[data-theme]` switching
- **Glass-morphism UI** — `backdrop-filter: blur()` panels with console aesthetics
- **Scroll reveal** — IntersectionObserver-powered entrance animations
- **Command palette** — `⌘K` global search across projects, notes, and pages
- **PWA support** — service worker + web app manifest for offline-capable install
- **Responsive** — breakpoints at 980px and 760px, mobile menu with hamburger toggle
- **Accessible** — skip links, ARIA labels, `prefers-reduced-motion` support

## Quick Start

```bash
# clone
git clone https://github.com/JameryW/MySite.git
cd MySite

# start dev server (Python 3)
npm run dev
# → http://localhost:4173
```

No install step. No dependencies. The `dev` script is a plain `python3 -m http.server`.

## Project Structure

```
public/
├── index.html          # homepage (hero, about, work, notes, activity, contact)
├── projects.html       # project listing
├── notes.html          # notes listing
├── about.html          # about page
├── project.html        # project detail shell (JS-rendered from ?slug=)
├── note.html           # note detail shell (JS-rendered from ?slug=)
├── 404.html            # custom 404 page
├── data.js             # all content data (window.siteData)
├── app.js              # rendering, interactions, nav, animations
├── styles.css          # single shared stylesheet
├── sw.js               # service worker
├── manifest.json       # PWA manifest
├── favicon.svg         # site icon
├── sitemap.xml         # SEO sitemap
└── robots.txt          # crawler rules
```

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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 |
| Styling | CSS custom properties, glass-morphism, no preprocessors |
| Scripting | Vanilla JS (ES2020+), no framework |
| Fonts | Google Fonts (Space Grotesk + Syne) |
| PWA | Service Worker + Web App Manifest |
| Hosting | GitHub Pages |

## Browser Support

Modern browsers with `backdrop-filter` and CSS custom properties support:
Chrome 80+, Firefox 103+, Safari 15.4+, Edge 80+

## License

[MIT](./LICENSE)
