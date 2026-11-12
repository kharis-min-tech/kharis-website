<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import published from "../../screenshot-urls.json";

const props = defineProps<{ name: string; alt: string }>();

const urls: Record<string, string> = published;

function source(file: string) {
  return urls[`/screenshots/${file}`] ?? withBase(`/screenshots/${file}`);
}

const light = computed(() => source(`${props.name}.png`));
const dark = computed(() => source(`${props.name}-dark.png`));
</script>

<template>
  <div class="screenshot-window screenshot-light">
    <p><img :src="light" :alt="alt" loading="lazy" decoding="async" /></p>
  </div>
  <div class="screenshot-window screenshot-dark">
    <p><img :src="dark" :alt="`${alt}, in dark mode`" loading="lazy" decoding="async" /></p>
  </div>
</template>
