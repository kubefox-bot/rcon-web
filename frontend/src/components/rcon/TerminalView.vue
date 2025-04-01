<template>
  <div class="terminal-view">
    <h3>Результат</h3>
    <div class="output-wrapper">
      <pre class="output"><code>{{ output }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ output: string }>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.terminal-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  h3 {
    color: $accent;
    margin: 0;
  }

  .output-wrapper {
    flex: 1;
    overflow-y: auto;
    border: 1px solid $border-color;
    border-radius: $radius;
    background: $bg-dark;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.6);
    padding: 1rem;
  }

  .output {
    margin: 0;
    color: $text-color;
    font-family: 'Courier New', monospace;
    font-size: 0.95rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
