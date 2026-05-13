import React from 'react'
import { ShieldOff, AlertOctagon } from 'lucide-react'

interface KillSwitchBannerProps {
  triggered: boolean
  reason?: string
}

export const KillSwitchBanner: React.FC<KillSwitchBannerProps> = ({ triggered, reason }) => {
  if (!triggered) return null

  return (
    <div
      className="w-full flex items-start gap-4 px-5 py-4"
      style={{
        background: 'rgba(239,68,68,0.12)',
        borderBottom: '1px solid rgba(239,68,68,0.35)',
        borderTop: '2px solid #ef4444',
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className="flex items-center justify-center rounded-full p-2 shrink-0"
        style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
      >
        <ShieldOff size={18} strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <AlertOctagon size={13} strokeWidth={2.5} style={{ color: '#f87171' }} />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: '#f87171' }}
          >
            Stop-Loss Triggered — Manual Override Required
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Daily loss limit has been reached.{' '}
          <strong style={{ color: '#f87171' }}>Do not add new exposure.</strong>
          {reason && <>{' '}{reason}</>}
          {' '}Review your bankroll settings before resuming.
        </p>
      </div>
    </div>
  )
}

export default KillSwitchBanner
