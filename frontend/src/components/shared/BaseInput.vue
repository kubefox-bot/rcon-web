<template>
  <label class="base-input">
    <span v-if="label">{{ label }}</span>
    <input :type="type" :placeholder="placeholder" :value="modelValue" @input="handleInput" />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
	modelValue: string | number;
	label?: string;
	placeholder?: string;
	type?: string;
}>();

const emit =
	defineEmits<(e: "update:modelValue", value: string | number) => void>();

function handleInput(event: Event) {
	const target = event.target as HTMLInputElement;
	const value = props.type === "number" ? Number(target.value) : target.value;
	emit("update:modelValue", value);
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.base-input {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: $text-color;
  font-size: 0.9rem;

  input {
    margin-top: 0.25rem;
    background: $bg-dark;
    border: 1px solid $border-color;
    padding: 0.75rem 1rem;
    border-radius: $radius;
    color: $text-color;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $accent;
    }
  }
}
</style>
