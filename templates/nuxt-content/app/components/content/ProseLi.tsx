export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <li class="leading-relaxed">
                {slots.default?.()}
            </li>
        );
    },
});
