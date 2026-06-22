import { NuxtLayout, NuxtPage, NuxtRouteAnnouncer } from "#components";

export default defineComponent({
    setup() {
        return () => (
            <>
                <NuxtRouteAnnouncer />
                <NuxtLayout>
                    <NuxtPage />
                </NuxtLayout>
            </>
        );
    },
});
