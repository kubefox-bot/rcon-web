import sodium from 'libsodium-wrappers'
import { ICryptoStorage } from './type'

export class CryptoStorageChaCha implements ICryptoStorage {
  private readonly key: Uint8Array

  constructor(key: Uint8Array) {
    if (key.length !== 32) {
      throw new Error('ChaCha key must be 32 bytes')
    }
    this.key = key
  }

  async encrypt(text: string): Promise<string> {
    await sodium.ready

    const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES)
    const message = sodium.from_string(text)

    const ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      message,
      null, // AAD
      null, // secret nonce
      nonce,
      this.key,
    )

    const combined = new Uint8Array(nonce.length + ciphertext.length)
    combined.set(nonce)
    combined.set(ciphertext, nonce.length)

    return sodium.to_base64(combined)
  }

  async decrypt(encrypted: string): Promise<string | null> {
    await sodium.ready

    try {
      const combined = sodium.from_base64(encrypted)
      const nonce = combined.slice(0, sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES)
      const ciphertext = combined.slice(nonce.length)

      const decrypted = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        null,
        nonce,
        this.key,
      )

      return sodium.to_string(decrypted)
    } catch (err) {
      console.warn('🔐 ChaCha decrypt failed:', err)
      return null
    }
  }
}
