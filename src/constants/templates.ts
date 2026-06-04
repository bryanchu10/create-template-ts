export const TEMPLATES = [
    {
        value: "ts-script",
        label: "ts-script",
        hint: "TypeScript script/tooling",
        deps: ["ts-pattern", "neverthrow"],
        devDeps: ["eslint", "@antfu/eslint-config", "tsx", "typescript", "rolldown"],
    },
] as const;

export type TemplateValue = typeof TEMPLATES[number]["value"];
