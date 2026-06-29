import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, Check, ShieldCheck, FileText, Shield } from 'lucide-react'
import { Button } from '../../components/Button'
import type { OnboardingData } from '../../hooks/useOnboarding'
import type { OnboardingStep, CardTier } from '../../types/index'

interface OnboardingFlowProps {
  phase: string
  data: OnboardingData
  advance: (nextPhase: OnboardingStep | 'idle', patch?: Partial<OnboardingData>) => void
  back: () => void
}

const SLIDE = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -28 },
  transition: { type: 'spring' as const, damping: 28, stiffness: 320, mass: 0.8 },
}

const SLIDE_RIGHT = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit:    { x: '100%' },
  transition: { type: 'spring' as const, damping: 28, stiffness: 320, mass: 0.8 },
}

function flagEmoji(code: string): string {
  return [...code.toUpperCase()].map(
    c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('')
}

const STEP_ORDER = ['email', 'email_verification', 'identity_name', 'identity_dob', 'identity_address', 'passport', 'tos', 'funding', 'card_selection']
const TOTAL_STEPS = STEP_ORDER.length

function stepNumber(phase: string): number {
  const idx = STEP_ORDER.indexOf(phase)
  return idx >= 0 ? idx + 1 : 0
}

// ── Shared header: progress bar + back button ───────────────────

function OnbHeader({ phase, onBack }: { phase: string; onBack?: () => void }) {
  const step = stepNumber(phase)
  const pct = step > 0 ? (step / TOTAL_STEPS) * 100 : 100

  return (
    <div className="onb-header">
      <div className="onb-progress-track">
        <motion.div
          className="onb-progress-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="onb-nav-row">
        {onBack ? (
          <button className="onb-back-btn" onClick={onBack} aria-label="Go back">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
        {step > 0 && (
          <span className="onb-step-count">{step} of {TOTAL_STEPS}</span>
        )}
      </div>
    </div>
  )
}

// ── Step 1: Email ───────────────────────────────────────────────

function StepEmail({
  data,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onNext: (email: string) => void
  onBack: () => void
}) {
  const [email, setEmail] = useState(data.email)
  const canContinue = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="email" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Create your account</h2>
        <p className="onb-sub">Enter your email to get started.</p>
        <div className="onb-input-group">
          <input
            className="onb-input"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="onb-divider">Or</div>
        <button
          className="onb-social-btn"
          onClick={() => onNext('google@demo.com')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <button
          className="onb-social-btn"
          onClick={() => onNext('apple@demo.com')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
          </svg>
          Continue with Apple
        </button>
        <div className="onb-kyc-note">
          <strong>Identity verification required</strong> — as a regulated financial app, we are legally required to verify your identity. You will need a valid passport or government-issued ID.
        </div>
        <p className="onb-signin-link">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!canContinue}
          onClick={() => onNext(email)}
        >
          Continue with email
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step 2: Email verification ──────────────────────────────────

function StepEmailVerification({
  email,
  onNext,
  onBack,
}: {
  email: string
  onNext: () => void
  onBack: () => void
}) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(30)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])

  useEffect(() => {
    if (otp.length === 6) {
      const t = setTimeout(onNext, 400)
      return () => clearTimeout(t)
    }
  }, [otp, onNext])

  const displayEmail = email.length > 22 ? email.slice(0, 20) + '...' : email

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="email_verification" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Check your inbox</h2>
        <p className="onb-sub">We sent a 6-digit code to {displayEmail}</p>
        <div className="onb-otp-wrap" onClick={() => inputRef.current?.focus()}>
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="onb-otp-hidden"
            aria-label="6-digit verification code"
          />
          <div className="onb-otp-boxes">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={
                  'onb-otp-box' +
                  (otp.length === i ? ' onb-otp-box--active' : '') +
                  (otp[i] !== undefined ? ' onb-otp-box--filled' : '')
                }
              >
                {otp[i] ?? ''}
              </div>
            ))}
          </div>
        </div>
        {countdown > 0 ? (
          <p className="onb-otp-timer">
            Resend code in 0:{countdown.toString().padStart(2, '0')}
          </p>
        ) : (
          <button
            className="onb-otp-resend-btn"
            onClick={() => { setCountdown(30); setOtp('') }}
          >
            Resend code
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Step 3a: Name ───────────────────────────────────────────────

function StepName({
  data,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onNext: (patch: Partial<OnboardingData>) => void
  onBack: () => void
}) {
  const [firstName, setFirstName] = useState(data.firstName)
  const [lastName, setLastName] = useState(data.lastName)
  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="identity_name" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">{"What's your name?"}</h2>
        <p className="onb-sub">Enter your name exactly as it appears on your ID.</p>
        <div className="onb-input-group">
          <label className="onb-label">First name</label>
          <input
            className="onb-input"
            type="text"
            placeholder="Maria"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            autoComplete="given-name"
            autoFocus
          />
        </div>
        <div className="onb-input-group">
          <label className="onb-label">Last name</label>
          <input
            className="onb-input"
            type="text"
            placeholder="Garcia"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!canContinue}
          onClick={() => onNext({ firstName, lastName })}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step 3b: Date of birth ──────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

function StepDateOfBirth({
  data,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onNext: (patch: Partial<OnboardingData>) => void
  onBack: () => void
}) {
  const existing = data.dateOfBirth ? data.dateOfBirth.split('-') : []
  const [day,   setDay]   = useState(existing[2] ? String(parseInt(existing[2], 10)) : '')
  const [month, setMonth] = useState(existing[1] || '')
  const [year,  setYear]  = useState(existing[0] || '')

  const canContinue = day.trim().length > 0 && month !== '' && year.length === 4

  const handleContinue = () => {
    onNext({ dateOfBirth: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` })
  }

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="identity_dob" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Date of birth</h2>
        <p className="onb-sub">Required for identity verification. Must match your ID.</p>
        <div className="onb-input-group">
          <label className="onb-label">Date of birth</label>
          <div className="onb-dob-row">
            <div className="onb-dob-field onb-dob-field--day">
              <span className="onb-dob-sublabel">Day</span>
              <input
                className="onb-input onb-dob-num"
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="DD"
                value={day}
                autoFocus
                onChange={e => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
              />
            </div>
            <div className="onb-dob-field onb-dob-field--month">
              <span className="onb-dob-sublabel">Month</span>
              <select
                className="onb-input onb-select"
                value={month}
                onChange={e => setMonth(e.target.value)}
              >
                <option value="">Select</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>
            </div>
            <div className="onb-dob-field onb-dob-field--year">
              <span className="onb-dob-sublabel">Year</span>
              <input
                className="onb-input onb-dob-num"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="YYYY"
                value={year}
                onChange={e => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

// ── Country picker (used inside StepAddress) ────────────────────

function CountryPickerScreen({
  selected,
  onSelect,
  onBack,
}: {
  selected: string
  onSelect: (code: string) => void
  onBack: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = EU_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div className="onb-screen" {...SLIDE_RIGHT}>
      <div className="onb-picker-header">
        <button className="onb-back-btn" onClick={onBack} aria-label="Go back">
          <ChevronLeft size={20} />
        </button>
        <span className="onb-picker-title">Select country</span>
        <div style={{ width: 40 }} />
      </div>
      <div className="onb-picker-search-wrap">
        <input
          ref={inputRef}
          className="onb-picker-search"
          type="text"
          placeholder="Search countries..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="onb-picker-list">
        {filtered.map(c => (
          <button
            key={c.code}
            className={`onb-picker-row${c.code === selected ? ' onb-picker-row--selected' : ''}`}
            onClick={() => onSelect(c.code)}
          >
            <span className="onb-picker-row__flag">{flagEmoji(c.code)}</span>
            <span className="onb-picker-row__name">{c.name}</span>
            {c.code === selected && (
              <Check size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Step 3c: Address ────────────────────────────────────────────

const EU_COUNTRIES = [
  { code: 'AT', name: 'Austria' }, { code: 'BE', name: 'Belgium' },
  { code: 'HR', name: 'Croatia' }, { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' }, { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' }, { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' }, { code: 'SE', name: 'Sweden' },
]

function StepAddress({
  data,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onNext: (patch: Partial<OnboardingData>) => void
  onBack: () => void
}) {
  const [form, setForm] = useState({
    addressLine: data.addressLine || '',
    city:        data.city        || '',
    postalCode:  data.postalCode  || '',
    country:     data.country     || 'ES',
  })
  const [showPicker, setShowPicker] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const canContinue = form.addressLine.trim() && form.city.trim() && form.postalCode.trim()
  const selectedCountry = EU_COUNTRIES.find(c => c.code === form.country)

  return (
    <motion.div className="onb-screen" {...SLIDE} style={{ overflow: 'hidden' }}>
      <OnbHeader phase="identity_address" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Home address</h2>
        <p className="onb-sub">Enter your address exactly as it appears on your ID.</p>
        <div className="onb-input-group">
          <label className="onb-label">Street address</label>
          <input className="onb-input" type="text" placeholder="Calle Mayor 12, 3A" value={form.addressLine} onChange={set('addressLine')} autoComplete="street-address" />
        </div>
        <div className="onb-input-group">
          <label className="onb-label">City</label>
          <input className="onb-input" type="text" placeholder="Madrid" value={form.city} onChange={set('city')} autoComplete="address-level2" />
        </div>
        <div className="onb-input-group">
          <label className="onb-label">Postal code</label>
          <input className="onb-input" type="text" inputMode="numeric" placeholder="28001" value={form.postalCode} onChange={set('postalCode')} autoComplete="postal-code" />
        </div>
        <div className="onb-input-group">
          <label className="onb-label">Country</label>
          <button
            type="button"
            className="onb-country-btn"
            onClick={() => setShowPicker(true)}
          >
            <span className="onb-country-btn__flag">{flagEmoji(form.country)}</span>
            <span className="onb-country-btn__name">
              {selectedCountry?.name ?? 'Select country'}
            </span>
            <ChevronRight size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          </button>
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!canContinue}
          onClick={() => onNext(form)}
        >
          Continue
        </Button>
      </div>

      <AnimatePresence>
        {showPicker && (
          <CountryPickerScreen
            key="country-picker"
            selected={form.country}
            onSelect={code => {
              setForm(f => ({ ...f, country: code }))
              setShowPicker(false)
            }}
            onBack={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Step 5: KYC review ──────────────────────────────────────────

function StepKycReview({ onApproved, onRejected }: { onApproved: () => void; onRejected: () => void }) {
  const [status, setStatus] = useState<'reviewing' | 'approved'>('reviewing')

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('approved'), 3500)
    const t2 = setTimeout(onApproved, 4600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onApproved, onRejected])

  return (
    <motion.div
      className="onb-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="onb-processing">
        {status === 'reviewing' ? (
          <>
            <div className="onb-processing__spinner" />
            <div className="onb-processing__title">Verifying your identity</div>
            <div className="onb-processing__sub">
              Our partner is reviewing your document. This usually takes a few seconds.
              You can close the app and we will notify you when verification is complete.
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 260 }}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--color-success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Check size={26} color="white" />
            </motion.div>
            <div className="onb-processing__title">Identity verified</div>
            <div className="onb-processing__sub">Your documents have been approved.</div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Step 5b: KYC rejected ───────────────────────────────────────

function StepKycRejected({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <div className="onb-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '32px 24px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(220,38,38,0.1)',
          border: '1px solid rgba(220,38,38,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="onb-title" style={{ marginBottom: 10 }}>Verification unsuccessful</h2>
        <p className="onb-sub" style={{ marginBottom: 0 }}>
          We could not verify your identity with the document provided. Please try again with a clearer photo where all four corners are visible and there is no glare.
        </p>
      </div>
      <div className="onb-footer">
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={onRetry}>
          Try again
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step 4: Passport / KYC ──────────────────────────────────────

function StepPassport({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [uploaded, setUploaded] = useState(false)

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="passport" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Verify your identity</h2>
        <p className="onb-sub">We need a photo of your passport or ID to open your account.</p>
        <ul className="onb-doc-tips">
          <li className="onb-doc-tip">
            <Check size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <span>All text is readable</span>
          </li>
          <li className="onb-doc-tip">
            <Check size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <span>No glare or shadows on the document</span>
          </li>
          <li className="onb-doc-tip">
            <Check size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <span>All four corners are visible</span>
          </li>
        </ul>
        <div
          className={`onb-upload-zone${uploaded ? ' onb-upload-zone--done' : ''}`}
          onClick={() => setUploaded(true)}
          role="button"
          tabIndex={0}
        >
          {uploaded ? (
            <>
              <div className="onb-upload-check">
                <Check size={20} color="white" />
              </div>
              <div className="onb-upload-label">Document uploaded</div>
              <div className="onb-upload-hint">Tap to change</div>
            </>
          ) : (
            <>
              <div className="onb-upload-icon">
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 16l4-4 3 3 4-4 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="onb-upload-label">Take a photo or upload</div>
              <div className="onb-upload-hint">JPEG or PNG, max 10 MB</div>
            </>
          )}
        </div>
        <p className="onb-security-note">
          Your document is processed securely and never shared with third parties.
        </p>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!uploaded}
          onClick={onNext}
        >
          Submit for review
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step 4: Terms of Service ────────────────────────────────────

function StepTos({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="tos" onBack={onBack} />
      <div className="onb-body">
        <div className="onb-tos-hero">
          <div className="onb-tos-icon">
            <ShieldCheck size={28} color="var(--color-primary)" />
          </div>
          <h2 className="onb-tos-headline">Built to protect you</h2>
          <p className="onb-tos-summary">
            Your balance earns automatically and stays private. ShieldVault handles everything else.
          </p>
        </div>
        <div className="onb-tos-docs">
          <button className="onb-tos-doc-row">
            <div className="onb-tos-doc-icon">
              <FileText size={16} />
            </div>
            <span className="onb-tos-doc-label">Terms of Service</span>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </button>
          <div className="onb-tos-divider" />
          <button className="onb-tos-doc-row">
            <div className="onb-tos-doc-icon">
              <Shield size={16} />
            </div>
            <span className="onb-tos-doc-label">Privacy Policy</span>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </button>
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          onClick={onNext}
        >
          Accept and continue
        </Button>
        <p className="onb-tos-footnote">
          {'By tapping "Accept and continue" you agree to our Terms of Service and Privacy Policy.'}
        </p>
      </div>
    </motion.div>
  )
}

// ── Step 5: Funding ─────────────────────────────────────────────

function StepFunding({
  onCrypto,
  onFiat,
  onBack,
}: {
  onCrypto: () => void
  onFiat: () => void
  onBack: () => void
}) {
  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="funding" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Deposit to activate</h2>
        <p className="onb-sub">
          Your $50 goes straight to your balance. {"It's"} a deposit, not a fee.
          Once {"you're"} in, you choose how it grows.
        </p>

        {/* Yield teaser — invitation, not explanation */}
        <div className="onb-yield-teaser">
          <div className="onb-yield-teaser__icon">
            <TrendingUp size={16} />
          </div>
          <div className="onb-yield-teaser__body">
            <div className="onb-yield-teaser__line">
              Your balance can earn <strong>up to 6.2% APY</strong>
            </div>
            <div className="onb-yield-teaser__sub">
              You choose your provider once {"you're"} inside
            </div>
          </div>
        </div>

        <div className="onb-choices">
          <button className="onb-choice-card" onClick={onCrypto}>
            <div className="onb-choice-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 14.5c0 1.1.9 2 2 2h2a2 2 0 000-4h-2a2 2 0 010-4h2a2 2 0 012 2M12 7v1m0 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="onb-choice-body">
              <div className="onb-choice-title">Send crypto</div>
              <div className="onb-choice-sub">Deposit USDC or any other crypto</div>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="onb-choice-card" onClick={onFiat}>
            <div className="onb-choice-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="onb-choice-body">
              <div className="onb-choice-title">Bank transfer or card</div>
              <div className="onb-choice-sub">Bank transfer, debit card, or Apple Pay</div>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Step 5a: Funding — crypto stream ────────────────────────────

const DEMO_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

function StepFundingCrypto({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [copied, setCopied] = useState(false)
  const shortAddr = DEMO_ADDRESS.slice(0, 8) + '...' + DEMO_ADDRESS.slice(-6)

  const handleCopy = () => {
    navigator.clipboard?.writeText(DEMO_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="funding" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Send USDC to your account</h2>
        <p className="onb-sub">Transfer at least $50 worth of USDC to this address. Network fees are covered.</p>
        <div className="onb-address-box">
          <div className="onb-address-label">Your deposit address</div>
          <div className="onb-address-value">{shortAddr}</div>
          <button className="onb-address-copy" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
        <div className="onb-info-table">
          <div className="onb-info-row">
            <span>Supported assets</span>
            <span>USDC, ETH, BTC</span>
          </div>
          <div className="onb-info-row">
            <span>Minimum deposit</span>
            <span>$50</span>
          </div>
          <div className="onb-info-row">
            <span>Arrival time</span>
            <span>Under 1 minute</span>
          </div>
        </div>
      </div>
      <div className="onb-footer">
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={onNext}>
          {"I've sent the funds"}
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step 5b: Funding — fiat stream ──────────────────────────────

function StepFundingFiat({
  onNext,
  onBack,
}: {
  onNext: (method: 'bank_transfer' | 'credit_card') => void
  onBack: () => void
}) {
  const [method, setMethod] = useState<'bank_transfer' | 'credit_card' | null>(null)

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="funding" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Add funds</h2>
        <p className="onb-sub">Choose how you would like to make your first deposit of $50.</p>
        <div className="onb-choices">
          <button
            className={`onb-choice-card${method === 'bank_transfer' ? ' onb-choice-card--selected' : ''}`}
            onClick={() => setMethod('bank_transfer')}
          >
            <div className="onb-choice-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M3 21h18M5 21V10m14 11V10M3 10l9-7 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="onb-choice-body">
              <div className="onb-choice-title">Bank transfer</div>
              <div className="onb-choice-sub">Free, arrives in 1 to 3 business days</div>
            </div>
            {method === 'bank_transfer' && (
              <div className="onb-choice-check"><Check size={12} color="white" /></div>
            )}
          </button>
          <button
            className={`onb-choice-card${method === 'credit_card' ? ' onb-choice-card--selected' : ''}`}
            onClick={() => setMethod('credit_card')}
          >
            <div className="onb-choice-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 10h18M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="onb-choice-body">
              <div className="onb-choice-title">Credit or debit card</div>
              <div className="onb-choice-sub">Instant, small processing fee applies</div>
            </div>
            {method === 'credit_card' && (
              <div className="onb-choice-check"><Check size={12} color="white" /></div>
            )}
          </button>
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          disabled={!method}
          onClick={() => method && onNext(method)}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

// ── Step: Processing ────────────────────────────────────────────

function StepProcessing({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 5000)
    return () => clearTimeout(t)
  }, [onNext])

  return (
    <motion.div
      className="onb-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="onb-processing">
        <div className="onb-processing__spinner" />
        <div className="onb-processing__title">Checking your deposit</div>
        <div className="onb-processing__sub">
          This usually takes less than a minute. You can close the app and we will notify you when your funds arrive.
        </div>
      </div>
    </motion.div>
  )
}

// ── Step 6: Card selection ──────────────────────────────────────

const PLAN_PERKS: Record<CardTier, string[]> = {
  premier: [
    'Standard spending limits (up to $5,000/day)',
    'Apple Pay and Google Pay',
    'Contactless and chip payments worldwide',
    'No monthly fee, ever',
  ],
  premium: [
    'Higher spending limits (up to $20,000/day)',
    'Apple Pay and Google Pay',
    'Travel insurance included',
    'Airport lounge access',
    'Priority customer support',
    '$2 per month',
  ],
}

function StepCardSelection({
  onNext,
  onBack,
}: {
  onNext: (tier: CardTier) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<CardTier>('premier')

  return (
    <motion.div className="onb-screen" {...SLIDE}>
      <OnbHeader phase="card_selection" onBack={onBack} />
      <div className="onb-body">
        <h2 className="onb-title">Choose your card</h2>
        <p className="onb-sub">Your card is included with your account. Upgrade anytime.</p>
        <div className="onb-visa-hero">
          <div className={`onb-visa-card onb-visa-card--${selected}`}>
            <div className="onb-visa-card__top-row">
              <div className="onb-visa-card__chip" />
              <div className="onb-visa-card__wordmark">ShieldVault</div>
            </div>
            <div className="onb-visa-card__bottom">
              <span className="onb-visa-card__number">{"•••• •••• •••• 1234"}</span>
              <span className="onb-visa-card__brand">VISA</span>
            </div>
          </div>
        </div>
        <div className="onb-plan-tabs">
          <button
            className={`onb-plan-tab${selected === 'premier' ? ' onb-plan-tab--active' : ''}`}
            onClick={() => setSelected('premier')}
          >
            PREMIER
          </button>
          <button
            className={`onb-plan-tab${selected === 'premium' ? ' onb-plan-tab--active' : ''}`}
            onClick={() => setSelected('premium')}
          >
            PREMIUM
          </button>
        </div>
        <div className="onb-plan-details">
          <div className="onb-plan-price">
            {selected === 'premier' ? 'Free' : '$2 / month'}
          </div>
          <div className="onb-plan-price-sub">
            {selected === 'premier' ? 'No monthly fee, ever' : 'Billed monthly, cancel anytime'}
          </div>
          <ul className="onb-plan-perks">
            {PLAN_PERKS[selected].map((perk, i) => (
              <li key={i} className="onb-plan-perk">
                <Check size={15} style={{ flexShrink: 0, color: 'var(--color-success)' }} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="onb-footer">
        <Button
          variant="primary"
          size="lg"
          style={{ width: '100%' }}
          onClick={() => onNext(selected)}
        >
          {selected === 'premier' ? 'Confirm PREMIER' : 'Confirm PREMIUM'}
        </Button>
        {selected === 'premier' && (
          <button className="onb-plan-upgrade-hint" onClick={() => setSelected('premium')}>
            See what PREMIUM includes
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Step: Completing ("You're all set") ─────────────────────────

function StepCompleting({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="onb-screen"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 240 }}
    >
      <div className="onb-completed">
        <motion.div
          className="onb-completed__check"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.15 }}
        >
          <ShieldCheck size={34} color="white" />
        </motion.div>
        <h2 className="onb-completed__title">{"You're all set"}</h2>
        <p className="onb-completed__sub">
          Your account is active and your balance is ready to use.
        </p>
        <motion.div
          className="onb-completed__balance-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
        >
          <div className="onb-completed__balance-label">Available balance</div>
          <div className="onb-completed__balance-amount">$50.00</div>
          <div className="onb-completed__balance-yield">
            <TrendingUp size={13} style={{ flexShrink: 0 }} />
            <span>Earning 4.2% APY</span>
          </div>
        </motion.div>
      </div>
      <div className="onb-footer">
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={onDone}>
          Go to my account
        </Button>
      </div>
    </motion.div>
  )
}

// ── Orchestrator ────────────────────────────────────────────────

export function OnboardingFlow({ phase, data, advance, back }: OnboardingFlowProps) {
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {phase === 'email' && (
          <StepEmail
            key="email"
            data={data}
            onNext={email => advance('email_verification', { email })}
            onBack={back}
          />
        )}
        {phase === 'email_verification' && (
          <StepEmailVerification
            key="email_verification"
            email={data.email}
            onNext={() => advance('identity_name')}
            onBack={back}
          />
        )}
        {phase === 'identity_name' && (
          <StepName
            key="identity_name"
            data={data}
            onNext={patch => advance('identity_dob', patch)}
            onBack={back}
          />
        )}
        {phase === 'identity_dob' && (
          <StepDateOfBirth
            key="identity_dob"
            data={data}
            onNext={patch => advance('identity_address', patch)}
            onBack={back}
          />
        )}
        {phase === 'identity_address' && (
          <StepAddress
            key="identity_address"
            data={data}
            onNext={patch => advance('passport', patch)}
            onBack={back}
          />
        )}
        {phase === 'passport' && (
          <StepPassport
            key="passport"
            onNext={() => advance('kyc_review')}
            onBack={back}
          />
        )}
        {phase === 'kyc_review' && (
          <StepKycReview
            key="kyc_review"
            onApproved={() => advance('tos')}
            onRejected={() => advance('kyc_rejected')}
          />
        )}
        {phase === 'kyc_rejected' && (
          <StepKycRejected
            key="kyc_rejected"
            onRetry={back}
          />
        )}
        {phase === 'tos' && (
          <StepTos
            key="tos"
            onNext={() => advance('funding')}
            onBack={back}
          />
        )}
        {phase === 'funding' && (
          <StepFunding
            key="funding"
            onCrypto={() => advance('funding_crypto', { fundingStream: 'crypto' })}
            onFiat={() => advance('funding_fiat', { fundingStream: 'fiat' })}
            onBack={back}
          />
        )}
        {phase === 'funding_crypto' && (
          <StepFundingCrypto
            key="funding_crypto"
            onNext={() => advance('processing')}
            onBack={back}
          />
        )}
        {phase === 'funding_fiat' && (
          <StepFundingFiat
            key="funding_fiat"
            onNext={method => advance('processing', { fiatMethod: method })}
            onBack={back}
          />
        )}
        {phase === 'processing' && (
          <StepProcessing
            key="processing"
            onNext={() => advance('card_selection')}
          />
        )}
        {phase === 'card_selection' && (
          <StepCardSelection
            key="card_selection"
            onNext={tier => advance('completing', { cardTier: tier })}
            onBack={back}
          />
        )}
        {phase === 'completing' && (
          <StepCompleting
            key="completing"
            onDone={() => advance('completed')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
