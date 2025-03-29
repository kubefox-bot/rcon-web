import { config } from '@/config'
import axios from 'axios'

export const api = axios.create({
  baseURL: `${config.apiHost}`,
  headers:{
    Authorization: `Bearer ${config.token}`
  }
})
