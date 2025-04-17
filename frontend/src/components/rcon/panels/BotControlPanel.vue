<template>
    <div class="panel">
      <h3>🤖 Боты</h3>
      <ul>
        <li>
          <button @click="emit('send', 'bot_add')">➕ Добавить бота</button>
        </li>
        <li>
          <button @click="emit('send', 'bot_kick')">🧹 Удалить всех ботов</button>
        </li>
        <li>
          <button @click="emit('send', 'bot_quota 0')">🚫 Выключить ботов</button>
        </li>
        <li>
          <button @click="emit('send', 'bot_quota 10')">🔟 Включить 10 ботов</button>
        </li>
        <li>
          <button @click="emit('send', 'bot_stop 1')">⛔ Заморозить ботов</button>
        </li>
        <li>
          <button @click="emit('send', 'bot_stop 0')">▶️ Разморозить ботов</button>
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
  