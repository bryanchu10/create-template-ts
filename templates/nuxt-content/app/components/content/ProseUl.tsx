export default defineComponent({
    setup(_, { slots }) {
        return () => <ul class="text-primary-dim mbe-4 pis-6 list-disc list-outside space-y-1">{slots.default?.()}</ul>;
    },
});
