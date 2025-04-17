<template>
    <div class="panel">
      <h3>🎮 Режимы игры</h3>
      <ul>
        <li v-for="mode in modes" :key="mode.name">
          <span>{{ mode.label }}</span>
          <button @click="emit('send', mode.command)">Включить</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
import type { RconSendEvent } from "../type"
const emit = defineEmits<RconSendEvent>()

const defaultMap = "de_dust2" // или ты можешь это сделать пропсом/селектором

const modes = [
	{
		name: "competitive",
		label: "Соревновательный",
		command: "game_mode 1; game_type 0; exec gamemode_competitive;}",
	},
	{
		name: "casual",
		label: "Обычный",
		command: "game_mode 0; game_type 0; exec gamemode_casual;",
	},
	{
		name: "deathmatch",
		label: "Бой насмерть",
		command: "game_mode 2; game_type 1; exec gamemode_deathmatch; ",
	},
	{
		name: "armsrace",
		label: "Гонка вооружений",
		command: "game_mode 0; game_type 1; exec gamemode_armsrace;",
	},
	{
		name: "demolition",
		label: "Уничтожение",
		command: "game_mode 1; game_type 1; exec gamemode_demolition;",
	},
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
  