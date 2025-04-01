import { CryptoStorage } from './cryptoStorage'
import { config } from '@/config'
import { Result, ok, err } from 'neverthrow'

export class EncryptedPasswordStorage {
  private crypto: CryptoStorage | null = null

  constructor() {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      this.crypto = new CryptoStorage(config.masterKey)
    } else {
      console.warn('⚠️ Web Crypto API не поддерживается. Шифрование отключено.')
    }
  }

  async encrypt(password: string): Promise<Result<string, string>> {
    if (!this.crypto) {
      return ok(password) // Возвращаем "как есть"
    }

    try {
      const encrypted = await this.crypto.encrypt(password)
      return ok(encrypted)
    } catch (e: any) {
      console.warn('⚠️ Ошибка при шифровании:', e)
      return err('Ошибка шифрования')
    }
  }

  async decrypt(encrypted: string): Promise<Result<string, string>> {
    if (!this.crypto) {
      return ok(encrypted)
    }

    try {
      const decrypted = await this.crypto.decrypt(encrypted)
      if (!decrypted) return err('Не удалось расшифровать пароль')
      return ok(decrypted)
    } catch (e: any) {
      console.warn('⚠️ Ошибка при расшифровке:', e)
      return err('Ошибка расшифровки')
    }
  }
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage()
