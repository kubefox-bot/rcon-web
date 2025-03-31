// src/composables/useAuth.ts
import { ref, computed } from 'vue'
import { api } from '@/lib/api'

import { Result, ok, err } from 'neverthrow'
import { jwt } from '@/lib'
import { useServerError } from './useServerError'

const isAuthenticated = ref(jwt.isAuthenticated())

export function useAuth() {
  const error = useServerError();
  const login = async (password: string): Promise<Result<'logged-in', string>> => {
    try {
      const res = await api.post('/login', { password })
      const token = res.data.access_token
      if (!token) return err('No token in response')

      jwt.setToken(token)
      isAuthenticated.value = true
      return ok('logged-in')
    } catch (e: any) {
      isAuthenticated.value = false
      error.setError(e?.response?.data?.message || 'Login failed')
      return err(e?.response?.data?.message || 'Login failed')
    }
  }

  const logout = async () => {
    jwt.removeToken()
    isAuthenticated.value = false
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    logout,
  }
}
