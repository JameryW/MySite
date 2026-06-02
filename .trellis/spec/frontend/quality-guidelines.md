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
<link rel="stylesheet" href="./styles.css?v=19" />
```

```js
// sw.js cache names must change when cached shell assets change.
const CACHE = 'mysite-v16';
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
<script src="./app.js?v=17" defer></script>
```

If a page intentionally does not load `app.js`, use a normal stylesheet link instead of `media="print" data-fonts-load`.

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
