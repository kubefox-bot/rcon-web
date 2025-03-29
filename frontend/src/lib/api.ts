import { config } from '@/config'
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers:{
    Authorization: `Bearer ${config.token}`
  }
})
