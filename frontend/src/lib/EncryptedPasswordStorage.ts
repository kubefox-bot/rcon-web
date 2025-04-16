import { config } from "@/config"
import { CryptoStorageChaCha } from "./cryptoStorageChacha"
import type { ICryptoStorage } from "./type"

export class EncryptedPasswordStorage {
	private crypto: ICryptoStorage

	constructor() {
		const key = config.masterKey
		const keyBytes = new TextEncoder().encode(key)
		this.crypto = new CryptoStorageChaCha(keyBytes)
	}

	isProbablyEncrypted(value: string): boolean {
		return value.startsWith('enc:')
	  }

	async encrypt(password: string): Promise<string | null> {
		if (this.isProbablyEncrypted(password) || !this.crypto) {
			return password
		  }
		try {
			const encrypted = await this.crypto.encrypt(password);
			return await `enc:${encrypted}`
		} catch (e: unknown) {
			console.warn("⚠️ Ошибка при шифровании:", e)
			return null
		}
	}

	

	async decrypt(encrypted: string): Promise<string | null> {
		if (!this.crypto) {
			return encrypted
		}

		try {
			const payload = encrypted.slice(4)
			return await this.crypto.decrypt(payload)
		} catch (e: unknown) {
			console.warn("⚠️ Ошибка при расшифровке:", e)
			return null
		}
	}
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage()
