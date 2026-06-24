import { NuxtLink, NuxtLinkLocale } from "#components";

export default defineComponent({
    props: {
        href: {
            type: String,
            required: true,
        },
    },
    setup(props, { slots }) {
        const isExternal = computed(() => /^https?:\/\//.test(props.href));

        return () => isExternal.value
            ? (
                    <NuxtLink
                        class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
                        rel="noopener noreferrer"
                        target="_blank"
                        to={props.href}
                    >
                        {slots.default?.()}
                    </NuxtLink>
                )
            : (
                    <NuxtLinkLocale
                        class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
                        to={props.href}
                    >
                        {slots.default?.()}
                    </NuxtLinkLocale>
                );
    },
});
