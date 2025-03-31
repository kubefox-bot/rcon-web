<template>
  <div class="card">
    <div class="header">
      <h3>🛠️ Server Controls</h3>
      <div class="info">
        <span>🖥️ {{ host || '—' }} : {{ port || '—' }}</span>
        <span :class="['status', statusClass]">{{ statusText }}</span>
      </div>
    </div>

    <details class="controls">
      <summary>⚙️ Действия</summary>
      <div class="button-row">
        <button @click="emit('send-command', 'status')" :disabled="isLoading">
          📡 Status
        </button>
        <button @click="emit('send-command', 'mp_restartgame 1')" :disabled="isLoading">
          🔁 Restart Map
        </button>
        <button @click="logout" class="danger" :disabled="isLoading">
          🔌 Disconnect
        </button>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted } from 'vue'
import { useConnectionForm } from './auth/useConnectionForm';

import { useServerStatus } from './useServerStatus';

const emit = defineEmits<{
  (e: 'send-command', command: string): void
}>()

const { statusText, isLoading, logout, checkStatus } = useServerStatus()

const { host, port } = useConnectionForm()

const statusClass = computed(() => {
  if (statusText.value.includes('🟢')) return 'online'
  if (statusText.value.includes('🔴')) return 'offline'
  return ''
})

onMounted(() =>{
  checkStatus();
});


</script>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: var(--padding);
  box-shadow: var(--shadow);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.status {
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
}
.online {
  background-color: var(--accent);
  color: black;
}
.offline {
  background-color: var(--danger);
  color: white;
}

.controls summary {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.button-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button {
  background: #3a3a55;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-color);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #505070;
}

button:disabled {
  opacity: 0.5;
  cursor: wait;
}

.danger {
  background-color: var(--danger);
}

.danger:hover {
  background-color: var(--error);
}
</style>
