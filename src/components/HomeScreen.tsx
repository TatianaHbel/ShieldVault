import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Download,
  Settings, Home, TrendingUp, CreditCard, User,
  ChevronRight, RotateCcw,
} from 'lucide-react'
import { EarnScreen, EARN_PROVIDERS } from './EarnScreen'
import { PipboyMissionCard } from './PipboyMissionCard'

const YIELD_KEY = 'shieldvault_yield_provider'
type HomeTheme = 'standard' | 'pipboy'

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

  const activeProvider = yieldProvider && yieldProvider !== 'none'
    ? EARN_PROVIDERS.find(p => p.id === yieldProvider) ?? null
    : null

  const handleProviderChange = (id: string) => {
    localStorage.setItem(YIELD_KEY, id)
    setYieldProvider(id)
  }

  return (
    <motion.div
      className={`hs-root screen--home${theme === 'pipboy' ? ' hs-root--pipboy' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {activeTab === 'earn' ? (
        <EarnScreen provider={yieldProvider} onProviderChange={handleProviderChange} />
      ) : (
        <>
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
                        <div className="hs-yield-active__tag">EARN</div>
                        <div className="hs-yield-active__provider">{activeProvider.name}</div>
                      </div>
                      <div className="hs-yield-active__rate">
                        <span className="hs-yield-active__pct">{activeProvider.apy}%</span>
                        <span className="hs-yield-active__pct-label">APY</span>
                      </div>
                    </div>
                    <div className="hs-yield-active__rows">
                      <div className="hs-yield-active__row">
                        <span>Next payment</span>
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
                      onClick={() => setActiveTab('earn')}
                    >
                      Start earning
                      <ChevronRight size={15} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hs-section" style={{ paddingBottom: 8 }}>
              <div className="hs-section-header">
                <span className="hs-section-title">Recent activity</span>
              </div>
              <div className="hs-activity-flat">
                <div className="hs-activity-flat__msg">No transactions yet</div>
                <div className="hs-activity-flat__hint">Add money or send to get started.</div>
              </div>
            </div>

            {onReset && (
              <div style={{ padding: '8px 16px 0', textAlign: 'center' }}>
                <button className="hs-reset-btn" onClick={onReset}>
                  Restart onboarding demo
                </button>
              </div>
            )}
          </div>
        </>
      )}

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
    </motion.div>
  )
}
