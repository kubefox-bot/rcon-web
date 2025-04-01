<template>
  <div>
    <h3>Статус сервера: {{ status }}</h3>

    <p v-if="errorMessage" class="error">❌ {{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { useServerError } from '@/composables/useServerError'

defineProps<{ status: string }>()

const { errorMessage } = useServerError()
</script>

<style scoped>
.error {
  color: var(--error, red);
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
