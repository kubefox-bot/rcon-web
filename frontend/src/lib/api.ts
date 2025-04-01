import axios from 'axios'
import { config } from '@/config'
import { jwt } from './jwtStorage'

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
