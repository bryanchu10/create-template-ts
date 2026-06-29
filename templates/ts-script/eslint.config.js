import antfu from "@antfu/eslint-config";

export default antfu(
    {
        typescript: {
            tsconfigPath: "tsconfig.json",
        },
        stylistic: {
            indent: 4,
            quotes: "double",
            braceStyle: "stroustrup",
            semi: true,
            overrides: {
                "style/jsx-first-prop-new-line": ["error", "multiprop"],
                "style/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
                "style/jsx-closing-bracket-location": ["error", "line-aligned"],
                "style/operator-linebreak": ["error", "before", { overrides: { "=": "after" } }],
                "style/padding-line-between-statements": [
                    "error",
                    { blankLine: "always", prev: "*", next: "for" },
                    { blankLine: "always", prev: "for", next: "*" },
                    { blankLine: "always", prev: "*", next: "return" },
                ],
                "style/arrow-parens": ["error", "always"],
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
    {
        files: ["**/*.tsx", "**/*.jsx"],
        rules: {
            "perfectionist/sort-jsx-props": ["error", {
                type: "alphabetical",
                order: "asc",
                ignoreCase: true,
                groups: [
                    "definition",
                    "unique",
                    "global",
                    "two-way",
                    "other-directives",
                    "attr",
                    "unknown",
                    "attr-bool",
                    "events",
                    "content",
                ],
                customGroups: [
                    {
                        groupName: "definition",
                        elementNamePattern: "^is$",
                    },
                    {
                        groupName: "unique",
                        elementNamePattern: "^(key|ref)$",
                    },
                    {
                        groupName: "global",
                        elementNamePattern: "^id$",
                    },
                    {
                        groupName: "two-way",
                        elementNamePattern: "^(modelValue|v-model.*|onUpdate:.+)$",
                    },
                    {
                        groupName: "other-directives",
                        elementNamePattern: "^v-(?!model|slots)",
                    },
                    {
                        groupName: "attr",
                        elementNamePattern: "^(class|className|style|for|htmlFor|lang|type|name|value|src|srcset|href|rel|target|alt|title|placeholder|role|tabIndex|aria-.+|data-.+)$",
                    },
                    {
                        groupName: "attr-bool",
                        elementNamePattern: "^(disabled|required|readonly|checked|selected|multiple|autofocus|autoplay|controls|loop|muted|open|hidden|async|defer|allowfullscreen|default|download|formnovalidate|ismap|nomodule|novalidate|reversed|scoped)$",
                    },
                    {
                        groupName: "events",
                        elementNamePattern: "^on[A-Z]",
                    },
                    {
                        groupName: "content",
                        elementNamePattern: "^(innerHTML|textContent|dangerouslySetInnerHTML|v-slots)$",
                    },
                ],
            }],
        },
    },
    {
        files: ["**/*.md/**"],
        rules: {
            "ts/consistent-type-definitions": "off",
        },
    },
);
