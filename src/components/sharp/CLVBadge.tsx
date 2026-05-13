import React, { useState } from 'react'
import { Info } from 'lucide-react'

interface CLVBadgeProps {
  clv: number | undefined
  label?: string
}

export const CLVBadge: React.FC<CLVBadgeProps> = ({ clv, label = 'CLV' }) => {
  const [tooltip, setTooltip] = useState(false)

  const pending    = clv === undefined
  const isPositive = !pending && clv >= 0

  const color  = pending ? 'rgba(255,255,255,0.4)' : isPositive ? '#10b981' : '#ef4444'
  const bg     = pending ? 'rgba(255,255,255,0.06)' : isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
  const border = pending ? 'rgba(255,255,255,0.12)' : isPositive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'

  const formatted = pending
    ? 'Pending'
    : `${isPositive ? '+' : ''}${clv!.toFixed(1)}pp`

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium"
        style={{ color, background: bg, borderColor: border, fontFamily: 'var(--font-mono)' }}
        aria-label={`${label}: ${formatted}`}
      >
        <span
          className="font-sans text-[10px] tracking-wider uppercase"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}
        >
          {label}
        </span>
        {formatted}
      </span>

      <button
        type="button"
        className="relative cursor-pointer opacity-40 hover:opacity-80 transition-opacity duration-150"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        aria-label="Closing Line Value explanation"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <Info size={12} strokeWidth={2} />
        {tooltip && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 rounded px-2.5 py-1.5 text-xs whitespace-nowrap pointer-events-none"
            style={{
              background: '#222222',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
            }}
            role="tooltip"
          >
            Closing Line Value — percentage points vs. closing line
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: '#222222' }}
            />
          </div>
        )}
      </button>
    </div>
  )
}

export default CLVBadge
