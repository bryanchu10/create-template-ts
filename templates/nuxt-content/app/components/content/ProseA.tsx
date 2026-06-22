import { NuxtLink, NuxtLinkLocale } from "#components";

export default defineComponent({
    props: {
        href: { type: String, required: true as const },
    },
    setup(props, { slots }) {
        const isExternal = computed(() => /^https?:\/\//.test(props.href));

        return () => isExternal.value
            ? (
                    <NuxtLink class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover" to={props.href} target="_blank" rel="noopener noreferrer">
                        {slots.default?.()}
                    </NuxtLink>
                )
            : (
                    <NuxtLinkLocale class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover" to={props.href}>
                        {slots.default?.()}
                    </NuxtLinkLocale>
                );
    },
});
