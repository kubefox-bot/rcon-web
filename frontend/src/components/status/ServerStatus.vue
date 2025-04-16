<template>
  <div class="server-status">
    <h3>Статус сервера: {{ status }}</h3>
    <GlobalLoader />
  </div>
</template>

<script setup lang="ts">
import GlobalLoader from "../shared/GlobalLoader.vue"

defineProps<{ status: string }>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.server-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h3 {
    color: $accent;
    margin: 0;
    font-weight: 500;
    font-size: 1.1rem;
  }
}
</style>
