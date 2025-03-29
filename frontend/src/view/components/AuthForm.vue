<template>
    <form @submit.prevent="handleConnect" class="form">
      <h2>🔐 Connect to CS2 Server</h2>
      <input v-model="host" placeholder="Host" />
      <input v-model.number="port" type="number" placeholder="Port" />
      <input v-model="password" placeholder="RCON Password" />
  
      <button type="submit">Connect</button>
      <p v-if="error" class="error">❌ {{ error }}</p>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useConnectionForm } from './useConnectionForm'
 
  
  const auth = useAuth()
  const { host, port, password} = useConnectionForm()
  const error = ref('')
  
  const handleConnect = async () => {
    const result = await auth.connect({ host: host.value, port: port.value, password: password.value })
    if (result.isErr()) {
      error.value = result.error
    }
  }
  </script>
  
  <style scoped>
  .form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
    margin: 2rem auto;
  }
  .error {
    color: red;
  }
  </style>
  