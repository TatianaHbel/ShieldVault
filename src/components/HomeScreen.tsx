import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ShieldOff, Send, Download, Settings, Home, TrendingUp, CreditCard, User } from 'lucide-react'

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'home' | 'earn' | 'cards' | 'account'>('home')

  return (
    <motion.div
      className="hs-root screen--home"
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
        <div className="hs-header__title">ShieldVault</div>
        <div className="hs-header__right">
          <div className="hs-avatar">SV</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="hs-scroll">
        {/* Balance card */}
        <div className="hs-balance-section">
          <div className="hs-balance-card">
            <div className="hs-balance-card__label">Available balance</div>
            <div className="hs-balance-card__amount">$50.00</div>
            <div className="hs-apy-badge">
              <TrendingUp size={13} />
              <span>Earning 4.2% APY</span>
            </div>
          </div>
        </div>

        {/* Action grid */}
        <div className="hs-actions">
          <div className="action-grid action-grid--quad">
            <button className="action-btn action-btn--framed">
              <div className="action-icon-lg action-icon-lg--primary">
                <ShieldCheck size={22} />
              </div>
              Shield
            </button>
            <button className="action-btn action-btn--framed">
              <div className="action-icon-lg action-icon-lg--muted">
                <ShieldOff size={22} />
              </div>
              Unshield
            </button>
            <button className="action-btn action-btn--framed">
              <div className="action-icon-lg action-icon-lg--muted">
                <Send size={22} />
              </div>
              Send
            </button>
            <button className="action-btn action-btn--framed">
              <div className="action-icon-lg action-icon-lg--muted">
                <Download size={22} />
              </div>
              Receive
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="hs-section">
          <div className="hs-section-header">
            <span className="hs-section-title">Recent activity</span>
          </div>
          <div className="hs-activity-empty">
            <div className="hs-activity-empty__icon">
              <TrendingUp size={28} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="hs-activity-empty__title">Your account is earning</div>
            <div className="hs-activity-empty__sub">
              Transactions will appear here. Add money or send to get started.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav with FAB */}
      <nav className="bottom-nav bottom-nav--fab">
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
        <div className="bottom-nav__fab-slot" />
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
        <button className="bottom-nav__fab" aria-label="Shield">
          <ShieldCheck size={26} color="white" />
          <span className="bottom-nav__fab-label">Shield</span>
        </button>
      </nav>
    </motion.div>
  )
}
