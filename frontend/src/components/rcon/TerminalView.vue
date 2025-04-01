<template>
    <div>
      <h3>Результат</h3>
      <pre>{{ output }}</pre>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ output: string }>()
  </script>
  