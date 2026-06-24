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
            <Html
                lang={head.value.htmlAttrs?.lang}
                dir={head.value.htmlAttrs?.dir}
            >
                <Head>
                    {head.value.link?.map((link) => (
                        <Link
                            key={link.key}
                            id={link.key}
                            href={link.href}
                            rel={link.rel}
                            hreflang={link.hreflang}
                        />
                    ))}
                    {head.value.meta?.map((meta) => (
                        <Meta
                            key={meta.key}
                            id={meta.key}
                            content={meta.content}
                            property={meta.property}
                        />
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
