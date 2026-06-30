import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ChevronLeft, X, Check } from 'lucide-react'
import { Button } from './Button'

const BALANCE = 50
const ELAPSED_MONTHS = 12

export interface EarnProvider {
  id: string
  name: string
  apy: number
  tag: string | null
  tc: string[] | null
}

export const EARN_PROVIDERS: EarnProvider[] = [
  {
    id: 'none',
    name: 'No earning',
    apy: 0,
    tag: null,
    tc: null,
  },
  {
    id: 'aave-usdc',
    name: 'AAVE USD Coin',
    apy: 4.2,
    tag: 'AAVE',
    tc: [
      "By activating AAVE USD Coin, you agree that your balance will be automatically deposited into the AAVE V2 lending pool. Earnings are variable and depend on current market utilisation rates. Annual Percentage Yield (APY) is not guaranteed and may change at any time.",
      "Your deposit is subject to AAVE protocol risk, including the possibility of partial or total loss in the event of an exploit. ShieldVault does not guarantee principal protection.",
      "Earnings are distributed monthly to your account balance. You may switch or deactivate your earning provider at any time. Changes take effect at the next monthly settlement.",
    ],
  },
  {
    id: 'aave-usdc-v3',
    name: 'AAVE USD Coin v3',
    apy: 3.8,
    tag: 'AAVE',
    tc: [
      "By activating AAVE USD Coin v3, you agree that your balance will be deposited into the AAVE V3 lending pool on Ethereum mainnet. AAVE V3 introduces supply caps, isolation mode, and enhanced risk parameters compared to V2.",
      "APY is variable and determined by real-time supply and borrow dynamics. Historical rates do not guarantee future performance.",
      "ShieldVault facilitates deposits on your behalf. You bear the full risk of protocol-level events. Monthly earnings are credited automatically to your account balance.",
    ],
  },
  {
    id: 'morpho-usdc',
    name: 'Morpho USDC',
    apy: 5.1,
    tag: 'Morpho',
    tc: [
      "By activating Morpho USDC, your balance will be supplied to the Morpho Protocol optimiser, which allocates funds across AAVE and Compound to maximise earnings through peer-to-peer order matching.",
      "Morpho's peer-to-peer layer may increase your effective APY compared to base protocol rates. This product carries both Morpho Protocol risk and the risk of the underlying lending protocols.",
      "APY is variable and cannot be guaranteed. Earnings are credited monthly. You may change your provider at any time with effect from the next settlement date.",
    ],
  },
  {
    id: 'morpho-usdc-prime',
    name: 'Morpho USDC Prime',
    apy: 4.7,
    tag: 'Morpho',
    tc: [
      "Morpho USDC Prime allocates your balance exclusively to verified, institutional-grade borrowers via the Morpho Blue protocol. This curated vault applies stricter collateral standards to reduce liquidation risk.",
      "The Prime vault targets a balance between earnings and capital safety, accepting a lower APY in exchange for reduced tail risk. Allocation is managed by Morpho Labs and is subject to change.",
      "APY is variable and reflects curated market conditions. Your principal is not guaranteed. Earnings are distributed monthly. Provider changes take effect at the following monthly settlement date.",
    ],
  },
  {
    id: 'morpho-usdc-boost',
    name: 'Morpho USDC Boost',
    apy: 6.2,
    tag: 'Morpho',
    tc: [
      "Morpho USDC Boost targets the highest available APY by allocating funds to opportunistic lending markets within the Morpho Blue ecosystem. This vault accepts higher market risk in exchange for elevated returns.",
      "Allocation includes emerging collateral markets with higher utilisation rates. This increases earnings potential but also increases the likelihood of variable returns and, in extreme scenarios, delayed withdrawals during market stress.",
      "This product is best suited for users who understand lending protocol risk and prioritise earnings over capital stability. APY is variable and not guaranteed. Earnings are credited monthly.",
    ],
  },
]

function calcEarned(apy: number): number {
  return (BALANCE * apy) / 100 / 12 * ELAPSED_MONTHS
}

function fmt(n: number): string {
  return n.toFixed(2)
}

// ── T&C Modal ──────────────────────────────────────────────

function TcModal({
  provider,
  onClose,
}: {
  provider: EarnProvider
  onClose: () => void
}) {
  return (
    <motion.div
      className="earn-tc-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="earn-tc-modal"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <div className="earn-tc-modal__head">
          <div>
            <div className="earn-tc-modal__label">Terms of Service</div>
            <div className="earn-tc-modal__name">{provider.name}</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="earn-tc-modal__body">
          {provider.tc!.map((para, i) => (
            <p key={i} className="earn-tc-modal__para">{para}</p>
          ))}
        </div>
        <div className="earn-tc-modal__foot">
          <Button variant="secondary" size="md" style={{ width: '100%' }} onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Provider row ───────────────────────────────────────────

function ProvRow({
  p,
  selected,
  onSelect,
  onTerms,
}: {
  p: EarnProvider
  selected: boolean
  onSelect: () => void
  onTerms: (() => void) | null
}) {
  return (
    <div
      className={`earn-prov-row${selected ? ' earn-prov-row--on' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
    >
      <div className={`earn-prov-radio${selected ? ' earn-prov-radio--on' : ''}`}>
        {selected && <Check size={10} strokeWidth={3} color="var(--color-on-primary)" />}
      </div>
      <div className="earn-prov-row__body">
        <div className="earn-prov-row__name">{p.name}</div>
        <div className="earn-prov-row__sub">
          {p.apy > 0 ? `${p.apy}% APY` : 'No automatic earnings'}
        </div>
      </div>
      {onTerms && (
        <button
          className="earn-prov-row__terms"
          onClick={e => { e.stopPropagation(); onTerms() }}
        >
          Terms
        </button>
      )}
    </div>
  )
}

// ── Provider select view ───────────────────────────────────

function ProviderSelectView({
  currentId,
  onBack,
  onConfirm,
}: {
  currentId: string
  onBack: () => void
  onConfirm: (id: string) => void
}) {
  const [selection, setSelection] = useState(currentId)
  const [tcOpen, setTcOpen] = useState<EarnProvider | null>(null)

  const noneProvider = EARN_PROVIDERS[0]
  const aave = EARN_PROVIDERS.filter(p => p.tag === 'AAVE')
  const morpho = EARN_PROVIDERS.filter(p => p.tag === 'Morpho')

  return (
    <motion.div
      className="earn-select"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="earn-select__header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <div className="earn-select__title">Choose a provider</div>
        <div style={{ width: 36 }} />
      </div>

      <div className="earn-select__body">
        <ProvRow
          p={noneProvider}
          selected={selection === 'none'}
          onSelect={() => setSelection('none')}
          onTerms={null}
        />

        <div className="earn-select__divider">AAVE</div>
        {aave.map(p => (
          <ProvRow
            key={p.id}
            p={p}
            selected={selection === p.id}
            onSelect={() => setSelection(p.id)}
            onTerms={() => setTcOpen(p)}
          />
        ))}

        <div className="earn-select__divider">Morpho</div>
        {morpho.map(p => (
          <ProvRow
            key={p.id}
            p={p}
            selected={selection === p.id}
            onSelect={() => setSelection(p.id)}
            onTerms={() => setTcOpen(p)}
          />
        ))}
      </div>

      <div className="earn-select__foot">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          onClick={() => onConfirm(selection)}
        >
          {selection === 'none' ? 'Confirm' : 'Start earning'}
        </Button>
      </div>

      <AnimatePresence>
        {tcOpen && (
          <TcModal key={tcOpen.id} provider={tcOpen} onClose={() => setTcOpen(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── EarnScreen ─────────────────────────────────────────────

export function EarnScreen({
  provider,
  onProviderChange,
}: {
  provider: string | null
  onProviderChange: (id: string) => void
}) {
  const [showSelect, setShowSelect] = useState(false)

  const activeProvider = provider && provider !== 'none'
    ? EARN_PROVIDERS.find(p => p.id === provider) ?? null
    : null

  const earned = activeProvider ? calcEarned(activeProvider.apy) : 0
  const currentBalance = BALANCE + earned

  const handleConfirm = (id: string) => {
    onProviderChange(id)
    setShowSelect(false)
  }

  return (
    <div className="earn-screen">
      <div className="earn-overview">
        <div className="earn-header">
          <div className="earn-header__title">Earn</div>
          {activeProvider && (
            <button
              className="earn-header__manage"
              onClick={() => setShowSelect(true)}
            >
              Manage
            </button>
          )}
        </div>

        <div className="earn-body">
          <AnimatePresence mode="wait">
            {activeProvider ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="earn-hero">
                  <div className="earn-hero__label">Total earned</div>
                  <div className="earn-hero__amount">+${fmt(earned)}</div>
                  <div className="earn-hero__sub">
                    Your $50.00 is now ${fmt(currentBalance)}
                  </div>
                  <div className="earn-hero__rate">
                    <TrendingUp size={13} />
                    <span>{activeProvider.apy}% APY</span>
                  </div>
                </div>

                <div className="earn-stats">
                  <div className="earn-stats__row">
                    <span>Next payment</span>
                    <span>August 2026</span>
                  </div>
                  <div className="earn-stats__row">
                    <span>This month</span>
                    <span>+${fmt(BALANCE * activeProvider.apy / 100 / 12)}</span>
                  </div>
                  <div className="earn-stats__row earn-stats__row--provider">
                    <span>Earning with</span>
                    <span className="earn-stats__provider-val">
                      {activeProvider.name}
                      <button
                        className="earn-stats__change"
                        onClick={() => setShowSelect(true)}
                      >
                        Change
                      </button>
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pitch"
                className="earn-pitch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="earn-pitch__icon">
                  <TrendingUp size={28} />
                </div>
                <div className="earn-pitch__amount">$0.00</div>
                <div className="earn-pitch__amount-label">Total earned</div>
                <div className="earn-pitch__title">Your money, working for you</div>
                <div className="earn-pitch__sub">
                  Activate earning and your balance grows automatically. Up to 6.2% APY with no extra steps.
                </div>
                <div className="earn-pitch__example">
                  <div className="earn-pitch__example-row">
                    <span>Your balance today</span>
                    <span>$50.00</span>
                  </div>
                  <div className="earn-pitch__example-row earn-pitch__example-row--highlight">
                    <span>After one year at 4.2%</span>
                    <span>$52.10</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ width: '100%', marginTop: 'var(--space-6)' }}
                  onClick={() => setShowSelect(true)}
                >
                  Start earning
                </Button>
                {provider === 'none' && (
                  <p className="earn-pitch__note">
                    You have chosen not to earn. You can activate at any time.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showSelect && (
          <ProviderSelectView
            key="select"
            currentId={provider ?? 'none'}
            onBack={() => setShowSelect(false)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
