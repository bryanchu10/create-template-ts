export default defineComponent({
    setup(_, { slots }) {
        return () => <p class="text-primary-dim leading-relaxed mbe-4">{slots.default?.()}</p>;
    },
});
