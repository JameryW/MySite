# Contributing

Thanks for your interest in contributing to MySite!

## How to Contribute

### Reporting Bugs

1. Search [existing issues](https://github.com/JameryW/MySite/issues) to avoid duplicates.
2. Open a new issue using the **Bug Report** template.
3. Include: browser, OS, steps to reproduce, expected vs actual behavior, screenshots if applicable.

### Suggesting Features

1. Open a new issue using the **Feature Request** template.
2. Describe the problem you're solving and your proposed approach.

### Submitting Changes

1. Fork the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Make your changes. Follow the coding conventions below.
3. Test locally with `npm run dev`.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add new project card variant
   fix: correct mobile nav z-index
   docs: update README setup instructions
   ```
5. Push and open a Pull Request against `main`.

## Coding Conventions

- **Indentation:** 2 spaces for HTML, CSS, JS, and JSON.
- **No build step:** all code runs directly in the browser — no transpilation, no bundler.
- **Content goes in `data.js`:** do not hardcode project or note content in HTML.
- **CSS:** use existing custom properties (`--bg`, `--cyan`, `--pink`, etc.) for theming consistency.
- **Accessibility:** include ARIA attributes, respect `prefers-reduced-motion`, keep skip links working.
- **Bilingual:** Chinese primary, English secondary for user-facing content.

## Development Setup

```bash
git clone https://github.com/JameryW/MySite.git
cd MySite
npm run dev
# → http://localhost:4173
```

That's it. No dependencies to install.

## Pull Request Checklist

- [ ] Tested locally with `npm run dev`
- [ ] No hardcoded content (use `data.js` for data)
- [ ] Works on both dark and light themes
- [ ] Responsive at 980px and 760px breakpoints
- [ ] Commit messages follow Conventional Commits
- [ ] No secrets or API keys committed
