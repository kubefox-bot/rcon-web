<template>
  <button class="ui-button" :class="variant" :title="title" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'danger' | 'ghost'
  title?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:color';
.ui-button {
  padding: 0.5rem 0.75rem;
  border-radius: $radius;
  font-weight: bold;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.default {
  background: $accent;
  color: #000;

  &:hover {
    background: color.adjust($accent, $lightness: 10%);
  }
}

.danger {
  background: $error;
  color: #fff;

  &:hover {
    background: color.adjust($error, $lightness: 10%);
  }
}

.ghost {
  background: transparent;
  color: $text-color;
  border: 1px solid $border-color;

  &:hover {
    background: $bg-panel;
  }
}
</style>
