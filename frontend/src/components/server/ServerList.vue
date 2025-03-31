<template>
    <div>
      <h2>Выберите сервер</h2>
  
      <ul v-if="servers.length">
        <li v-for="(s, i) in servers" :key="i">
          {{ s.host }}:{{ s.port }}
          <button @click="connectTo(s)">Подключиться</button>
          <button @click="remove(i)">Delete</button>
        </li>
      </ul>
  
      <p v-else>Серверы не добавлены</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAppStep } from '@/composables/useAppStep'
  import { serverStorage, StoredServer } from '@/lib/serverStorage'
  import { useConnectionForm } from '@/composables/useConnectionForm'
  
  const servers = ref<StoredServer[]>(serverStorage.loadAll())
  const passwords = ref<string[]>(servers.value.map(() => ''))
  
  const { connect } = useConnectionForm()
  const { setStep } = useAppStep()
  
  const connectTo = async (server: StoredServer) => {
    
    
    const result = await connect(server)
  
    result.match(
      () => setStep('rcon'),
      (err) => alert(`Ошибка подключения: ${err}`)
    )
  }
  
  
  const remove = (index: number) => {
    serverStorage.remove(index)
    servers.value = serverStorage.loadAll()
    passwords.value = servers.value.map(() => '')
  }
  </script>
  