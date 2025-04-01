<template>
  <div class="panel">
    <h3>🗺️ Карты</h3>
    <ul>
      <li v-for="map in maps" :key="map">
        <span>{{ map }}</span>
        <button @click="emit('send', `map ${map}`)">Запустить</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RconSendEvent } from '../type'
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

      span {
        color: $text-color;
        font-family: $font-main;
      }

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
