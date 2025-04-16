import type { ConnectPayload } from "@/models";
import type { Result } from "neverthrow";
import { sendRconRequest } from "./rcon";

export async function connectToServer(
	payload: ConnectPayload,
): Promise<Result<"connected", string>> {
	return sendRconRequest<"connected">("connect", payload);
}
