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
} as const;

export type TemplateValue = keyof typeof TEMPLATES;
