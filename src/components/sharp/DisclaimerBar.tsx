import React from 'react'
import { Info } from 'lucide-react'

export const DisclaimerBar: React.FC = () => {
  return (
    <div
      className="w-full flex items-start gap-2 px-4 py-2.5"
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
      role="contentinfo"
      aria-label="Legal disclaimer"
    >
      <Info size={11} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
      <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Sharp Filter is for analysis and tracking only. It does not place bets or guarantee profit.
        Sports betting involves risk. Users are responsible for local laws.
        Stop-loss rules are mandatory safety controls.
      </p>
    </div>
  )
}

export default DisclaimerBar
