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
  import { useServerConnect } from '@/composables/useServerConnect'
  
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
    (err) => (error.value = err)
  )
}
  </script>
  
  