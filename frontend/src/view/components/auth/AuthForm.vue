<template>
  <form @submit.prevent="handleConnect" class="form">
    <h2>🔐 Подключение к CS2</h2>

    <input v-model="host" placeholder="Host" />
    <input v-model.number="port" type="number" placeholder="Port" />
    <input v-model="password" placeholder="RCON Password" />

    <button type="submit">🔗 Подключиться</button>

    <p v-if="error" class="error">❌ {{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useConnectionForm } from './useConnectionForm'

const auth = useAuth()
const { host, port, password } = useConnectionForm()
const error = ref('')

const handleConnect = async () => {
  const result = await auth.connect({
    host: host.value,
    port: port.value,
    password: password.value,
  })
  if (result.isErr()) {
    error.value = result.error
  }
}
</script>

<style scoped>
.form {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: var(--padding);
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-color);
}

h2 {
  margin: 0;
  text-align: center;
  font-size: 1.5rem;
  color: var(--accent);
}

input {
  background: var(--terminal-bg);
  color: var(--text-color);
  border: 1px solid #444;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;
}

input:focus {
  border-color: var(--accent);
}

button {
  background: var(--accent);
  color: black;
  border: none;
  padding: 0.75rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #0c0;
}

.error {
  color: var(--error);
  font-weight: bold;
  text-align: center;
}
</style>
