import { config } from "@/config";
import { CryptoStorageChaCha } from "./cryptoStorageChacha";
import type { ICryptoStorage } from "./type";

export class EncryptedPasswordStorage {
	private crypto: ICryptoStorage;

	constructor() {
		const key = config.masterKey;
		const keyBytes = new TextEncoder().encode(key);
		this.crypto = new CryptoStorageChaCha(keyBytes);
	}

	async encrypt(password: string): Promise<string | null> {
		try {
			return await this.crypto.encrypt(password);
		} catch (e: unknown) {
			console.warn("⚠️ Ошибка при шифровании:", e);
			return null;
		}
	}

	async decrypt(encrypted: string): Promise<string | null> {
		if (!this.crypto) {
			return encrypted;
		}

		try {
			const payload = encrypted.slice(4);
			return await this.crypto.decrypt(payload);
		} catch (e: unknown) {
			console.warn("⚠️ Ошибка при расшифровке:", e);
			return null;
		}
	}
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage();
