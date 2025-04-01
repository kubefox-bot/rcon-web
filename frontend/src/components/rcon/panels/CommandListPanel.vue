<template>
  <div>
    <h3>Команды</h3>
    <ul>
      <li>
        <button @click="emit('send', 'status')">📡 Статус</button>
      </li>
      <li>
        <button @click="emit('send', 'mp_restartgame 1')">🔁 Рестарт</button>
      </li>
      <li>
        <button @click="emit('send', 'say Hello from panel')">💬 Say</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RconSendEvent } from '../type'

const emit = defineEmits<RconSendEvent>()
</script>
