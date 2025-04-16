<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Авторизация</h2>
    <input v-model="password" type="password" placeholder="Введите пароль" />
    <button type="submit">Войти</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { useAppStep } from '@/composables/useAppStep'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

const password = ref('')
const error = ref('')
const { login } = useAuth()

const handleLogin = async () => {
  const result = await login(password.value)
  const { setStep } = useAppStep()
  result.match(
    () => {
      error.value = ''
      setStep('server')
    },
    (err) => (error.value = `Ошибка: ${err}`),
  )
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:color';
.login-form {
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
    margin: 0 0 1rem 0;
  }

  input {
    background: $bg-dark;
    border: 1px solid $border-color;
    padding: 0.75rem 1rem;
    border-radius: $radius;
    color: $text-color;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: $accent;
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
