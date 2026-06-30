import { useRef, useState, useEffect } from 'react'
import { Signal, Wifi, Battery } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import SVLogo from '../img/SVlogo.svg'
import LogoPng from '../img/logo.png'
import PersonaPhoto from '../img/landing/magnific_editorial-photography-for_kLfTkya16B.png'
import ScreenLanding from '../img/screen landing.png'
import { Button } from '../components/Button'
import { OnboardingFlow } from '../flows/onboarding/OnboardingFlow'
import type { OnboardingData } from '../hooks/useOnboarding'
import type { OnboardingStep } from '../types/index'

// ── Actor config ──────────────────────────────────────────────────────────────

type Actor = 'user' | 'system' | 'done' | 'error'

const COL: Record<Actor, string> = {
  user:   '#EBFC0E',
  system: '#888888',
  done:   '#22C55E',
  error:  '#EF4444',
}

const FMBG: Record<Actor, string> = {
  user:   'rgba(235,252,14,0.08)',
  system: 'rgba(136,136,136,0.06)',
  done:   'rgba(34,197,94,0.08)',
  error:  'rgba(239,68,68,0.07)',
}

const FMAL: Record<Actor, string> = {
  user:   'USER',
  system: 'SYSTEM',
  done:   'DONE',
  error:  'TERMINAL',
}

// ── Node type ─────────────────────────────────────────────────────────────────

type NodeVariant = 'main' | 'fork' | 'terminal'

interface FN {
  id: string
  title: string
  lines: string[]
  cta?: string
  actor: Actor
  x: number
  y: number
  variant: NodeVariant
}

const nodeW = (n: FN) => n.variant === 'main' ? 175 : n.variant === 'fork' ? 160 : 130
const nodeH = (n: FN) => n.variant === 'main' ? 132 : n.variant === 'fork' ? 112 : 48

// ── Screen preview ────────────────────────────────────────────────────────────

const PREVIEW_STEPS: { phase: OnboardingStep; label: string; desc: string }[] = [
  { phase: 'email',             label: 'Account',       desc: 'Email sign-in or SSO via Google / Apple. KYC notice shown upfront so users know what to expect.' },
  { phase: 'email_verification',label: 'Email code',    desc: '6-digit OTP sent automatically. Auto-submits on completion. Resend available after 30 seconds.' },
  { phase: 'identity_name',     label: 'Full name',     desc: 'First and last name exactly as they appear on the government-issued ID.' },
  { phase: 'identity_dob',      label: 'Date of birth', desc: 'Day, month, year selector. Must match the ID document submitted in the next step.' },
  { phase: 'identity_address',  label: 'Home address',  desc: 'Street address, city, postal code, and country. 26 EU countries supported via searchable picker.' },
  { phase: 'passport',          label: 'ID document',   desc: 'Passport, national ID, or driving licence. Tap to photo or upload. JPEG/PNG up to 10 MB.' },
  { phase: 'kyc_review',        label: 'KYC review',    desc: 'Partner service reviews the document automatically. Usually a few seconds. User can close the app and is notified on completion.' },
  { phase: 'tos',               label: 'Terms',         desc: 'Terms of Service and Privacy Policy. Trust-forward copy and single-tap acceptance.' },
  { phase: 'funding',           label: 'Deposit method',desc: '$50 minimum to activate the account. User chooses between sending crypto or funding via bank transfer / card.' },
  { phase: 'funding_crypto',    label: 'Crypto deposit', desc: 'EIP-681 QR code pre-fills 50 USDC in any Ethereum wallet. Copy-to-clipboard fallback for the deposit address.' },
  { phase: 'funding_fiat',      label: 'Bank / card',   desc: 'Bank transfer (free, 1 to 3 business days) or credit/debit card (instant, small processing fee).' },
  { phase: 'processing',        label: 'Processing',    desc: 'Deposit confirmation spinner. Auto-advances in ~5 seconds. User can close the app safely.' },
  { phase: 'card_selection',    label: 'Card tier',     desc: 'VISA PREMIER (free) or PREMIUM ($2/month). Toggle tabs to compare perks. Upgrade available anytime after onboarding.' },
  { phase: 'completing',        label: 'All set',        desc: 'ShieldVault check animation, $50 balance shown, and 4.2% APY confirmed. One tap to reach the home screen.' },
]

const SCALE = 0.60
const PHONE_W = 390
const PHONE_H = 844

const DEMO_DATA: OnboardingData = {
  email: 'thomas@example.com',
  firstName: 'Thomas',
  lastName: 'Dupont',
  dateOfBirth: '1990-05-15',
  addressLine: '14 Rue de Rivoli',
  city: 'Paris',
  postalCode: '75001',
  country: 'FR',
  fundingStream: null,
  fiatMethod: null,
  cardTier: null,
}

function ScreenPreview() {
  const [stepIdx, setStepIdx] = useState(0)
  const pillsRef = useRef<HTMLDivElement>(null)

  const step = PREVIEW_STEPS[stepIdx]
  const phase = step.phase

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(PREVIEW_STEPS.length - 1, idx))
    setStepIdx(clamped)
    const el = pillsRef.current?.children[clamped] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const handleAdvance = (nextPhase: OnboardingStep | 'idle') => {
    if (nextPhase === 'completed' || nextPhase === 'idle') return
    const idx = PREVIEW_STEPS.findIndex(s => s.phase === nextPhase)
    if (idx >= 0) goTo(idx)
  }

  const handleBack = () => goTo(Math.max(0, stepIdx - 1))

  const isFirst = stepIdx === 0
  const isLast  = stepIdx === PREVIEW_STEPS.length - 1

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Step filmstrip */}
      <div
        ref={pillsRef}
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: 32,
          scrollbarWidth: 'none',
        }}
      >
        {PREVIEW_STEPS.map((s, i) => (
          <button
            key={s.phase}
            onClick={() => goTo(i)}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 99,
              border: `1px solid ${i === stepIdx ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
              background: i === stepIdx ? 'var(--color-glass-tint-strong)' : 'transparent',
              color: i === stepIdx ? 'var(--color-primary)' : i < stepIdx ? 'var(--color-body)' : 'var(--color-muted)',
              fontSize: 11,
              fontWeight: i === stepIdx ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 120ms ease',
            }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Phone + side panel */}
      <div style={{ display: 'flex', gap: 52, alignItems: 'flex-start' }}>

        {/* Scaled phone frame */}
        <div style={{
          width: PHONE_W * SCALE + 32,
          height: PHONE_H * SCALE + 32,
          position: 'relative',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: PHONE_W,
            height: PHONE_H,
            transformOrigin: 'top left',
            transform: `scale(${SCALE})`,
          }}>
            <div style={{
              width: PHONE_W,
              height: PHONE_H,
              background: 'var(--color-surface-card)',
              borderRadius: 44,
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 0 10px #111111, 0 0 0 11px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Status bar */}
              <div style={{
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px',
                flexShrink: 0,
                background: 'var(--color-surface-card)',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                color: 'var(--color-ink)',
                letterSpacing: '-0.01em',
              }}>
                <span>9:41</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-ink)' }}>
                  <Signal size={14} strokeWidth={2} />
                  <Wifi size={14} strokeWidth={2} />
                  <Battery size={14} strokeWidth={2} />
                </span>
              </div>

              {/* App layer */}
              <div className="app-layer">
                <OnboardingFlow
                  key={phase}
                  phase={phase}
                  data={DEMO_DATA}
                  advance={handleAdvance}
                  back={handleBack}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: step info + controls */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 8 }}>
            Step {stepIdx + 1} of {PREVIEW_STEPS.length}
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {step.label}
          </h3>
          <p style={{ margin: '0 0 36px', fontSize: 15, color: 'var(--color-body)', lineHeight: 1.75, maxWidth: 360 }}>
            {step.desc}
          </p>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <button
              onClick={() => goTo(stepIdx - 1)}
              disabled={isFirst}
              style={{
                padding: '11px 22px',
                border: '1px solid var(--color-hairline)',
                borderRadius: 9,
                background: 'transparent',
                color: isFirst ? 'var(--color-muted-soft)' : 'var(--color-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 120ms ease',
              }}
            >
              Previous
            </button>
            <button
              onClick={() => goTo(stepIdx + 1)}
              disabled={isLast}
              style={{
                padding: '11px 22px',
                border: `1px solid ${isLast ? 'var(--color-hairline)' : 'transparent'}`,
                borderRadius: 9,
                background: isLast ? 'transparent' : 'var(--color-primary)',
                color: isLast ? 'var(--color-muted-soft)' : '#0A0A09',
                fontSize: 13,
                fontWeight: 700,
                cursor: isLast ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 120ms ease',
              }}
            >
              {isLast ? 'End of flow' : 'Next step'}
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {PREVIEW_STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: 4,
                  width: i === stepIdx ? 28 : 4,
                  borderRadius: 99,
                  background: i <= stepIdx ? 'var(--color-primary)' : 'var(--color-hairline-strong)',
                  cursor: 'pointer',
                  transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1), background 120ms ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}


// ── FlowMap ───────────────────────────────────────────────────────────────────

function FlowMap() {
  const NW = 175, NH = 132
  const STEP = 210
  const MAIN_X = 20

  const OB_Y       = 146
  const FORK_Y     = 340
  const OB_FAIL_Y  = 470


  const px = (i: number) => MAIN_X + i * STEP

  const obMain: FN[] = [
    {
      id: 'email', title: 'Create your account',
      lines: ['Email, Google, or Apple sign-in', 'KYC identity verification required'],
      cta: 'Continue with email',
      actor: 'user', x: px(0), y: OB_Y, variant: 'main',
    },
    {
      id: 'email_verification', title: 'Check your inbox',
      lines: ['6-digit code sent to email', 'Auto-submits when complete', 'Resend after 30s'],
      actor: 'user', x: px(1), y: OB_Y, variant: 'main',
    },
    {
      id: 'identity', title: 'Tell us about yourself',
      lines: ['Full name + date of birth', 'Phone number', 'Street address, city, postal code, country'],
      cta: 'Continue',
      actor: 'user', x: px(2), y: OB_Y, variant: 'main',
    },
    {
      id: 'passport', title: 'Verify your identity',
      lines: ['Passport, national ID, or driving licence', 'Take photo or upload (max 10 MB)', 'Secure — not shared with third parties'],
      cta: 'Submit for review',
      actor: 'user', x: px(3), y: OB_Y, variant: 'main',
    },
    {
      id: 'kyc_review', title: 'Verifying your identity',
      lines: ['Provider reviews document automatically', 'Usually a few seconds', 'Close app — notified on completion'],
      actor: 'system', x: px(4), y: OB_Y, variant: 'main',
    },
    {
      id: 'tos', title: 'Terms and conditions',
      lines: ['Scrollable agreement text', 'Checkbox to confirm agreement'],
      cta: 'Accept and continue',
      actor: 'user', x: px(5), y: OB_Y, variant: 'main',
    },
    {
      id: 'funding', title: 'Fund your account',
      lines: ['4.2% APY auto-yield callout', 'Send crypto or bank / card'],
      actor: 'user', x: px(6), y: OB_Y, variant: 'main',
    },
    {
      id: 'processing', title: 'Checking your deposit',
      lines: ['Spinner — auto-advances ~30s', 'Minimum $50 required to activate', 'Close app — notified on arrival'],
      actor: 'system', x: px(7), y: OB_Y, variant: 'main',
    },
    {
      id: 'card_selection', title: 'Choose your card',
      lines: ['VISA card visual preview', 'PREMIER free vs PREMIUM $2/mo', 'Perks list per tier'],
      cta: 'Confirm tier',
      actor: 'user', x: px(8), y: OB_Y, variant: 'main',
    },
    {
      id: 'completing', title: "You're all set",
      lines: ['Shield check animation', '$50.00 balance displayed', 'Earning 4.2% APY automatically'],
      cta: 'Go to my account',
      actor: 'done', x: px(9), y: OB_Y, variant: 'main',
    },
  ]

  const kycRejected: FN = {
    id: 'kyc_rejected', title: 'Verification unsuccessful',
    lines: ['Document unclear or rejected'],
    actor: 'error', x: px(4) + NW / 2 - 65, y: OB_FAIL_Y, variant: 'terminal',
  }

  const gapCx = (px(6) + NW / 2 + px(7) + NW / 2) / 2
  const forkCrypto: FN = {
    id: 'fork_crypto', title: 'Send crypto',
    lines: ['Deposit address with copy button', 'USDC, ETH, BTC — min $50', 'Arrival under 1 minute'],
    cta: "I've sent the funds",
    actor: 'user', x: gapCx - 160 - 6, y: FORK_Y, variant: 'fork',
  }
  const forkFiat: FN = {
    id: 'fork_fiat', title: 'Bank or card',
    lines: ['Bank transfer — free, 1-3 days', 'Credit / debit card — instant, fee'],
    actor: 'user', x: gapCx + 6, y: FORK_Y, variant: 'fork',
  }

  const obFailed: FN = {
    id: 'ob_failed', title: 'Deposit not confirmed',
    lines: ['Below $50 or not received'],
    actor: 'error', x: px(7) + NW / 2 - 65, y: OB_FAIL_Y, variant: 'terminal',
  }

  const allNodes: FN[] = [...obMain, kycRejected, forkCrypto, forkFiat, obFailed]

  const CANVAS_W = px(9) + NW + 40
  const CANVAS_H = OB_FAIL_Y + 48 / 2 + 80

  const cx = (n: FN) => n.x + nodeW(n) / 2
  const cy = (n: FN) => n.y
  const top = (n: FN) => n.y - nodeH(n) / 2
  const bot = (n: FN) => n.y + nodeH(n) / 2

  const hLink = (a: FN, b: FN) =>
    `M${a.x + nodeW(a)},${a.y} L${b.x},${b.y}`

  const dropArc = (from: FN, to: FN) => {
    const x1 = cx(from), y1 = bot(from)
    const x2 = cx(to),   y2 = top(to)
    return `M${x1},${y1} C${x1},${y1 + 22} ${x2},${y2 - 22} ${x2},${y2}`
  }

  const fundingBotX = cx(obMain[6])
  const fundingBotY = bot(obMain[6])
  const forkDownCrypto = `M${fundingBotX},${fundingBotY} C${fundingBotX},${fundingBotY + 28} ${cx(forkCrypto)},${top(forkCrypto) - 28} ${cx(forkCrypto)},${top(forkCrypto)}`
  const forkDownFiat   = `M${fundingBotX},${fundingBotY} C${fundingBotX},${fundingBotY + 28} ${cx(forkFiat)},${top(forkFiat) - 28} ${cx(forkFiat)},${top(forkFiat)}`

  const procLeftX = obMain[7].x
  const procY     = cy(obMain[7])
  const mergeFromCrypto = `M${cx(forkCrypto)},${bot(forkCrypto)} C${cx(forkCrypto)},${bot(forkCrypto) + 32} ${procLeftX - 24},${procY + 24} ${procLeftX},${procY}`
  const mergeFromFiat   = `M${cx(forkFiat)},${bot(forkFiat)}   C${cx(forkFiat)},${bot(forkFiat) + 32}   ${procLeftX - 12},${procY + 18} ${procLeftX},${procY}`

  const retryArc = (() => {
    const fx = obFailed.x, fy = obFailed.y
    const tx = fundingBotX, ty = bot(obMain[6])
    return `M${fx},${fy} C${fx - 28},${fy + 42} ${tx - 80},${ty + 52} ${tx},${ty}`
  })()

  const kycRetryArc = (() => {
    const fx = kycRejected.x, fy = kycRejected.y
    const tx = cx(obMain[3]), ty = bot(obMain[3])
    return `M${fx},${fy} C${fx - 32},${fy + 40} ${tx - 20},${ty + 40} ${tx},${ty}`
  })()

  const INIT_SCALE = 0.6
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(INIT_SCALE)
  const txRef    = useRef(0)
  const tyRef    = useRef(0)
  const dragRef  = useRef<{ sx: number; sy: number; stx: number; sty: number } | null>(null)
  const [xform, setXform]         = useState({ tx: 0, ty: 0, scale: INIT_SCALE })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.92 : 1.09
      const next   = Math.min(2.5, Math.max(0.25, scaleRef.current * factor))
      const rect   = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const ntx = mx - (mx - txRef.current) * (next / scaleRef.current)
      const nty = my - (my - tyRef.current) * (next / scaleRef.current)
      scaleRef.current = next; txRef.current = ntx; tyRef.current = nty
      setXform({ tx: ntx, ty: nty, scale: next })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onPtrDown = (e: React.PointerEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, stx: txRef.current, sty: tyRef.current }
    setIsDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPtrMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const ntx = dragRef.current.stx + e.clientX - dragRef.current.sx
    const nty = dragRef.current.sty + e.clientY - dragRef.current.sy
    txRef.current = ntx; tyRef.current = nty
    setXform(x => ({ ...x, tx: ntx, ty: nty }))
  }
  const onPtrUp = () => { dragRef.current = null; setIsDragging(false) }

  const renderNode = (node: FN) => {
    const w = nodeW(node)
    const h = nodeH(node)
    const col = COL[node.actor]
    const isTerminal = node.variant === 'terminal'

    return (
      <div
        key={node.id}
        style={{
          position: 'absolute',
          left: node.x,
          top: node.y - h / 2,
          width: w, height: h,
          background: FMBG[node.actor],
          border: `1px solid ${col}${isTerminal ? '28' : '40'}`,
          borderRadius: 7,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: isTerminal ? '5px 10px' : '9px 11px',
          opacity: isTerminal ? 0.8 : 1,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: isTerminal ? 9 : 10.5, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: isTerminal ? 2 : 4, flexShrink: 0 }}>
          {node.title}
        </div>
        {node.lines.map((line, i) => (
          <div key={i} style={{ fontSize: 8.5, color: '#888888', lineHeight: 1.4, marginBottom: 1, flexShrink: 0 }}>
            {line}
          </div>
        ))}
        {node.cta && (
          <div style={{ marginTop: 5, fontSize: 8, fontWeight: 600, color: col, borderTop: `1px solid ${col}20`, paddingTop: 4, flexShrink: 0 }}>
            {node.cta}
          </div>
        )}
        <div style={{ marginTop: 'auto', paddingTop: 3, fontSize: 7, fontWeight: 800, color: col, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
          {FMAL[node.actor]}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPtrDown}
      onPointerMove={onPtrMove}
      onPointerUp={onPtrUp}
      onPointerLeave={onPtrUp}
      style={{
        width: '100%', height: 580, overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 8,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 14, zIndex: 10, fontSize: 9, color: 'var(--color-muted-soft)', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
        scroll to zoom — drag to pan
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 10, display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--color-muted)', marginRight: 6, fontVariantNumeric: 'tabular-nums', fontFamily: 'Inter, sans-serif' }}>
          {Math.round(xform.scale * 100)}%
        </span>
        {([
          ['+',     () => { const n = Math.min(2.5, scaleRef.current * 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['-',     () => { const n = Math.max(0.25, scaleRef.current / 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['reset', () => { scaleRef.current = INIT_SCALE; txRef.current = 0; tyRef.current = 0; setXform({ tx: 0, ty: 0, scale: INIT_SCALE }) }],
        ] as [string, () => void][]).map(([lbl, fn]) => (
          <button key={lbl} onClick={fn} onPointerDown={e => e.stopPropagation()} style={{
            padding: '0 8px', height: 26,
            border: '1px solid var(--color-hairline)',
            borderRadius: 5, background: 'var(--color-surface-elevated)',
            fontSize: 11, fontWeight: 600, color: 'var(--color-muted)',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{lbl}</button>
        ))}
      </div>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transformOrigin: '0 0',
        transform: `translate(${xform.tx}px,${xform.ty}px) scale(${xform.scale})`,
        width: CANVAS_W, height: CANVAS_H,
      }}>
        <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
          <defs>
            <marker id="sv-a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#2A2A28" />
            </marker>
            <marker id="sv-e" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#EF4444" />
            </marker>
            <marker id="sv-n" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#2A2A28" />
            </marker>
          </defs>

          {obMain.slice(0, 5).map((n, i) => (
            <path key={`ob-h${i}`} d={hLink(n, obMain[i + 1])} stroke="#2A2A28" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}
          {obMain.slice(7, 9).map((n, i) => (
            <path key={`ob-h2${i}`} d={hLink(n, obMain[8 + i])} stroke="#2A2A28" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          <path d={dropArc(obMain[4], kycRejected)} stroke="#EF4444" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <path d={kycRetryArc} stroke="#EF4444" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <text x={kycRejected.x - 32} y={OB_FAIL_Y + 52} style={{ fontSize: 8, fill: '#EF4444', fontFamily: 'Inter, sans-serif', fontWeight: 700, opacity: 0.7 }}>retry</text>

          <path d={forkDownCrypto} stroke="#2A2A28" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />
          <path d={forkDownFiat}   stroke="#2A2A28" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />
          <path d={mergeFromCrypto} stroke="#2A2A28" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />
          <path d={mergeFromFiat}   stroke="#2A2A28" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />

          <path d={dropArc(obMain[7], obFailed)} stroke="#EF4444" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <path d={retryArc} stroke="#EF4444" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <text x={obFailed.x - 38} y={OB_FAIL_Y + 52} style={{ fontSize: 8, fill: '#EF4444', fontFamily: 'Inter, sans-serif', fontWeight: 700, opacity: 0.7 }}>retry</text>

          {[
            { label: 'ONBOARDING', x: MAIN_X, y: OB_Y - NH / 2 - 22, color: '#EBFC0E' },
          ].map(({ label, x, y, color }) => (
            <g key={label}>
              <line x1={x} y1={y - 1} x2={x + 16} y2={y - 1} stroke={color} strokeWidth="2" strokeLinecap="round" />
              <text x={x + 22} y={y + 4} style={{ fontSize: 10, fontWeight: 800, fill: color, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                {label}
              </text>
            </g>
          ))}

          <text x={gapCx} y={FORK_Y - 56 - 8} textAnchor="middle" style={{ fontSize: 8.5, fill: '#5A5A5A', fontFamily: 'Inter, sans-serif' }}>
            funding method
          </text>
        </svg>
        {allNodes.map(renderNode)}
      </div>
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  const items: { actor: Actor; label: string; desc: string }[] = [
    { actor: 'user',   label: 'USER',     desc: 'requires user input or decision' },
    { actor: 'system', label: 'SYSTEM',   desc: 'automatic — user can leave safely' },
    { actor: 'done',   label: 'DONE',     desc: 'terminal success state' },
    { actor: 'error',  label: 'TERMINAL', desc: 'terminal failure — retry available' },
  ]

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28, fontFamily: 'Inter, sans-serif' }}>
      {items.map(({ actor, label, desc }) => (
        <div key={actor} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 22,
            background: FMBG[actor],
            border: `1px solid ${COL[actor]}3C`,
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: COL[actor], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--color-body)' }}>{desc}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={40} height={20} style={{ overflow: 'visible' }}>
          <line x1={0} y1={10} x2={36} y2={10} stroke="#EF4444" strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />
          <polygon points="36 7, 40 10, 36 13" fill="#EF4444" opacity={0.5} />
        </svg>
        <span style={{ fontSize: 12, color: 'var(--color-body)' }}>failure or error branch</span>
      </div>
    </div>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────────

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--color-glass-tint)',
      border: '1px solid var(--color-glass-border-strong)',
      borderRadius: 8, padding: '14px 18px', marginBottom: 28,
      fontSize: 14, color: 'var(--color-body)', lineHeight: 1.65,
      fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </div>
  )
}

// ── Phase table ───────────────────────────────────────────────────────────────

function PhaseTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 40 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            {['Phase', 'Actor', 'What is happening', 'User can leave?'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '8px 14px',
                borderBottom: '2px solid var(--color-hairline-strong)',
                fontSize: 11, fontWeight: 700, color: 'var(--color-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : 'var(--color-surface-soft)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-hairline)',
                  color: ci === 0 ? 'var(--color-ink)' : 'var(--color-body)',
                  fontWeight: ci === 0 ? 600 : 400,
                  lineHeight: 1.5,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Design system section wrapper ─────────────────────────────────────────────

function DSSection({ id, tag, title, desc, children }: {
  id: string
  tag: string
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section id={id} data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag}</span>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 32px', lineHeight: 1.7 }}>{desc}</p>
      {children}
    </section>
  )
}

// ── Color palette ─────────────────────────────────────────────────────────────

function SwatchGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  )
}

function ColorRow({ swatches }: { swatches: { token: string; hex: string; note?: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
      {swatches.map(({ token, hex, note }) => (
        <div key={token}>
          <div style={{ height: 52, background: hex, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }} />
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-body)', fontFamily: 'monospace', lineHeight: 1.4 }}>{token}</div>
          <div style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'monospace', marginBottom: 2 }}>{hex}</div>
          {note && <div style={{ fontSize: 10, color: 'var(--color-muted-soft)' }}>{note}</div>}
        </div>
      ))}
    </div>
  )
}

function ColorSection() {
  return (
    <div>
      <SwatchGroup label="Brand">
        <ColorRow swatches={[
          { token: '--color-primary',          hex: '#EBFC0E', note: 'Electric Lime' },
          { token: '--color-primary-active',   hex: '#D4E40C', note: 'Pressed state' },
          { token: '--color-primary-disabled', hex: '#3A3220', note: 'Disabled fill' },
          { token: '--color-on-primary',       hex: '#0A0A09', note: 'Text on gold' },
        ]} />
      </SwatchGroup>
      <SwatchGroup label="Canvas and surfaces">
        <ColorRow swatches={[
          { token: '--color-canvas',           hex: '#0A0A09', note: 'Page background' },
          { token: '--color-surface-soft',     hex: '#111110', note: 'Subtle fills' },
          { token: '--color-surface-card',     hex: '#1A1A18', note: 'Cards' },
          { token: '--color-surface-elevated', hex: '#242422', note: 'Raised elements' },
          { token: '--color-surface-overlay',  hex: '#2E2E2A', note: 'Modals, tooltips' },
        ]} />
      </SwatchGroup>
      <SwatchGroup label="Text">
        <ColorRow swatches={[
          { token: '--color-ink',         hex: '#FFFFFF', note: 'Headlines' },
          { token: '--color-body-strong', hex: '#E6E6E6', note: 'Strong body' },
          { token: '--color-body',        hex: '#CCCCCC', note: 'Body copy' },
          { token: '--color-muted',       hex: '#888888', note: 'Secondary' },
          { token: '--color-muted-soft',  hex: '#5A5A5A', note: 'Disabled' },
        ]} />
      </SwatchGroup>
      <SwatchGroup label="Borders and glass">
        <ColorRow swatches={[
          { token: '--color-hairline',          hex: '#2A2A28', note: 'Default border' },
          { token: '--color-hairline-strong',   hex: '#3A3A36', note: 'Emphasis border' },
          { token: '--color-glass-bg',          hex: 'rgba(255,255,255,0.04)', note: 'Base fill' },
          { token: '--color-glass-tint',        hex: 'rgba(235,252,14,0.06)', note: 'Gold tint' },
          { token: '--color-glass-tint-strong', hex: 'rgba(235,252,14,0.12)', note: 'Selected' },
        ]} />
      </SwatchGroup>
      <SwatchGroup label="Semantic">
        <ColorRow swatches={[
          { token: '--color-success', hex: '#22C55E', note: 'Confirmed' },
          { token: '--color-warning', hex: '#F59E0B', note: 'Caution' },
          { token: '--color-error',   hex: '#EF4444', note: 'Failed' },
          { token: '--color-yield',   hex: '#22C55E', note: 'Earnings' },
        ]} />
      </SwatchGroup>
    </div>
  )
}

// ── Typography section ────────────────────────────────────────────────────────

function TypeSection() {
  const scale: { label: string; size: number; weight: number; tracking: string; sample: string; mono?: boolean }[] = [
    { label: 'Display',    size: 34, weight: 800, tracking: '-0.035em', sample: 'Private payments' },
    { label: 'Heading 1',  size: 26, weight: 700, tracking: '-0.025em', sample: 'Fund your account' },
    { label: 'Heading 2',  size: 22, weight: 700, tracking: '-0.02em',  sample: 'Choose your card tier' },
    { label: 'Subheading', size: 18, weight: 600, tracking: '-0.01em',  sample: 'VISA PREMIER — free' },
    { label: 'Body',       size: 15, weight: 400, tracking: '0',        sample: 'Your balance earns 4.2% APY automatically every month. No action required.' },
    { label: 'Small',      size: 13, weight: 400, tracking: '0',        sample: 'Minimum deposit $50.00 to activate account' },
    { label: 'Caption',    size: 12, weight: 500, tracking: '0.02em',   sample: 'Last transaction' },
    { label: 'Label',      size: 11, weight: 700, tracking: '0.07em',   sample: 'ACCOUNT BALANCE' },
    { label: 'Mono',       size: 14, weight: 500, tracking: '0',        sample: '$1,234.56', mono: true },
  ]

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-hairline)' }}>
      {scale.map(({ label, size, weight, tracking, sample, mono }, i) => (
        <div key={label} style={{
          display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24,
          padding: '18px 24px',
          borderBottom: i < scale.length - 1 ? '1px solid var(--color-hairline)' : 'none',
          alignItems: 'center',
          background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-soft)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: 10, color: 'var(--color-muted-soft)', fontFamily: 'monospace', marginTop: 3 }}>{size}px / {weight}</div>
          </div>
          <div style={{
            fontSize: size,
            fontWeight: weight,
            letterSpacing: tracking,
            color: 'var(--color-ink)',
            fontFamily: mono ? 'monospace' : 'Inter, sans-serif',
            lineHeight: 1.3,
            fontVariantNumeric: mono ? 'tabular-nums' : undefined,
          }}>
            {sample}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Spacing and radius section ────────────────────────────────────────────────

function SpacingSection() {
  const spaces = [
    { token: '--space-1',  px: 4  },
    { token: '--space-2',  px: 8  },
    { token: '--space-3',  px: 12 },
    { token: '--space-4',  px: 16 },
    { token: '--space-5',  px: 20 },
    { token: '--space-6',  px: 24 },
    { token: '--space-8',  px: 32 },
    { token: '--space-10', px: 40 },
    { token: '--space-12', px: 48 },
    { token: '--space-16', px: 64 },
  ]

  const radii = [
    { token: '--radius-xs',   px: 4    },
    { token: '--radius-sm',   px: 8    },
    { token: '--radius-md',   px: 12   },
    { token: '--radius-lg',   px: 16   },
    { token: '--radius-xl',   px: 20   },
    { token: '--radius-2xl',  px: 28   },
    { token: '--radius-card', px: 20   },
    { token: '--radius-full', px: 9999 },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Spacing scale (4px base)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {spaces.map(({ token, px }) => (
            <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: px, height: 20, background: 'var(--color-primary)', borderRadius: 3, flexShrink: 0 }} />
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-muted)' }}>{token}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted-soft)', marginLeft: 'auto' }}>{px}px</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Border radius</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {radii.map(({ token, px }) => (
            <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 28,
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: px,
                flexShrink: 0,
              }} />
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-muted)' }}>{token}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted-soft)', marginLeft: 'auto' }}>{px === 9999 ? 'full' : `${px}px`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Glass system section ──────────────────────────────────────────────────────

function GlassSection() {
  const cards = [
    { label: 'glass-bg',           bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',  desc: 'Base glass — neutral, universal' },
    { label: 'glass-tint',         bg: 'rgba(235,252,14,0.06)',  border: 'rgba(255,255,255,0.08)',  desc: 'Gold tint — default card state' },
    { label: 'glass-tint-strong',  bg: 'rgba(235,252,14,0.12)',  border: 'rgba(255,255,255,0.14)',  desc: 'Strong tint — selected or active' },
    { label: 'surface-card',       bg: '#1A1A18',               border: 'rgba(255,255,255,0.08)',  desc: 'Opaque card — balance, lists' },
    { label: 'surface-elevated',   bg: '#242422',               border: 'rgba(255,255,255,0.08)',  desc: 'Elevated — tooltips, FAB context' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {cards.map(({ label, bg, border, desc }) => (
        <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6, fontFamily: 'monospace' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: 16 }}>{desc}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 7, borderRadius: 4, background: 'var(--color-hairline-strong)', marginBottom: 5 }} />
              <div style={{ height: 7, width: '60%', borderRadius: 4, background: 'var(--color-hairline)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Motion section ────────────────────────────────────────────────────────────

function MotionSection() {
  const durations = [
    { token: '--duration-fast',   ms: 150, use: 'Hover states, micro-feedback' },
    { token: '--duration-normal', ms: 300, use: 'Panel open, card flip' },
    { token: '--duration-slow',   ms: 500, use: 'Screen transitions' },
    { token: '--duration-reveal', ms: 700, use: 'Onboarding hero reveals' },
  ]

  const easings = [
    { token: '--ease-out',    value: 'cubic-bezier(0.16, 1, 0.3, 1)',  desc: 'Default — slow ease out. Feels deliberate.' },
    { token: '--ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)',   desc: 'Cross-fades, paired enter/exit.' },
    { token: '--ease-spring', value: 'cubic-bezier(0.16, 1, 0.3, 1)',  desc: 'Alias to ease-out. No bounce in this system.' },
  ]

  const [active, setActive] = useState<number | null>(null)

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Duration tokens — click to preview</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 40 }}>
        {durations.map(({ token, ms, use }, i) => (
          <div
            key={token}
            onClick={() => setActive(active === i ? null : i)}
            style={{
              padding: '16px',
              background: active === i ? 'var(--color-glass-tint-strong)' : 'var(--color-surface-card)',
              border: `1px solid ${active === i ? 'rgba(235,252,14,0.3)' : 'var(--color-hairline)'}`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-body)', fontFamily: 'monospace' }}>{token}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {ms}<span style={{ fontSize: 12, fontWeight: 500 }}>ms</span>
              </div>
            </div>
            <div style={{ height: 3, background: 'var(--color-hairline-strong)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{
                height: '100%',
                width: active === i ? '100%' : '0%',
                background: 'var(--color-primary)',
                borderRadius: 99,
                transition: `width ${ms}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{use}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Easing curves</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {easings.map(({ token, value, desc }) => (
          <div key={token} style={{
            display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24,
            padding: '14px 20px',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 10, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-body)', fontFamily: 'monospace', marginBottom: 4 }}>{token}</div>
              <div style={{ fontSize: 10, color: 'var(--color-muted-soft)', fontFamily: 'monospace' }}>{value}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Button section ────────────────────────────────────────────────────────────

function ButtonSection() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Variants</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '28px', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-hairline)', marginBottom: 24 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Sizes</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '28px', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-hairline)', marginBottom: 24, alignItems: 'center' }}>
        <Button variant="primary" size="lg">Large</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="sm">Small</Button>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 16 }}>Full width</div>
      <div style={{ padding: '28px', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-hairline)' }}>
        <Button variant="primary" size="lg" style={{ width: '100%' }}>Get started</Button>
      </div>
    </div>
  )
}

// ── Sidebar navigation ────────────────────────────────────────────────────────

const NAV = [
  {
    group: 'Flows',
    items: [
      { id: 'user',       label: 'Who is this for' },
      { id: 'yield',      label: 'Auto-yield' },
      { id: 'flow-map',   label: 'Flow map' },
      { id: 'problems',   label: 'Problems solved' },
      { id: 'screens',    label: 'Screen gallery' },
      { id: 'onboarding', label: 'Onboarding phases' },
      { id: 'copy-rules', label: 'Copy rules' },
    ],
  },
  {
    group: 'Design system',
    items: [
      { id: 'ds-colors',     label: 'Colors' },
      { id: 'ds-typography', label: 'Typography' },
      { id: 'ds-spacing',    label: 'Spacing and radius' },
      { id: 'ds-glass',      label: 'Glass system' },
      { id: 'ds-motion',     label: 'Motion' },
      { id: 'ds-buttons',    label: 'Buttons' },
    ],
  },
]

const ALL_IDS = NAV.flatMap(g => g.items.map(i => i.id))

// ── UseCase page ──────────────────────────────────────────────────────────────

export function UseCase() {
  const [active, setActive] = useState('flow-map')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          )
          setActive(topmost.target.id)
        }
      },
      { rootMargin: '-8% 0px -60% 0px', threshold: 0 },
    )
    ALL_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      {/* Sidebar */}
      <nav style={{
        width: sidebarOpen ? 220 : 64,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'var(--color-surface-soft)',
        borderRight: '1px solid var(--color-hairline)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {sidebarOpen ? (
          <>
            {/* Expanded header */}
            <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--color-hairline)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <img src={SVLogo} alt="ShieldVault" style={{ flex: 1, minWidth: 0, height: 'auto', objectFit: 'contain' }} />
              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 6,
                  border: '1px solid var(--color-hairline)',
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-muted)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            {NAV.map(({ group, items }) => (
              <div key={group} style={{ padding: '0 10px', marginBottom: 20 }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'var(--color-muted-soft)',
                  padding: '0 8px', marginBottom: 4,
                }}>
                  {group}
                </div>
                {items.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '7px 10px', borderRadius: 7,
                      border: 'none',
                      background: active === id ? 'var(--color-glass-tint-strong)' : 'transparent',
                      color: active === id ? 'var(--color-primary)' : 'var(--color-body)',
                      fontSize: 13,
                      fontWeight: active === id ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      display: 'block',
                      lineHeight: 1.4,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </>
        ) : (
          /* Collapsed state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, gap: 16 }}>
            <img src={LogoPng} alt="ShieldVault" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <button
              onClick={() => setSidebarOpen(true)}
              title="Open sidebar"
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: '1px solid var(--color-hairline)',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-muted)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, padding: '64px 72px 120px' }}>
        <div style={{ maxWidth: 900 }}>

          {/* ── Presentation intro ── */}
          <div style={{ marginBottom: 72, paddingBottom: 72, borderBottom: '1px solid var(--color-hairline)' }}>
            <img
              src={LogoPng}
              alt="ShieldVault"
              style={{ height: 160, width: 'auto', display: 'block', marginBottom: 40, objectFit: 'contain' }}
            />
            <h1 style={{
              margin: '0 0 24px',
              fontSize: 56,
              fontWeight: 800,
              color: 'var(--color-ink)',
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              maxWidth: 740,
            }}>
              A new payment app,<br />built for everyone.
            </h1>
            <p style={{
              fontSize: 18,
              color: 'var(--color-body)',
              lineHeight: 1.75,
              margin: 0,
              maxWidth: 580,
            }}>
              ShieldVault is a blockchain-backed payment app designed for mainstream users.
              No wallet. No crypto knowledge required. Sign up with email, pay with VISA anywhere,
              and earn automatically on your balance from day one.
            </p>
          </div>

          {/* ── PRODUCT SCOPE ── */}
          <div style={{ marginBottom: 72, paddingBottom: 72, borderBottom: '1px solid var(--color-hairline)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>

              {/* Left: text */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 14 }}>
                  Product
                </div>
                <h2 style={{ margin: '0 0 20px', fontSize: 36, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  ShieldVault
                </h2>
                <p style={{ fontSize: 16, color: 'var(--color-body)', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 420 }}>
                  A mobile payment app for mainstream users. Sign up with email, pay with a VISA card,
                  and earn automatically on every dollar in the account.
                  No wallet. No confirmations. Privacy by default.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {([
                    { label: 'Email or Google', sub: 'No wallet required' },
                    { label: 'VISA + Apple Pay', sub: 'USD and EUR' },
                    { label: 'Auto-yield', sub: 'Up to 6.2% APY' },
                    { label: 'Private by default', sub: 'Amounts stay confidential' },
                  ] as { label: string; sub: string }[]).map(({ label, sub }) => (
                    <div key={label} style={{
                      background: 'var(--color-surface-card)',
                      border: '1px solid var(--color-hairline)',
                      borderRadius: 10,
                      padding: '14px 16px',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: screenshot */}
              <div style={{ width: 240, flexShrink: 0 }}>
                <img
                  src={ScreenLanding}
                  alt="ShieldVault app"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
                />
              </div>

            </div>
          </div>

          {/* ── WHO IS THIS FOR ── */}

          <section id="user" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>00</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Who is this for</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 36px', lineHeight: 1.7 }}>
              ShieldVault is designed for people who want their money to work harder — without learning anything new.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }}>

              {/* Photo */}
              <div style={{
                borderRadius: 20,
                overflow: 'hidden',
                height: 340,
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-hairline)',
                flexShrink: 0,
              }}>
                <img
                  src={PersonaPhoto}
                  alt="Thomas Dupont"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Persona details */}
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>Thomas Dupont</div>
                  <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>32 — Senior Marketing Manager — Paris, France</div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  {['Revolut user', 'No crypto knowledge', 'Privacy-conscious', 'EU resident', 'Saving at 0.5% APY'].map(tag => (
                    <span key={tag} style={{
                      padding: '4px 12px', borderRadius: 99,
                      background: 'var(--color-surface-elevated)',
                      border: '1px solid var(--color-hairline)',
                      fontSize: 12, color: 'var(--color-body)',
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Pain points + goals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-error)', marginBottom: 14 }}>Pain points</div>
                    {[
                      'Savings earn almost nothing at the bank',
                      'Crypto is too complex to even start',
                      'No privacy in digital payments',
                      'Multiple apps for spending and saving',
                    ].map(p => (
                      <div key={p} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--color-error)', fontSize: 14, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>×</span>
                        <span style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-success)', marginBottom: 14 }}>What he wants</div>
                    {[
                      'Money earning without any effort',
                      'One card for everything, worldwide',
                      'Financial privacy without complexity',
                      'Set it, forget it — just works',
                    ].map(g => (
                      <div key={g} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--color-success)', fontSize: 14, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5 }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* QR code — try it on your phone */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            background: 'var(--color-glass-tint)',
            border: '1px solid rgba(235,252,14,0.25)',
            borderRadius: 16,
            padding: '28px 36px',
            marginBottom: 96,
          }}>
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 12, flexShrink: 0 }}>
              <QRCodeSVG value="https://shieldvault.netlify.app" size={96} bgColor="#FFFFFF" fgColor="#0A0A09" level="M" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 6 }}>
                Try it on your phone
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Scan to walk through the flow
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.6, marginBottom: 8 }}>
                Live prototype. Full onboarding flow, VISA card selection, auto-yield. No install required.
              </div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-muted)' }}>
                shieldvault.netlify.app
              </div>
            </div>
          </div>

          {/* ── AUTO-YIELD ── */}

          <section id="yield" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Bonus</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Auto-yield system</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 28px', lineHeight: 1.7, maxWidth: 640 }}>
              Every month the account balance generates a small return automatically.
              There is no separate savings product — the payment account itself earns.
              Users see it as <strong style={{ color: 'var(--color-ink)' }}>Earnings</strong> in the app, not yield or APY.
            </p>

            {/* How it works strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
              {([
                { label: 'Always on', desc: 'Earnings start the moment funds arrive. No opt-in, no setup.' },
                { label: 'Monthly payout', desc: 'The account balance grows once a month. Visible in the Earn tab.' },
                { label: 'Vault choice', desc: 'Users can switch vault at any time. Default is set during onboarding.' },
              ] as { label: string; desc: string }[]).map(({ label, desc }) => (
                <div key={label} style={{
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 12,
                  padding: '18px 20px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Vault options */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 14 }}>
              Available vaults
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {([
                { name: 'AAVE USD Coin',        apy: '4.2%', tag: 'Default', tagColor: 'var(--color-primary)', tagBg: 'rgba(235,252,14,0.12)' },
                { name: 'AAVE USD Coin v3',     apy: '4.8%', tag: 'AAVE',    tagColor: 'var(--color-muted)',   tagBg: 'var(--color-surface-elevated)' },
                { name: 'Morpho USDC',          apy: '5.1%', tag: 'Morpho',  tagColor: 'var(--color-muted)',   tagBg: 'var(--color-surface-elevated)' },
                { name: 'Morpho USDC Prime',    apy: '5.7%', tag: 'Morpho',  tagColor: 'var(--color-muted)',   tagBg: 'var(--color-surface-elevated)' },
                { name: 'Morpho USDC Boost',    apy: '6.2%', tag: 'Morpho',  tagColor: 'var(--color-muted)',   tagBg: 'var(--color-surface-elevated)' },
              ] as { name: string; apy: string; tag: string; tagColor: string; tagBg: string }[]).map(({ name, apy, tag, tagColor, tagBg }, i, arr) => (
                <div key={name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: i === 0 ? 'rgba(235,252,14,0.04)' : 'var(--color-surface-soft)',
                  border: '1px solid var(--color-hairline)',
                  borderTop: i === 0 ? '1px solid var(--color-hairline)' : 'none',
                  borderRadius: i === 0 ? '12px 12px 0 0' : i === arr.length - 1 ? '0 0 12px 12px' : 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px',
                      borderRadius: 99, background: tagBg, color: tagColor,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{tag}</span>
                    <span style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: 'var(--color-ink)' }}>{name}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-yield)', fontVariantNumeric: 'tabular-nums' }}>{apy}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── FLOWS ── */}

          <section id="flow-map" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>01</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Flow map</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 28px', lineHeight: 1.7 }}>
              Each node shows the actual screen: title, key UI elements, and primary action.
              Primary paths run left to right. The deposit step forks into two funding methods
              that merge back into a single processing state.
            </p>
            <Callout>
              <strong style={{ color: 'var(--color-ink)' }}>How to read this:</strong>{' '}
              Gold nodes are user-driven steps. Gray nodes are automatic system operations.
              Green is the success terminal. Red dashed branches show failures with retry paths.
            </Callout>
            <Legend />
            <FlowMap />
          </section>

          {/* ── PROBLEMS SOLVED ── */}

          <section id="problems" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>02</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Problems we were asked to solve</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 36px', lineHeight: 1.7 }}>
              ShieldVault is the retail pivot of ShieldPay. The brief defined four problems to solve
              by converting a DeFi product into something a mainstream user would actually choose.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {
                  problem: 'Blockchain is too complex for mainstream users',
                  solution: 'Every blockchain action — shielding, yield routing, signing — happens automatically. Users connect with email or Google. No wallet, no gas, no confirmation steps ever.',
                  tag: 'UX',
                },
                {
                  problem: 'DeFi yield is inaccessible without crypto literacy',
                  solution: 'Auto-yield is on by default from the moment funds arrive. No separate savings account, no protocol interaction. The payment account itself earns — up to 6.2% APY across 5 vault options.',
                  tag: 'Product',
                },
                {
                  problem: 'Neobanks have no amount confidentiality',
                  solution: 'Amounts stay private by default. The infrastructure ensures confidentiality without the user doing anything differently. Privacy is the default, not a feature to enable.',
                  tag: 'Infrastructure',
                },
                {
                  problem: 'Crypto-backed accounts cannot pay in the real world',
                  solution: 'A VISA card (PREMIER free, PREMIUM at $2/mo) connects directly to the account. Apple Pay supported. Users spend in USD or EUR from their balance, anywhere in the world.',
                  tag: 'Payments',
                },
              ].map(({ problem, solution, tag }, i, arr) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderRadius: i === 0 ? '14px 14px 0 0' : i === arr.length - 1 ? '0 0 14px 14px' : 0,
                  border: '1px solid var(--color-hairline)',
                  borderTop: i === 0 ? '1px solid var(--color-hairline)' : 'none',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '22px 24px', background: 'rgba(239,68,68,0.04)', borderRight: '1px solid var(--color-hairline)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-error)', marginBottom: 10, opacity: 0.7 }}>Problem</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.5 }}>{problem}</div>
                  </div>
                  <div style={{ padding: '22px 24px', background: 'var(--color-surface-soft)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 10, opacity: 0.8 }}>{tag}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.65 }}>{solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Page header */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 12 }}>
              ShieldVault
            </div>
            <h1 style={{ margin: '0 0 16px', fontSize: 38, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
              Design and flows
            </h1>
            <p style={{ fontSize: 17, color: 'var(--color-body)', lineHeight: 1.7, margin: 0, maxWidth: 680 }}>
              Design system tokens, component patterns, and user flow documentation for ShieldVault.
              A retail payment account backed by blockchain — users never see wallets, gas, or signing flows.
            </p>
          </div>

          <section id="screens" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>03</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Screen gallery</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 32px', lineHeight: 1.7 }}>
              Interactive walkthrough of every onboarding step. Click through the tabs or use the navigation buttons.
              Screens with automatic transitions (KYC review, deposit processing) will advance on their own after a few seconds.
            </p>
            <ScreenPreview />
          </section>

          <section id="onboarding" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>03</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Onboarding phases</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 28px', lineHeight: 1.7 }}>
              The onboarding state machine has a single happy path from registration to a funded,
              active account. The $50 minimum deposit requirement gates access to card selection.
            </p>

            {/* Presenter note */}
            <div style={{
              background: 'rgba(245,158,11,0.06)',
              border: '1px dashed rgba(245,158,11,0.35)',
              borderRadius: 10,
              padding: '16px 20px',
              marginBottom: 32,
              fontFamily: 'Inter, sans-serif',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F59E0B', marginBottom: 8 }}>
                Presenter note
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-body)', lineHeight: 1.7 }}>
                This prototype collects all identity fields upfront. Production will use{' '}
                <strong style={{ color: 'var(--color-ink)' }}>progressive KYC</strong>{' '}
                — email only at signup, full identity requested only when a transaction threshold is crossed.
              </p>
            </div>

            <PhaseTable rows={[
              ['email',             'USER',    'Email input + Google/Apple SSO. KYC notice shown upfront.',                                      'Yes'],
              ['email_verification','USER',    '6-digit OTP auto-sent. Auto-submits on completion. Resend after 30s.',                            'Yes'],
              ['identity',          'USER',    'Full name, date of birth, phone, street address, city, postal code, country.',                    'Yes'],
              ['passport',          'USER',    'Passport, national ID, or driving licence. Take photo or upload. Max 10 MB.',                     'Yes'],
              ['kyc_review',        'SYSTEM',  'Generic KYC provider reviews document automatically. Usually seconds.',                          'Yes — notified on completion'],
              ['kyc_rejected',      'TERMINAL','Document unclear or identity not confirmed. Retry with a clearer photo.',                         'n/a — retry from passport'],
              ['tos',               'USER',    'Scrollable Terms of Service. Checkbox required to proceed.',                                      'Yes'],
              ['funding',           'USER',    '4.2% APY auto-yield callout. Choose: send crypto or bank / card.',                                'Yes'],
              ['funding_crypto',    'USER',    'Deposit address with copy button. Supports USDC, ETH, BTC. Min $50.',                             'Yes — deposit detected on return'],
              ['funding_fiat',      'USER',    'Bank transfer (free, 1-3 days) or credit/debit card (instant, fee applies).',                     'Yes — transfer detected on return'],
              ['processing',        'SYSTEM',  'Spinner auto-advances ~30s. Confirms deposit received. Min $50 required.',                        'Yes — confirmed on return'],
              ['failed',            'TERMINAL','Deposit not confirmed or below $50. Retry returns to funding step.',                             'n/a — restart from funding'],
              ['card_selection',    'USER',    'VISA card visual. PREMIER (free) vs PREMIUM ($2/mo). Perks listed per tier.',                     'Yes'],
              ['completed',         'DONE',    'Shield check animation. $50.00 balance shown. Earning 4.2% APY.',                                 'n/a — complete'],
            ]} />
          </section>

          <section id="copy-rules" data-section="" style={{ marginBottom: 96, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>04</span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>Copy rules</h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: '0 0 32px', lineHeight: 1.7 }}>
              Every UI state answers three questions: what is happening right now, what should the user do,
              and what happens if they leave.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Forbidden', col: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.20)', terms: ['gas', 'blockchain', 'wallet', 'USDC address', 'mempool', 'confirmation hash', 'FHE', 'smart contract', 'private key', 'pending'] },
                { label: 'Preferred', col: '#22C55E', bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.20)',  terms: ['account', 'balance', 'transfer', 'deposit', 'payment', 'earnings', 'yield', 'sending', 'confirming', 'processing'] },
              ].map(({ label, col, bg, border, terms }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: col, marginBottom: 14 }}>
                    {label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {terms.map(t => (
                      <span key={t} style={{ padding: '3px 9px', background: 'var(--color-surface-elevated)', border: `1px solid ${col}22`, borderRadius: 4, fontSize: 12, color: 'var(--color-body)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Design decision: Yield vs Earn */}
            <div style={{
              marginTop: 28,
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-hairline-strong)',
              borderLeft: '3px solid var(--color-primary)',
              borderRadius: '0 10px 10px 0',
              padding: '20px 24px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 10 }}>
                Design decision
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8, lineHeight: 1.4 }}>
                {"\"Yield\" is DeFi vocabulary — it lives in the anti-reference pile alongside \"gas\" and \"wallet\""}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.7 }}>
                {"\"Yield\" stays in code internals and provider technical names (AAVE is still called AAVE). User-facing copy uses "}
                <strong style={{ color: 'var(--color-ink)' }}>earn / earnings / earning X%</strong>
                {" instead. The word \"yield\" never appears in the UI."}
              </div>
            </div>
          </section>

          {/* ── DESIGN SYSTEM ── */}

          <div style={{ marginBottom: 56, paddingTop: 56, borderTop: '1px solid var(--color-hairline)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 10 }}>Design system</div>
            <h2 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.025em' }}>Token reference</h2>
            <p style={{ fontSize: 15, color: 'var(--color-body)', margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
              All visual decisions are encoded as CSS custom properties. Every component uses tokens — no hardcoded values in production code.
            </p>
          </div>

          <DSSection id="ds-colors" tag="Colors" title="Color system" desc="A near-black canvas with warm gold as the single accent. One yellow per screen — no accent stacking.">
            <ColorSection />
          </DSSection>

          <DSSection id="ds-typography" tag="Typography" title="Type scale" desc="Inter only. 700+ weight with negative letter-spacing for headlines. Tabular-nums on all monetary amounts.">
            <TypeSection />
          </DSSection>

          <DSSection id="ds-spacing" tag="Spacing" title="Spacing and radius" desc="4px base grid. Border radius scale from sharp (4px) to pill (9999px).">
            <SpacingSection />
          </DSSection>

          <DSSection id="ds-glass" tag="Glass" title="Glass system" desc="Cards as illuminated dark surfaces with hairline borders. No drop shadows — depth comes from surface layering.">
            <GlassSection />
          </DSSection>

          <DSSection id="ds-motion" tag="Motion" title="Motion tokens" desc="Slow ease-out cubic-bezier(0.16, 1, 0.3, 1). No spring bounce. Durations 150 to 700ms.">
            <MotionSection />
          </DSSection>

          <DSSection id="ds-buttons" tag="Buttons" title="Button system" desc="Primary uses warm gold with on-primary text. Secondary and ghost variants for supporting actions.">
            <ButtonSection />
          </DSSection>

        </div>
      </main>
    </div>
  )
}
