import type { CommandPayload, RconResponse } from "@/models"
import type { Result } from "neverthrow"
import { sendRconRequest } from "./rcon"

export async function sendCommand(
	payload: CommandPayload,
): Promise<Result<RconResponse, string>> {
	return sendRconRequest<RconResponse>("command", payload)
}
