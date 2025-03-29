import { ref } from 'vue'
import { connectToServer, disconnect } from '@/handlers'
import type { ConnectPayload } from '@/models'

const isAuthenticated = ref(false)
const token = ref('changeme')

export function useAuth() {
  const connect = async (payload: ConnectPayload) => {
    const result = await connectToServer(payload, token.value)
    isAuthenticated.value = result.isOk()
    return result
  }

  const logout = async () => {
    await disconnect(token.value)
    isAuthenticated.value = false
  }

  return {
    token,
    isAuthenticated,
    connect,
    logout,
  }
}
