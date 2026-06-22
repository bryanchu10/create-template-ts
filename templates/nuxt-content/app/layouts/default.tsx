import { Body, Head, Html, Link, Meta } from "#components";

export default defineComponent({
    setup(_, { slots }) {
        const head = useLocaleHead({ seo: true });

        useSeoMeta({
            ogSiteName: "Nuxt Content Starter",
            ogType: "website",
            twitterCard: "summary",
        });

        return () => (
            <Html lang={head.value.htmlAttrs?.lang} dir={head.value.htmlAttrs?.dir}>
                <Head>
                    {head.value.link?.map(link => (
                        <Link key={link.key} id={link.key} rel={link.rel} href={link.href} hreflang={link.hreflang} />
                    ))}
                    {head.value.meta?.map(meta => (
                        <Meta key={meta.key} id={meta.key} property={meta.property} content={meta.content} />
                    ))}
                </Head>
                <Body>
                    <header />
                    <main>
                        {slots.default?.()}
                    </main>
                    <footer />
                </Body>
            </Html>
        );
    },
});
