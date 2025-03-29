// src/handlers/connect.ts

import { api } from '../lib/api'
import { ConnectPayload } from '../models'
import { Result, ok, err } from 'neverthrow'

export async function connectToServer(
  payload: ConnectPayload,
): Promise<Result<'connected', string>> {
  try {
    const res = await api.post('/connect', payload)
    if (res.status === 200) {
      return ok('connected')
    } else {
      return err('Unexpected response')
    }
  } catch (e: any) {
    return err(e?.response?.data || e.message)
  }
}
