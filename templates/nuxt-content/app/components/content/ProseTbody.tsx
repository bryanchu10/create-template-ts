export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <tbody class="divide-base-muted divide-y">
                {slots.default?.()}
            </tbody>
        );
    },
});
