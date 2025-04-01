// src/handlers/command.ts
import { sendRconRequest } from './rcon'
import { CommandPayload, RconResponse } from '@/models'
import { Result } from 'neverthrow'

export async function sendCommand(payload: CommandPayload): Promise<Result<RconResponse, string>> {
  return sendRconRequest<RconResponse>('command', payload)
}
