import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { api } from '../lib/api'
import { Result, ok, err } from 'neverthrow'
import type { AxiosError } from 'axios'
import { ConnectPayload } from '@/models'

export async function sendRconRequest<T>(
  action: string,
  payload: ConnectPayload,
): Promise<Result<T, string>> {
  const { start, stop } = useGlobalLoader()
  start()

  try {
    const res = await api.post('/rcon', { action, ...payload })
    return ok(res.data.data as T)
  } catch (e) {
    const error = e as AxiosError<{ message?: string }>
    const message = error.response?.data?.message || error.message || 'Unknown error'
    return err(message)
  } finally {
    stop()
  }
}
