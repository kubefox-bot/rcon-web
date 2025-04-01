<template>
  <div class="panel">
    <h3>Своя команда</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="command" placeholder="Введите команду" />
      <button type="submit">Отправить</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RconSendEvent } from '../type'

const command = ref('')
const emit = defineEmits<RconSendEvent>()

const handleSubmit = () => {
  if (!command.value.trim()) return
  emit('send', command.value.trim())
  command.value = ''
}
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

  form {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      background: $bg-dark;
      border: 1px solid $border-color;
      padding: 0.5rem;
      border-radius: $radius;
      color: $text-color;

      &:focus {
        outline: none;
        border-color: $accent;
      }
    }

    button {
      background: $accent;
      color: #000;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: $radius;
      cursor: pointer;
      font-weight: bold;

      &:hover {
        background: color.adjust($accent, $lightness: 10%);
      }
    }
  }
}
</style>
