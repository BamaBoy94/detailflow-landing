import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Minus } from 'lucide-react'
import type { RuleChecklist as RuleChecklistType, RuleResult } from '@/types'

interface RuleChecklistProps {
  checklist: RuleChecklistType
}

interface RuleRowProps {
  label: string
  result: RuleResult
}

function resultConfig(result: RuleResult) {
  switch (result) {
    case 'pass':
      return {
        icon: <CheckCircle2 size={14} />,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.10)',
        border: 'rgba(16,185,129,0.25)',
        label: 'PASS',
      }
    case 'warn':
      return {
        icon: <AlertTriangle size={14} />,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
        border: 'rgba(245,158,11,0.25)',
        label: 'WARN',
      }
    case 'fail':
      return {
        icon: <XCircle size={14} />,
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.10)',
        border: 'rgba(239,68,68,0.25)',
        label: 'FAIL',
      }
    case 'n/a':
    default:
      return {
        icon: <Minus size={14} />,
        color: 'rgba(255,255,255,0.3)',
        bg: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.08)',
        label: 'N/A',
      }
  }
}

const RuleRow: React.FC<RuleRowProps> = ({ label, result }) => {
  const cfg = resultConfig(result)
  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="text-xs font-medium"
        style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </span>
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase font-mono rounded px-1.5 py-0.5"
        style={{ color: cfg.color, fontFamily: 'var(--font-mono)' }}
        aria-label={`${label}: ${result}`}
      >
        <span style={{ color: cfg.color }}>{cfg.icon}</span>
        {cfg.label}
      </span>
    </div>
  )
}

export const RuleChecklist: React.FC<RuleChecklistProps> = ({ checklist }) => {
  const rules: { label: string; key: keyof RuleChecklistType }[] = [
    { label: 'Projection Edge', key: 'projection_edge' },
    { label: 'Odds Value', key: 'odds_value' },
    { label: 'Context Confirmation', key: 'context' },
    { label: 'Market Confirmation', key: 'market_confirmation' },
    { label: 'Bankroll / Risk', key: 'bankroll' },
  ]

  const passCount = Object.values(checklist).filter((v) => v === 'pass').length
  const failCount = Object.values(checklist).filter((v) => v === 'fail').length
  const warnCount = Object.values(checklist).filter((v) => v === 'warn').length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="sf-label">Rule Checklist</span>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span style={{ color: '#10b981' }}>{passCount} pass</span>
          {warnCount > 0 && <span style={{ color: '#f59e0b' }}>{warnCount} warn</span>}
          {failCount > 0 && <span style={{ color: '#ef4444' }}>{failCount} fail</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {rules.map(({ label, key }) => (
          <RuleRow key={key} label={label} result={checklist[key]} />
        ))}
      </div>
    </div>
  )
}

export default RuleChecklist
