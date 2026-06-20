<script setup lang="ts">
const props = defineProps<{ code?: string }>();
const { t } = useI18n();

const copied = ref(false);

async function copy() {
    await navigator.clipboard.writeText(props.code ?? "");
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}
</script>

<template>
    <div class="my-6 relative">
        <button
            class="text-xs text-primary-dim transition-colors right-3 top-3 absolute hover:text-primary"
            @click="copy"
        >
            {{ copied ? t("prose.copied") : t("prose.copy") }}
        </button>
        <pre class="text-sm text-primary-dim font-mono p-4 rounded bg-base-subtle overflow-x-auto"><slot /></pre>
    </div>
</template>
