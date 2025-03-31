<template>
    <div>
      <h3>Статус сервера: {{ status }}</h3>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ status: string }>()
  </script>
  