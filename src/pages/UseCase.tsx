import { useRef, useState, useEffect } from 'react'

// ── Actor config ──────────────────────────────────────────────────────────────

type Actor = 'user' | 'system' | 'done' | 'error'

const COL: Record<Actor, string> = {
  user:   '#1A56DB',
  system: '#6B7280',
  done:   '#059669',
  error:  '#DC2626',
}

const FMBG: Record<Actor, string> = {
  user:   'rgba(26,86,219,0.07)',
  system: 'rgba(107,114,128,0.08)',
  done:   'rgba(5,150,105,0.08)',
  error:  'rgba(220,38,38,0.07)',
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

// ── FlowMap ───────────────────────────────────────────────────────────────────

function FlowMap() {
  const NW = 175, NH = 132
  const FW = 160, FH = 112
  const STEP = 210
  const MAIN_X = 20

  const OB_Y      = 146
  const FORK_Y    = 340
  const OB_FAIL_Y = 470
  const SEP_Y     = 560
  const PAY_Y     = 650
  const PAY_FAIL_Y = 790

  const px = (i: number) => MAIN_X + i * STEP

  // ── Onboarding main track (10 nodes) ──
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

  // ── KYC rejected terminal (below kyc_review, index 4) ──
  const kycRejected: FN = {
    id: 'kyc_rejected', title: 'Verification unsuccessful',
    lines: ['Document unclear or rejected'],
    actor: 'error', x: px(4) + NW / 2 - 65, y: OB_FAIL_Y, variant: 'terminal',
  }

  // ── Funding fork nodes — centered between funding (6) and processing (7) ──
  const gapCx = (px(6) + NW / 2 + px(7) + NW / 2) / 2
  const forkCrypto: FN = {
    id: 'fork_crypto', title: 'Send crypto',
    lines: ['Deposit address with copy button', 'USDC, ETH, BTC — min $50', 'Arrival under 1 minute'],
    cta: "I've sent the funds",
    actor: 'user', x: gapCx - FW - 6, y: FORK_Y, variant: 'fork',
  }
  const forkFiat: FN = {
    id: 'fork_fiat', title: 'Bank or card',
    lines: ['Bank transfer — free, 1-3 days', 'Credit / debit card — instant, fee'],
    actor: 'user', x: gapCx + 6, y: FORK_Y, variant: 'fork',
  }

  // ── Deposit failed terminal (below processing, index 7) ──
  const obFailed: FN = {
    id: 'ob_failed', title: 'Deposit not confirmed',
    lines: ['Below $50 or not received'],
    actor: 'error', x: px(7) + NW / 2 - 65, y: OB_FAIL_Y, variant: 'terminal',
  }

  // ── Payment track ──
  const payMain: FN[] = [
    {
      id: 'pay_idle', title: 'Send payment',
      lines: ['Recipient and amount input', 'Balance checked before send'],
      cta: 'Send',
      actor: 'user', x: px(0), y: PAY_Y, variant: 'main',
    },
    {
      id: 'pay_submitting', title: 'Submitting',
      lines: ['Sub-1s spinner — automatic', 'Blockchain op runs silently'],
      actor: 'system', x: px(1), y: PAY_Y, variant: 'main',
    },
    {
      id: 'pay_processing', title: 'Processing',
      lines: ['On-chain confirmation', 'A few seconds — close app safely'],
      actor: 'system', x: px(2), y: PAY_Y, variant: 'main',
    },
    {
      id: 'pay_completed', title: 'Payment sent',
      lines: ['Balance updated', 'Transaction confirmed'],
      actor: 'done', x: px(3), y: PAY_Y, variant: 'main',
    },
  ]

  const payFailed: FN = {
    id: 'pay_failed', title: 'Payment failed',
    lines: ['No funds moved — retry'],
    actor: 'error', x: px(2) + NW / 2 - 65, y: PAY_FAIL_Y, variant: 'terminal',
  }

  const allNodes: FN[] = [...obMain, kycRejected, forkCrypto, forkFiat, obFailed, ...payMain, payFailed]

  const CANVAS_W = px(9) + NW + 40
  const CANVAS_H = PAY_FAIL_Y + 48 / 2 + 80

  // ── SVG helpers ──
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

  // funding (index 6) → fork (down)
  const fundingBotX = cx(obMain[6])
  const fundingBotY = bot(obMain[6])
  const forkDownCrypto = `M${fundingBotX},${fundingBotY} C${fundingBotX},${fundingBotY + 28} ${cx(forkCrypto)},${top(forkCrypto) - 28} ${cx(forkCrypto)},${top(forkCrypto)}`
  const forkDownFiat   = `M${fundingBotX},${fundingBotY} C${fundingBotX},${fundingBotY + 28} ${cx(forkFiat)},${top(forkFiat) - 28} ${cx(forkFiat)},${top(forkFiat)}`

  // fork → processing (index 7, up)
  const procLeftX = obMain[7].x
  const procY     = cy(obMain[7])
  const mergeFromCrypto = `M${cx(forkCrypto)},${bot(forkCrypto)} C${cx(forkCrypto)},${bot(forkCrypto) + 32} ${procLeftX - 24},${procY + 24} ${procLeftX},${procY}`
  const mergeFromFiat   = `M${cx(forkFiat)},${bot(forkFiat)}   C${cx(forkFiat)},${bot(forkFiat) + 32}   ${procLeftX - 12},${procY + 18} ${procLeftX},${procY}`

  // retry arc: obFailed left → funding (index 6) bottom
  const retryArc = (() => {
    const fx = obFailed.x, fy = obFailed.y
    const tx = fundingBotX, ty = bot(obMain[6])
    return `M${fx},${fy} C${fx - 28},${fy + 42} ${tx - 80},${ty + 52} ${tx},${ty}`
  })()

  // kycRejected retry arc: left edge → passport (index 3) bottom
  const kycRetryArc = (() => {
    const fx = kycRejected.x, fy = kycRejected.y
    const tx = cx(obMain[3]), ty = bot(obMain[3])
    return `M${fx},${fy} C${fx - 32},${fy + 40} ${tx - 20},${ty + 40} ${tx},${ty}`
  })()

  // ── Pan / zoom ──
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

  // ── Node renderer ──
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
        <div style={{
          fontSize: isTerminal ? 9 : 10.5,
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1.2,
          marginBottom: isTerminal ? 2 : 4,
          flexShrink: 0,
        }}>
          {node.title}
        </div>

        {node.lines.map((line, i) => (
          <div key={i} style={{
            fontSize: 8.5,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.4,
            marginBottom: 1,
            flexShrink: 0,
          }}>
            {line}
          </div>
        ))}

        {node.cta && (
          <div style={{
            marginTop: 5,
            fontSize: 8,
            fontWeight: 600,
            color: col,
            borderTop: `1px solid ${col}20`,
            paddingTop: 4,
            flexShrink: 0,
          }}>
            {node.cta}
          </div>
        )}

        <div style={{
          marginTop: 'auto',
          paddingTop: 3,
          fontSize: 7,
          fontWeight: 800,
          color: col,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          flexShrink: 0,
        }}>
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
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Hint */}
      <div style={{
        position: 'absolute', top: 10, right: 14, zIndex: 10,
        fontSize: 9, color: 'var(--color-text-muted)',
        letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', opacity: 0.55,
      }}>
        scroll to zoom | drag to pan
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 10, display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginRight: 6, fontVariantNumeric: 'tabular-nums', fontFamily: 'Inter, sans-serif' }}>
          {Math.round(xform.scale * 100)}%
        </span>
        {([
          ['+',    () => { const n = Math.min(2.5, scaleRef.current * 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['-',    () => { const n = Math.max(0.25, scaleRef.current / 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['reset',() => { scaleRef.current = INIT_SCALE; txRef.current = 0; tyRef.current = 0; setXform({ tx: 0, ty: 0, scale: INIT_SCALE }) }],
        ] as [string, () => void][]).map(([lbl, fn]) => (
          <button key={lbl} onClick={fn} onPointerDown={e => e.stopPropagation()} style={{
            padding: '0 8px', height: 26,
            border: '1px solid var(--color-border)',
            borderRadius: 5, background: 'var(--color-surface)',
            fontSize: 11, fontWeight: 600,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{lbl}</button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transformOrigin: '0 0',
        transform: `translate(${xform.tx}px,${xform.ty}px) scale(${xform.scale})`,
        width: CANVAS_W, height: CANVAS_H,
      }}>
        <svg
          width={CANVAS_W} height={CANVAS_H}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          <defs>
            <marker id="sv-a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--color-border)" />
            </marker>
            <marker id="sv-e" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#DC2626" />
            </marker>
            <marker id="sv-n" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="var(--color-border)" />
            </marker>
          </defs>

          {/* Onboarding: email → … → kyc_review → tos (indices 0-5, skip 6→7 which forks) */}
          {obMain.slice(0, 5).map((n, i) => (
            <path key={`ob-h${i}`} d={hLink(n, obMain[i + 1])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          {/* processing → card_selection → completing (indices 7-9) */}
          {obMain.slice(7, 9).map((n, i) => (
            <path key={`ob-h2${i}`} d={hLink(n, obMain[8 + i])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          {/* KYC rejected drop from kyc_review (index 4) */}
          <path d={dropArc(obMain[4], kycRejected)} stroke="#DC2626" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />

          {/* KYC retry arc: rejected → passport (index 3) */}
          <path d={kycRetryArc} stroke="#DC2626" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <text
            x={kycRejected.x - 32}
            y={OB_FAIL_Y + 52}
            style={{ fontSize: 8, fill: '#DC2626', fontFamily: 'Inter, sans-serif', fontWeight: 700, opacity: 0.7 }}
          >
            retry
          </text>

          {/* funding → fork nodes (down) */}
          <path d={forkDownCrypto} stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />
          <path d={forkDownFiat}   stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />

          {/* fork nodes → processing (merge back up) */}
          <path d={mergeFromCrypto} stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />
          <path d={mergeFromFiat}   stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />

          {/* Deposit failed drop from processing (index 7) */}
          <path d={dropArc(obMain[7], obFailed)} stroke="#DC2626" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />

          {/* Deposit retry arc: failed → funding (index 6) */}
          <path d={retryArc} stroke="#DC2626" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />
          <text
            x={obFailed.x - 38}
            y={OB_FAIL_Y + 52}
            style={{ fontSize: 8, fill: '#DC2626', fontFamily: 'Inter, sans-serif', fontWeight: 700, opacity: 0.7 }}
          >
            retry
          </text>

          {/* Separator */}
          <line x1={16} y1={SEP_Y} x2={CANVAS_W - 16} y2={SEP_Y} stroke="var(--color-border)" strokeWidth="1" opacity={0.28} />

          {/* Payment: idle → submitting → processing → completed */}
          {payMain.slice(0, 3).map((n, i) => (
            <path key={`py-h${i}`} d={hLink(n, payMain[i + 1])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          {/* Payment: failed drop from processing */}
          <path d={dropArc(payMain[2], payFailed)} stroke="#DC2626" strokeWidth="1" fill="none" strokeDasharray="4,3" opacity={0.4} markerEnd="url(#sv-e)" />

          {/* Section labels */}
          {[
            { label: 'ONBOARDING', x: MAIN_X,    y: OB_Y - NH / 2 - 22,  color: '#1A56DB' },
            { label: 'PAYMENT',    x: px(0),       y: PAY_Y - NH / 2 - 22, color: '#059669' },
          ].map(({ label, x, y, color }) => (
            <g key={label}>
              <line x1={x} y1={y - 1} x2={x + 16} y2={y - 1} stroke={color} strokeWidth="2" strokeLinecap="round" />
              <text x={x + 22} y={y + 4} style={{ fontSize: 10, fontWeight: 800, fill: color, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                {label}
              </text>
            </g>
          ))}

          {/* Fork label */}
          <text
            x={gapCx}
            y={FORK_Y - FH / 2 - 8}
            textAnchor="middle"
            style={{ fontSize: 8.5, fill: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
          >
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
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{desc}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={40} height={20} style={{ overflow: 'visible' }}>
          <line x1={0} y1={10} x2={36} y2={10} stroke="#DC2626" strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />
          <polygon points="36 7, 40 10, 36 13" fill="#DC2626" opacity={0.5} />
        </svg>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>failure or error branch</span>
      </div>
    </div>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────────

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(26,86,219,0.04)',
      border: '1px solid rgba(26,86,219,0.18)',
      borderRadius: 6, padding: '14px 18px', marginBottom: 28,
      fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65,
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
                borderBottom: '2px solid var(--color-border)',
                fontSize: 11, fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : 'var(--color-surface-subtle)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-border)',
                  color: ci === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
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

// ── State pill ────────────────────────────────────────────────────────────────

function StatePill({ state, actor }: { state: string; actor: Actor }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 99,
      background: FMBG[actor], border: `1px solid ${COL[actor]}2A`,
      fontSize: 12, fontWeight: 600, color: COL[actor],
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: COL[actor], flexShrink: 0 }} />
      {state}
    </span>
  )
}

// ── UseCase page ──────────────────────────────────────────────────────────────

export function UseCase() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div style={{ padding: '80px 72px 72px', background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px',
            background: 'rgba(26,86,219,0.07)', border: '1px solid rgba(26,86,219,0.18)',
            borderRadius: 99, fontSize: 11, fontWeight: 700, color: '#1A56DB',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20,
          }}>
            ShieldVault
          </div>
          <h1 style={{ margin: '0 0 20px', fontSize: 34, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.035em', lineHeight: 1.2 }}>
            User flow and interaction model
          </h1>
          <p style={{ fontSize: 17, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, maxWidth: 720 }}>
            ShieldVault is a retail payment account backed by blockchain. The onboarding flow
            takes users from registration through identity verification, deposit, and card selection.
            Every blockchain operation runs under the hood
            {' — '}
            users never see wallets, gas, or signing flows.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '72px 72px 80px', maxWidth: 1080, margin: '0 auto' }}>

        {/* 01 — Flow map */}
        <section style={{ marginBottom: 96 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A56DB', letterSpacing: '0.04em' }}>01</span>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Flow map
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 28px', lineHeight: 1.7 }}>
            Each node shows the actual screen: title, key UI elements, and primary action.
            Primary paths run left to right. The deposit step forks into two funding methods
            that merge back into a single processing state. Zoom in to read node detail.
          </p>
          <Callout>
            <strong style={{ color: 'var(--color-text-primary)' }}>How to read this:</strong>{' '}
            Blue nodes are user-driven steps. Gray nodes are automatic system operations.
            Green is the success terminal. Red dashed branches show failures with retry paths.
            The deposit fork shows two funding methods (crypto or fiat) that converge into the same processing state.
          </Callout>
          <Legend />
          <FlowMap />
        </section>

        {/* 02 — Onboarding phases */}
        <section style={{ marginBottom: 96 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A56DB', letterSpacing: '0.04em' }}>02</span>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Onboarding phases
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 32px', lineHeight: 1.7 }}>
            The onboarding state machine has a single happy path from registration to a funded,
            active account. The $50 minimum deposit requirement gates access to card selection and account activation.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {[
              ['email', 'user'], ['email_verification', 'user'], ['identity', 'user'],
              ['passport', 'user'], ['kyc_review', 'system'], ['kyc_rejected', 'error'],
              ['tos', 'user'], ['funding', 'user'], ['funding_crypto', 'user'],
              ['funding_fiat', 'user'], ['processing', 'system'], ['failed', 'error'],
              ['card_selection', 'user'], ['completed', 'done'],
            ].map(([s, a]) => <StatePill key={s} state={s} actor={a as Actor} />)}
          </div>
          <PhaseTable rows={[
            ['email',             'USER',    'Email input + Google/Apple SSO. KYC notice shown upfront.',                                      'Yes'],
            ['email_verification','USER',    '6-digit OTP auto-sent. Auto-submits on completion. Resend after 30s.',                            'Yes'],
            ['identity',          'USER',    'Full name, date of birth, phone, street address, city, postal code, country. Required by EU AML.','Yes'],
            ['passport',          'USER',    'Passport, national ID, or driving licence. Take photo or upload. Max 10 MB.',                     'Yes'],
            ['kyc_review',        'SYSTEM',  'Generic KYC provider reviews document automatically. Usually seconds. Fallback: 24-72h manual.',  'Yes — notified on completion'],
            ['kyc_rejected',      'TERMINAL','Document unclear or identity not confirmed. Retry with a clearer photo.',                          'n/a — retry from passport'],
            ['tos',               'USER',    'Scrollable Terms of Service. Checkbox required to proceed.',                                      'Yes'],
            ['funding',           'USER',    '4.2% APY auto-yield callout. Choose: send crypto or bank / card.',                                'Yes'],
            ['funding_crypto',    'USER',    'Deposit address with copy button. Supports USDC, ETH, BTC. Min $50.',                             'Yes — deposit detected on return'],
            ['funding_fiat',      'USER',    'Bank transfer (free, 1-3 days) or credit/debit card (instant, fee applies).',                     'Yes — transfer detected on return'],
            ['processing',        'SYSTEM',  'Spinner auto-advances ~30s. Confirms deposit received. Min $50 required.',                        'Yes — confirmed on return'],
            ['failed',            'TERMINAL','Deposit not confirmed or below $50. Retry returns to funding step.',                              'n/a — restart from funding'],
            ['card_selection',    'USER',    'VISA card visual. PREMIER (free) vs PREMIUM ($2/mo). Perks listed per tier.',                     'Yes'],
            ['completed',         'DONE',    'Shield check animation. $50.00 balance shown. Earning 4.2% APY.',                                 'n/a — complete'],
          ]} />
        </section>

        {/* 03 — Payment phases */}
        <section style={{ marginBottom: 96 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A56DB', letterSpacing: '0.04em' }}>03</span>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Payment flow
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 32px', lineHeight: 1.7 }}>
            Post-onboarding payments are a four-state machine with no wallet confirmation steps.
            The submitting state replaces the entire wallet signature flow
            {' — '}
            it is invisible to the user (spinner only, sub-1s). Users never see gas, signing requests, or transaction hashes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {[
              ['idle', 'user'], ['submitting', 'system'],
              ['processing', 'system'], ['completed', 'done'], ['failed', 'error'],
            ].map(([s, a]) => <StatePill key={s} state={s} actor={a as Actor} />)}
          </div>
          <PhaseTable rows={[
            ['idle',       'USER',    'Recipient and amount input. Balance checked before send.',            'Yes — nothing sent yet'],
            ['submitting', 'SYSTEM',  'Sub-1s spinner. Blockchain op initiated silently. Automatic.',        'Yes — completes or fails shortly'],
            ['processing', 'SYSTEM',  'On-chain confirmation in progress. A few seconds.',                   'Yes — balance updates on return'],
            ['completed',  'DONE',    'Payment sent. Balance updated. Transaction confirmed.',                'n/a — complete'],
            ['failed',     'TERMINAL','Payment failed. No funds moved. Retry starts a new payment.',         'n/a — retry from idle'],
          ]} />

          <div style={{ background: 'rgba(26,86,219,0.04)', border: '1px solid rgba(26,86,219,0.18)', borderRadius: 6, padding: '20px 24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
              Design principle
            </div>
            <blockquote style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              {"\"I started a payment. It went through. My balance is updated.\""}
            </blockquote>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {"Not: \"I signed something and I'm not sure if it worked.\""}
            </div>
          </div>
        </section>

        {/* 04 — Copy rules */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A56DB', letterSpacing: '0.04em' }}>04</span>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Copy rules
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 32px', lineHeight: 1.7 }}>
            Every UI state answers three questions: what is happening right now, what should the user do,
            and what happens if they leave.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Forbidden', color: '#DC2626', bg: 'rgba(220,38,38,0.04)', border: 'rgba(220,38,38,0.18)', terms: ['gas', 'blockchain', 'wallet', 'USDC address', 'mempool', 'confirmation hash', 'FHE', 'smart contract', 'private key', 'pending'] },
              { label: 'Preferred', color: '#059669', bg: 'rgba(5,150,105,0.04)', border: 'rgba(5,150,105,0.18)', terms: ['account', 'balance', 'transfer', 'deposit', 'payment', 'earnings', 'yield', 'sending', 'confirming', 'processing'] },
            ].map(({ label, color, bg, border, terms }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: 14 }}>
                  {label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {terms.map(t => (
                    <span key={t} style={{ padding: '3px 9px', background: 'rgba(255,255,255,0.7)', border: `1px solid ${color}22`, borderRadius: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
