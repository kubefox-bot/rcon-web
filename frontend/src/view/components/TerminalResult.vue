<template>
  <div class="terminal-output">
    <h3>📥 Результат</h3>
    <div class="scroll-area">
      <pre v-if="props.result?.length">{{ props.result }}</pre>
      <p v-else class="placeholder">Ожидаю команду...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  result: string
}>()
</script>

<style scoped>
.terminal-output {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  background: var(--terminal-bg);
  border-radius: 0.5rem;
  padding: 1rem;
}

pre {
  color: var(--terminal-text);
  white-space: pre-wrap;
  font-family: var(--font-mono);
  margin: 0;
}

.placeholder {
  color: var(--text-color);
  opacity: 0.5;
}
</style>
