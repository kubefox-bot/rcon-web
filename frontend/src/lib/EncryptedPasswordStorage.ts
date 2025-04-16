import { CryptoStorageAES } from './cryptoStorageAES'
import { config } from '@/config'
import { ICryptoStorage } from './type'
import { CryptoStorageChaCha } from './cryptoStorageChacha'

export class EncryptedPasswordStorage {
  private crypto: ICryptoStorage | null = null


  constructor() {
    this.initCrypto()
  }

  isProbablyEncrypted(value: string): boolean {
    return value.startsWith('enc:')
  }

  private initCrypto(): void {
    const key = config.masterKey
    const backend = config.encryptionBackend
    const log = (msg: string) => console.warn(`⚠️ [EncryptedPasswordStorage] ${msg}`)

    switch (backend) {
      case 'aes': {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          this.crypto = new CryptoStorageAES(key)
        } else {
          log('Web Crypto API не поддерживается. AES недоступен.')
        }
        break
      }
      default:
      case 'chacha': {
        const keyBytes = new TextEncoder().encode(key)
        if (keyBytes.length !== 32) {
          log('Ключ для ChaCha должен быть ровно 32 байта. Шифрование отключено.')
        } else {
          this.crypto = new CryptoStorageChaCha(keyBytes)
        }
        break
      }
    }
  }

  async encrypt(password: string): Promise<string | null> {
    if (this.isProbablyEncrypted(password) || !this.crypto) {
      return password
    }

    try {
      const encrypted = await this.crypto.encrypt(password)
      return encrypted ? `enc:${encrypted}` : null
    } catch (e: unknown) {
      console.warn('⚠️ Ошибка при шифровании:', e)
      return null
    }
  }

  async decrypt(encrypted: string): Promise<string | null> {
    if (!this.isProbablyEncrypted(encrypted)) {
      return encrypted
    }

    if (!this.crypto) {
      return encrypted
    }

    try {
      const payload = encrypted.slice(4)
      return await this.crypto.decrypt(payload)
    } catch (e: unknown) {
      console.warn('⚠️ Ошибка при расшифровке:', e)
      return null
    }
  }
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage()
