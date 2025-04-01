<template>
  <main>
    <h1>🎮 RCON CLIENT</h1>
    <ServerStatus :status="statusText" />
    <component :is="currentComponent" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStep } from '@/composables/useAppStep'
import LoginForm from '@/components/auth/LoginForm.vue'
import ServerView from '@/components/server/ServerView.vue'
import RconPanel from '@/components/rcon/RconPanel.vue'
import ServerStatus from '@/components/status/ServerStatus.vue'
import { useServerStatus } from '@/composables/useServerStatus'

const { step, initStep } = useAppStep()

onMounted(() => {
  initStep()
})

const { statusText } = useServerStatus()

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

<style scoped lang="scss">
@use '@/styles/variables' as *;
main {
  background: $bg-dark;
  color: $text-color;
  font-family: $font-main;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: $accent;
    letter-spacing: 1px;
  }
}
</style>