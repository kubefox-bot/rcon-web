// src/lib/EncryptedPasswordStorage.ts
import { CryptoStorage } from './cryptoStorage'
import { config } from '@/config'

export class EncryptedPasswordStorage {
  private crypto: CryptoStorage | null = null

  constructor() {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      this.crypto = new CryptoStorage(config.masterKey)
    } else {
      console.warn('⚠️ Web Crypto API не поддерживается. Шифрование отключено.')
    }
  }

  async encrypt(password: string): Promise<string | null> {
    if (!this.crypto) {
      return password
    }

    try {
      return await this.crypto.encrypt(password)
    } catch (e: unknown) {
      console.warn('⚠️ Ошибка при шифровании:', e)
      return null
    }
  }

  async decrypt(encrypted: string): Promise<string | null> {
    if (!this.crypto) {
      return encrypted
    }

    try {
      return await this.crypto.decrypt(encrypted)
    } catch (e: unknown) {
      console.warn('⚠️ Ошибка при расшифровке:', e)
      return null
    }
  }
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage()
