export default defineComponent({
    setup(_, { slots }) {
        return () => <td class="px-4 py-2">{slots.default?.()}</td>;
    },
});
