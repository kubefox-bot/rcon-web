export interface StoredServer {
    host: string
    port: number
  }
  
  export interface ServerStorageAdapter {
    save(server: StoredServer): void
    load(): StoredServer | null
    clear(): void
  }