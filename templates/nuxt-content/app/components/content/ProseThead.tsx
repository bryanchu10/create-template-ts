export default defineComponent({
    setup(_, { slots }) {
        return () => <thead class="text-primary border-b border-base-muted">{slots.default?.()}</thead>;
    },
});
