<script setup lang="ts">
const props = defineProps<{ href: string }>();
const isExternal = computed(() => /^https?:\/\//.test(props.href));
</script>

<template>
    <NuxtLink
        v-if="isExternal"
        class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
        :to="href" target="_blank" rel="noopener noreferrer"
    >
        <slot />
    </NuxtLink>
    <NuxtLinkLocale
        v-else
        class="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
        :to="href"
    >
        <slot />
    </NuxtLinkLocale>
</template>
