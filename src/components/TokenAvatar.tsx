import type { CSSProperties } from 'react'
import { Zap, ArrowRight, Plus, Ban, Check } from 'lucide-react'

const ICON_BASE = 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/color'

const TOKEN_COLORS: Record<string, string> = {
  ETH:   '#396993',
  USDC:  '#2775CA',
  DAI:   '#F5AC37',
  BTC:   '#F7931A',
  MATIC: '#8247E5',
  SOL:   '#9945FF',
  BNB:   '#F3BA2F',
  AAVE:  '#B6509E',
}

const BADGE = {
  blue:   '#1A56DB',
  green:  '#059669',
  amber:  '#D97706',
  grey:   '#9CA3AF',
  greyIcon: '#6B7280',
} as const

export type TokenAvatarVariant =
  | 'default'
  | 'in-progress'
  | 'success'
  | 'failed'
  | 'add-funds'
  | 'send-in-progress'
  | 'send-success'
  | 'pair'

export interface TokenAvatarProps {
  symbol: string
  imageUrl?: string
  chain?: string
  chainImageUrl?: string
  pairSymbol?: string
  pairImageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: TokenAvatarVariant
}

const SIZES = {
  sm: { token: 32, badge: 16, icon: 10, offset: { right: -4, bottom: -3 } },
  md: { token: 48, badge: 24, icon: 14, offset: { right: -6, bottom: -4 } },
  lg: { token: 56, badge: 24, icon: 14, offset: { right: -6, bottom: -5 } },
} as const

function fallbackColor(symbol: string): string {
  return TOKEN_COLORS[symbol.toUpperCase()] ?? '#9CA3AF'
}

function resolveImageUrl(symbol: string, override?: string): string {
  return override ?? `${ICON_BASE}/${symbol.toLowerCase()}.png`
}

function TokenCircle({
  symbol,
  imageUrl,
  px,
  style,
}: {
  symbol: string
  imageUrl?: string
  px: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        background: fallbackColor(symbol),
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={resolveImageUrl(symbol, imageUrl)}
        alt={symbol}
        width={px}
        height={px}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

function BadgeShell({
  px,
  fill,
  offset,
  children,
}: {
  px: number
  fill: string
  offset: { right: number; bottom: number }
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: offset.right,
        bottom: offset.bottom,
        width: px,
        height: px,
        borderRadius: '50%',
        background: fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 0 2px #FFFFFF',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}

export function TokenAvatar({
  symbol,
  imageUrl,
  chain,
  chainImageUrl,
  pairSymbol,
  pairImageUrl,
  size = 'md',
  variant = 'default',
}: TokenAvatarProps) {
  const { token: tokenPx, badge: badgePx, icon: iconPx, offset } = SIZES[size]

  if (variant === 'pair') {
    const overlap = Math.round(tokenPx * 0.4)
    const totalW = tokenPx * 2 - overlap
    return (
      <div style={{ position: 'relative', width: totalW, height: tokenPx, flexShrink: 0, display: 'inline-block' }}>
        <div style={{ position: 'absolute', left: 0 }}>
          <TokenCircle symbol={symbol} imageUrl={imageUrl} px={tokenPx} />
        </div>
        <div style={{ position: 'absolute', left: tokenPx - overlap }}>
          <TokenCircle
            symbol={pairSymbol ?? symbol}
            imageUrl={pairImageUrl}
            px={tokenPx}
            style={{ boxShadow: '0 0 0 2px #fff' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <TokenCircle symbol={symbol} imageUrl={imageUrl} px={tokenPx} />

      {variant === 'default' && chain && (
        <BadgeShell px={badgePx} fill="#fff" offset={offset}>
          <img
            src={resolveImageUrl(chain, chainImageUrl)}
            alt={chain}
            width={badgePx}
            height={badgePx}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </BadgeShell>
      )}

      {variant === 'in-progress' && (
        <BadgeShell px={badgePx} fill={BADGE.blue} offset={offset}>
          <Zap size={iconPx} color="#fff" strokeWidth={2.5} fill="#fff" aria-hidden />
        </BadgeShell>
      )}

      {variant === 'success' && (
        <BadgeShell px={badgePx} fill={BADGE.green} offset={offset}>
          <Check size={iconPx} color="#fff" strokeWidth={2.5} aria-hidden />
        </BadgeShell>
      )}

      {variant === 'failed' && (
        <BadgeShell px={badgePx} fill={BADGE.grey} offset={offset}>
          <Ban size={iconPx} color={BADGE.greyIcon} strokeWidth={2} aria-hidden />
        </BadgeShell>
      )}

      {variant === 'add-funds' && (
        <BadgeShell px={badgePx} fill={BADGE.blue} offset={offset}>
          <Plus size={iconPx} color="#fff" strokeWidth={2.5} aria-hidden />
        </BadgeShell>
      )}

      {variant === 'send-in-progress' && (
        <BadgeShell px={badgePx} fill={BADGE.blue} offset={offset}>
          <ArrowRight size={iconPx} color="#fff" strokeWidth={2.5} aria-hidden />
        </BadgeShell>
      )}

      {variant === 'send-success' && (
        <BadgeShell px={badgePx} fill={BADGE.green} offset={offset}>
          <ArrowRight size={iconPx} color="#fff" strokeWidth={2.5} aria-hidden />
        </BadgeShell>
      )}
    </div>
  )
}
