<template>
  <div class="card">
    <h3>📜 Сменить карту</h3>
    <div class="wrapper">
      <select v-model="selectedMap">
        <option v-for="map in maps" :key="map" :value="map">
          {{ map }}
        </option>
      </select>
      <button @click="changeMap">🎯 Применить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['send-command'])

const selectedMap = ref('de_dust2')
const maps = ['de_dust2', 'de_mirage', 'de_inferno', 'de_nuke', 'de_vertigo']

const changeMap = () => {
  emit('send-command', `map ${selectedMap.value}`)
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

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

select {
  background: var(--terminal-bg);
  color: var(--accent);
  padding: 0.75rem;
  font-family: var(--font-mono);
  border: none;
  border-radius: 0.5rem;
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
</style>
