import type { Collections } from "@nuxt/content";
import { err, ok } from "neverthrow";
import { match, P } from "ts-pattern";
import { ContentRenderer } from "#components";

const collectionMap: Record<string, keyof Collections> = {
    "en": "content_en",
    "zh-TW": "content_zh_tw",
};

export default defineNuxtComponent({
    async setup() {
        const route = useRoute();
        const { locale } = useI18n();

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

            return match({ content, locale: locale.value })
                .with({ content: P.nullish, locale: P.not("en") }, async () =>
                    queryCollection("content_en").path(slug.value).first())
                .otherwise(() => content);
        }, { watch: [locale] });

        (page.value
            ? ok(page.value)
            : err(createError({ statusCode: 404, statusMessage: "Page not found", fatal: true }))
        ).match(
            () => {},
            (e) => { throw e; },
        );

        useSeoMeta({
            ogType: "article",
            title: computed(() => page.value?.title),
            ogTitle: computed(() => page.value?.title),
            description: computed(() => page.value?.description),
            ogDescription: computed(() => page.value?.description),
        });

        return () => (
            <section class="px-8">
                {page.value && (
                    <ContentRenderer
                        class="bg-surface"
                        value={page.value}
                        tag="article"
                    />
                )}
            </section>
        );
    },
});
