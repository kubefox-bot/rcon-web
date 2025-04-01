import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useFlashMessage() {
  function show(msg: string, duration = 3000) {
    message.value = msg
    visible.value = true

    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      visible.value = false
      message.value = ''
    }, duration)
  }

  return {
    message,
    visible,
    show,
  }
}
