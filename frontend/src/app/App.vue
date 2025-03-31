<template>
  <main>
    <h1>🎮 RCON CLIENT</h1>
    <component :is="currentComponent" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStep } from '@/composables/useAppStep'
import LoginForm from '@/components/auth/LoginForm.vue'
import ServerView from '@/components/server/ServerView.vue'
import RconPanel from '@/components/rcon/RconPanel.vue'



const { step, initStep } = useAppStep()

onMounted(() => {
  initStep()
})

const currentComponent = computed(() => {
  switch (step.value) {
    case 'auth':
      return LoginForm
    case 'server':
      return ServerView
    case 'rcon':
      return RconPanel
    default:
      return LoginForm
  }
})
</script>
