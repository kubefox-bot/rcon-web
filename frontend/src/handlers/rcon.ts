import { api } from '../lib/api'
import { Result, ok, err } from 'neverthrow'

export async function sendRconRequest<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<Result<T, string>> {
  try {
    const res = await api.post('/rcon', { action, ...payload })
    return ok(res.data.data as T)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return err(e?.response?.data?.message || e.message)
  }
}
