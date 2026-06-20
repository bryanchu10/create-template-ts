import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
    presets: [
        presetWind4(),
    ],
    theme: {
        colors: {
            base: {
                DEFAULT: "oklch(var(--color-base))",
                subtle: "oklch(var(--color-base-subtle))",
                muted: "oklch(var(--color-base-muted))",
            },
            primary: {
                DEFAULT: "oklch(var(--color-primary))",
                dim: "oklch(var(--color-primary-dim))",
                foreground: "oklch(var(--color-primary-fg))",
            },
            accent: {
                DEFAULT: "oklch(var(--color-accent))",
                hover: "oklch(var(--color-accent-hover))",
                foreground: "oklch(var(--color-accent-fg))",
            },
        },
    },
});
