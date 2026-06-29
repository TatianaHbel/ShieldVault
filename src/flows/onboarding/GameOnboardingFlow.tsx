import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Vault door SVG ──────────────────────────────────────────────

function VaultDoor({ size = 88, color = '#E8C93A', spin = true }: { size?: number; color?: string; spin?: boolean }) {
  const c   = size / 2
  const r1  = size * 0.44
  const r2  = size * 0.27
  const N   = 8
  const T   = 24

  const spokes = Array.from({ length: N }, (_, i) => {
    const a = (i * Math.PI * 2) / N
    return { x1: c + Math.cos(a) * r2, y1: c + Math.sin(a) * r2, x2: c + Math.cos(a) * r1, y2: c + Math.sin(a) * r1 }
  })
  const ticks = Array.from({ length: T }, (_, i) => {
    const a   = (i * Math.PI * 2) / T
    const maj = i % 3 === 0
    const ri  = r1 - (maj ? 6 : 3)
    return { x1: c + Math.cos(a) * r1, y1: c + Math.sin(a) * r1, x2: c + Math.cos(a) * ri, y2: c + Math.sin(a) * ri, maj }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g style={{ transformOrigin: `${c}px ${c}px`, animation: spin ? 'gm-vault-spin 28s linear infinite' : 'none' }}>
        <circle cx={c} cy={c} r={r1} fill="none" stroke={color} strokeWidth={1.5} />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={color} strokeWidth={t.maj ? 1.4 : 0.7} opacity={t.maj ? 0.85 : 0.35} />
        ))}
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth={1.5} />
        ))}
      </g>
      <circle cx={c} cy={c} r={r2} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={c} cy={c} r={size * 0.065} fill={color} opacity={0.7} />
      <circle cx={c} cy={c} r={size * 0.03} fill={color} />
    </svg>
  )
}

// ── Typewriter ──────────────────────────────────────────────────

function useTypewriter(text: string, speed = 32, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let iv: ReturnType<typeof setInterval>
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, speed)
    }, delay)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [text, speed, delay])
  return { displayed, done }
}

// ── Shared header ───────────────────────────────────────────────

function GmHeader({ step, title, sub }: { step: number; title: string; sub?: string }) {
  const TOTAL = 7
  return (
    <div className="gm-vault-header">
      <div className="gm-vault-header__brand">VAULT-SHIELD CITIZENS BUREAU</div>
      <div className="gm-vault-header__step">
        {'STEP '}{String(step).padStart(2, '0')}{' / '}{String(TOTAL).padStart(2, '0')}
      </div>
      <div className="gm-progress-blocks">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className={`gm-pb${i < step ? ' gm-pb--on' : ''}`} />
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="gm-vault-header__title">{title}</div>
        {sub && <div className="gm-vault-header__sub">{sub}</div>}
      </div>
    </div>
  )
}

// ── SLIDE variants ──────────────────────────────────────────────

const SLIDE_IN  = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
const FADE      = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }

// ═══════════════════════════════════════════════════════════════
// Screen 1 — TRANSMISSION RECEIVED
// ═══════════════════════════════════════════════════════════════

function GmS1Signal({ onNext }: { onNext: () => void }) {
  const { displayed: h, done: hDone } = useTypewriter('TRANSMISSION RECEIVED', 55, 250)
  const { displayed: s, done: sDone } = useTypewriter('INCOMING SIGNAL FROM VAULT-SHIELD CENTRAL COMMAND. NEW CITIZEN REGISTRATION PROTOCOL INITIATED.', 20, 1500)
  const [showBtn, setShowBtn] = useState(false)

  useEffect(() => {
    if (!sDone) return
    const t = setTimeout(() => setShowBtn(true), 700)
    return () => clearTimeout(t)
  }, [sDone])

  return (
    <motion.div className="gm-screen gm-crt" {...FADE}>
      <div className="gm-s1-top">
        <div className="gm-s1-brand">VAULT-SHIELD CITIZENS BUREAU</div>
      </div>

      <div className="gm-s1-body">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', damping: 12, stiffness: 160 }}
        >
          <VaultDoor size={92} />
        </motion.div>

        <div className="gm-s1-headline gm-glitch">
          {h}{!hDone && <span className="gm-cursor" />}
        </div>
        <div className="gm-s1-sub">
          {s}{hDone && !sDone && <span className="gm-cursor" />}
        </div>
        {sDone && (
          <motion.div className="gm-s1-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            AWAITING RESPONSE...
          </motion.div>
        )}
      </div>

      <div className="gm-footer">
        {showBtn ? (
          <motion.button className="gm-btn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onClick={onNext}>
            {'[ BEGIN CITIZEN REGISTRATION ]'}
          </motion.button>
        ) : <div style={{ height: 52 }} />}
      </div>
      <div className="gm-coords">VS-NET // COORD 40.4168N 3.7038W // PROTOCOL V1.0</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 2 — COMM CHANNEL (email)
// ═══════════════════════════════════════════════════════════════

function GmS2Email({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail]     = useState('')
  const [focused, setFocused] = useState(false)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={1} title="COMM CHANNEL REGISTRATION" sub="ENTER YOUR COMM CHANNEL ID TO ESTABLISH A SECURE LINK" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-field">
          <div className="gm-field-label">COMM CHANNEL ID</div>
          <div className={`gm-field-row${focused ? ' gm-field-row--focused' : ''}`}>
            <span className="gm-field-prompt">{'>'}</span>
            <input
              className="gm-field-input"
              type="email"
              inputMode="email"
              placeholder="citizen@vault-shield.net"
              value={email}
              autoFocus
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {valid && <span className="gm-field-ok">OK</span>}
          </div>
        </div>

        <div className="gm-divider">OR</div>

        <button className="gm-social-btn" onClick={() => onNext('google@demo.com')}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          SYNC VIA GOOGLE NETWORK
        </button>
        <button className="gm-social-btn" onClick={() => onNext('apple@demo.com')}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
          </svg>
          SYNC VIA APPLE NET
        </button>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" disabled={!valid} onClick={() => onNext(email)}>
          {'[ TRANSMIT COMM CHANNEL ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 01 // COMM CHANNEL SETUP</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 3 — SIGNAL LOCK (OTP)
// ═══════════════════════════════════════════════════════════════

function GmS3Otp({ email, onNext }: { email: string; onNext: () => void }) {
  const [otp, setOtp]       = useState('')
  const [countdown, setC]   = useState(30)
  const inputRef             = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setC(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])
  useEffect(() => {
    if (otp.length === 6) { const t = setTimeout(onNext, 500); return () => clearTimeout(t) }
  }, [otp, onNext])

  const display = email.length > 24 ? email.slice(0, 22) + '...' : email

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={1} title="SIGNAL LOCK VERIFICATION" sub={`6-DIGIT CODE TRANSMITTED TO ${display}`} />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="gm-otp-wrap">
          <input ref={inputRef} type="tel" inputMode="numeric" maxLength={6} value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="gm-otp-hidden" aria-label="6-digit code" />
          <div className="gm-otp-boxes" onClick={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`gm-otp-box${otp.length === i ? ' gm-otp-box--active' : ''}${otp[i] !== undefined ? ' gm-otp-box--filled' : ''}`}>
                {otp[i] ?? ''}
              </div>
            ))}
          </div>
          {countdown > 0
            ? <div className="gm-otp-timer">RESEND IN 0:{String(countdown).padStart(2, '0')}</div>
            : <button className="gm-otp-resend" onClick={() => { setC(30); setOtp('') }}>RESEND TRANSMISSION</button>
          }
        </div>
      </div>
      <div className="gm-coords">VS-NET // STEP 01 // SIGNAL LOCK</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 4 — CITIZEN IDENTITY (name + DOB)
// ═══════════════════════════════════════════════════════════════

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function GmS4Identity({ onNext }: { onNext: (p: { firstName: string; lastName: string; dob: string }) => void }) {
  const [first,  setFirst]  = useState('')
  const [last,   setLast]   = useState('')
  const [day,    setDay]    = useState('')
  const [month,  setMonth]  = useState('')
  const [year,   setYear]   = useState('')
  const [focus,  setFocus]  = useState<string | null>(null)
  const canContinue = first.trim() && last.trim() && day.trim() && month && year.length === 4

  const field = (name: string) => ({
    onFocus: () => setFocus(name),
    onBlur:  () => setFocus(null),
  })

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={2} title="CITIZEN IDENTITY PROTOCOL" sub="CREDENTIALS MUST MATCH YOUR IDENTIFICATION DOCUMENT" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-field">
          <div className="gm-field-label">AGENT DESIGNATION</div>
          <div className={`gm-field-row${focus === 'first' ? ' gm-field-row--focused' : ''}`}>
            <span className="gm-field-prompt">{'>'}</span>
            <input className="gm-field-input" type="text" placeholder="FIRST NAME" value={first} autoFocus autoComplete="given-name" onChange={e => setFirst(e.target.value)} {...field('first')} />
            {first.trim() && <span className="gm-field-ok">OK</span>}
          </div>
        </div>

        <div className="gm-field">
          <div className="gm-field-label">FAMILY DESIGNATION</div>
          <div className={`gm-field-row${focus === 'last' ? ' gm-field-row--focused' : ''}`}>
            <span className="gm-field-prompt">{'>'}</span>
            <input className="gm-field-input" type="text" placeholder="LAST NAME" value={last} autoComplete="family-name" onChange={e => setLast(e.target.value)} {...field('last')} />
            {last.trim() && <span className="gm-field-ok">OK</span>}
          </div>
        </div>

        <div className="gm-field">
          <div className="gm-field-label">DATE OF BIRTH RECORD</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className={`gm-field-row${focus === 'day' ? ' gm-field-row--focused' : ''}`} style={{ flex: '0 0 64px' }}>
              <input className="gm-field-input" style={{ width: '100%' }} type="text" inputMode="numeric" maxLength={2} placeholder="DD" value={day} onChange={e => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))} {...field('day')} />
            </div>
            <div className={`gm-field-row${focus === 'month' ? ' gm-field-row--focused' : ''}`} style={{ flex: 1 }}>
              <select className="gm-field-select" value={month} onChange={e => setMonth(e.target.value)} {...field('month')}>
                <option value="">MONTH</option>
                {MONTHS.map((m, i) => <option key={m} value={String(i + 1).padStart(2, '0')}>{m.toUpperCase()}</option>)}
              </select>
            </div>
            <div className={`gm-field-row${focus === 'year' ? ' gm-field-row--focused' : ''}`} style={{ flex: '0 0 80px' }}>
              <input className="gm-field-input" style={{ width: '100%' }} type="text" inputMode="numeric" maxLength={4} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))} {...field('year')} />
            </div>
          </div>
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" disabled={!canContinue} onClick={() => onNext({ firstName: first, lastName: last, dob: `${year}-${month}-${day.padStart(2, '0')}` })}>
          {'[ CONFIRM IDENTITY ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 02 // IDENTITY PROTOCOL</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 5 — SETTLEMENT COORDINATES (address)
// ═══════════════════════════════════════════════════════════════

const EU_COUNTRIES = [
  ['AT','Austria'],['BE','Belgium'],['HR','Croatia'],['CY','Cyprus'],['CZ','Czech Republic'],
  ['DK','Denmark'],['EE','Estonia'],['FI','Finland'],['FR','France'],['DE','Germany'],
  ['GR','Greece'],['HU','Hungary'],['IE','Ireland'],['IT','Italy'],['LV','Latvia'],
  ['LT','Lithuania'],['LU','Luxembourg'],['MT','Malta'],['NL','Netherlands'],['PL','Poland'],
  ['PT','Portugal'],['RO','Romania'],['SK','Slovakia'],['SI','Slovenia'],['ES','Spain'],['SE','Sweden'],
]

function GmS5Address({ onNext }: { onNext: (p: { street: string; city: string; postal: string; country: string }) => void }) {
  const [form, setForm] = useState({ street: '', city: '', postal: '', country: 'ES' })
  const [focus, setFocus] = useState<string | null>(null)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const canContinue = form.street.trim() && form.city.trim() && form.postal.trim()

  const field = (name: string) => ({
    onFocus: () => setFocus(name),
    onBlur:  () => setFocus(null),
  })

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={3} title="SETTLEMENT COORDINATES" sub="YOUR RESIDENTIAL LOCATION RECORD" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-field">
          <div className="gm-field-label">STREET ADDRESS</div>
          <div className={`gm-field-row${focus === 'street' ? ' gm-field-row--focused' : ''}`}>
            <span className="gm-field-prompt">{'>'}</span>
            <input className="gm-field-input" type="text" placeholder="STREET AND NUMBER" value={form.street} autoFocus autoComplete="street-address" onChange={set('street')} {...field('street')} />
            {form.street.trim() && <span className="gm-field-ok">OK</span>}
          </div>
        </div>

        <div className="gm-field">
          <div className="gm-field-label">SETTLEMENT</div>
          <div className={`gm-field-row${focus === 'city' ? ' gm-field-row--focused' : ''}`}>
            <span className="gm-field-prompt">{'>'}</span>
            <input className="gm-field-input" type="text" placeholder="CITY" value={form.city} autoComplete="address-level2" onChange={set('city')} {...field('city')} />
            {form.city.trim() && <span className="gm-field-ok">OK</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="gm-field" style={{ flex: 1 }}>
            <div className="gm-field-label">POSTAL CODE</div>
            <div className={`gm-field-row${focus === 'postal' ? ' gm-field-row--focused' : ''}`}>
              <span className="gm-field-prompt">{'>'}</span>
              <input className="gm-field-input" type="text" inputMode="numeric" placeholder="00000" value={form.postal} autoComplete="postal-code" onChange={set('postal')} {...field('postal')} />
            </div>
          </div>
          <div className="gm-field" style={{ flex: 1 }}>
            <div className="gm-field-label">TERRITORY</div>
            <div className={`gm-field-row${focus === 'country' ? ' gm-field-row--focused' : ''}`}>
              <select className="gm-field-select" value={form.country} onChange={set('country')} {...field('country')}>
                {EU_COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" disabled={!canContinue} onClick={() => onNext(form)}>
          {'[ CONFIRM COORDINATES ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 03 // LOCATION RECORD</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 6 — BIOMETRIC CLEARANCE (auto-scan)
// ═══════════════════════════════════════════════════════════════

const SCANS = ['FACIAL RECOGNITION', 'RETINAL SCAN', 'FINGERPRINT ANALYSIS'] as const

function GmS6Biometric({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState([0, 0, 0])
  const [cleared, setCleared]   = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    SCANS.forEach((_, idx) => {
      const startDelay = idx * 1600 + 400
      timers.push(setTimeout(() => {
        let v = 0
        const iv = setInterval(() => {
          v += 3
          setProgress(p => { const n = [...p]; n[idx] = Math.min(v, 100); return n })
          if (v >= 100) clearInterval(iv)
        }, 22)
      }, startDelay))
    })
    timers.push(setTimeout(() => setCleared(true), 5600))
    timers.push(setTimeout(onNext, 6800))
    return () => timers.forEach(clearTimeout)
  }, [onNext])

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={4} title="BIOMETRIC CLEARANCE" sub="VAULT-SHIELD SCANNING YOUR BIOMETRIC PROFILE" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-bio-body">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', damping: 12, stiffness: 160 }}>
          <VaultDoor size={72} color={cleared ? '#22C55E' : '#E8C93A'} spin={!cleared} />
        </motion.div>

        <div className="gm-scan-rows" style={{ width: '100%', maxWidth: 280 }}>
          {SCANS.map((label, idx) => {
            const pct  = progress[idx]
            const done = pct >= 100
            return (
              <div key={label} className="gm-scan-row">
                <div className="gm-scan-row-header">
                  <span className="gm-scan-row-label">{label}</span>
                  <span className={`gm-scan-row-status${done ? ' gm-scan-row-status--done' : ' gm-scan-row-status--scanning'}`}>
                    {done ? 'COMPLETE' : pct > 0 ? `${pct}%` : 'STANDBY'}
                  </span>
                </div>
                <div className="gm-scan-bar-track">
                  <div className={`gm-scan-bar-fill${done ? ' gm-scan-bar-fill--green' : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {cleared && (
            <motion.div className="gm-bio-clearance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="gm-bio-badge">VAULT-SHIELD CLEARANCE GRANTED</div>
              <div className="gm-bio-sub">BIOMETRIC PROFILE REGISTERED</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="gm-coords">VS-NET // STEP 04 // BIOMETRIC CLEARANCE</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 7 — OVERSEER AGREEMENT (TOS)
// ═══════════════════════════════════════════════════════════════

function GmS7Tos({ onNext }: { onNext: () => void }) {
  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={5} title="OVERSEER AGREEMENT" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <VaultDoor size={52} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2, color: 'var(--color-muted)', lineHeight: 1.8, maxWidth: 280, margin: '0 auto' }}>
            THE OVERSEER HAS REVIEWED YOUR APPLICATION. YOUR VAULT-SHIELD BALANCE IS PROTECTED UNDER FULL ENCRYPTION. AUTO-YIELD OPERATES IN THE BACKGROUND.
          </div>
        </div>

        <div className="gm-tos-links">
          <button className="gm-tos-link-row">
            <span>CITIZEN AGREEMENT</span>
            <span className="gm-tos-arrow">{'>'}</span>
          </button>
          <button className="gm-tos-link-row">
            <span>PRIVACY PROTOCOLS</span>
            <span className="gm-tos-arrow">{'>'}</span>
          </button>
        </div>

        <div className="gm-tos-footnote">
          BY ACCEPTING YOU AGREE TO THE VAULT-SHIELD CITIZEN AGREEMENT AND PRIVACY PROTOCOLS.
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" onClick={onNext}>
          {'[ ACCEPT OVERSEER TERMS ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 05 // OVERSEER AGREEMENT</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 8 — VAULT CREDIT ALLOCATION (funding)
// ═══════════════════════════════════════════════════════════════

function GmS8Funding({ onCrypto, onFiat }: { onCrypto: () => void; onFiat: () => void }) {
  const [selected, setSelected] = useState<'crypto' | 'fiat' | null>(null)

  const confirm = () => {
    if (selected === 'crypto') onCrypto()
    else if (selected === 'fiat') onFiat()
  }

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={6} title="VAULT CREDIT ALLOCATION" sub="MINIMUM ALLOCATION: $50.00 USD" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-box">
          <div className="gm-box-title">AUTO-YIELD PROTOCOL</div>
          <div className="gm-box-row"><span>YIELD RATE</span><span className="green">4.2% APY</span></div>
          <div className="gm-box-row"><span>PROVIDER</span><span>AAVE PROTOCOL</span></div>
          <div className="gm-box-row"><span>LOCK PERIOD</span><span>NONE</span></div>
          <div className="gm-box-row"><span>ACTIVATION</span><span>INSTANT</span></div>
        </div>

        <div className="gm-choice">
          <button className={`gm-choice-card${selected === 'crypto' ? ' gm-choice-card--active' : ''}`} onClick={() => setSelected('crypto')}>
            <div className={`gm-choice-indicator${selected === 'crypto' ? ' gm-choice-indicator--filled' : ''}`}>
              {selected === 'crypto' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">CRYPTO TRANSFER</div>
              <div className="gm-choice-sub">USDC, ETH, BTC ACCEPTED</div>
            </div>
            <div className="gm-choice-badge">FAST</div>
          </button>
          <button className={`gm-choice-card${selected === 'fiat' ? ' gm-choice-card--active' : ''}`} onClick={() => setSelected('fiat')}>
            <div className={`gm-choice-indicator${selected === 'fiat' ? ' gm-choice-indicator--filled' : ''}`}>
              {selected === 'fiat' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">FIAT ONRAMP</div>
              <div className="gm-choice-sub">BANK TRANSFER OR CREDIT CARD</div>
            </div>
            <div className="gm-choice-badge">EASY</div>
          </button>
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" disabled={!selected} onClick={confirm}>
          {'[ PROCEED TO ALLOCATION ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 06 // VAULT CREDIT</div>
    </motion.div>
  )
}

// ── Screen 8a: Crypto sub-screen ────────────────────────────────

const DEMO_ADDR = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

function GmS8Crypto({ onNext }: { onNext: () => void }) {
  const [copied, setCopied] = useState(false)
  const short = DEMO_ADDR.slice(0, 10) + '...' + DEMO_ADDR.slice(-8)

  const handleCopy = () => {
    navigator.clipboard?.writeText(DEMO_ADDR).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={6} title="CRYPTO TRANSFER PROTOCOL" sub="SEND FUNDS TO YOUR VAULT-SHIELD DEPOSIT ADDRESS" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-addr-box">
          <div className="gm-addr-label">VAULT-SHIELD DEPOSIT ADDRESS</div>
          <div className="gm-addr-value">{short}</div>
          <button className="gm-addr-copy" onClick={handleCopy}>
            {copied ? 'COPIED!' : 'COPY ADDRESS'}
          </button>
        </div>

        <div className="gm-box">
          <div className="gm-box-title">TRANSFER PARAMETERS</div>
          <div className="gm-box-row"><span>ACCEPTED ASSETS</span><span>USDC / ETH / BTC</span></div>
          <div className="gm-box-row"><span>MINIMUM AMOUNT</span><span>$50.00</span></div>
          <div className="gm-box-row"><span>ARRIVAL TIME</span><span className="green">UNDER 1 MINUTE</span></div>
          <div className="gm-box-row"><span>NETWORK FEES</span><span className="green">COVERED</span></div>
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" onClick={onNext}>
          {'[ TRANSFER CONFIRMED ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 06A // CRYPTO TRANSFER</div>
    </motion.div>
  )
}

// ── Screen 8b: Fiat sub-screen ──────────────────────────────────

function GmS8Fiat({ onNext }: { onNext: () => void }) {
  const [method, setMethod] = useState<'bank' | 'card' | null>(null)

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={6} title="FIAT ONRAMP PROTOCOL" sub="SELECT YOUR ALLOCATION METHOD" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-choice">
          <button className={`gm-choice-card${method === 'bank' ? ' gm-choice-card--active' : ''}`} onClick={() => setMethod('bank')}>
            <div className={`gm-choice-indicator${method === 'bank' ? ' gm-choice-indicator--filled' : ''}`}>
              {method === 'bank' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">BANK TRANSFER</div>
              <div className="gm-choice-sub">FREE / 1-3 BUSINESS DAYS</div>
            </div>
          </button>
          <button className={`gm-choice-card${method === 'card' ? ' gm-choice-card--active' : ''}`} onClick={() => setMethod('card')}>
            <div className={`gm-choice-indicator${method === 'card' ? ' gm-choice-indicator--filled' : ''}`}>
              {method === 'card' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">CREDIT OR DEBIT CARD</div>
              <div className="gm-choice-sub">INSTANT / SMALL FEE APPLIES</div>
            </div>
          </button>
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" disabled={!method} onClick={onNext}>
          {'[ CONFIRM ALLOCATION METHOD ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 06B // FIAT ONRAMP</div>
    </motion.div>
  )
}

// ── Screen 8c: Processing ───────────────────────────────────────

function GmS8Processing({ onNext }: { onNext: () => void }) {
  const [pct, setPct]     = useState(0)
  const [done, setDone]   = useState(false)

  useEffect(() => {
    let v = 0
    const iv = setInterval(() => {
      v += 1.6
      setPct(Math.min(Math.round(v), 100))
      if (v >= 100) { clearInterval(iv); setDone(true) }
    }, 60)
    const t = setTimeout(onNext, 7000)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [onNext])

  return (
    <motion.div className="gm-screen gm-crt" {...FADE}>
      <div className="gm-proc-body">
        <VaultDoor size={72} color={done ? '#22C55E' : '#E8C93A'} spin={!done} />

        <div className="gm-proc-title">
          {done ? 'ALLOCATION CONFIRMED' : 'VERIFYING VAULT CREDIT ALLOCATION'}
        </div>
        <div className="gm-proc-sub">
          {done
            ? 'YOUR VAULT-SHIELD BALANCE: $50.00'
            : 'CONTACTING VAULT-SHIELD CLEARING SYSTEM'}
        </div>

        <div className="gm-proc-bar-wrap">
          <div className="gm-proc-bar-label">{pct}%</div>
          <div className="gm-scan-bar-track">
            <div className={`gm-scan-bar-fill${done ? ' gm-scan-bar-fill--green' : ''}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="gm-coords">VS-NET // STEP 06C // PROCESSING</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 9 — VAULT-SHIELD CARD ASSIGNMENT
// ═══════════════════════════════════════════════════════════════

const TIER_PERKS = {
  premier: [
    'Standard spending limit up to $5,000/day',
    'Apple Pay and Google Pay',
    'Contactless and chip payments worldwide',
    'No monthly fee, ever',
  ],
  premium: [
    'Enhanced limit up to $20,000/day',
    'Apple Pay and Google Pay',
    'Travel insurance included',
    'Airport lounge access',
    'Priority citizen support',
    '$2.00 per month',
  ],
}

function GmS9Card({ onNext }: { onNext: (tier: 'premier' | 'premium') => void }) {
  const [tier, setTier] = useState<'premier' | 'premium'>('premier')

  return (
    <motion.div className="gm-screen gm-crt" {...SLIDE_IN}>
      <GmHeader step={7} title="VAULT-SHIELD CARD ASSIGNMENT" sub="SELECT YOUR CITIZEN CARD TIER" />
      <hr className="gm-sep" style={{ marginTop: 14 }} />

      <div className="gm-body">
        <div className="gm-choice">
          <button className={`gm-choice-card${tier === 'premier' ? ' gm-choice-card--active' : ''}`} onClick={() => setTier('premier')}>
            <div className={`gm-choice-indicator${tier === 'premier' ? ' gm-choice-indicator--filled' : ''}`}>
              {tier === 'premier' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">TIER I - PREMIER</div>
              <div className="gm-choice-sub">STANDARD CITIZEN ALLOCATION</div>
            </div>
            <div className="gm-choice-badge">FREE</div>
          </button>
          <button className={`gm-choice-card${tier === 'premium' ? ' gm-choice-card--active' : ''}`} onClick={() => setTier('premium')}>
            <div className={`gm-choice-indicator${tier === 'premium' ? ' gm-choice-indicator--filled' : ''}`}>
              {tier === 'premium' ? '■' : ''}
            </div>
            <div className="gm-choice-body">
              <div className="gm-choice-title">TIER II - PREMIUM</div>
              <div className="gm-choice-sub">ENHANCED CITIZEN CLEARANCE</div>
            </div>
            <div className="gm-choice-badge">$2/MO</div>
          </button>
        </div>

        <div className="gm-tier-perks">
          {TIER_PERKS[tier].map((perk, i) => (
            <div key={i} className="gm-tier-perk">
              <span className="gm-tier-perk-check">{'>'}</span>
              <span>{perk.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gm-footer">
        <button className="gm-btn" onClick={() => onNext(tier)}>
          {tier === 'premier' ? '[ CONFIRM TIER I - PREMIER ]' : '[ CONFIRM TIER II - PREMIUM ]'}
        </button>
      </div>
      <div className="gm-coords">VS-NET // STEP 07 // CARD ASSIGNMENT</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Screen 10 — ACCESS AUTHORIZED
// ═══════════════════════════════════════════════════════════════

function GmS10Granted({ firstName, lastName, onEnter }: { firstName: string; lastName: string; onEnter: () => void }) {
  const [xp, setXp]             = useState(0)
  const [showRows, setShowRows] = useState(false)
  const [showBtn, setShowBtn]   = useState(false)
  const [agentId]               = useState(() => String(Math.floor(Math.random() * 9000) + 1000))

  useEffect(() => {
    const t1 = setTimeout(() => {
      let v = 0
      const iv = setInterval(() => {
        v += 2.5
        setXp(Math.min(Math.round(v), 100))
        if (v >= 100) clearInterval(iv)
      }, 20)
      return () => clearInterval(iv)
    }, 500)
    const t2 = setTimeout(() => setShowRows(true), 1600)
    const t3 = setTimeout(() => setShowBtn(true), 2300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <motion.div className="gm-screen gm-crt" {...FADE}>
      <div className="gm-s10-body">
        <motion.div className="gm-granted-badge" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          ACCESS AUTHORIZED
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', damping: 10, stiffness: 160 }}>
          <VaultDoor size={80} color="#22C55E" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ textAlign: 'center' }}>
          <div className="gm-granted-name">CITIZEN {firstName.toUpperCase()}</div>
          {lastName && <div className="gm-granted-sub">{lastName.toUpperCase()}</div>}
        </motion.div>

        <motion.div className="gm-xp-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="gm-xp-label">
            <span>NETWORK SYNC</span>
            <span>{xp}%</span>
          </div>
          <div className="gm-xp-track">
            <div className="gm-xp-fill" style={{ width: `${xp}%` }} />
          </div>
        </motion.div>

        <AnimatePresence>
          {showRows && (
            <motion.div className="gm-net-rows" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="gm-net-row"><span>VAULT STATUS</span><span>ONLINE</span></div>
              <div className="gm-net-row"><span>YIELD PROTOCOL</span><span>4.2% APY</span></div>
              <div className="gm-net-row"><span>SHIELD LAYER</span><span>ACTIVE</span></div>
              <div className="gm-net-row"><span>CITIZEN ID</span><span>VS-{agentId}</span></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="gm-footer">
        <AnimatePresence>
          {showBtn && (
            <motion.button className="gm-btn gm-btn--green" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onClick={onEnter}>
              {'[ ENTER VAULT-SHIELD ]'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="gm-coords">VS-NET // CITIZEN VS-{agentId} // CLEARANCE LEVEL 1</div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Orchestrator
// ═══════════════════════════════════════════════════════════════

type GmStep =
  | 'signal' | 'email' | 'otp' | 'identity' | 'address'
  | 'biometric' | 'tos' | 'funding' | 'funding_crypto'
  | 'funding_fiat' | 'processing' | 'card' | 'granted'

interface GmData {
  email: string
  firstName: string
  lastName: string
  dob: string
  street: string
  city: string
  postal: string
  country: string
  fundingStream: 'crypto' | 'fiat' | null
  cardTier: 'premier' | 'premium' | null
}

const EMPTY_DATA: GmData = {
  email: '', firstName: '', lastName: '', dob: '',
  street: '', city: '', postal: '', country: 'ES',
  fundingStream: null, cardTier: null,
}

export function GameOnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<GmStep>('signal')
  const [data, setData] = useState<GmData>(EMPTY_DATA)
  const patch = useCallback((p: Partial<GmData>) => setData(d => ({ ...d, ...p })), [])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {step === 'signal' && <GmS1Signal key="signal" onNext={() => setStep('email')} />}

        {step === 'email' && (
          <GmS2Email key="email" onNext={email => { patch({ email }); setStep('otp') }} />
        )}
        {step === 'otp' && (
          <GmS3Otp key="otp" email={data.email} onNext={() => setStep('identity')} />
        )}
        {step === 'identity' && (
          <GmS4Identity key="identity" onNext={p => { patch(p); setStep('address') }} />
        )}
        {step === 'address' && (
          <GmS5Address key="address" onNext={p => { patch(p); setStep('biometric') }} />
        )}
        {step === 'biometric' && (
          <GmS6Biometric key="biometric" onNext={() => setStep('tos')} />
        )}
        {step === 'tos' && (
          <GmS7Tos key="tos" onNext={() => setStep('funding')} />
        )}
        {step === 'funding' && (
          <GmS8Funding key="funding"
            onCrypto={() => { patch({ fundingStream: 'crypto' }); setStep('funding_crypto') }}
            onFiat={()   => { patch({ fundingStream: 'fiat'   }); setStep('funding_fiat') }}
          />
        )}
        {step === 'funding_crypto' && (
          <GmS8Crypto key="funding_crypto" onNext={() => setStep('processing')} />
        )}
        {step === 'funding_fiat' && (
          <GmS8Fiat key="funding_fiat" onNext={() => setStep('processing')} />
        )}
        {step === 'processing' && (
          <GmS8Processing key="processing" onNext={() => setStep('card')} />
        )}
        {step === 'card' && (
          <GmS9Card key="card" onNext={tier => { patch({ cardTier: tier }); setStep('granted') }} />
        )}
        {step === 'granted' && (
          <GmS10Granted key="granted" firstName={data.firstName} lastName={data.lastName} onEnter={onComplete} />
        )}
      </AnimatePresence>
    </div>
  )
}
