import type { Result } from "neverthrow";
import { sendRconRequest } from "./rcon";

export async function disconnect(): Promise<Result<"disconnected", string>> {
	return sendRconRequest<"disconnected">("disconnect");
}
