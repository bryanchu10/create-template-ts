<script setup lang="ts">
const head = useLocaleHead({ seo: true });

useSeoMeta({
    ogSiteName: "Nuxt Content Starter",
    ogType: "website",
    twitterCard: "summary",
});
</script>

<template>
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
        <Head>
            <template v-for="link in head.link" :key="link.key">
                <Link :id="link.key" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
            </template>
            <template v-for="meta in head.meta" :key="meta.key">
                <Meta :id="meta.key" :property="meta.property" :content="meta.content" />
            </template>
        </Head>
        <Body>
            <header />
            <main>
                <slot />
            </main>
            <footer />
        </Body>
    </Html>
</template>
