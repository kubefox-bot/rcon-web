import type { Result } from "neverthrow"
import { sendRconRequest } from "./rcon"

export const disconnect = async (): Promise<Result<"disconnected", string>> => {
	const result = await sendRconRequest<unknown>({ action: "disconnect" })
	return result.map(() => "disconnected")
}
