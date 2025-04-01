import axios from 'axios'
import { config } from '@/config'
import { jwt } from './jwtStorage'
import { forceLogout } from '@/composables/useAuth'

export const api = axios.create({
  baseURL: `${config.apiHost}:${config.apiPort}`,
})

api.interceptors.request.use((req) => {
  const tokenResult = jwt.getToken()
  tokenResult.map((token) => {
    req.headers.Authorization = `Bearer ${token}`
  })
  return req
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout()
    }
    return Promise.reject(error)
  },
)
