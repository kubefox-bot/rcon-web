import { config } from '@/config'
import axios from 'axios'

export const api = axios.create({
  baseURL: `http://${config.apiHost}:${config.apiPort}`,
  headers:{
    Authorization: `Bearer ${config.token}`
  }
})
