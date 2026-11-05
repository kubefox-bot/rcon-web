import type { ConnectPayload } from "@/models"
import type { Result } from "neverthrow"
import { sendRconRequest } from "./rcon"

export const connectToServer = async (
	payload: ConnectPayload,
): Promise<Result<"connected", string>> => {
	const result = await sendRconRequest<unknown>({
		...payload,
		action: "connect",
	})
	return result.map(() => "connected")
}
