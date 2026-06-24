export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <blockquote class="text-primary-dim my-4 pis-4 border-is-4 border-base-muted italic">
                {slots.default?.()}
            </blockquote>
        );
    },
});
