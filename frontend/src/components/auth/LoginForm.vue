<template>
  <form @submit.prevent="handleLogin">
    <h2>Авторизация</h2>
    <input v-model="password" type="password" placeholder="Введите пароль" />
    <button type="submit">Войти</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAppStep } from '@/composables/useAppStep'

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
