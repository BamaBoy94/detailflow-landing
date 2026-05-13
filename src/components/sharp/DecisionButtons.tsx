import React from 'react'
import { CheckCircle, Eye, XCircle } from 'lucide-react'
import type { CandidateStatus } from '../../types'

interface DecisionButtonsProps {
  candidateId: string
  currentStatus: CandidateStatus
  onDecision: (id: string, decision: 'approve' | 'reject' | 'watch') => void
  disabled?: boolean
}

type Decision = 'approve' | 'reject' | 'watch'

interface ButtonConfig {
  decision: Decision
  label: string
  icon: React.ElementType
  activeStatus: CandidateStatus
  activeColor: string
  activeBg: string
  activeBorder: string
  idleColor: string
  hoverBg: string
  hoverBorder: string
}

const BUTTONS: ButtonConfig[] = [
  {
    decision: 'approve',
    label: 'Approve',
    icon: CheckCircle,
    activeStatus: 'approved',
    activeColor: '#10b981',
    activeBg: 'rgba(16,185,129,0.18)',
    activeBorder: 'rgba(16,185,129,0.5)',
    idleColor: 'rgba(16,185,129,0.55)',
    hoverBg: 'rgba(16,185,129,0.1)',
    hoverBorder: 'rgba(16,185,129,0.3)',
  },
  {
    decision: 'watch',
    label: 'Watchlist',
    icon: Eye,
    activeStatus: 'watchlist',
    activeColor: '#f59e0b',
    activeBg: 'rgba(245,158,11,0.18)',
    activeBorder: 'rgba(245,158,11,0.5)',
    idleColor: 'rgba(245,158,11,0.55)',
    hoverBg: 'rgba(245,158,11,0.1)',
    hoverBorder: 'rgba(245,158,11,0.3)',
  },
  {
    decision: 'reject',
    label: 'Reject',
    icon: XCircle,
    activeStatus: 'rejected',
    activeColor: '#ef4444',
    activeBg: 'rgba(239,68,68,0.18)',
    activeBorder: 'rgba(239,68,68,0.5)',
    idleColor: 'rgba(239,68,68,0.55)',
    hoverBg: 'rgba(239,68,68,0.1)',
    hoverBorder: 'rgba(239,68,68,0.3)',
  },
]

export const DecisionButtons: React.FC<DecisionButtonsProps> = ({
  candidateId,
  currentStatus,
  onDecision,
  disabled = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label="Decision actions">
      {BUTTONS.map((btn) => {
        const isActive = currentStatus === btn.activeStatus
        const Icon = btn.icon

        return (
          <button
            key={btn.decision}
            type="button"
            onClick={() => !disabled && onDecision(candidateId, btn.decision)}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`${btn.label}${isActive ? ' (active)' : ''}`}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-40 disabled:cursor-not-allowed"
            style={
              isActive
                ? {
                    background: btn.activeBg,
                    borderColor: btn.activeBorder,
                    color: btn.activeColor,
                    boxShadow: `0 0 0 1px ${btn.activeBorder} inset`,
                  }
                : {
                    background: 'transparent',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: btn.idleColor,
                  }
            }
            onMouseEnter={e => {
              if (!isActive && !disabled) {
                const el = e.currentTarget
                el.style.background = btn.hoverBg
                el.style.borderColor = btn.hoverBorder
                el.style.color = btn.activeColor
              }
            }}
            onMouseLeave={e => {
              if (!isActive && !disabled) {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(255,255,255,0.1)'
                el.style.color = btn.idleColor
              }
            }}
          >
            <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
            {btn.label}
            {isActive && (
              <span
                className="ml-0.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: btn.activeColor }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default DecisionButtons
