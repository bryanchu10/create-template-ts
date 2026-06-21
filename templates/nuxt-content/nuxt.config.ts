import { execSync } from "node:child_process";
import process from "node:process";

function gitDate(absPath: string, cwd: string, which: "first" | "last"): string | null {
    try {
        const cmd = which === "first"
            ? `git log --follow --format=%aI -- "${absPath}" | tail -1`
            : `git log -1 --format=%aI -- "${absPath}"`;

        return execSync(cmd, { encoding: "utf-8", cwd }).trim() || null;
    }
    catch {
        return null;
    }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ["@unocss/reset/tailwind-v4.css", "~/assets/main.css"],
    hooks: {
        "content:file:afterParse": function (ctx) {
            if (!ctx.file.id.endsWith(".md"))
                return;

            const cwd = process.cwd();
            const absPath = ctx.file.path;

            ctx.content.date ??= gitDate(absPath, cwd, "first");
            ctx.content.updatedAt ??= gitDate(absPath, cwd, "last");
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
        strategy: "prefix",
        defaultLocale: "en",

    },
    routeRules: {
        "/": { redirect: { to: "/en", statusCode: 301 } },
    },
    devtools: { enabled: true },
    compatibilityDate: "2024-04-03",
});
