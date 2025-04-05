import { connectToServer } from '@/handlers'
import { ConnectPayload } from '@/models'
import { encryptedPasswordStorage } from '@/lib/EncryptedPasswordStorage'
import { serverStorage } from '@/lib/serverStorage'
import { useServerError } from './useServerError'
import { Result, ok, err } from 'neverthrow'

export function useServerConnect() {
  const { setError } = useServerError()

  const encryptPassword = async (plain: string): Promise<Result<string, string>> => {
    const encrypted = await encryptedPasswordStorage.encrypt(plain)
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

  const saveEncrypted = async (payload: ConnectPayload) => {
    const exists = serverStorage
      .loadAll()
      .some((s) => s.host === payload.host && s.port === payload.port)

    if (!exists) {
      serverStorage.save(payload)
    }
  }

  const connect = async (payload: ConnectPayload): Promise<Result<'connected', string>> => {
    const encryptedResult = await encryptPassword(payload.password)

    if (encryptedResult.isErr()) {
      setError(encryptedResult.error)
      return err(encryptedResult.error)
    }

    const encrypted = encryptedResult.value

    const result = await tryConnect({ ...payload, password: encrypted })

    if (result.isOk()) {
      await saveEncrypted({ ...payload, password: encrypted })
    }

    return result
  }

  return {
    connect,
  }
}
