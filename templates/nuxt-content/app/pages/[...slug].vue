<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();

const collectionMap: Record<string, keyof Collections> = {
    "en": "content_en",
    "zh-TW": "content_zh_tw",
};

const slug = computed(() => {
    const parts = Array.isArray(route.params.slug)
        ? route.params.slug
        : [route.params.slug];
    const path = parts.join("/");

    return path.startsWith("/") ? path : `/${path}`;
});

const { data: page } = await useAsyncData(`page-${locale.value}-${slug.value}`, async () => {
    const collection = collectionMap[locale.value] ?? "content_en";
    const content = await queryCollection(collection).path(slug.value).first();

    if (!content && locale.value !== "en") {
        return await queryCollection("content_en").path(slug.value).first();
    }

    return content;
}, {
    watch: [locale],
});

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

useSeoMeta({
    ogType: "article",
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
