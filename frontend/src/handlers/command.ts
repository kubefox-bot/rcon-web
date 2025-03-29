import { CommandPayload, RconResponse } from '@/models'
import { api } from '@lib'

import { Result, ok, err } from 'neverthrow'

export async function sendCommand(
  payload: CommandPayload,
): Promise<Result<RconResponse, string>> {
  try {
    const res = await api.post('/command', payload)
    return ok(res.data)
  } catch (e: any) {
    return err(e?.response?.data || e.message)
  }
}
