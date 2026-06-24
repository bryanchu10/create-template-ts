export default defineComponent({
    setup() {
        const { t } = useI18n();
        const count = ref(0);

        function increment() {
            count.value++;
        }

        function decrement() {
            count.value--;
        }

        return () => (
            <div class="mbe-2 p-3 border border-primary inline-block">
                <span class="text-primary mbe-2 block">
                    {t("counter.title")}
                    :
                    {" "}
                    {count.value}
                </span>
                <div class="flex gap-2">
                    <button
                        class="text-primary px-2 py-1 border"
                        onClick={increment}
                    >
                        {t("counter.increment")}
                    </button>
                    <button
                        class="text-primary px-2 py-1 border"
                        onClick={decrement}
                    >
                        {t("counter.decrement")}
                    </button>
                </div>
            </div>
        );
    },
});
