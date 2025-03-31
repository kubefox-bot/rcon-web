<template>
    <details class="map-selector">
      <summary>📜 Выбор карты</summary>
      <div class="wrapper">


      <select v-model="selectedMap">
        <option v-for="map in maps" :key="map" :value="map">{{ map }}</option>
      </select>
      <button @click="changeMap">Сменить карту</button>
    </div>
    </details>
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  const emit = defineEmits(['send-command'])

  
  const selectedMap = ref('de_dust2')
  const maps = ['de_dust2', 'de_mirage', 'de_inferno', 'de_nuke', 'de_vertigo']
  
  const changeMap = async () => {
  await emit("send-command", `map ${selectedMap.value}`)
}
  </script>
  
  <style scoped>
  .wrapper{
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .map-selector {
    margin-bottom: 1rem;
    cursor: pointer;
  }
  select {
    font-family: monospace;

  }
  </style>
  