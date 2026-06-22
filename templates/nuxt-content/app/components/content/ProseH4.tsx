export default defineComponent({
    setup(_, { slots }) {
        return () => <h4 class="text-lg text-primary font-medium mbe-2 mbs-4">{slots.default?.()}</h4>;
    },
});
