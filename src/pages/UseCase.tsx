import { useRef, useState, useEffect } from 'react'

// ── Actor types ───────────────────────────────────────────────────────────────

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

// ── Node types ────────────────────────────────────────────────────────────────

interface FN {
  id: string
  label: string
  sub?: string
  actor: Actor
  x: number
  y: number
  small?: boolean
}

// ── FlowMap ───────────────────────────────────────────────────────────────────

function FlowMap() {
  const NW = 90, NH = 52
  const FW = 74, FH = 36
  const STEP = 110

  // Y positions
  const OB_Y   = 110   // onboarding main
  const FORK_Y = 220   // crypto/fiat fork nodes
  const OB_FAIL_Y = 318 // onboarding failed
  const SEP_Y  = 370   // separator
  const PAY_Y  = 430   // payment main
  const PAY_FAIL_Y = 530 // payment failed

  const MAIN_X = 20
  const px = (i: number) => MAIN_X + i * STEP

  const CANVAS_W = px(7) + NW + 40
  const CANVAS_H = PAY_FAIL_Y + FH / 2 + 52

  // Onboarding main nodes
  const obMain: FN[] = [
    { id: 'ob0', label: 'Identity',     sub: 'name, DOB, address',  actor: 'user',   x: px(0), y: OB_Y },
    { id: 'ob1', label: 'Verify ID',    sub: 'passport + KYC',      actor: 'user',   x: px(1), y: OB_Y },
    { id: 'ob2', label: 'Terms',        sub: 'sign agreement',       actor: 'user',   x: px(2), y: OB_Y },
    { id: 'ob3', label: 'Deposit',      sub: 'choose method',        actor: 'user',   x: px(3), y: OB_Y },
    { id: 'ob4', label: 'Processing',   sub: '~30s confirm',         actor: 'system', x: px(4), y: OB_Y },
    { id: 'ob5', label: 'Choose card',  sub: 'Visa tier',            actor: 'user',   x: px(5), y: OB_Y },
    { id: 'ob6', label: 'Ready',        sub: 'account active',       actor: 'done',   x: px(6), y: OB_Y },
  ]

  // Fork nodes below Deposit (ob3)
  const forkCrypto: FN = {
    id: 'fc', label: 'Crypto',  sub: 'USDC transfer', actor: 'user',
    x: px(3) - FW / 2 - 4, y: FORK_Y, small: true,
  }
  const forkFiat: FN = {
    id: 'ff', label: 'Fiat',    sub: 'bank / card',   actor: 'user',
    x: px(3) + FW / 2 + 4, y: FORK_Y, small: true,
  }

  // Failed node below Processing (ob4)
  const obFailed: FN = {
    id: 'obf', label: 'Failed', sub: 'retry deposit', actor: 'error',
    x: px(4), y: OB_FAIL_Y, small: true,
  }

  // Payment main nodes
  const payMain: FN[] = [
    { id: 'py0', label: 'Payment',    sub: 'enter details', actor: 'user',   x: px(1), y: PAY_Y },
    { id: 'py1', label: 'Confirming', sub: 'instant',       actor: 'system', x: px(2), y: PAY_Y },
    { id: 'py2', label: 'Processing', sub: 'a few seconds', actor: 'system', x: px(3), y: PAY_Y },
    { id: 'py3', label: 'Sent',       sub: 'balance updated', actor: 'done', x: px(4), y: PAY_Y },
  ]

  // Payment failed below processing
  const payFailed: FN = {
    id: 'pyf', label: 'Failed', sub: 'try again', actor: 'error',
    x: px(3), y: PAY_FAIL_Y, small: true,
  }

  const allNodes: FN[] = [
    ...obMain, forkCrypto, forkFiat, obFailed,
    ...payMain, payFailed,
  ]

  // SVG path helpers
  const hLink = (a: FN, b: FN) =>
    `M${a.x + NW},${a.y} L${b.x},${b.y}`

  const dropFrom = (from: FN, to: FN) => {
    const cx = from.x + (from.small ? FW : NW) / 2
    const y1 = from.y + (from.small ? FH : NH) / 2
    const y2 = to.y - (to.small ? FH : NH) / 2
    return `M${cx},${y1} C${cx},${y1 + 20} ${cx},${y2 - 20} ${cx},${y2}`
  }

  // Fork: from deposit node down to crypto/fiat
  const depositCx = obMain[3].x + NW / 2
  const depositBottom = obMain[3].y + NH / 2
  const forkCryptoCx = forkCrypto.x + FW / 2
  const forkFiatCx = forkFiat.x + FW / 2
  const forkTop = FORK_Y - FH / 2

  const forkLineCrypto = `M${depositCx},${depositBottom} C${depositCx},${depositBottom + 20} ${forkCryptoCx},${forkTop - 20} ${forkCryptoCx},${forkTop}`
  const forkLineFiat   = `M${depositCx},${depositBottom} C${depositCx},${depositBottom + 20} ${forkFiatCx},${forkTop - 20} ${forkFiatCx},${forkTop}`

  // Merge: from crypto/fiat up to processing
  const processingCx = obMain[4].x + NW / 2
  const processingTop = obMain[4].y - NH / 2
  const forkCryptoBot = FORK_Y + FH / 2
  const forkFiatBot   = FORK_Y + FH / 2

  const mergeCrypto = `M${forkCryptoCx},${forkCryptoBot} C${forkCryptoCx},${forkCryptoBot + 20} ${processingCx - 10},${processingTop - 20} ${processingCx},${processingTop}`
  const mergeFiat   = `M${forkFiatCx},${forkFiatBot} C${forkFiatCx},${forkFiatBot + 20} ${processingCx + 10},${processingTop - 20} ${processingCx},${processingTop}`

  // Pan/zoom state
  const INIT_SCALE = 0.88
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(INIT_SCALE)
  const txRef = useRef(0)
  const tyRef = useRef(0)
  const dragRef = useRef<{ sx: number; sy: number; stx: number; sty: number } | null>(null)
  const [xform, setXform] = useState({ tx: 0, ty: 0, scale: INIT_SCALE })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.92 : 1.09
      const next = Math.min(2.5, Math.max(0.3, scaleRef.current * factor))
      const rect = el.getBoundingClientRect()
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
    const w = node.small ? FW : NW
    const h = node.small ? FH : NH
    const col = COL[node.actor]
    return (
      <div
        key={node.id}
        style={{
          position: 'absolute',
          left: node.x,
          top: node.y - h / 2,
          width: w,
          height: h,
          background: FMBG[node.actor],
          border: `1px solid ${col}${node.small ? '28' : '3C'}`,
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          boxSizing: 'border-box',
          opacity: node.small ? 0.75 : 1,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{
          fontSize: node.small ? 9 : 11,
          fontWeight: node.actor === 'system' ? 500 : 700,
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          lineHeight: 1.15,
          padding: '0 4px',
        }}>
          {node.label}
        </span>
        {node.sub && (
          <span style={{
            fontSize: 7.5,
            color: node.small ? col : 'var(--color-text-secondary)',
            textAlign: 'center',
            lineHeight: 1.1,
            padding: '0 4px',
          }}>
            {node.sub}
          </span>
        )}
        <span style={{
          fontSize: 7,
          fontWeight: 800,
          color: col,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {FMAL[node.actor]}
        </span>
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
        width: '100%',
        height: 560,
        overflow: 'hidden',
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
        letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', opacity: 0.6,
      }}>
        scroll to zoom | drag to pan
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, zIndex: 10,
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        <span style={{
          fontSize: 10, color: 'var(--color-text-secondary)',
          marginRight: 6, fontVariantNumeric: 'tabular-nums',
          fontFamily: 'Inter, sans-serif',
        }}>
          {Math.round(xform.scale * 100)}%
        </span>
        {([
          ['+', () => { const n = Math.min(2.5, scaleRef.current * 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['-', () => { const n = Math.max(0.3, scaleRef.current / 1.2); scaleRef.current = n; setXform(x => ({ ...x, scale: n })) }],
          ['reset', () => { scaleRef.current = INIT_SCALE; txRef.current = 0; tyRef.current = 0; setXform({ tx: 0, ty: 0, scale: INIT_SCALE }) }],
        ] as [string, () => void][]).map(([lbl, fn]) => (
          <button
            key={lbl}
            onClick={fn}
            onPointerDown={e => e.stopPropagation()}
            style={{
              padding: '0 8px', height: 26,
              border: '1px solid var(--color-border)',
              borderRadius: 5,
              background: 'var(--color-surface)',
              fontSize: 11, fontWeight: 600,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {lbl}
          </button>
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
          width={CANVAS_W}
          height={CANVAS_H}
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

          {/* Onboarding main flow: identity → verification → tos → deposit */}
          {obMain.slice(0, 3).map((n, i) => (
            <path key={`ob${i}`} d={hLink(n, obMain[i + 1])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}
          {/* deposit → processing (skip — goes via fork) */}
          {/* processing → card_selection → ready */}
          {obMain.slice(4, -1).map((n, i) => (
            <path key={`ob2${i}`} d={hLink(n, obMain[5 + i])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          {/* Fork lines: deposit → crypto, deposit → fiat */}
          <path d={forkLineCrypto} stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />
          <path d={forkLineFiat}   stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-n)" />

          {/* Merge lines: crypto → processing, fiat → processing */}
          <path d={mergeCrypto} stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />
          <path d={mergeFiat}   stroke="var(--color-border)" strokeWidth="1.5" fill="none" markerEnd="url(#sv-a)" />

          {/* Failed drop from processing */}
          <path
            d={dropFrom(obMain[4], obFailed)}
            stroke="#DC2626" strokeWidth="1" fill="none"
            strokeDasharray="4,3" opacity={0.4}
            markerEnd="url(#sv-e)"
          />

          {/* Retry arc from failed back to deposit */}
          {(() => {
            const fx = obFailed.x + FW / 2
            const fy = obFailed.y - FH / 2
            const tx = obMain[3].x + NW / 2
            const ty = obMain[3].y + NH / 2
            return (
              <path
                d={`M${fx},${fy} C${fx},${fy - 30} ${tx},${ty + 40} ${tx},${ty}`}
                stroke="#DC2626" strokeWidth="1" fill="none"
                strokeDasharray="4,3" opacity={0.45}
                markerEnd="url(#sv-e)"
              />
            )
          })()}

          {/* Separator */}
          <line x1={16} y1={SEP_Y} x2={CANVAS_W - 16} y2={SEP_Y} stroke="var(--color-border)" strokeWidth="1" opacity={0.3} />

          {/* Payment main flow */}
          {payMain.slice(0, -1).map((n, i) => (
            <path key={`py${i}`} d={hLink(n, payMain[i + 1])} stroke="var(--color-border)" strokeWidth="2" fill="none" markerEnd="url(#sv-a)" />
          ))}

          {/* Failed drop from payment processing */}
          <path
            d={dropFrom(payMain[2], payFailed)}
            stroke="#DC2626" strokeWidth="1" fill="none"
            strokeDasharray="4,3" opacity={0.4}
            markerEnd="url(#sv-e)"
          />

          {/* Section labels */}
          <text x={MAIN_X} y={OB_Y - NH / 2 - 20} style={{ fontSize: 10, fontWeight: 800, fill: '#1A56DB', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ONBOARDING</text>
          <text x={px(1)} y={PAY_Y - NH / 2 - 20} style={{ fontSize: 10, fontWeight: 800, fill: '#059669', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PAYMENT</text>

          {/* Section colored bars */}
          <line x1={MAIN_X} y1={OB_Y - NH / 2 - 24} x2={MAIN_X + 16} y2={OB_Y - NH / 2 - 24} stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" />
          <line x1={px(1)} y1={PAY_Y - NH / 2 - 24} x2={px(1) + 16} y2={PAY_Y - NH / 2 - 24} stroke="#059669" strokeWidth="2" strokeLinecap="round" />

          {/* Fork label */}
          <text
            x={obMain[3].x + NW / 2}
            y={FORK_Y - FH / 2 - 6}
            style={{ fontSize: 8, fill: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif', textAnchor: 'middle' }}
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
    { actor: 'user',   label: 'USER',   desc: 'requires user input or decision' },
    { actor: 'system', label: 'SYSTEM', desc: 'automatic — user can leave safely' },
    { actor: 'done',   label: 'DONE',   desc: 'terminal success state' },
    { actor: 'error',  label: 'TERMINAL', desc: 'terminal failure — retry available' },
  ]

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32, fontFamily: 'Inter, sans-serif' }}>
      {items.map(({ actor, label, desc }) => (
        <div key={actor} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 20,
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
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>failure or terminal branch</span>
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
      borderRadius: 6,
      padding: '14px 18px',
      marginBottom: 32,
      fontSize: 14,
      color: 'var(--color-text-secondary)',
      lineHeight: 1.65,
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
              }}>
                {h}
              </th>
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
                }}>
                  {cell}
                </td>
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
      padding: '3px 10px',
      borderRadius: 99,
      background: FMBG[actor],
      border: `1px solid ${COL[actor]}2A`,
      fontSize: 12, fontWeight: 600,
      color: COL[actor],
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: COL[actor], flexShrink: 0,
      }} />
      {state}
    </span>
  )
}

// ── UseCase page ──────────────────────────────────────────────────────────────

export function UseCase() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div style={{
        padding: '80px 72px 72px',
        background: 'var(--color-surface-raised)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px',
            background: 'rgba(26,86,219,0.07)',
            border: '1px solid rgba(26,86,219,0.18)',
            borderRadius: 99,
            fontSize: 11, fontWeight: 700,
            color: '#1A56DB',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            ShieldVault
          </div>
          <h1 style={{
            margin: '0 0 20px',
            fontSize: 34,
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.035em',
            lineHeight: 1.2,
          }}>
            User flow and interaction model
          </h1>
          <p style={{
            fontSize: 17,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: 720,
          }}>
            ShieldVault is a retail payment account backed by blockchain. The onboarding flow
            takes users from registration through identity verification, deposit, and card selection.
            Every blockchain operation runs under the hood
            {" — "}
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
            Two flows: onboarding (one-time registration and funding) and payment (recurring).
            Primary paths run left to right. Dashed branches show failures. The deposit step
            forks into two funding methods that converge back into a single processing state.
          </p>
          <Callout>
            <strong style={{ color: 'var(--color-text-primary)' }}>How to read this:</strong>{' '}
            Blue nodes are user-driven steps. Gray nodes are automatic system operations the user can leave.
            Green is the success terminal. Red nodes are failures with retry paths.
            The deposit fork shows two methods (crypto transfer or fiat onramp) that merge into the same processing step.
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
            active account. The $50 minimum deposit requirement gates access to the VISA card
            selection and account activation.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {[
              ['identity', 'user'], ['verification', 'user'], ['tos', 'user'],
              ['funding', 'user'], ['funding_crypto', 'user'], ['funding_fiat', 'user'],
              ['processing', 'system'], ['failed', 'error'], ['card_selection', 'user'],
              ['completed', 'done'],
            ].map(([s, a]) => (
              <StatePill key={s} state={s} actor={a as Actor} />
            ))}
          </div>

          <PhaseTable rows={[
            ['identity',       'USER',   'User fills registration form: name, DOB, phone, address, email',         'Yes'],
            ['verification',   'USER',   'User uploads passport photo for KYC review',                             'Yes'],
            ['tos',            'USER',   'User reviews and agrees to Terms of Service',                             'Yes'],
            ['funding',        'USER',   'User chooses funding method: crypto transfer or fiat onramp',             'Yes'],
            ['funding_crypto', 'USER',   'User sends USDC or other crypto to a generated deposit address',          'Yes — deposit detected on return'],
            ['funding_fiat',   'USER',   'User completes bank transfer or credit card onramp via partner',          'Yes — transfer detected on return'],
            ['processing',     'SYSTEM', 'System confirms deposit receipt, minimum $50 required. Takes ~30s.',      'Yes — confirmed on return'],
            ['failed',         'TERMINAL','Deposit not confirmed or below minimum. User can retry a new deposit.',  'n/a — restart from funding'],
            ['card_selection', 'USER',   'User selects VISA PREMIER (free) or VISA PREMIUM ($2/month)',             'Yes'],
            ['completed',      'DONE',   'Account active. Balance available. VISA card issued.',                    'n/a — complete'],
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
            {" — "}
            it is invisible to the user (spinner only, sub-1s). Users never see gas, signing requests, or transaction hashes.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {[
              ['idle', 'user'], ['submitting', 'system'],
              ['processing', 'system'], ['completed', 'done'], ['failed', 'error'],
            ].map(([s, a]) => (
              <StatePill key={s} state={s} actor={a as Actor} />
            ))}
          </div>

          <PhaseTable rows={[
            ['idle',       'USER',    'User enters recipient and amount. Confirms payment.',         'Yes — nothing sent yet'],
            ['submitting', 'SYSTEM',  'Blockchain operation initiated silently. Sub-1s spinner.',    'Yes — completes or fails shortly'],
            ['processing', 'SYSTEM',  'Transfer confirming on-chain. A few seconds.',                'Yes — balance updates on return'],
            ['completed',  'DONE',    'Payment sent. Balance updated.',                              'n/a — complete'],
            ['failed',     'TERMINAL','Payment failed. No funds moved. User can retry.',             'n/a — retry from idle'],
          ]} />

          <div style={{
            background: 'rgba(26,86,219,0.04)',
            border: '1px solid rgba(26,86,219,0.18)',
            borderRadius: 6,
            padding: '20px 24px',
            fontFamily: 'Inter, sans-serif',
          }}>
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
            and what happens if they leave. These vocabulary rules apply across all states.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                label: 'Forbidden',
                color: '#DC2626',
                bg: 'rgba(220,38,38,0.04)',
                border: 'rgba(220,38,38,0.18)',
                terms: ['gas', 'blockchain', 'wallet', 'USDC address', 'mempool', 'confirmation hash', 'FHE', 'smart contract', 'private key', 'pending'],
              },
              {
                label: 'Preferred',
                color: '#059669',
                bg: 'rgba(5,150,105,0.04)',
                border: 'rgba(5,150,105,0.18)',
                terms: ['account', 'balance', 'transfer', 'deposit', 'payment', 'earnings', 'yield', 'sending', 'confirming', 'processing'],
              },
            ].map(({ label, color, bg, border, terms }) => (
              <div key={label} style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: '20px 24px',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color, marginBottom: 14,
                }}>
                  {label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {terms.map(t => (
                    <span key={t} style={{
                      padding: '3px 9px',
                      background: 'rgba(255,255,255,0.7)',
                      border: `1px solid ${color}22`,
                      borderRadius: 4,
                      fontSize: 12, color: 'var(--color-text-secondary)',
                      fontFamily: 'Inter, sans-serif',
                    }}>
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
