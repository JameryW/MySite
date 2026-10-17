# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.2] - 2026-10-17

### Changed

- Refresh XhsGrowthAgent and UltimateCoders project copy to match current Kernel / DAG / memory progress
- Rebuild About page hero around the brand name, add a Now Building progress section, and tighten profile signals
- Update homepage focus wording toward kernel, memory, and observable execution surfaces
- Cache bump: `styles.css?v=84`, `app.js?v=50`, `data.js?v=33`, Service Worker `mysite-v107`

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
