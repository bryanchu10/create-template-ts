import { execSync } from "node:child_process";
import process from "node:process";
import { fromThrowable } from "neverthrow";
import { match, P } from "ts-pattern";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        vueJsx: {
            defineComponentName: ["defineComponent", "defineNuxtComponent"],
        },
    },
    css: ["@unocss/reset/tailwind-v4.css", "~/assets/main.css"],
    hooks: {
        "content:file:afterParse": function (ctx) {
            match(ctx.file.id.endsWith(".md"))
                .with(true, () => {
                    const resolved = resolveTimestamps(ctx.file.path, process.cwd(), ctx.content);
                    ctx.content.date = resolved.date;
                    ctx.content.updatedAt = resolved.updatedAt;
                })
                .otherwise(() => undefined);
        },
    },
    content: {
        build: {
            markdown: {
                highlight: {
                    theme: "vitesse-dark",
                    langs: ["ts", "tsx", "js", "jsx", "vue", "bash", "sh", "json", "css", "html", "md", "yaml"],
                },
            },
        },
    },
    modules: [
        "@nuxt/content",
        "@unocss/nuxt",
        "@nuxtjs/i18n",
    ],
    i18n: {
        baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        locales: [
            { code: "en", name: "English", language: "en-US", dir: "ltr", file: "en.json" },
            { code: "zh-TW", name: "繁體中文", language: "zh-TW", dir: "ltr", file: "zh-TW.json" },
        ],
        langDir: "locales",
        strategy: "prefix_except_default",
        defaultLocale: "en",
        detectBrowserLanguage: false,
    },
    routeRules: {
        "/": { redirect: { to: "/en", statusCode: 301 } },
    },
    devtools: { enabled: true },
    compatibilityDate: "2024-04-03",
});

function resolveTimestamps(
    absPath: string,
    cwd: string,
    existing: Record<string, unknown>,
): { date: string | null; updatedAt: string | null } {
    const date = existing.date != null ? String(existing.date) : gitDate(absPath, cwd, "first");
    const rawUpdatedAt = existing.updatedAt != null ? String(existing.updatedAt) : gitDate(absPath, cwd, "last");

    const updatedAt = match({ date, rawUpdatedAt })
        .with({ date: P.string, rawUpdatedAt: P.string }, ({ date: d, rawUpdatedAt: u }) => {
            return match(d.length > 10)
                .with(true, () => {
                    return new Date(u).getTime() - new Date(d).getTime() > 60 * 60 * 1000
                        ? u
                        : null;
                })
                .otherwise(() => d.slice(0, 10) === u.slice(0, 10) ? null : u);
        })
        .otherwise(() => rawUpdatedAt);

    return { date, updatedAt };
}

function gitDate(absPath: string, cwd: string, which: "first" | "last"): string | null {
    const cmd = which === "first"
        ? `git log --follow --format=%aI -- "${absPath}" | tail -1`
        : `git log -1 --format=%aI -- "${absPath}"`;

    return fromThrowable(
        () => execSync(cmd, { encoding: "utf-8", cwd }).trim() || null,
        () => null,
    )().unwrapOr(null);
}
