<template>
  <div class="rcon-panel">
    <div v-if="state === 'loading'">
      <p>⏳ Загрузка...</p>
    </div>

    <div v-else class="grid">
      <div class="panels">
        <CommandList @send="handleSend" />
        <MapSelector @send="handleSend" />
        <ManualCommand @send="handleSend" />
      </div>

      <div class="right">
        <TerminalView :output="output" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CommandList from './panels/CommandListPanel.vue'
import TerminalView from './TerminalView.vue'
import { sendCommand } from '@/handlers'
import MapSelector from './panels/MapSelectorPanel.vue'
import { RconState } from './type'
import { useServerError } from '@/composables/useServerError'
import { useServerStatus } from '@/composables/useServerStatus'
import ManualCommand from './panels/ManualCommandPanel.vue'

const state = ref<RconState>('ready')
const status = useServerStatus()
onMounted(() => {
  status.checkStatus()
})
const output = ref('')

const { setError, clearError } = useServerError()
const handleSend = async (cmd: string) => {
  output.value = ''
  state.value = 'loading'
  const result = await sendCommand({ command: cmd })

  result
    .map((res) => res.response)
    .match(
      (res) => {
        clearError()
        output.value = res
        state.value = 'ready'
      },
      (err) => {
        output.value = `❌ ${err}`
        setError(err)
      },
    )
}
</script>
