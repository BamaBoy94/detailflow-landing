import React, { useState } from 'react'
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react'

interface RiskFlagBadgeProps {
  flags: string[]
}

export const RiskFlagBadge: React.FC<RiskFlagBadgeProps> = ({ flags }) => {
  const [expanded, setExpanded] = useState(false)

  if (flags.length === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium"
        style={{
          background: 'rgba(16,185,129,0.12)',
          borderColor: 'rgba(16,185,129,0.3)',
          color: '#34d399',
        }}
        aria-label="No risk flags"
      >
        <ShieldCheck size={13} strokeWidth={2} />
        No Flags
      </span>
    )
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors duration-150"
        style={{
          background: expanded ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.12)',
          borderColor: 'rgba(239,68,68,0.4)',
          color: '#f87171',
        }}
        aria-expanded={expanded}
        aria-label={`${flags.length} risk flag${flags.length !== 1 ? 's' : ''} — click to ${expanded ? 'collapse' : 'expand'}`}
      >
        <ShieldAlert size={13} strokeWidth={2} />
        {flags.length} Risk Flag{flags.length !== 1 ? 's' : ''}
        {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>

      {expanded && (
        <div
          className="absolute left-0 top-full mt-1.5 z-30 rounded border min-w-[220px] py-1.5 shadow-xl"
          style={{
            background: '#1a1a1a',
            borderColor: 'rgba(239,68,68,0.3)',
          }}
          role="list"
        >
          {flags.map((flag, i) => (
            <div
              key={i}
              role="listitem"
              className="flex items-start gap-2 px-3 py-1.5 text-xs"
              style={{ color: '#f87171' }}
            >
              <span className="mt-0.5 shrink-0 h-1.5 w-1.5 rounded-full" style={{ background: '#ef4444' }} />
              {flag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RiskFlagBadge
