import type { CommandPayload, RconResponse } from "@/models"
import type { Result } from "neverthrow"
import { sendRconRequest } from "./rcon"

export const sendCommand = async (
	payload: CommandPayload,
): Promise<Result<RconResponse, string>> => {
	return sendRconRequest<RconResponse>({ ...payload, action: "command" })
}
