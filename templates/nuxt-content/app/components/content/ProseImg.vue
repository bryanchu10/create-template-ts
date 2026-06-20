<script setup lang="ts">
defineProps<{ src: string; alt?: string }>();
</script>

<template>
    <img
        class="my-6 rounded max-w-full" loading="lazy"
        :src="src" :alt="alt"
    >
</template>
