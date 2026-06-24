export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <code class="text-sm text-accent font-mono px-1.5 py-0.5 rounded bg-base-subtle">
                {slots.default?.()}
            </code>
        );
    },
});
