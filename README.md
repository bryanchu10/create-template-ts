[English](./README.md) · [繁體中文](./README.zh-TW.md)

# create-template-ts

[![npm version](https://img.shields.io/npm/v/@hosaki/create-template-ts)](https://www.npmjs.com/package/@hosaki/create-template-ts)
[![npm downloads](https://img.shields.io/npm/dm/@hosaki/create-template-ts)](https://www.npmjs.com/package/@hosaki/create-template-ts)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D22-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

Scaffold a modular TypeScript project for scripts and tooling.

## Usage

**pnpm**
```bash
pnpm create @hosaki/template-ts
```

**npm**
```bash
npx @hosaki/create-template-ts
```

Follow the prompts to choose a project name and template. The CLI will fetch the latest package versions automatically.

## Templates

| Template | Description |
|----------|-------------|
| ts-script | TypeScript script/tooling with neverthrow, ts-pattern, eslint, tsx, and rolldown |
| ts-library | TypeScript library with tsdown, vitest, eslint, and release-it |
| hono | Hono API server with Drizzle ORM (SQLite), OpenAPI docs via Scalar, pino logging, and neverthrow |
| nuxt-content | Nuxt 4 content site with @nuxt/content v3, i18n (en/zh-TW), UnoCSS, OKLCH color system, and Vue components authored in TSX |

> **nuxt-content setup order**
>
> The dev server reads `git log` to populate content metadata, so a git repository with at least one commit must exist before running `dev`. Nuxt also generates type files on the first dev run, so `check` and `lint` will fail until `dev` has been run once.
>
> ```bash
> git init
> git add -A && git commit -m "init"
> pnpm install
> pnpm dev   # run once before check/lint
> ```

## Development

```bash
pnpm install
pnpm dev       # watch mode
pnpm build     # bundle with rolldown
pnpm check     # type check
pnpm lint      # eslint
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

[MIT](./LICENSE) © Bryan Chu
