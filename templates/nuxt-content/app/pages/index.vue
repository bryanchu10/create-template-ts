<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale } = useI18n();

const collectionMap: Record<string, keyof Collections> = {
    "en": "content_en",
    "zh-TW": "content_zh_tw",
};

const { data: page } = await useAsyncData(`page-${locale.value}-/`, async () => {
    const collection = collectionMap[locale.value] ?? "content_en";
    const content = await queryCollection(collection).path("/").first();

    if (!content && locale.value !== "en") {
        return await queryCollection("content_en").path("/").first();
    }

    return content;
}, {
    watch: [locale],
});

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

useSeoMeta({
    title: computed(() => page.value?.title),
    ogTitle: computed(() => page.value?.title),
    description: computed(() => page.value?.description),
    ogDescription: computed(() => page.value?.description),
});
</script>

<template>
    <section class="px-8">
        <ContentRenderer
            v-if="page" class="bg-base" tag="article"
            :value="page"
        />
    </section>
</template>
