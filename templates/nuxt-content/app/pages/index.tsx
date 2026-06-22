import type { Collections } from "@nuxt/content";
import { ContentRenderer } from "#components";

const collectionMap: Record<string, keyof Collections> = {
    "en": "content_en",
    "zh-TW": "content_zh_tw",
};

export default defineNuxtComponent({
    async setup() {
        const { locale } = useI18n();

        const { data: page } = await useAsyncData(`page-${locale.value}-/`, async () => {
            const collection = collectionMap[locale.value] ?? "content_en";
            const content = await queryCollection(collection).path("/").first();

            if (!content && locale.value !== "en") {
                return queryCollection("content_en").path("/").first();
            }

            return content;
        }, { watch: [locale] });

        if (!page.value) {
            throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
        }

        useSeoMeta({
            title: computed(() => page.value?.title),
            ogTitle: computed(() => page.value?.title),
            description: computed(() => page.value?.description),
            ogDescription: computed(() => page.value?.description),
        });

        return () => (
            <section class="px-8">
                {page.value && <ContentRenderer class="bg-base" tag="article" value={page.value} />}
            </section>
        );
    },
});
