<template>
  <div class="server-list">
    <h2>Сохранённые серверы</h2>

    <ul v-if="servers.length">
      <li v-for="(s, i) in servers" :key="i" class="server-card">
        <span class="info">{{ s.host }}:{{ s.port }}</span>
        <div class="actions">
          <BaseButton @click="connectTo(s)" title="Подключиться">🔌</BaseButton>
          <BaseButton class="danger" @click="remove(i)" title="Удалить">🗑️</BaseButton>
        </div>
      </li>
    </ul>

    <p v-else>Серверы не добавлены</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStep } from '@/composables/useAppStep'
import { serverStorage, StoredServer } from '@/lib/serverStorage'
import { useServerConnect } from '@/composables/useServerConnect'
import BaseButton from '../shared/BaseButton.vue'

const servers = ref<StoredServer[]>(serverStorage.loadAll())

const { connect } = useServerConnect()
const { setStep } = useAppStep()

const connectTo = async (server: StoredServer) => {
  const result = await connect(server)

  result.match(
    () => setStep('rcon'),
    (err) => alert(`Ошибка подключения: ${err}`),
  )
}

const remove = (index: number) => {
  serverStorage.remove(index)
  servers.value = serverStorage.loadAll()
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:color';

.server-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    margin-top: 0;
    color: $accent;
    font-size: 1.25rem;
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .server-card {
    background: $bg-dark;
    border: 1px solid $border-color;
    padding: 1rem;
    border-radius: $radius;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;

    &:hover {
      background: color.adjust($bg-dark, $lightness: 10%);
    }

    .info {
      color: $text-color;
      font-size: 1rem;
      font-family: $font-main;
    }

    .actions {
      display: flex;
      gap: 0.5rem;

      button {
        background: $accent;
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: $radius;
        cursor: pointer;
        font-weight: bold;
        color: #000;
        transition: background 0.2s ease;

        &:hover {
          background: color.adjust($accent, $lightness: 10%);
        }

        &.danger {
          background: $error;
          color: #fff;

          &:hover {
            background: color.adjust($error, $lightness: 10%);
          }
        }
      }
    }
  }

  p {
    color: $text-color;
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
