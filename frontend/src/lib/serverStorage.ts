import { Singleton } from '@/utils/singleton'

export interface StoredServer {
  host: string
  port: number
  password: string
}

export interface ServerStorageAdapter {
  save(server: StoredServer): void
  loadAll(): StoredServer[]
  remove(index: number): void
  clear(): void
}

const STORAGE_KEY = 'rcon.servers'

@Singleton
export class LocalServerStorage implements ServerStorageAdapter {
  loadAll(): StoredServer[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    try {
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  save(server: StoredServer): void {
    const list = this.loadAll()
    list.push(server)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  remove(index: number): void {
    const list = this.loadAll()
    list.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const serverStorage = new LocalServerStorage()
