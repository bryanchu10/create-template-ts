export const TEMPLATES = {
    "ts-script": {
        hint: "TypeScript script/tooling",
        withPeerDependencies: false as const,
        deps: ["ts-pattern", "neverthrow"] as const,
        devDeps: ["eslint", "@antfu/eslint-config", "tsx", "typescript", "rolldown"] as const,
    },
    "ts-library": {
        hint: "TypeScript library with tests and release tooling",
        withPeerDependencies: true as const,
        deps: ["ts-pattern", "neverthrow"] as const,
        devDeps: [
            "eslint",
            "@antfu/eslint-config",
            "typescript",
            "tsdown",
            "vitest",
            "release-it",
            "@release-it/conventional-changelog",
        ] as const,
    },
    "hono": {
        hint: "Hono API server with Drizzle ORM, OpenAPI & SQLite",
        withPeerDependencies: false as const,
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
        ] as const,
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
        ] as const,
    },
} as const;

export type TemplateValue = keyof typeof TEMPLATES;
