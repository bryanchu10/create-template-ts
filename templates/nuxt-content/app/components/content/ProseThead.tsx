export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <thead class="text-primary border-b border-surface-muted">
                {slots.default?.()}
            </thead>
        );
    },
});
