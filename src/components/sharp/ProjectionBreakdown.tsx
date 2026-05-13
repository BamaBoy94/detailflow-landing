import React from 'react'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import type { BetCandidate } from '@/types'
import { formatOdds, formatProb, formatEV, juiceLevel } from '@/utils/odds'
import { calculateEV } from '@/utils/evCalculator'

interface ProjectionBreakdownProps {
  candidate: BetCandidate
}

interface StatRowProps {
  label: string
  value: React.ReactNode
  dimLabel?: boolean
}

const StatRow: React.FC<StatRowProps> = ({ label, value, dimLabel = false }) => (
  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <span
      className="text-xs"
      style={{ color: dimLabel ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans)' }}
    >
      {label}
    </span>
    <span className="text-xs font-mono font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.85)' }}>
      {value}
    </span>
  </div>
)

function oddsColor(odds: number): string {
  const level = juiceLevel(odds)
  if (level === 'ok') return '#10b981'
  if (level === 'caution') return '#f59e0b'
  return '#ef4444'
}

export const ProjectionBreakdown: React.FC<ProjectionBreakdownProps> = ({ candidate }) => {
  const {
    player_or_team,
    market,
    bet_type,
    line,
    odds,
    projection,
    projection_edge,
    implied_probability,
    projected_probability,
    estimated_ev,
  } = candidate

  const ev = calculateEV({ odds, projected_probability })
  const edgePositive = projection_edge >= 0
  const evPositive = estimated_ev >= 0

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div
        className="rounded-lg px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)' }}>
              {player_or_team}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {market} · {bet_type} {line.toFixed(1)}
            </p>
          </div>
          <div className="text-right">
            <span
              className="text-base font-mono font-bold"
              style={{ color: oddsColor(odds), fontFamily: 'var(--font-mono)' }}
            >
              {formatOdds(odds)}
            </span>
          </div>
        </div>

        {/* Projection Edge Banner */}
        <div
          className="mt-3 flex items-center gap-2 rounded px-3 py-2"
          style={{
            background: edgePositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${edgePositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {edgePositive ? (
            <TrendingUp size={14} color="#10b981" />
          ) : (
            <TrendingDown size={14} color="#ef4444" />
          )}
          <span
            className="text-xs font-semibold"
            style={{ color: edgePositive ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}
          >
            Projection Edge: {edgePositive ? '+' : ''}{projection_edge.toFixed(1)} pts
          </span>
        </div>
      </div>

      {/* Projection Math */}
      <div>
        <p className="sf-label mb-2">Projection Math</p>
        <div className="rounded-lg px-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <StatRow
            label="Model Projection"
            value={
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                {projection.toFixed(1)}
              </span>
            }
          />
          <StatRow
            label="Bet Line"
            value={
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                {line.toFixed(1)}
              </span>
            }
          />
          <StatRow
            label="Edge (Projection − Line)"
            value={
              <span style={{ color: edgePositive ? '#10b981' : '#ef4444' }}>
                {edgePositive ? '+' : ''}{projection_edge.toFixed(1)}
              </span>
            }
          />
        </div>
      </div>

      {/* Probability */}
      <div>
        <p className="sf-label mb-2">Probability Analysis</p>
        <div className="rounded-lg px-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <StatRow
            label="Implied Probability (from odds)"
            value={
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {formatProb(implied_probability)}
              </span>
            }
          />
          <StatRow
            label="Estimated Projected Probability"
            value={
              <span style={{ color: projected_probability > implied_probability ? '#10b981' : '#ef4444' }}>
                {formatProb(projected_probability)}
              </span>
            }
          />
          <StatRow
            label="Probability Edge"
            value={
              <span style={{ color: ev.probability_edge > 0 ? '#10b981' : '#ef4444' }}>
                {ev.probability_edge > 0 ? '+' : ''}{ev.probability_edge.toFixed(1)} pp
              </span>
            }
          />
        </div>
      </div>

      {/* EV Breakdown */}
      <div>
        <p className="sf-label mb-2">Estimated EV Breakdown</p>
        <div className="rounded-lg px-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <StatRow
            label="Decimal Odds"
            value={
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {ev.decimal_odds.toFixed(3)}x
              </span>
            }
          />
          <StatRow
            label="Profit if Win (per unit)"
            value={
              <span style={{ color: '#10b981' }}>
                +{ev.profit_if_win.toFixed(3)} u
              </span>
            }
          />
          <StatRow
            label="Estimated EV (per unit)"
            value={
              <span style={{ color: evPositive ? '#10b981' : '#ef4444' }}>
                {ev.estimated_ev >= 0 ? '+' : ''}{ev.estimated_ev.toFixed(3)} u
              </span>
            }
          />
          <div className="flex items-center justify-between gap-4 py-2">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Estimated EV %
            </span>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: evPositive ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}
            >
              {formatEV(estimated_ev)}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="flex items-start gap-2 rounded px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <AlertCircle size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
          EV estimates are model outputs, not guaranteed returns. All projections are statistical
          estimates based on available data and are subject to uncertainty.
        </p>
      </div>
    </div>
  )
}

export default ProjectionBreakdown
