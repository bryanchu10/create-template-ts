# Changelog

## [1.1.0] - 2026-06-05

### Features

- Add interactive template selection — the CLI now prompts the user to choose a template, making the scaffolder extensible for future templates

### Internal

- Adopt neverthrow for type-safe error handling throughout the pipeline
- Refactor chain structure and variable naming for clarity
- Apply newspaper principle to code organisation (eliminate early if-statements)
- Enforce ESLint rules: `new-cap`, `padding-line-between-statements`

### Documentation

- Add bilingual README (English / 繁體中文) with language switcher
- Add shields.io badges: npm version, npm downloads, license, Node.js, pnpm
- Add MIT LICENSE file
- Add `author` and `license` fields to `package.json`

---

## [1.0.2] - 2025

- Add `repository` field for npm provenance verification

## [1.0.1] - 2025

- Switch CI to npm Trusted Publishing

## [1.0.0] - 2025

- Initial release
