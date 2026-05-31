# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website for Jamery Wang — a geek-themed, AI-focused personal site. No framework, no build step, no bundler. Vanilla HTML/CSS/JS served directly.

## Development Commands

- `npm run dev` — start local dev server at `http://localhost:4173` (Python HTTP server serving `public/`)
- No test suite or linter is configured

## Architecture

All site files live in `public/`. There is no `src/` directory and no compilation step.

### Data-driven rendering

Content is driven entirely by `data.js`, which sets `window.siteData` with `projects[]` and `notes[]` arrays. `app.js` reads `data-*` attributes on DOM nodes to decide what to render on each page. Detail pages (`project.html`, `note.html`) are empty shells — their content is injected by JavaScript based on the `?slug=` query parameter.

**Page routing by data attributes:**
- `[data-home-projects]` / `[data-home-notes]` — homepage featured items
- `[data-project-library]` / `[data-note-library]` — listing pages
- `[data-project-detail]` / `[data-note-detail]` — detail pages (slug from URL)
- `[data-project-count]` / `[data-note-count]` — count badges
- `body[data-page]` — drives nav active state (values: `home`, `projects`, `notes`, `about`)

**Cross-referencing:** Projects and notes link to each other via `relatedNotes[]` and `relatedProjects[]` slug arrays.

### File responsibilities

| File | Purpose |
|------|---------|
| `data.js` | All content data (projects + notes with slugs, metadata, cross-references) |
| `app.js` | Rendering logic, scroll interactions, nav state, time display, reveal animations |
| `styles.css` | Single shared stylesheet (dark theme, glass-morphism, responsive) |

### HTML pages

- `index.html` — homepage (hero, ops, about, stack, work, notes, timeline, contact)
- `projects.html` — project listing
- `notes.html` — notes listing
- `about.html` — about page
- `project.html` — project detail shell (JS-rendered from slug)
- `note.html` — note detail shell (JS-rendered from slug)

All pages share the same header/nav structure, `data.js`, `app.js`, and `styles.css`.

## Coding Conventions

- 2-space indentation for HTML, CSS, JS, and JSON
- Content is bilingual: Chinese primary, English secondary
- CSS custom properties for theming (`--bg`, `--cyan`, `--pink`, `--lime`, `--text`, `--muted`, `--line`)
- Google Fonts: Space Grotesk (body) + Syne (headings)
- Responsive breakpoints: 980px and 760px
- `prefers-reduced-motion` support required for all animations
- Conventional Commits format (e.g., `feat:`, `fix:`)

## Adding Content

To add a new project or note, edit `data.js` — add an entry to the `projects` or `notes` array with all required fields (slug, code, label, title, summary, etc.). The rendering and detail pages update automatically. No HTML changes needed for new entries.

## Design Notes

- Dark theme with glass-morphism cards (`backdrop-filter: blur()`)
- IntersectionObserver-based `.reveal` scroll animations (add `.reveal` class to new sections)
- Parallax orb movement on pointer move (`.orb-a`, `.orb-b`)
- Ticker animation, radar panel, and terminal card are homepage-specific decorative elements
