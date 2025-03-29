<template>
    <div class="panel">
      <h2>🖥️ CS2 RCON Panel</h2>
      <textarea v-model="command" placeholder="Enter command..." rows="4" />
      <button @click="send">Send Command</button>
      <button @click="logout" class="disconnect">Disconnect</button>
      <pre>{{ output }}</pre>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'

  import { sendCommand } from '@/handlers'
  import { useAuth } from './useAuth'
  
  const auth = useAuth()
  const command = ref('')
  const output = ref('')
  
  const send = async () => {
    const result = await sendCommand({ command: command.value })
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
  pre {
    background: #111;
    color: #0f0;
    padding: 1rem;
    white-space: pre-wrap;
  }
  .disconnect {
    background-color: #911;
    color: white;
  }
  </style>
  