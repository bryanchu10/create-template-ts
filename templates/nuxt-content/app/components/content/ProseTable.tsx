export default defineComponent({
    setup(_, { slots }) {
        return () => (
            <div class="my-6 overflow-x-auto">
                <table class="text-sm text-primary-dim w-full border-collapse">
                    {slots.default?.()}
                </table>
            </div>
        );
    },
});
