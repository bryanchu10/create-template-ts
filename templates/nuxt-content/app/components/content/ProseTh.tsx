export default defineComponent({
    setup(_, { slots }) {
        return () => <th class="font-semibold px-4 py-2 text-left">{slots.default?.()}</th>;
    },
});
