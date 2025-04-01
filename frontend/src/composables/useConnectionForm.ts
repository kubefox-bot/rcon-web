import { ref } from 'vue'
import { connectToServer } from '@/handlers'
import { ConnectPayload } from '@/models'
import { Result, err } from 'neverthrow'
import { encryptedPasswordStorage } from '@/lib/EncryptedPasswordStorage'
import { useServerError } from './useServerError'

const host = ref('')
const port = ref(27050)
const password = ref('')

export function useConnectionForm() {
  const { setError } = useServerError()

  const connect = async (req: ConnectPayload): Promise<Result<'connected', string>> => {
    const decryptedResult = await encryptedPasswordStorage.decrypt(req.password)

    return decryptedResult.match(
      async (decrypted) => {
        const result = await connectToServer({ ...req, password: decrypted })
        result.mapErr((e) => setError(e))
        return result
      },
      (decryptionError) => {
        setError(decryptionError)
        return err(decryptionError)
      }
    )
  }

  return {
    host,
    port,
    password,
    connect,
  }
}
