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
        const { locale } = useI18n();

        const { data: page } = await useAsyncData(`page-${locale.value}-/`, async () => {
            const collection = collectionMap[locale.value] ?? "content_en";
            const content = await queryCollection(collection).path("/").first();

            return match({ content, locale: locale.value })
                .with({ content: P.nullish, locale: P.not("en") }, async () =>
                    queryCollection("content_en").path("/").first())
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
            title: computed(() => page.value?.title),
            ogTitle: computed(() => page.value?.title),
            description: computed(() => page.value?.description),
            ogDescription: computed(() => page.value?.description),
        });

        return () => (
            <section class="px-8">
                {page.value && (
                    <ContentRenderer
                        class="bg-base"
                        value={page.value}
                        tag="article"
                    />
                )}
            </section>
        );
    },
});
