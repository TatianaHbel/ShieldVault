import { useState, useCallback } from 'react'
import type { OnboardingStep, CardTier, FundingStream, FiatMethod } from '../types/index'

type OnboardingPhase = 'idle' | OnboardingStep

export interface OnboardingData {
  email: string
  fundingStream: FundingStream | null
  fiatMethod: FiatMethod | null
  cardTier: CardTier | null
}

interface OnboardingState {
  phase: OnboardingPhase
  data: OnboardingData
}

const STEP_SEQUENCE: OnboardingStep[] = [
  'email',
  'email_verification',
  'passport',
  'tos',
  'funding',
  'card_selection',
]

const INITIAL_DATA: OnboardingData = {
  email: '',
  fundingStream: null,
  fiatMethod: null,
  cardTier: null,
}

const STORAGE_KEY = 'shieldvault_onboarding'
const COMPLETED_KEY = 'shieldvault_completed'

function persist(state: OnboardingState) {
  if (state.phase === 'idle') {
    localStorage.removeItem(STORAGE_KEY)
  } else if (state.phase === 'completed') {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(COMPLETED_KEY, '1')
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

const VALID_PHASES = new Set([
  'email', 'email_verification', 'passport', 'tos',
  'funding', 'funding_crypto', 'funding_fiat', 'processing',
  'card_selection', 'completing',
])

function restore(): OnboardingState | null {
  try {
    if (localStorage.getItem(COMPLETED_KEY) === '1') {
      return { phase: 'completed', data: INITIAL_DATA }
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as OnboardingState
    if (!VALID_PHASES.has(parsed.phase as string)) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(
    () => restore() ?? { phase: 'idle', data: INITIAL_DATA }
  )

  const start = useCallback(() => {
    const next: OnboardingState = { phase: 'email', data: INITIAL_DATA }
    persist(next)
    setState(next)
  }, [])

  const advance = useCallback((nextPhase: OnboardingPhase, patch?: Partial<OnboardingData>) => {
    setState(prev => {
      const next: OnboardingState = {
        phase: nextPhase,
        data: patch ? { ...prev.data, ...patch } : prev.data,
      }
      persist(next)
      return next
    })
  }, [])

  const back = useCallback(() => {
    setState(prev => {
      const step = prev.phase as OnboardingStep
      if (step === 'funding_crypto' || step === 'funding_fiat') {
        const next = { phase: 'funding' as OnboardingPhase, data: prev.data }
        persist(next)
        return next
      }
      const idx = STEP_SEQUENCE.indexOf(step)
      if (idx <= 0) {
        const next = { phase: 'idle' as OnboardingPhase, data: INITIAL_DATA }
        persist(next)
        return next
      }
      const next = { phase: STEP_SEQUENCE[idx - 1] as OnboardingPhase, data: prev.data }
      persist(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(COMPLETED_KEY)
    setState({ phase: 'idle', data: INITIAL_DATA })
  }, [])

  return {
    phase: state.phase,
    data: state.data,
    isActive: state.phase !== 'idle' && state.phase !== 'completed',
    isComplete: state.phase === 'completed',
    start,
    advance,
    back,
    reset,
  }
}
