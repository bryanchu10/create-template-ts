import antfu from "@antfu/eslint-config";

export default antfu(
    {
        typescript: true,
        stylistic: {
            indent: 4,
            quotes: "double",
            braceStyle: "stroustrup",
            semi: true,
            overrides: {
                "style/jsx-one-expression-per-line": ["error", { allow: "non-jsx" }],
                "style/jsx-first-prop-new-line": ["error", "never"],
                "style/jsx-max-props-per-line": "off",
                "style/jsx-closing-bracket-location": ["error", "after-props"],
                "style/operator-linebreak": ["error", "before", { overrides: { "=": "after" } }],
                "style/padding-line-between-statements": [
                    "error",
                    { blankLine: "always", prev: "*", next: "for" },
                    { blankLine: "always", prev: "for", next: "*" },
                    { blankLine: "always", prev: "*", next: "return" },
                ],
            },
        },
    },
    {
        rules: {
            "new-cap": ["error", {
                capIsNew: true,
                newIsCap: true,
                properties: true,
            }],
            "no-shadow": "error",
        },
    },
    {
        files: ["pnpm-workspace.yaml"],
        rules: {
            "pnpm/yaml-enforce-settings": ["error", { settings: { shellEmulator: true } }],
        },
    },
    {
        files: ["**/*.yml", "**/*.yaml"],
        rules: {
            "yaml/indent": ["error", 2],
        },
    },
);
