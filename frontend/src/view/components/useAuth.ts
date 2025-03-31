import { ref } from 'vue'
import { connectToServer, disconnect } from '@/handlers'
import type { ConnectPayload } from '@/models'

const isAuthenticated = ref(false)

export function useAuth() {
  const connect = async (payload: ConnectPayload) => {
    const result = await connectToServer(payload)
    isAuthenticated.value = result.isOk()
    return result
  }

  const logout = async () => {
    await disconnect()
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    connect,
    logout,
  }
}
