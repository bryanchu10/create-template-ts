export default defineComponent({
    setup(_, { slots }) {
        return () => <h1 class="text-4xl text-primary leading-tight font-bold mbe-6 mbs-10">{slots.default?.()}</h1>;
    },
});
