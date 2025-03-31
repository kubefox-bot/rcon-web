<template>
  <div class="layout">
    <div class="full-width">
      <ServerControls @send-command="send" />
    </div>

    <div class="controls">
      <MapSelector @send-command="send" />
      <CommandPanel @send-command="send" />
    </div>

    <div class="terminal">
      <TerminalResult :result="output" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapSelector from './MapSelector.vue'
import ServerControls from './ServerControls.vue'
import CommandPanel from './CommandPanel.vue'
import TerminalResult from './TerminalResult.vue'
import { sendCommand } from '@/handlers'

const output = ref('')

const send = async (cmd: string) => {
  const result = await sendCommand({ command: cmd })

  result
    .map((res) => res.response)
    .match(
      (res) => (output.value = res),
      (err) => (output.value = `❌ ${err}`)
    )
}

</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  padding: 1rem;
  height: calc(100vh - 20rem);
  margin-inline: auto;
}

.full-width {
  grid-column: 1 / -1;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%; 
}

.terminal {
  display: flex;
  flex-direction: column;
  height: 100%; 
  overflow: hidden;
}

</style>
