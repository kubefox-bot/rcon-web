import { ref } from 'vue'
import { sendCommand, disconnect } from '@/handlers'
import { useAuth } from './auth/useAuth'

export function useServerStatus() {
  const output = ref('')
  const isLoading = ref(false)
  const statusText = ref('')

  const auth = useAuth()

  const send = async (cmd: string) => {
    isLoading.value = true
    output.value = ''
    const result = await sendCommand({ command: cmd })
    isLoading.value = false
    
    if (result.isOk()) {
      output.value = result.value.response
      return result.value.response
    } else {
      output.value = `❌ ${result.error}`
      return null
    }
  }

  const checkStatus = async () => {
    const res = await send('status')
    if (res?.includes('hostname') || res?.includes('map')) {
      statusText.value = '🟢 Онлайн'
    } else {
      statusText.value = '🔴 Оффлайн'
    }
  }

  const restartMap = () => send('mp_restartgame 1')

  const logout = async () => {
    await disconnect()
    auth.isAuthenticated.value = false
  }

  return {
    output,
    isLoading,
    statusText,
    checkStatus,
    restartMap,
    logout,
  }
}
