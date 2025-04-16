<template>
  <div v-if="errorMessage" class="server-error">
    <p>❌ {{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { useServerError } from "@/composables/useServerError"

const { errorMessage } = useServerError()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.server-error {
  background: rgba(255, 76, 76, 0.1);
  border: 1px solid $error;
  border-radius: $radius;
  padding: 0.75rem 1rem;
  color: $error;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
