export type RconSendEvent = {
    (e: 'send', command: string): void
  }
  

  export type RconState = 'loading' | 'ready'