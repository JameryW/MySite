# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.4] - 2026-11-01

### Added

- Hover/focus-intent prefetch of same-origin HTML shells (skips Save-Data, external and new-tab links)
- Service-worker navigation preload and cross-document view transitions (progressive, Chrome 126+)

### Fixed

- Service worker failed to install on the VPS because `./404.html` (an internal nginx location that returns 404) was in the precache list; removed it and documented the 200-only rule. Offline unknown URLs now fall back to the cached index.
- GitHub Pages mirror via Actions (`https://jameryw.github.io/MySite/`), canonical URLs stay on the VPS
- Print stylesheet for project/note detail pages (chrome hidden, external URLs expanded, A4-friendly)
- Author meta, IndieWeb `rel="me"` links, `twitter:site`/`twitter:creator`, `og:image:type` on every page
- `sourcePrivate` handling: private-repo projects link to the public repos tab instead of a 404

### Changed

- HTML is served with `Cache-Control: max-age=60` (repeat navigations ~2× faster; `sw.js` stays no-cache)
- Skip link is visible on focus and now moves focus to `<main>`; detail pages no longer steal the first Tab
- Command palette is a proper dialog (role/aria-modal/combobox/listbox/aria-activedescendant) with focus return
- About ID-card reserves its chip rows, dropping CLS from 0.0593 to ≤0.0147
- Print CSS no longer prints internal URLs or navigation sections
- Cache bump: `app.js?v=90`, `data.js?v=44`, `styles.css?v=131`, SW `mysite-v164`

## [1.2.3] - 2026-11-01

### Added

- `/.well-known/security.txt` (contact + expiry) served as `text/plain`
- Response-level `Content-Security-Policy` header that mirrors each page's meta policy and adds `frame-ancestors 'none'`, `base-uri`, `form-action`, `object-src`
- Runtime `ItemList` JSON-LD on the projects / notes / showcase listings

### Changed

- Harden HTTPS server blocks with HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
- Re-sync `deploy/nginx.conf` with the running VPS (log format, dead `/ws` route removed, xray access log)
- Preload `data.js` + `app.js` and mark them `fetchpriority="high"`

## [1.2.2] - 2026-11-01

### Added

- Real `date` / `updated` fields for all projects and notes, feeding RSS `pubDate`, JSON-LD dates and sitemap `lastmod`
- 404 page gains Notes/About actions and a proper footer nav; archive is linked from every footer
- Skip links on the 404 and static archive pages

### Changed

- Compact prev/next pager with direction cues, capped at 760px for single-sibling pagers
- Metadata separators render on the following item so wrapped rows never end with a dangling `·`
- Showcase heading uses the shared `page-title-main` structure
- Home outline subtitle scales to 0.7em (EN one line at every desktop width); home summaries cap at 78ch
- Removed 67 dead CSS rules (~7.5 KB) and the dead `fitProjectHeroTitle` fitter

## [1.2.1] - 2026-11-01

### Added

- SEO/GEO surface generated from `data.js`: `llms.txt`, `llms-full.txt`, `feed.xml`, JS-free `archive.html`, `sitemap.xml` (with lastmod)
- `robots.txt` explicitly allows major AI crawlers; RSS discovery links on every page
- Per-page titles/descriptions, `og:locale` alternates, and richer JSON-LD (`WebSite`/`Person`, `ProfilePage`, `CollectionPage` + `BreadcrumbList`, runtime `CreativeWork`/`BlogPosting` + breadcrumbs)
- Visible breadcrumbs on detail pages; soft-404 `noindex` for invalid slugs; `noindex` on 404
- `npm run gen:seo` + CI freshness check so generated assets can never go stale

## [1.2.0] - 2026-11-01

### Added

- Production deploy pipeline for the VPS (`npm run deploy`, `npm run deploy:nginx`) with backups and version verification
- CI `Checks` workflow for CSP hashes, cache versions, SW keys, refs and sitemap coverage

### Changed

- Rebuild the About page as a two-column hero with an ID card, Now Building timeline, and working profile
- Site-wide polish: light-theme contrast tokens and neon CTA, sticky topbar, mobile gutter/typography, section-head alignment, filter tap targets + live result counts, footer grouping
- Above-the-fold reveals paint instantly (note-detail LCP 1092ms → 252ms locally)
- Fix mobile right-edge overflow at 421–488px and 320–430px
- Move production from GitHub Pages to the VPS nginx host; CSP hash recomputed for the boot script

## [1.1.2] - 2026-10-17

### Changed

- Refresh XhsGrowthAgent and UltimateCoders project copy to match current Kernel / DAG / memory progress
- Rebuild About page as a brand-first single-column hero with a Now Building section
- Remove redundant Profile Pulse / dual taglines; align home copy away from prompt-native conflict
- Tighten projects / showcase section wording and Now Building card hierarchy
- Deduplicate About working profile, shorten home focus copy, and make note-card meta less repetitive
- Tighten nav gap, section-head view-all grouping, and hero-to-section rhythm
- Localize notes/project detail chrome, shorten highlight titles, and color note status pills by kind
- Improve hero text wrapping and detail-page section rhythm
- Ship site-wide ZH/EN bilingual switching (`site-lang`); keep product keywords in English
- Add project `summaryEn` / `overviewEn` / `highlightsEn` mirrors and chrome `data-i18n` coverage
- Keep language toggle outside the mobile hamburger; translate footers; search both locales in ⌘K
- Drop duplicate in-page lang toggles; bilingualize ⌘K group labels and projects indexed count
- Fix ZH card chrome (`查看详情` / `打开演示`); bilingual 404 with shared site-lang
- Platform-aware palette shortcut (Ctrl+K / ⌘K); cluster mobile lang+socials; unify EN CTA casing
- Align project/note `outputs[]` 1:1 with highlights/bullets so detail highlight footers stay on-topic
- Localize project detail signal panel + section kickers; capitalize EN highlight bodies after colon split
- Normalize highlight titles to labeled splits; bilingualize About signal strip and detail not-found titles
- Keep project detail titles wrapping inside the hero column so they no longer cover the signal panel
- Scale long detail titles and soft-break CamelCase at token boundaries instead of mid-word wraps
- Fit long detail titles to one line beside the signal panel; use muted subtitle instead of outline stroke
- Raise hamburger topbar to 980px and keep nav/brand/status on one line to stop Chinese labels stacking
- Rebalance desktop topbar so nav sits after the brand; keep home/about name on one line
- Keep note-card `N# / Label` on one line; bilingualize listing signal chrome; ease Notes/Showcase hero wraps
- Localize footer nav links, topbar status pills, footer meta lines, and back-to-top label
- Grid-align project highlight cards; soft-break arrow/path copy; even About Now cards; bilingual 404 chrome
- Align N12 `outputs[]` 1:1 with bullets; use localized note titles in document meta; ease signal-panel wraps and topbar-end spacing
- Soften light-theme label glow; harden note-card `N# / Label` ellipsis
- Clean note-facts borders at 2-col / 1-col breakpoints; horizontal-scroll filter pills on narrow screens
- Light-theme hamburger drawer, filter-pill active, and palette hover/kbd contrast
- Drop detail pager empty spacer; flex-align related/pager footers; About Now stays 2-col until 760
- Replace dead listing “view source” chrome with open-detail; localize palette GitHub row
- Fix light-theme detail subtitles, scroll-progress track, panel/footer/back-to-top borders
- Scope pager hover to dual-column desktop; auto-fill highlight grid; relax mobile highlight min-heights
- Showcase/related status as meta (not fake CTA); unclip home focus to 3 lines; hide EN tagline duplicate
- Wire topbar/section aria labels through site-lang; drop mobile focus max-height clip
- Drop duplicate detail reading-progress bar; compact signal panels site-wide on mobile
- Soften About Now / related light borders; fix About contact overflow; tighten note overview rhythm
- Compact project listing cards on mobile; palette uses safe-area + dvh on narrow screens
- 404 gains theme toggle + aria i18n via notfound.js
- Cache bump: `styles.css?v=111`, `app.js?v=71`, `data.js?v=42`, Service Worker `mysite-v138`

## [1.0.0] - 2026-05-31

### Added

- Homepage with hero, about, work, notes, activity, and contact sections
- Data-driven rendering from `data.js` — projects and notes render automatically
- Project and note detail pages via `?slug=` query parameters
- Dark and light theme toggle with CSS custom properties
- Command palette (`⌘K`) for global search
- Scroll-reveal animations with IntersectionObserver
- Parallax orb movement on pointer move
- Terminal typing animation on homepage
- PWA support with service worker and web app manifest
- Responsive design (980px / 760px breakpoints)
- Custom 404 page
- SEO: sitemap.xml, robots.txt, structured data (JSON-LD), Open Graph tags
- Featured projects: XhsGrowthAgent, QuantAgent
- Notes: Why Agents Matter, Prototype First, Interface as Signal, Prompt Engineering Is Evolving, Build In Public
