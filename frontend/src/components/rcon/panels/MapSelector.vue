<template>
    <div>
      <h3>🗺️ Карты</h3>
      <ul>
        <li v-for="map in maps" :key="map">
          {{ map }}
          <button @click="emit('send', `map ${map}`)">Запустить</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
import { RconSendEvent } from '../type';

  const emit = defineEmits<RconSendEvent>()
  
  const maps = [
    'de_dust2',
    'de_mirage',
    'de_inferno',
    'de_nuke',
    'de_overpass',
    'de_vertigo',
    'cs_office',
  ]
  </script>
  