export default defineComponent({
    setup(_, { slots }) {
        return () => <h2 class="text-2xl text-primary leading-snug font-semibold mbe-4 mbs-8">{slots.default?.()}</h2>;
    },
});
