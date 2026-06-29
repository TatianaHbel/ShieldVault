import { useState, useCallback, useRef, useEffect } from 'react'
import type { PaymentPhase, PaymentType, PaymentOperation } from '../types/index'

const STORAGE_KEY = 'shieldvault_active_operation'

interface OperationState {
  phase: PaymentPhase
  type: PaymentType
  amount: string
  startedAt: number
}

const IDLE: OperationState = {
  phase: 'idle',
  type: 'deposit',
  amount: '',
  startedAt: 0,
}

function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms))
}

function persist(op: OperationState) {
  if (op.phase === 'idle') {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    const saved: PaymentOperation = {
      type: op.type,
      phase: op.phase,
      amount: op.amount,
      currency: 'USDC',
      startedAt: op.startedAt,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }
}

const RESTORABLE_PHASES = new Set<PaymentPhase>(['processing', 'completed', 'failed'])

function restore(): OperationState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as PaymentOperation
    if (!RESTORABLE_PHASES.has(saved.phase)) return null
    return {
      phase: saved.phase === 'processing' ? 'processing' : saved.phase,
      type: saved.type,
      amount: saved.amount,
      startedAt: saved.startedAt,
    }
  } catch {
    return null
  }
}

export function useOperation() {
  const [op, setOp] = useState<OperationState>(() => restore() ?? IDLE)
  const abortRef = useRef(false)

  const update = useCallback((patch: Partial<OperationState>) => {
    setOp(prev => {
      const next = { ...prev, ...patch }
      persist(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    abortRef.current = true
    setOp(IDLE)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // No wallet confirmation steps — submit goes straight to processing
  const startPayment = useCallback(async (type: PaymentType, amount: string) => {
    abortRef.current = false
    const base: OperationState = { phase: 'submitting', type, amount, startedAt: Date.now() }
    setOp(base)
    persist(base)

    await delay(800)
    if (abortRef.current) return
    update({ phase: 'processing' })

    await delay(4000)
    if (abortRef.current) return

    if (Math.random() < 0.1) {
      update({ phase: 'failed' })
      return
    }

    update({ phase: 'completed' })
  }, [update])

  useEffect(() => {
    return () => { abortRef.current = true }
  }, [])

  return {
    phase: op.phase,
    operationType: op.type,
    amount: op.amount,
    startedAt: op.startedAt,
    isActive: op.phase !== 'idle',
    startPayment,
    reset,
  }
}
