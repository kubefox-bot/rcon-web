<template>
    <div class="rcon-panel">
      <ServerStatus :status="statusText" />
  
      <div v-if="state === 'loading'">
        <p>⏳ Загрузка...</p>
      </div>
  
      <div v-else class="grid">
        <div class="left">
          <CommandList @send="handleSend" />
          <MapSelector @send="handleSend" />
        </div>
  
        <div class="right">
          <TerminalView :output="output" />
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import ServerStatus from './ServerStatus.vue'
  import CommandList from './panels/CommandList.vue'
  import TerminalView from './TerminalView.vue'
  import { sendCommand } from '@/handlers'
import MapSelector from './panels/MapSelector.vue'
import { RconState } from './type'


const state = ref<RconState>('ready')

  const output = ref('')
  const statusText = ref('🟡 Проверка...')
  
  const handleSend = async (cmd: string) => {
    output.value = ''
      state.value = 'loading'
    const result = await sendCommand({ command: cmd })
  
    result
      .map((res) => res.response)
      .match(
        (res) => {
          output.value = res
          if (res.includes('hostname') || res.includes('map')) {
            statusText.value = '🟢 Онлайн'
          }
            state.value = 'ready'
        },
        (err) => {
          output.value = `❌ ${err}`
          statusText.value = '🔴 Ошибка'
        }
      )
  }
  </script>
  