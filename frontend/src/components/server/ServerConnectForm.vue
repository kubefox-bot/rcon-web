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
  error.value = ''

  const encryptedResult = await encryptedPasswordStorage.encrypt(password.value)

  encryptedResult.match(
    async (shifredPass) => {
      const server = {
        host: host.value,
        port: port.value,
        password: shifredPass,
      }

      const result = await connect(server)

      result.match(
        () => {
          const alreadyExists = serverStorage
            .loadAll()
            .some((s) => s.host === server.host && s.port === server.port)

          if (!alreadyExists) {
            serverStorage.save(server)
          }

          setStep('rcon')
        },
        (err) => {
          error.value = err
        }
      )
    },
    (err) => {
      error.value = err
    }
  )
}
  </script>
  