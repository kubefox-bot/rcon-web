// crypto-storage-chacha.ts
import nacl from 'tweetnacl'
import { decodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util'
import { ICryptoStorage } from './type'

export class CryptoStorageChaCha implements ICryptoStorage {
  constructor(private readonly key: Uint8Array) {
    if (key.length !== nacl.secretbox.keyLength) {
      throw new Error(`Key must be ${nacl.secretbox.keyLength} bytes`)
    }
  }

  encrypt(text: string): Promise<string> {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
    const message = decodeUTF8(text)
    const encrypted = nacl.secretbox(message, nonce, this.key)
    const combined = new Uint8Array(nonce.length + encrypted.length)
    combined.set(nonce)
    combined.set(encrypted, nonce.length)
    return Promise.resolve(encodeBase64(combined))
  }

  decrypt(cipherText: string): Promise<string | null> {
    const combined = decodeBase64(cipherText)
    const nonce = combined.slice(0, nacl.secretbox.nonceLength)
    const message = combined.slice(nacl.secretbox.nonceLength)
    const decrypted = nacl.secretbox.open(message, nonce, this.key)
    const result = decrypted ? new TextDecoder().decode(decrypted) : null
    return Promise.resolve(result)
  }
}
