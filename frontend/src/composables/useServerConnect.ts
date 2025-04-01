import { connectToServer } from '@/handlers'
import { ConnectPayload } from '@/models'
import { encryptedPasswordStorage } from '@/lib/EncryptedPasswordStorage'
import { serverStorage } from '@/lib/serverStorage'
import { useServerError } from './useServerError'
import { Result, ok, err } from 'neverthrow'

export function useServerConnect() {
  const { setError } = useServerError()

  const decryptPassword = async (password: string): Promise<Result<string, string>> => {
    const decrypted = await encryptedPasswordStorage.decrypt(password)
    return decrypted ? ok(decrypted) : err('Не удалось расшифровать пароль')
  }
  
  const encryptPassword = async (password: string): Promise<Result<string, string>> => {
    const encrypted = await encryptedPasswordStorage.encrypt(password)
    return encrypted ? ok(encrypted) : err('Не удалось зашифровать пароль')
  }

  const tryConnect = async (payload: ConnectPayload): Promise<Result<'connected', string>> => {
    return connectToServer(payload).then((res) => {
      if (res.isErr()) {
        setError(res.error)
        return err(res.error)
      }
      return ok('connected')
    })
  }

  const saveIfNew = (payload: ConnectPayload) => {
    const exists = serverStorage
      .loadAll()
      .some((s) => s.host === payload.host && s.port === payload.port)

    if (!exists) {
      serverStorage.save(payload)
    }
  }

  const connect = async (
    payload: ConnectPayload,
    isEncrypted: boolean = false
  ): Promise<Result<'connected', string>> => {
    const passwordResult = isEncrypted
      ? await decryptPassword(payload.password)
      : ok(payload.password)

    if (passwordResult.isErr()) {
      setError(passwordResult.error)
      return err(passwordResult.error)
    }

    const decrypted = passwordResult.value

    const result = await tryConnect({ ...payload, password: decrypted })

    if (result.isOk() && !isEncrypted) {
      const encryptedResult = await encryptPassword(payload.password)
      if (encryptedResult.isOk()) {
        saveIfNew({ ...payload, password: encryptedResult.value })
      } else {
        console.warn('⚠️ Пароль не был сохранён: ошибка шифрования')
      }
    }

    return result
  }

  return {
    connect,
  }
}
