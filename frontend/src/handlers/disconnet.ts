import { sendRconRequest } from './rcon'
import { Result } from 'neverthrow'

export async function disconnect(): Promise<Result<'disconnected', string>> {
  return sendRconRequest<'disconnected'>('disconnect')
}
