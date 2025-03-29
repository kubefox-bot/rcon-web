import { ref } from 'vue'

export function useConnectionForm() {
  const host = ref('')
  const port = ref(27015)
  const password = ref('')

  return {
    host,
    port,
    password,
  }
}
