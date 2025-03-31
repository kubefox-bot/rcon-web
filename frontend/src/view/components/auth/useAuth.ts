import { ref } from 'vue'
import { connectToServer, disconnect } from '@/handlers'
import type { ConnectPayload } from '@/models'
import { Result } from 'neverthrow'

const isAuthenticated = ref(false)

export function useAuth() {
  const connect = async (
    payload: ConnectPayload
  ): Promise<Result<string, string>> => {
    const result = await connectToServer(payload)

    const mapped = result.map((res) => res)

    mapped.match(
      () => (isAuthenticated.value = true),
      () => (isAuthenticated.value = false)
    )

    return mapped
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
