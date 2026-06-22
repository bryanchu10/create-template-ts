export interface TemplateConfig {
    readonly hint: string;
    readonly withPeerDependencies: boolean;
    readonly deps: readonly string[];
    readonly devDeps: readonly string[];
    readonly pinnedVersions?: Record<string, string>;
    readonly skipVerify?: true;
}

// To add a new template, follow this shape:
//
// "my-template": {
//     hint: "Description shown in the CLI prompt",
//     withPeerDependencies: false,
//     deps: ["my-dep"],
//     devDeps: ["typescript"],
//     pinnedVersions: { "my-dep": "^1.0.0" }, // omit to always fetch latest
// },

export const TEMPLATES = {
    "ts-script": {
        hint: "TypeScript script/tooling",
        withPeerDependencies: false,
        deps: ["ts-pattern", "neverthrow"],
        devDeps: ["eslint", "@antfu/eslint-config", "tsx", "typescript", "rolldown"],
    },

    "ts-library": {
        hint: "TypeScript library with tests and release tooling",
        withPeerDependencies: true,
        deps: ["ts-pattern", "neverthrow"],
        devDeps: [
            "eslint",
            "@antfu/eslint-config",
            "typescript",
            "tsdown",
            "vitest",
            "release-it",
            "@release-it/conventional-changelog",
        ],
    },

    "hono": {
        hint: "Hono API server with Drizzle ORM, OpenAPI & SQLite",
        withPeerDependencies: false,
        deps: [
            "@hono/node-server",
            "@hono/zod-openapi",
            "@scalar/hono-api-reference",
            "better-sqlite3",
            "drizzle-orm",
            "hono",
            "neverthrow",
            "pino",
            "pino-http",
            "ts-pattern",
            "zod",
        ],
        devDeps: [
            "@antfu/eslint-config",
            "@types/better-sqlite3",
            "@vitest/coverage-v8",
            "drizzle-kit",
            "eslint",
            "pino-pretty",
            "rolldown",
            "tsx",
            "typescript",
            "vitest",
        ],
    },

    "nuxt-content": {
        hint: "Nuxt Content site with i18n, UnoCSS & OKLCH color system",
        withPeerDependencies: false,
        skipVerify: true,
        deps: [
            "@nuxt/content",
            "@nuxtjs/i18n",
            "@unocss/reset",
            "better-sqlite3",
            "neverthrow",
            "nuxt",
            "ts-pattern",
            "vue",
            "vue-router",
        ],
        devDeps: [
            "@antfu/eslint-config",
            "@unocss/eslint-plugin",
            "@unocss/nuxt",
            "eslint",
            "typescript",
            "unocss",
            "vue-tsc",
        ],
    },
} as const satisfies Record<string, TemplateConfig>;

export type TemplateValue = keyof typeof TEMPLATES;
