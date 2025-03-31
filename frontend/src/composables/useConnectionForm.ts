import { ref } from 'vue'
import { connectToServer } from '@/handlers'
import { ConnectPayload } from '@/models'
import { Result, ok, err } from 'neverthrow'
import { encryptedPasswordStorage } from '@/lib/EncryptedPasswordStorage'
import { useServerError } from './useServerError'
import { useServerStatus } from './useServerStatus'

const host = ref('')
const port = ref(27050)
const password = ref('')

export function useConnectionForm() {
  const {setError, errorMessage} = useServerError();

  const connect = async (req: ConnectPayload): Promise<Result<'connected', string>> => {
    const decrypted = await encryptedPasswordStorage.decrypt(req.password)

    if (!decrypted) {
      setError('Failed to decrypt password');
      return err('Failed to decrypt password')
    }
    return await connectToServer({ ...req, password: decrypted })
  }

  return {
    host,
    port,
    password,
    connect,
  }
}
