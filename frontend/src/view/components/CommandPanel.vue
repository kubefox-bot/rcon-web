<template>
  <details>
    <summary>Write command</summary>
    <div class="command">
      <textarea v-model="command" placeholder="Enter command..." rows="4" />
      <button @click="sendCommand">Send Command</button>
    </div>
  </details>
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  
  const emit = defineEmits(['send-command', 'logout'])
  
  const command = ref('status')
  
  const sendCommand = () => {
    const val = command.value.trim();


    if (val.length === 0){
      alert("Command is Empty");
      return;
    }

    if (command.value.trim()) {
      emit('send-command', command.value)
    }
  }
  
  </script>
  
  <style scoped>
  .command {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  textarea {
    font-family: monospace;
    padding: 0.5rem;
  }
  pre {
    background: #111;
    color: #0f0;
    padding: 1rem;
    white-space: pre-wrap;
  }
  .disconnect {
    background-color: #911;
    color: white;
  }
  </style>
  