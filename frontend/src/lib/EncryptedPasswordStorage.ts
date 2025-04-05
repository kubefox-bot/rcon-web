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

  isProbablyEncrypted(value: string): boolean {
    return value.startsWith('enc:')
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
