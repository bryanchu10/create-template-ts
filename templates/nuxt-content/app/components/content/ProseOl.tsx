export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <ol class="text-primary-dim mbe-4 ps-6 list-decimal list-outside space-y-1">
                {slots.default?.()}
            </ol>
        );
    },
});
