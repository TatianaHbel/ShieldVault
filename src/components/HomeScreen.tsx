import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Download,
  Settings, Home, TrendingUp, CreditCard, User,
  Check, ChevronRight, RotateCcw,
} from 'lucide-react'
import { Button } from './Button'
import { PipboyMissionCard } from './PipboyMissionCard'

const YIELD_KEY = 'shieldvault_yield_provider'
type HomeTheme = 'standard' | 'pipboy'

const PROVIDERS = [
  { id: 'aave-usdc',         name: 'AAVE USD Coin',     apy: 4.2, tag: 'AAVE'   },
  { id: 'aave-usdc-v3',      name: 'AAVE USD Coin v3',  apy: 3.8, tag: 'AAVE'   },
  { id: 'morpho-usdc',       name: 'Morpho USDC',       apy: 5.1, tag: 'Morpho' },
  { id: 'morpho-usdc-prime', name: 'Morpho USDC Prime', apy: 4.7, tag: 'Morpho' },
  { id: 'morpho-usdc-boost', name: 'Morpho USDC Boost', apy: 6.2, tag: 'Morpho' },
]

const SHEET_SPRING = {
  type: 'spring' as const,
  damping: 28,
  stiffness: 320,
  mass: 0.8,
}

function YieldSetupSheet({
  onActivate,
  onClose,
}: {
  onActivate: (id: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <motion.div
      className="yield-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="yield-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={SHEET_SPRING}
        onClick={e => e.stopPropagation()}
      >
        <div className="yield-sheet__handle" />
        <div className="yield-sheet__head">
          <div className="yield-sheet__title">Choose a yield provider</div>
          <div className="yield-sheet__sub">
            Your balance earns automatically once you pick one.
          </div>
        </div>
        <div className="yield-sheet__list">
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`yield-prov-row${selected === p.id ? ' yield-prov-row--on' : ''}`}
              onClick={() => setSelected(p.id)}
            >
              <div className="yield-prov-row__tag">{p.tag}</div>
              <div className="yield-prov-row__name">{p.name}</div>
              <div className="yield-prov-row__apy">
                <span className="yield-prov-row__num">{p.apy}%</span>
                <span className="yield-prov-row__label">APY</span>
              </div>
              <div className={`yield-prov-row__check${selected === p.id ? ' yield-prov-row__check--on' : ''}`}>
                {selected === p.id && <Check size={11} color="white" />}
              </div>
            </button>
          ))}
        </div>
        <div className="yield-sheet__foot">
          <Button
            variant="primary"
            size="lg"
            style={{ width: '100%' }}
            disabled={!selected}
            onClick={() => selected && onActivate(selected)}
          >
            Start earning
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HomeScreen({
  theme = 'standard',
  onThemeChange,
  onReset,
}: {
  theme?: HomeTheme
  onThemeChange?: (theme: HomeTheme) => void
  onReset?: () => void
}) {
  const [activeTab, setActiveTab] = useState<'home' | 'earn' | 'cards' | 'account'>('home')
  const [yieldProvider, setYieldProvider] = useState<string | null>(
    () => localStorage.getItem(YIELD_KEY)
  )
  const [showYieldSetup, setShowYieldSetup] = useState(false)

  const activeProvider = PROVIDERS.find(p => p.id === yieldProvider) ?? null

  const handleActivate = (id: string) => {
    localStorage.setItem(YIELD_KEY, id)
    setYieldProvider(id)
    setShowYieldSetup(false)
  }

  return (
    <motion.div
      className={`hs-root screen--home${theme === 'pipboy' ? ' hs-root--pipboy' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="hs-header">
        <div className="hs-header__left">
          <button className="icon-btn" aria-label="Settings">
            <Settings size={20} />
          </button>
        </div>
        <div className="hs-header__title">
          {theme === 'pipboy' ? 'STAT' : 'ShieldVault'}
        </div>
        <div className="hs-header__right">
          <div className="hs-avatar">SV</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="hs-scroll">
        {theme === 'pipboy' && (
          <div className="hs-pipboy-status">
            <div className="hs-pipboy-status__row">
              <span>LVL 06</span>
              <span>HP 115/115</span>
              <span>AP 90/90</span>
            </div>
          </div>
        )}

        {/* Balance — flat, no card */}
        <div className="hs-balance-section">
          <div className="hs-balance-label">Available balance</div>
          <div className="hs-balance-amount">
            50.00
            <span className="hs-balance-unit">USDC</span>
          </div>
          {activeProvider && (
            <motion.div
              className="hs-apy-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <TrendingUp size={13} />
              <span>Earning {activeProvider.apy}% APY</span>
            </motion.div>
          )}
        </div>

        {/* Actions — pill buttons only */}
        <div className="hs-action-pills">
          <button className="hs-pill hs-pill--primary">
            <Send size={15} />
            Send
          </button>
          <button className="hs-pill hs-pill--ghost">
            <Download size={15} />
            Receive
          </button>
        </div>

        {theme === 'pipboy' && (
          <div className="hs-section">
            <div className="hs-pipboy-card-unlock">
              <PipboyMissionCard className="hs-pipboy-card-unlock__card" />
              <button
                className="hs-pipboy-switch"
                onClick={() => onThemeChange?.('standard')}
              >
                <RotateCcw size={14} />
                Standard mode
              </button>
            </div>
          </div>
        )}

        {/* Yield section */}
        <div className="hs-section">
          <AnimatePresence mode="wait">
            {activeProvider ? (
              <motion.div
                key="yield-active"
                className="hs-yield-active"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hs-yield-active__top">
                  <div>
                    <div className="hs-yield-active__tag">YIELD</div>
                    <div className="hs-yield-active__provider">{activeProvider.name}</div>
                  </div>
                  <div className="hs-yield-active__rate">
                    <span className="hs-yield-active__pct">{activeProvider.apy}%</span>
                    <span className="hs-yield-active__pct-label">APY</span>
                  </div>
                </div>
                <div className="hs-yield-active__rows">
                  <div className="hs-yield-active__row">
                    <span>Next yield payment</span>
                    <span>August 2026</span>
                  </div>
                  <div className="hs-yield-active__row">
                    <span>Projected monthly</span>
                    <span>+${((50 * activeProvider.apy / 100) / 12).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="yield-empty"
                className="hs-yield-empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hs-yield-empty__icon">
                  <TrendingUp size={22} />
                </div>
                <div className="hs-yield-empty__body">
                  <div className="hs-yield-empty__title">
                    Your balance is not earning yet
                  </div>
                  <div className="hs-yield-empty__sub">
                    Choose a provider and your 50 USDC starts growing automatically. Up to 6.2% APY.
                  </div>
                </div>
                <button
                  className="hs-yield-empty__cta"
                  onClick={() => setShowYieldSetup(true)}
                >
                  Set up yield
                  <ChevronRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent activity — flat, no card */}
        <div className="hs-section" style={{ paddingBottom: 8 }}>
          <div className="hs-section-header">
            <span className="hs-section-title">Recent activity</span>
          </div>
          <div className="hs-activity-flat">
            <div className="hs-activity-flat__msg">No transactions yet</div>
            <div className="hs-activity-flat__hint">Add money or send to get started.</div>
          </div>
        </div>

        {/* Demo reset */}
        {onReset && (
          <div style={{ padding: '8px 16px 0', textAlign: 'center' }}>
            <button className="hs-reset-btn" onClick={onReset}>
              Restart onboarding demo
            </button>
          </div>
        )}

      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <button
          className={`bottom-nav__tab${activeTab === 'home' ? ' bottom-nav__tab--active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={22} />
          Home
        </button>
        <button
          className={`bottom-nav__tab${activeTab === 'earn' ? ' bottom-nav__tab--active' : ''}`}
          onClick={() => setActiveTab('earn')}
        >
          <TrendingUp size={22} />
          Earn
        </button>
        <button
          className={`bottom-nav__tab${activeTab === 'cards' ? ' bottom-nav__tab--active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          <CreditCard size={22} />
          Cards
        </button>
        <button
          className={`bottom-nav__tab${activeTab === 'account' ? ' bottom-nav__tab--active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={22} />
          Account
        </button>
      </nav>

      {/* Yield setup sheet */}
      <AnimatePresence>
        {showYieldSetup && (
          <YieldSetupSheet
            key="yield-setup"
            onActivate={handleActivate}
            onClose={() => setShowYieldSetup(false)}
          />
        )}
      </AnimatePresence>

    </motion.div>
  )
}
