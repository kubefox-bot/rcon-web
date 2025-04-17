<template>
    <div class="panel">
      <h3>🔥 Разминка</h3>
      <ul>
        <li>
          <button @click="emit('send', 'mp_warmup_start')">▶️ Начать разминку</button>
        </li>
        <li>
          <button @click="emit('send', 'mp_warmup_end')">🛑 Завершить разминку</button>
        </li>
        <li>
          <button @click="emit('send', 'mp_warmuptime 999999')">♾️ Бесконечная разминка</button>
        </li>
        <li>
          <button @click="emit('send', 'mp_warmuptime 30')">⏱️ 30 сек разминка</button>
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
      gap: 0.75rem;
  
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
  
        button {
          background: $accent;
          color: #000;
          border: none;
          padding: 0.4rem 0.75rem;
          border-radius: $radius;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.2s ease;
  
          &:hover {
            background: color.adjust($accent, $lightness: 10%);
          }
        }
      }
    }
  }
  </style>
  