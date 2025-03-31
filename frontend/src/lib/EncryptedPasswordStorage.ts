// src/lib/EncryptedPasswordStorage.ts
import { config } from '@/config'
import { CryptoStorage } from './cryptoStorage'

export class EncryptedPasswordStorage {
  private crypto = new CryptoStorage(config.masterKey)

  async encrypt(password: string): Promise<string> {
    return this.crypto.encrypt(password)
  }

  async decrypt(encrypted: string): Promise<string | null> {
    return this.crypto.decrypt(encrypted)
  }
}

export const encryptedPasswordStorage = new EncryptedPasswordStorage()
