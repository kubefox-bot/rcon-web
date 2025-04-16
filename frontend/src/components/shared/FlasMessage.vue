<!-- src/components/shared/FlashMessage.vue -->
<template>
  <transition name="fade">
    <div v-if="visible" class="flash-message">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useFlashMessage } from "@/composables/useFlashMessage";

const { message, visible } = useFlashMessage();
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.flash-message {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: $error;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: $radius;
  box-shadow: $shadow;
  z-index: 9999;
  font-weight: bold;
  animation: fade-in 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
