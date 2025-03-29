<template>
     <main class="app">
    <AuthForm v-if="!auth.isAuthenticated.value" />
    <RconPanel v-else />
  </main>
  </template>
  
  <script setup lang="ts">
import { useAuth } from '@/view/components/useAuth';
import AuthForm from '@/view/components/AuthForm.vue';
import RconPanel from '@/view/components/RconPanel.vue';
  const auth = useAuth()

  </script>
  
  <style scoped>
  .app {
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }
  </style>
  