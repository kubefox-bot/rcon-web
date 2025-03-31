<template>
  <main class="app">
    <h1>🎮 RCON CLIENT</h1>

    <Transition name="fade-slide" mode="out-in">
      <component :is="auth.isAuthenticated.value ? RconPanel : AuthForm" />
    </Transition>
  </main>
</template>

<script setup lang="ts">
import AuthForm from '@/view/components/auth/AuthForm.vue'
import { useAuth } from '@/view/components/auth/useAuth'
import RconPanel from '@/view/components/RconPanel.vue'

const auth = useAuth()
</script>
<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-color);
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

