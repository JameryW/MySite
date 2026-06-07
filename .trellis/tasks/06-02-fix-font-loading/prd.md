# Fix font loading and fallback usage

## Goal

Fix the font issues found in the read-only audit so every page that declares the Google Fonts async loader actually applies those fonts, invalid CSS is removed, and Chinese text has an explicit system fallback stack.

## What I Already Know

* The site is a zero-dependency static website under `public/`.
* Google Fonts are loaded through `media="print" data-fonts-load` links.
* `app.js` switches async font links from `media="print"` to `media="all"`.
* `404.html` declares the async font link but does not include `app.js`, so the loader never runs there when JavaScript is enabled.
* `styles.css` has `font-display: swap` in the `body` rule, where browsers ignore it.
* The Google Fonts URL already includes `display=swap`.
* Body copy uses `Space Grotesk`, headings use `Syne`, and terminal snippets use `SFMono-Regular` / `Menlo`.

## Assumptions

* The 404 page should remain lightweight and should not gain full site interactivity just to load fonts.
* Chinese fallback fonts should be explicit but should not introduce new external font downloads.
* No dependency, build step, or content data change is needed.

## Requirements

* Ensure `404.html` applies the Google Fonts link when JavaScript is enabled.
* Remove the ineffective `font-display` declaration from normal CSS.
* Add explicit Chinese system fallbacks to the main body font stack.
* Load `Noto Sans SC` as the primary Chinese companion font for `Space Grotesk` and `Syne`.
* Prevent large display titles and stroked heading text from being clipped by tight line boxes or no-wrap behavior.
* Give the home hero English title enough line space for descenders such as the lowercase `g` in `Wang`.
* Keep existing Google Fonts families and requested weights unchanged.
* Preserve CSP compatibility.
* Bump stylesheet query versions and service worker cache version so deployed users receive the CSS change.

## Acceptance Criteria

* [ ] `404.html` no longer has a `data-fonts-load` async font link without a working loader.
* [ ] `styles.css` no longer declares `font-display` outside `@font-face`.
* [ ] The body `font-family` includes Chinese system fallbacks after `Space Grotesk`.
* [ ] Chinese text resolves to `Noto Sans SC` before system Chinese fallbacks.
* [ ] All Google Fonts links include `Noto Sans SC` with the weights used by body and heading text.
* [ ] Home hero title text wraps instead of being clipped when the card is narrow.
* [ ] Display heading line-height leaves enough room for large glyphs and text stroke.
* [ ] The lowercase `g` in the home hero English title is not visually crowded by the Chinese subtitle line.
* [ ] No new external script, dependency, or build process is introduced.
* [ ] Existing app pages still use the existing `app.js` font loader.
* [ ] All HTML pages reference the updated stylesheet query version.
* [ ] The service worker cache name changes after the stylesheet update.

## Definition of Done

* Run the available static checks for the touched files.
* Verify relevant source lines manually because the project has no test suite, linter, or build step.

## Out of Scope

* Self-hosting Google Fonts.
* Changing visual typography choices or font sizes.
* Adding a new dedicated Chinese webfont.

## Technical Notes

* Impacted files: `public/404.html`, all HTML stylesheet references, `public/styles.css`, `public/sw.js`.
* Existing loader: `public/app.js`.
* Repository command: `npm run dev` starts a Python static server; no tests/lint/build are configured.
