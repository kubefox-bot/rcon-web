<template>
    <form @submit.prevent="handleConnect">
      <h2>Новый сервер</h2>
      <input v-model="host" placeholder="Host" />
      <input v-model.number="port" placeholder="Port" />
      <input v-model="password" placeholder="RCON Password" />
  
      <button type="submit">Сохранить и подключиться</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAppStep } from '@/composables/useAppStep'
  import { serverStorage } from '@/lib/serverStorage'
  import { useConnectionForm } from '@/composables/useConnectionForm'
import { encryptedPasswordStorage } from '@/lib/EncryptedPasswordStorage'
  
  const { host, port, password, connect } = useConnectionForm()
  const { setStep } = useAppStep()
  const error = ref('')
  
  const handleConnect = async () => {
    const shifredPass = await encryptedPasswordStorage.encrypt(password.value)
    const result = await connect({
      host: host.value,
      port: port.value,
      password: shifredPass
    })
  
    result.match(
      () => {
        serverStorage.save({ host: host.value, port: port.value, password: shifredPass })
        setStep('rcon')
      },
      (err) => (error.value = err)
    )
  }
  </script>
  