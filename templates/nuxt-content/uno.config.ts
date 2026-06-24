import { defineConfig, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
    presets: [
        presetWind4(),
        presetWebFonts({
            provider: "google",
            fonts: {
                sans: ["IBM Plex Sans", "Noto Sans TC"],
                mono: ["IBM Plex Mono"],
            },
        }),
    ],
    theme: {
        colors: {
            surface: {
                DEFAULT: "oklch(var(--color-surface))",
                subtle: "oklch(var(--color-surface-subtle))",
                muted: "oklch(var(--color-surface-muted))",
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
