// src/composables/useAppStep.ts
import { jwt } from '@/lib'
import { ref } from 'vue'
import { useFlashMessage } from './useFlashMessage'

export type AppStep = 'auth' | 'server' | 'rcon'

const step = ref<AppStep>('auth')

export function useAppStep() {
  const setStep = (newStep: AppStep) => {
    step.value = newStep
  }

  const initStep = () => {
    const { show } = useFlashMessage()

    if (jwt.isAuthenticated()) {
      setStep('server')
    } else {
      setStep('auth')
      show('Сессия истекла. Войдите снова.')
    }
  }

  return {
    step,
    setStep,
    initStep,
  }
}
