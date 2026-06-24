export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <tbody class="divide-surface-muted divide-y">
                {slots.default?.()}
            </tbody>
        );
    },
});
