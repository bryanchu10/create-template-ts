[English](./README.md) · [繁體中文](./README.zh-TW.md)

# create-template-ts

[![npm version](https://img.shields.io/npm/v/@hosaki/create-template-ts)](https://www.npmjs.com/package/@hosaki/create-template-ts)
[![npm downloads](https://img.shields.io/npm/dm/@hosaki/create-template-ts)](https://www.npmjs.com/package/@hosaki/create-template-ts)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D22-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

快速建立模組化的 TypeScript 專案，適合腳本與工具開發。

## 使用方式

**pnpm**
```bash
pnpm create @hosaki/template-ts
```

**npm**
```bash
npx @hosaki/create-template-ts
```

依照提示選擇專案名稱與範本，CLI 會自動抓取最新的套件版本。

## 範本

| 範本 | 說明 |
|------|------|
| ts-script | TypeScript 腳本／工具專案，內含 neverthrow、ts-pattern、eslint、tsx、rolldown |
| ts-library | TypeScript 函式庫專案，內含 tsdown、vitest、eslint、release-it |
| hono | Hono API 伺服器，內含 Drizzle ORM（SQLite）、Scalar OpenAPI 文件、pino 日誌、neverthrow |
| nuxt-content | Nuxt 4 內容網站，內含 @nuxt/content v3、i18n（en/zh-TW）、UnoCSS、OKLCH 色彩系統，元件以 TSX 語法撰寫 |

> **nuxt-content 啟動順序**
>
> dev 伺服器會讀取 `git log` 來填入內容的時間戳，因此執行 `dev` 之前必須先有 git repository 且至少存在一筆 commit。另外，Nuxt 會在第一次 `dev` 時生成型別檔案，在此之前執行 `check` 或 `lint` 會失敗。
>
> ```bash
> git init
> git add -A && git commit -m "init"
> pnpm install
> pnpm dev   # 至少執行一次，check/lint 才能正常運作
> ```

## 開發

```bash
pnpm install
pnpm dev       # 監聽模式
pnpm build     # 用 rolldown 打包
pnpm check     # 型別檢查
pnpm lint      # eslint
```

## 更新紀錄

請見 [CHANGELOG.md](./CHANGELOG.md)。

## 授權

[MIT](./LICENSE) © Bryan Chu
