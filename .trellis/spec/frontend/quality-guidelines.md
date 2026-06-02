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

### Async Font Links

Pages using the Google Fonts async pattern must also load the JavaScript font loader:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Syne:wght@700;800&display=swap"
  media="print"
  data-fonts-load
  rel="stylesheet"
/>
<script src="./app.js?v=19" defer></script>
```

If a page intentionally does not load `app.js`, use a normal stylesheet link instead of `media="print" data-fonts-load`.

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
