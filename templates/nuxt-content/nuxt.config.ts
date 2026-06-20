import process from "node:process";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ["@unocss/reset/tailwind-v4.css", "~/assets/main.css"],
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
