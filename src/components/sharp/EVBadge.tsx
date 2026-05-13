import React from 'react'

interface EVBadgeProps {
  ev: number     // fractional, e.g. 0.072 = 7.2% EV
  size?: 'sm' | 'md'
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
}

export const EVBadge: React.FC<EVBadgeProps> = ({ ev, size = 'md' }) => {
  const isPositive = ev >= 0
  const pct = (ev * 100).toFixed(1)
  const display = isPositive ? `+${pct}% EV` : `${pct}% EV`

  const color  = isPositive ? '#10b981' : '#ef4444'
  const bg     = isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
  const border = isPositive ? 'rgba(16,185,129,0.3)'  : 'rgba(239,68,68,0.3)'

  return (
    <span
      className={`inline-flex items-center rounded border font-semibold ${sizeStyles[size]}`}
      style={{ color, background: bg, borderColor: border, fontFamily: 'var(--font-mono)' }}
      aria-label={`Expected value ${display}`}
    >
      {display}
    </span>
  )
}

export default EVBadge
