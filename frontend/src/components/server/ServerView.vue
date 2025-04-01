<template>
  <div class="server-view">
    <div class="left">
      <ServerList />
    </div>
    <div class="right">
      <ServerConnectForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import ServerList from './ServerList.vue'
import ServerConnectForm from './ServerConnectForm.vue'
</script>

<style scoped lang="scss">
.server-view {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
}

.left,
.right {
  background: var(--bg-panel);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  flex: 1;
  min-width: 320px;
  color: var(--text-color);
}
</style>
