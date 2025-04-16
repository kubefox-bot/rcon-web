export interface StoredServer {
	host: string;
	port: number;
}

export interface ServerStorageAdapter {
	save(server: StoredServer): void;
	load(): StoredServer | null;
	clear(): void;
}

export interface ICryptoStorage {
	encrypt(text: string): Promise<string>;
	decrypt(cipherText: string): Promise<string | null>;
}
