<template>
  <div class="card">
    <h3>⌨️ Выполнить команду</h3>
    <div class="command">
      <textarea v-model="command" placeholder="Введите команду..." rows="4" />
      <button @click="sendCommand">🚀 Отправить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['send-command'])

const command = ref('status')

const sendCommand = () => {
  const val = command.value.trim()
  if (!val.length) {
    alert('Команда пуста')
    return
  }
  emit('send-command', val)
}
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: var(--padding);
  box-shadow: var(--shadow);
  color: var(--text-color);
}

.command {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

textarea {
  font-family: var(--font-mono);
  background: var(--terminal-bg);
  color: var(--accent);
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  resize: vertical;
}

button {
  align-self: flex-start;
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
</style>
