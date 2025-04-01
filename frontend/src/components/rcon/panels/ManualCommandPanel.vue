<template>
  <div>
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
