/* ── Onboarding ─────────────────────────────────────────── */

export type OnboardingStep =
  | 'email'
  | 'email_verification'
  | 'identity'
  | 'passport'
  | 'kyc_review'
  | 'kyc_rejected'
  | 'tos'
  | 'funding'
  | 'funding_crypto'
  | 'funding_fiat'
  | 'processing'
  | 'card_selection'
  | 'completing'
  | 'completed'

export type FundingStream = 'crypto' | 'fiat'
export type FiatMethod = 'bank_transfer' | 'credit_card'
export type CardTier = 'premier' | 'premium'

/* ── Payments ────────────────────────────────────────────── */

export type PaymentPhase =
  | 'idle'
  | 'submitting'    // processing user action, no wallet confirmation needed
  | 'processing'    // waiting for on-chain confirmation
  | 'completed'
  | 'failed'

export type PaymentType = 'deposit' | 'send' | 'withdraw'

export interface PaymentOperation {
  type: PaymentType
  phase: PaymentPhase
  amount: string
  currency: 'USDC'
  startedAt: number
}

/* ── Yield ───────────────────────────────────────────────── */

export type YieldVault =
  | 'aave_usdc'     // default — AAVE USD Coin
  | 'aave_usdc_v3'
  | 'morpho_usdc'
  | 'morpho_usdc_prime'
  | 'morpho_usdc_boost'

export interface YieldVaultInfo {
  id: YieldVault
  name: string
  provider: 'AAVE' | 'Morpho'
  apy: number
  isDefault?: boolean
}
