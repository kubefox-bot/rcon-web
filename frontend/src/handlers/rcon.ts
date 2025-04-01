/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from '../lib/api'
import { Result, ok, err } from 'neverthrow'

export async function sendRconRequest<T = any>(
  action: string,
  payload: Record<string, any> = {},
): Promise<Result<T, string>> {
  try {
    const res = await api.post('/rcon', { action, ...payload })
    return ok(res.data.data as T)
  } catch (e: any) {
    return err(e?.response?.data?.message || e.message)
  }
}
