import { ChaCha20Poly1305 } from "@stablelib/chacha20poly1305"
import { randomBytes } from "@stablelib/random"
import type { ICryptoStorage } from "./type"

export class CryptoStorageChaCha implements ICryptoStorage {
	private readonly key: Uint8Array

	constructor(key: Uint8Array) {
		if (key.length !== 32) {
			throw new Error("ChaCha20 key must be 32 bytes")
		}
		this.key = key
	}

	async encrypt(text: string): Promise<string> {
		const nonce = randomBytes(12)
		const message = new TextEncoder().encode(text)
		const cipher = new ChaCha20Poly1305(this.key)
		const encrypted = cipher.seal(nonce, message)

		const combined = new Uint8Array(nonce.length + encrypted.length)
		combined.set(nonce)
		combined.set(encrypted, nonce.length)

		return btoa(String.fromCharCode(...combined))
	}

	async decrypt(cipherText: string): Promise<string | null> {
		try {
			const binary = atob(cipherText)
			const combined = Uint8Array.from(binary, (c) => c.charCodeAt(0))
			const nonce = combined.slice(0, 12)
			const data = combined.slice(12)
			const cipher = new ChaCha20Poly1305(this.key)
			const decrypted = cipher.open(nonce, data)

			if (!decrypted) return null
			return new TextDecoder().decode(decrypted)
		} catch (e) {
			console.warn("❌ ChaCha decrypt error:", e)
			return null
		}
	}
}
