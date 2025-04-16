<template>
  <div class="panel-wrapper">
    <div class="panel-header" @click="toggle">
      <h3>{{ title }}</h3>
      <span class="toggle-icon">{{ isOpen ? '▲' : '▼' }}</span>
    </div>

    <transition name="collapse">
      <div v-if="isOpen" class="panel-body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { usePersistentPanelState } from "./panels/usePersistentPanelState";

const props = defineProps<{ title: string }>();

const panelId = `panel-${props.title.toLowerCase().replace(/\s+/g, "-")}`;

const { isOpen, toggle } = usePersistentPanelState(panelId, true);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.panel-wrapper {
  border: 1px solid $border-color;
  border-radius: $radius;
  background: $bg-panel;
  box-shadow: $shadow;
  overflow: hidden;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    cursor: pointer;
    color: $accent;
    user-select: none;

    h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .toggle-icon {
      font-size: 0.9rem;
    }
  }

  .panel-body {
    padding: 1rem;
    border-top: 1px solid $border-color;
  }
}

.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
