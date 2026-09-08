# Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

<!--
Document your project's quality standards here.

Questions to answer:
- What patterns are forbidden?
- What linting rules do you enforce?
- What are your testing requirements?
- What code review standards apply?
-->

(To be filled by the team)

---

## Forbidden Patterns

<!-- Patterns that should never be used and why -->

(To be filled by the team)

---

## Required Patterns

### Touch Hover Theme Parity

Mobile touch devices can keep `:hover` active after a tap. Any `@media (hover: none)` hover reset for shared cards or controls must preserve the active theme instead of hardcoding dark-mode colors.

```css
@media (hover: none) {
  .note-card:hover {
    background:
      linear-gradient(135deg, rgba(255, 79, 216, 0.04), transparent 50%),
      linear-gradient(180deg, rgba(18, 26, 52, 0.72), rgba(7, 11, 27, 0.86));
  }

  [data-theme="light"] .note-card:hover {
    background:
      linear-gradient(135deg, rgba(192, 38, 160, 0.04), transparent 50%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(230, 234, 245, 0.86));
  }
}
```

Decorative pseudo-elements layered over clickable cards or hero CTAs must use `pointer-events: none` so they cannot intercept touch hit-testing.

> **Warning**: Page-scoped hover overrides outrank the generic `@media (hover: none)` reset. `body[data-page="home"] .work-card:hover` (0,3,1) beats `.work-card:hover` (0,2,0), so the card stays shifted after tap on touch devices. Whenever you add a higher-specificity hover (e.g. home-scoped `transform`), add a same-specificity reset inside the `hover: none` block:
>
> ```css
> @media (hover: none) {
>   body[data-page="home"] .work-card:hover {
>     transform: none;
>   }
> }
> ```
> Learned 2026-09-05 in `09-05-optimize-homepage-layout` (check agent fix).
>
> The same applies to theme-scoped hovers: `[data-theme="light"] body[data-page="home"] .focus-list div:hover` (0,4,2) outranks a non-theme-scoped reset (0,3,2), so a theme-scoped hover needs its own `[data-theme="light"] …` reset inside `hover: none` (including per-item variants when resting styles differ, e.g. nth-child accent rails). Learned 2026-09-08 in `09-08-site-visual-perf-polish` (check agent fix).

### Static Asset Cache Versioning

When changing a cached static asset, update every cache key that can keep the old bytes alive.

For this project:

```html
<!-- HTML pages should point at the current stylesheet query version. -->
<link rel="stylesheet" href="./styles.css?v=22" />
```

```js
// sw.js cache names must change when cached shell assets change.
const CACHE = 'mysite-v20';
```

Required checks after editing `styles.css`, `app.js`, or `data.js`:

* Search all HTML pages for the matching query string, for example `styles.css?v=`.
* Bump the relevant query version in every page that references the changed asset.
* Bump `public/sw.js` `CACHE` when a shell asset changes so returning visitors do not receive stale cached files.
* Keep `sw.js` `SHELL` precache keys **exactly equal** to the versioned URLs the pages request (query string included). `caches.match()` does exact-key matching, so a precached `./styles.css` entry never satisfies a `./styles.css?v=62` request — the mismatch sat unnoticed until 2026-09 (`09-08-site-visual-perf-polish`).
* Self-hosted fonts under `public/fonts/` are keyed by their versioned filename (`-v1`, `-v2`, …); adding a file means adding the same path to `SHELL`.

### Platform Link Logos

Social platform links on standalone pages should use page-local SVG symbols or a verified local brand asset when the platform mark is not a practical inline path. Use the shared classes below and keep visible text alongside the logo for accessibility and recognition; external links retain `target="_blank"` and `rel="noreferrer"`.

```html
<a class="platform-link" href="https://x.com/JameryWang" target="_blank" rel="noreferrer">
  <svg class="platform-icon" aria-hidden="true"><use href="#platform-icon-x"></use></svg>
  <span>X</span>
</a>
```

Do not add a remote icon request or a dependency for these static platform marks. Keep the compact topbar icons grouped with `.topbar-socials` and leave primary page actions focused on page navigation.

On mobile, keep `.topbar-socials` as a direct child of `.topbar`, outside the collapsible `.topbar-meta` container. The menu toggle should control navigation and utility actions only, so the three platform icons remain visible before the menu is opened.

The mobile `.topbar-meta.open` state should be a compact bounded panel with a single horizontal row combining five navigation items and icon-only utility controls. Avoid repeating the topbar status or search shortcut text inside the open panel. Close it on navigation, outside clicks, and `Escape`, while returning focus to the menu button for keyboard users.

For the About page's three primary entry links, override the generic mobile stacked action layout with a compact three-column grid. Keep each target at least 42px tall and allow the label to wrap instead of stretching each link to the full viewport width.

For image-based marks, add the asset to the Service Worker shell cache and use an empty `alt` when the adjacent visible link text already names the platform.

### Async Font Links

Syne (400–800) and Space Grotesk (300–700) are self-hosted latin variable woff2 files under `public/fonts/` with versioned filenames (e.g. `syne-latin-var-v1.woff2`), declared via `@font-face` at the top of `styles.css` together with metric-override fallback faces (`Syne Fallback`, `Space Grotesk Fallback`, `Noto Sans SC Fallback` using `size-adjust`/`ascent-override`/`descent-override`). Only Noto Sans SC still loads from Google Fonts, async:

```html
<link rel="preload" href="./fonts/syne-latin-var-v1.woff2" as="font" type="font/woff2" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
  media="print"
  data-fonts-load
  rel="stylesheet"
/>
<script src="./app.js?v=27" defer></script>
```

Rules that come with this pipeline:

* Preload **Syne only** (the LCP display face); Space Grotesk is discovered through the `@font-face` in `styles.css`. The preload `href` must resolve to exactly the same URL as the `@font-face` `src` or the font downloads twice.
* Fonts are cache-keyed by their versioned filename — bump `-v1` → `-v2` (file + `@font-face` src + preload href + `sw.js` SHELL entry) when replacing a font file. `CSP` `font-src` must keep `'self' https://fonts.gstatic.com` on every page that declares a CSP meta.
* When replacing the self-hosted woff2 files, keep the metric-override fallback values in sync (recompute with the web.dev/next-font formulas; current values are one-time-measured approximations noted in `styles.css`).

Pages using the async Google Fonts pattern must also load the JavaScript font loader (`app.js` flips `media="print"` → `all`; it is the only loader because CSP forbids inline handlers). If a page intentionally does not load `app.js` (e.g. `404.html`), use a normal stylesheet link instead of `media="print" data-fonts-load` — the async link would never activate there.

### Detail Array Rendering

When rendering repeated detail sections from data arrays, each card must derive its visible heading and body from the item content, not from the parent project/note metadata. Parent metadata such as `project.label` or `project.timeframe` can be section context, but using it as every repeated card title makes the cards look duplicated.

```js
const detailItemParts = (item, fallbackTitle) => ({
  title: fallbackTitle || (item.length > 24 ? `${item.slice(0, 24)}...` : item),
  body: item.trim()
});
```

```html
<article class="track-card reveal">
  <p class="stack-label">Highlight 01</p>
  <h3>${highlight.title}</h3>
  <p>${highlight.body}</p>
</article>
```

### Page Shell Edge Gutters

Keep the main content shell at the established centered width, and handle edge seams through the page canvas/scrollbar backgrounds. Do not widen `.site-frame` to fix a right-edge seam because that changes the desktop layout scale.

```css
html {
  background: var(--bg);
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

.site-frame {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding-bottom: 48px;
}
```

Do not apply global focus outlines to large non-interactive layout containers such as `main[tabindex="-1"]`; the outline can look like an edge gap on desktop detail pages.

```css
:where(a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])):focus-visible {
  outline: 2px solid var(--lime);
}
```

### Related Card Grids

Related project/note grids should use compact spacing and content-driven heights. Do not reuse the generic `.related-card { min-height: 220px; }` behavior without an override for compact related sections.

```css
.related-track-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;
}

.build-track-grid > .track-card,
.related-track-grid > .track-card {
  min-width: 0;
}

.related-track-grid .related-card {
  min-width: 0;
  min-height: 0;
  height: 100%;
}
```

On mobile, project titles and detail-card headings must allow long English/CamelCase tokens to wrap instead of widening or clipping the viewport.

```css
@media (max-width: 760px) {
  .page-title,
  .track-card h3,
  .related-card h3 {
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}
```

### Display Title Clipping

Large display headings must leave enough line-box space for tall glyphs and text stroke. Avoid pairing tight heading line-height with no-wrap text inside an `overflow: hidden` card.

```css
h1,
h2,
h3 {
  line-height: 1.08;
}

h1 {
  padding-block: 0.04em;
}

h1 span {
  padding-block: 0.04em;
  margin-block: -0.04em;
}
```

For the home hero title, allow the secondary line to wrap rather than clipping it at the card edge:

```css
body[data-page="home"] .hero-copy h1 {
  line-height: 1.16;
}

body[data-page="home"] .hero-copy h1 span {
  margin-block: 0;
  white-space: normal;
  text-wrap: balance;
}
```

---

## Testing Requirements

<!-- What level of testing is expected -->

(To be filled by the team)

---

## Code Review Checklist

<!-- What reviewers should check -->

(To be filled by the team)
