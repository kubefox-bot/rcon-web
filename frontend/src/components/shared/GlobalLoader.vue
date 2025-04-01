<template>
  <Loader size="16px" v-if="isLoading"><slot /></Loader>
</template>

<script setup lang="ts">
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import Loader from './Loader.vue'

const { isLoading } = useGlobalLoader()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.loader {
  font-size: 1rem;
  color: $accent;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
