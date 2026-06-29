import { motion } from 'framer-motion'
import { MobileShell } from './components/MobileShell'
import { HomeScreen } from './components/HomeScreen'
import { Button } from './components/Button'
import { useOnboarding } from './hooks/useOnboarding'
import { OnboardingFlow } from './flows/onboarding/OnboardingFlow'
import './App.css'

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="landing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="landing-hero">
        <div className="landing-logo">ShieldVault</div>
        <div className="landing-tagline">
          Private payments with automatic yield on every dollar
        </div>
        <div className="landing-features">
          <div className="landing-feature">
            <div className="landing-feature-icon" style={{ background: '#EFF6FF' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" fill="#1A56DB" fillOpacity=".15" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>VISA card linked to your USDC account</span>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon" style={{ background: '#ECFDF5' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17 6 23 6 23 12" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>4.2% APY on your balance, automatically</span>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon" style={{ background: '#F5F3FF' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span>Amounts stay private by default</span>
          </div>
        </div>
      </div>
      <div className="landing-footer">
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={onStart}>
          Get started
        </Button>
        <p className="landing-signin-link">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const onboarding = useOnboarding()

  return (
    <MobileShell>
      <div className="app-layer">
        {onboarding.isComplete ? (
          <HomeScreen key="home" onReset={onboarding.reset} />
        ) : onboarding.isActive ? (
          <OnboardingFlow
            key="flow"
            phase={onboarding.phase}
            data={onboarding.data}
            advance={onboarding.advance}
            back={onboarding.back}
          />
        ) : (
          <LandingScreen key="landing" onStart={onboarding.start} />
        )}
      </div>
    </MobileShell>
  )
}
