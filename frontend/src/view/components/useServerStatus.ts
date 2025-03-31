import { ref } from 'vue'
import { sendCommand, disconnect } from '@/handlers'
import { useAuth } from './auth/useAuth'
import { Result } from 'neverthrow'

export function useServerStatus() {
  const output = ref('')
  const isLoading = ref(false)
  const statusText = ref('')

  const auth = useAuth()

  const send = async (cmd: string): Promise<Result<string, string>> => {
    isLoading.value = true
    output.value = ''
  
    const result = await sendCommand({ command: cmd })
    isLoading.value = false
  
    const mapped = result.map((res) => res.response)
  
    mapped.match(
      (res) => (output.value = res),
      (err) => (output.value = `❌ ${err}`)
    )
  
    return mapped
  }
  

  const checkStatus = async () => {
    const result = await send('status')

    result.match(
      (res) => {
        if (res.includes('hostname') || res.includes('map')) {
          statusText.value = '🟢 Онлайн'
        } else {
          statusText.value = '🔴 Оффлайн'
        }
      },
      () => {
        statusText.value = '🔴 Оффлайн'
      }
    )
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
