import React from 'react'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: { pill: 'gap-1 px-2 py-0.5',     score: 'text-sm font-bold',  label: 'text-[9px]' },
  md: { pill: 'gap-1.5 px-2.5 py-1',   score: 'text-base font-bold', label: 'text-[10px]' },
  lg: { pill: 'gap-2 px-3 py-1.5',     score: 'text-lg font-bold',  label: 'text-xs' },
}

function tierConfig(score: number) {
  if (score >= 8) return {
    label: 'HIGH',
    bg: 'rgba(16,185,129,0.18)',
    border: 'rgba(16,185,129,0.4)',
    labelColor: '#10b981',
    scoreColor: '#34d399',
  }
  if (score >= 6) return {
    label: 'MED',
    bg: 'rgba(245,158,11,0.18)',
    border: 'rgba(245,158,11,0.4)',
    labelColor: '#f59e0b',
    scoreColor: '#fbbf24',
  }
  return {
    label: 'LOW',
    bg: 'rgba(239,68,68,0.18)',
    border: 'rgba(239,68,68,0.4)',
    labelColor: '#ef4444',
    scoreColor: '#f87171',
  }
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  const cfg = tierConfig(score)
  const sz = sizeStyles[size]

  return (
    <span
      className={`inline-flex items-baseline rounded-full border ${sz.pill}`}
      style={{ background: cfg.bg, borderColor: cfg.border }}
      aria-label={`Score ${score.toFixed(1)} — ${cfg.label}`}
    >
      <span
        className={sz.score}
        style={{ color: cfg.scoreColor, fontFamily: 'var(--font-mono)' }}
      >
        {score.toFixed(1)}
      </span>
      <span
        className={`font-sans font-semibold tracking-widest uppercase ${sz.label}`}
        style={{ color: cfg.labelColor }}
      >
        {cfg.label}
      </span>
    </span>
  )
}

export default ScoreBadge
