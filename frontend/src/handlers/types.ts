import type { CommandPayload, ConnectPayload } from "@/models"

export type RconRequest =
	| ({ readonly action: "connect" } & Readonly<ConnectPayload>)
	| ({ readonly action: "command" } & Readonly<CommandPayload>)
	| { readonly action: "disconnect" }
