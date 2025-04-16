<template>
  <div class="loading-spinner" :style="customStyle">
    <div class="spinner" :style="{ width: spinnerSize, height: spinnerSize }"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	message?: string;
	height?: string;
	width?: string;
	size?: string;
}>();

const customStyle = computed(() => ({
	height: props.height || "auto",
	width: props.width || "auto",
}));

const spinnerSize = computed(() => props.size || "48px");
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $accent;

  .spinner {
    border: 4px solid $accent;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
