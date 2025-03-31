<template>
    <div class="panel">
      <h2>🖥️ CS2 RCON Panel</h2>
      <button @click="logout" class="disconnect">Disconnect</button>
      <MapSelector @send-command="send"/>
      <CommandPanel @send-command="send" @logout="logout" />
      <TerminalResult :result="output"/>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref } from 'vue'
import MapSelector from './MapSelector.vue'
import CommandPanel from './CommandPanel.vue'
import { sendCommand } from '@/handlers'
import { useAuth } from './useAuth'
import TerminalResult from './TerminalResult.vue'
  
  const auth = useAuth()
  const output = ref('')
  
  const send = async (cmd: string) => {
    if (!cmd) return
    const result = await sendCommand({ command: cmd })
    output.value = result.isOk() ? result.value.response : `❌ ${result.error}`
  }
  
  const logout = async () => {
    await auth.logout()
  }
  </script>
  
  <style scoped>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 2rem auto;
  }
  textarea {
    font-family: monospace;
    padding: 0.5rem;
  }
  
  .disconnect {
    background-color: #911;
    color: white;
  }

  .command{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  </style>
  