# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- Cache bump: `styles.css?v=94`, `app.js?v=58`, `data.js?v=38`, Service Worker `mysite-v117`

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
