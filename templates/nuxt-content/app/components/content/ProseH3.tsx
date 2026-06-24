export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <h3 class="text-xl text-primary leading-snug font-semibold mbe-3 mbs-6">
                {slots.default?.()}
            </h3>
        );
    },
});
