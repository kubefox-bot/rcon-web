// src/handlers/disconnect.ts

import { api } from '../lib/api'
import { Result, ok, err } from 'neverthrow'

export async function disconnect(): Promise<Result<'disconnected', string>> {
  try {
    const res = await api.post('/disconnect', {})
    if (res.status === 200) {
      return ok('disconnected')
    }
    return err('Unexpected status')
  } catch (e: any) {
    return err(e?.response?.data || e.message)
  }
}
