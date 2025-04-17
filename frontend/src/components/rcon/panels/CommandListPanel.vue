<template>
  <div class="panel">
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
      <li>
        <button @click="emit('send', 'mp_pause_match')">⏸️ Пауза</button>
      </li>
      <li>
        <button @click="emit('send', 'mp_unpause_match')">▶️ Снять паузу</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { RconSendEvent } from "../type"
const emit = defineEmits<RconSendEvent>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:color';
.panel {
  background: $bg-panel;
  border-radius: $radius;
  padding: $padding;
  box-shadow: $shadow;
  margin-bottom: 1rem;

  h3 {
    color: $accent;
    margin-bottom: 1rem;
    margin: 0 auto;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    button {
      background: $accent;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: $radius;
      cursor: pointer;
      font-weight: bold;
      color: #000;
      transition: background 0.2s ease;

      &:hover {
        background: color.adjust($accent, $lightness: 10%);
      }
    }
  }
}
</style>
