import { jwt } from '@/lib'
import { ref } from 'vue'

export type AppStep = 'auth' | 'server' | 'rcon'

const step = ref<AppStep>('auth')

export function useAppStep() {
  const setStep = (newStep: AppStep) => {
    step.value = newStep
  }

  const initStep = () => {
    if (jwt.isAuthenticated()) {
      setStep('server')
    } else {
      setStep('auth')
    }
  }

  return {
    step,
    setStep,
    initStep,
  }
}
