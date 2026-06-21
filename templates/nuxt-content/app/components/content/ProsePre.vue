<script setup lang="ts">
const props = defineProps<{
    code?: string;
    language?: string;
    filename?: string;
    highlights?: number[];
    meta?: string;
    class?: string;
}>();

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
</script>

<template>
    <div class="mbe-4 relative">
        <button
            class="text-xs text-primary-dim transition-colors right-3 top-3 absolute hover:text-primary"
            @click="copy"
        >
            {{ copied ? t("prose.copied") : t("prose.copy") }}
        </button>
        <pre
            class="text-sm font-mono p-4 rounded bg-base-subtle overflow-x-auto"
            :class="[props.class, { 'line-numbers': showLineNumbers }]"
        ><slot /></pre>
    </div>
</template>

<style>
pre code .line {
    display: block;
}

pre code .line.highlight {
    background-color: rgb(255 255 255 / 0.08);
    margin-inline: -1rem;
    padding-inline: 1rem;
}

pre.line-numbers code {
    counter-reset: line;
}

pre.line-numbers code .line::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2ch;
    margin-right: 1.5rem;
    text-align: right;
    color: rgb(255 255 255 / 0.25);
    user-select: none;
}
</style>
