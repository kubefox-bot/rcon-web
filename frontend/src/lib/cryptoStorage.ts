export class CryptoStorage {
  constructor(private readonly key: string) {}

  async encrypt(text: string): Promise<string> {
    const enc = new TextEncoder()
    const key = await this.importKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
    const buffer = new Uint8Array([...iv, ...new Uint8Array(encrypted)])
    return btoa(String.fromCharCode(...buffer))
  }

  async decrypt(cipherText: string): Promise<string | null> {
    try {
      const binary = atob(cipherText)
      const buffer = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      const iv = buffer.slice(0, 12)
      const data = buffer.slice(12)
      const key = await this.importKey()
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
      return new TextDecoder().decode(decrypted)
    } catch {
      return null
    }
  }

  private async importKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(this.key), 'AES-GCM', false, [
      'encrypt',
      'decrypt',
    ])
  }
}
