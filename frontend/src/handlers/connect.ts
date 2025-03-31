import { sendRconRequest } from './rcon'
import { ConnectPayload } from '@/models'
import { Result } from 'neverthrow'

export async function connectToServer(
  payload: ConnectPayload
): Promise<Result<'connected', string>> {
  return sendRconRequest<'connected'>('connect', payload)
}
