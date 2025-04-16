<template>
  <form @submit.prevent="handleConnect" class="connect-form">
    <h2>➕ Новый сервер</h2>

    <BaseInput v-model="host" label="Host" placeholder="example.com" />
    <BaseInput v-model.number="port" label="Port" type="number" placeholder="27015" />
    <BaseInput
      v-model="password"
      label="RCON Password"
      placeholder="Введите пароль"
      type="password"
    />

    <button type="submit">💾 Сохранить и подключиться</button>

    <p v-if="error" class="error">❌ {{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { useAppStep } from '@/composables/useAppStep'
import { useConnectionForm } from '@/composables/useConnectionForm'
import { useServerConnect } from '@/composables/useServerConnect'
import { ref } from 'vue'
import BaseInput from '../shared/BaseInput.vue'
const { host, port, password } = useConnectionForm()
const { connect } = useServerConnect()
const { setStep } = useAppStep()
const error = ref('')

const handleConnect = async () => {
  error.value = ''
  const result = await connect({
    host: host.value,
    port: port.value,
    password: password.value,
  })

  result.match(
    () => setStep('rcon'),
    (err) => {
      error.value = err
    },
  )
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:color';
.connect-form {
  background: $bg-panel;
  padding: $padding;
  border-radius: $radius;
  box-shadow: $shadow;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  width: 100%;

  h2 {
    color: $accent;
    text-align: center;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    color: $text-color;
    font-size: 0.9rem;

    input {
      margin-top: 0.25rem;
      background: $bg-dark;
      border: 1px solid $border-color;
      padding: 0.75rem 1rem;
      border-radius: $radius;
      color: $text-color;
      font-size: 1rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: $accent;
      }
    }
  }

  button {
    background: $accent;
    color: #000;
    font-weight: bold;
    padding: 0.75rem;
    border: none;
    border-radius: $radius;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: color.adjust($accent, $lightness: 10%);
    }
  }

  .error {
    color: $error;
    font-weight: bold;
    text-align: center;
  }
}
</style>
