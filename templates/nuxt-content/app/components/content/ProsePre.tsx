import type { PropType } from "vue";

export default defineComponent({
    props: {
        code: String,
        language: String,
        filename: String,
        highlights: Array as PropType<number[]>,
        meta: String,
        class: String,
    },
    setup(props, { slots }) {
        const { t } = useI18n();
        const showLineNumbers = computed(() => props.meta?.includes("line-numbers") ?? false);
        const copied = ref(false);

        async function copy() {
            await navigator.clipboard.writeText(props.code ?? "");
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);
        }

        return () => (
            <div class="mbe-4 relative">
                <button
                    class="text-xs text-primary-dim transition-colors right-3 top-3 absolute hover:text-primary"
                    onClick={() => void copy()}
                >
                    {copied.value ? t("prose.copied") : t("prose.copy")}
                </button>
                <pre class={[
                    "text-sm font-mono p-4 rounded bg-base-subtle overflow-x-auto",
                    props.class,
                    showLineNumbers.value && "line-numbers",
                ].filter(Boolean).join(" ")}
                >
                    {slots.default?.()}
                </pre>
            </div>
        );
    },
});
