export interface ConnectPayload {
	host: string;
	port: number;
	password: string;
}

export interface CommandPayload {
	command: string;
}

export interface RconResponse {
	response: string;
}
