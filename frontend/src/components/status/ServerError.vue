<template>
  <div v-if="errorMessage" class="server-error">
    <p>❌ {{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { useServerError } from '@/composables/useServerError'

const { errorMessage } = useServerError()
</script>
