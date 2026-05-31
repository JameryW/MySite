# Repository Guidelines

## Project Structure & Module Organization
This repository is currently minimal, with no application code checked in yet. Keep new source files under `src/`, static assets under `public/`, and tests under `tests/`. If the project grows into multiple packages, group them under `packages/` and give each package its own README and test entry point.

Recommended layout:

```text
src/        application code
public/     static assets
tests/      automated tests
docs/       design or architecture notes
```

## Build, Test, and Development Commands
No build tooling is configured yet. When adding a runtime or framework, expose a small, standard command set through a root `Makefile` or `package.json` scripts so contributors can rely on:

- `npm install` or equivalent: install dependencies
- `npm run dev`: start the local development server
- `npm test`: run the full test suite
- `npm run lint`: run formatting and lint checks

Document any project-specific alternatives in the root README when they are introduced.

## Coding Style & Naming Conventions
Use 2-space indentation for JavaScript, TypeScript, JSON, YAML, and Markdown. Prefer small modules with one clear responsibility. Use `PascalCase` for components/classes, `camelCase` for functions and variables, and `kebab-case` for file names unless a framework requires otherwise. Keep imports explicit and avoid large utility dumping grounds.

Adopt a formatter and linter early, such as Prettier plus ESLint, and run them before opening a pull request.

## Testing Guidelines
Place tests in `tests/` or next to source files with a `.test` or `.spec` suffix, for example `tests/api.test.ts` or `src/lib/math.spec.ts`. Cover new features and bug fixes with automated tests before merging. If a change is not practical to test automatically, explain the manual verification steps in the pull request.

## Commit & Pull Request Guidelines
No Git history is available in this workspace yet, so use Conventional Commits going forward, such as `feat: add homepage scaffold` or `fix: handle empty state`. Keep commits focused and easy to review.

Pull requests should include a short summary, linked issue or task when relevant, test results, and screenshots for UI changes. Call out any follow-up work or known limitations clearly.

## Configuration & Security
Do not commit secrets, API keys, or environment-specific credentials. Store local configuration in untracked `.env` files and provide a checked-in `.env.example` whenever configuration becomes necessary.
