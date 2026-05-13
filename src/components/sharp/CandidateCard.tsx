import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import type { BetCandidate } from '@/types'
import { formatOdds } from '@/utils/odds'
import { DecisionButtons } from '@/components/sharp/DecisionButtons'
import { ScoreBadge } from '@/components/sharp/ScoreBadge'

interface CandidateCardProps {
  candidate: BetCandidate
  onDecision: (id: string, decision: 'approve' | 'reject' | 'watch') => void
  onClick: (candidate: BetCandidate) => void
}

function statusConfig(status: BetCandidate['status']) {
  switch (status) {
    case 'approved':  return { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.28)', label: 'Approved' }
    case 'rejected':  return { color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.28)',   label: 'Rejected' }
    case 'watchlist': return { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.28)',  label: 'Watchlist' }
    case 'expired':   return { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', label: 'Expired' }
    default:          return { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.28)',  label: 'Candidate' }
  }
}

function formatShortTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return iso
  }
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onDecision, onClick }) => {
  const {
    player_or_team,
    market,
    bet_type,
    line,
    odds,
    sportsbook,
    system_score,
    estimated_ev,
    projection_edge,
    status,
    context_notes,
    risk_flags,
    game,
    league,
    game_start_time,
  } = candidate

  const statusCfg = statusConfig(status)
  const edgePositive = projection_edge >= 0
  const evPositive = estimated_ev >= 0
  const evPct = (estimated_ev * 100).toFixed(1)
  const evDisplay = evPositive ? `+${evPct}%` : `${evPct}%`
  const firstNote = context_notes[0] ?? null

  return (
    <article
      className="sf-card sf-card-hover flex flex-col gap-0 overflow-hidden"
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(candidate)}
      role="button"
      tabIndex={0}
      aria-label={`${player_or_team} — ${market} ${bet_type} ${line.toFixed(1)}, score ${system_score.toFixed(1)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(candidate)
        }
      }}
    >
      {/* ── Top stripe: score tier color ─────────────── */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            system_score >= 8
              ? 'linear-gradient(90deg, #10b981, transparent)'
              : system_score >= 6
              ? 'linear-gradient(90deg, #f59e0b, transparent)'
              : 'linear-gradient(90deg, #ef4444, transparent)',
        }}
      />

      {/* ── Card body ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4">

        {/* Row 1: Player + badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="font-semibold text-sm leading-tight truncate"
              style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-sans)' }}
            >
              {player_or_team}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {market} · {bet_type}
            </p>
          </div>
          <ScoreBadge score={system_score} size="sm" />
        </div>

        {/* Row 2: Game + league + time */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.22)' }}
          >
            {league}
          </span>
          <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {game}
          </span>
          <span className="flex items-center gap-1 text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Clock size={10} strokeWidth={2} />
            {formatShortTime(game_start_time)}
          </span>
        </div>

        {/* Row 3: Line / Odds / Book */}
        <div
          className="flex items-center justify-between gap-2 rounded-md px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex flex-col items-start">
            <span className="sf-label" style={{ fontSize: '0.58rem' }}>Line</span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-mono)' }}
            >
              {line.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="sf-label" style={{ fontSize: '0.58rem' }}>Odds</span>
            <span
              className="text-sm font-semibold"
              style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}
            >
              {formatOdds(odds)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="sf-label" style={{ fontSize: '0.58rem' }}>Book</span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {sportsbook}
            </span>
          </div>
        </div>

        {/* Row 4: EV + Projection Edge + Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* EV */}
          <span
            className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border"
            style={{
              color: evPositive ? '#10b981' : '#ef4444',
              background: evPositive ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
              borderColor: evPositive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {evDisplay} EV
          </span>

          {/* Projection Edge */}
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium"
            style={{ color: edgePositive ? '#10b981' : '#ef4444' }}
          >
            {edgePositive
              ? <TrendingUp size={11} strokeWidth={2.5} />
              : <TrendingDown size={11} strokeWidth={2.5} />}
            {edgePositive ? '+' : ''}{projection_edge.toFixed(1)} over line
          </span>

          {/* Status badge — pushed right */}
          <span
            className="ml-auto text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border"
            style={{
              color: statusCfg.color,
              background: statusCfg.bg,
              borderColor: statusCfg.border,
            }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Row 5: Context note preview */}
        {firstNote && (
          <p
            className="text-[11px] leading-relaxed line-clamp-2"
            style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-sans)' }}
          >
            {firstNote}
          </p>
        )}

        {/* Row 6: Risk flags */}
        {risk_flags.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span className="text-[11px] font-medium" style={{ color: '#f87171' }}>
              {risk_flags.length} risk flag{risk_flags.length !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} style={{ color: '#10b981', flexShrink: 0 }} />
            <span className="text-[11px]" style={{ color: 'rgba(16,185,129,0.7)' }}>
              No risk flags
            </span>
          </div>
        )}
      </div>

      {/* ── Decision bar ──────────────────────────────── */}
      <div
        className="px-4 py-3 flex items-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <DecisionButtons
          candidateId={candidate.id}
          currentStatus={candidate.status}
          onDecision={onDecision}
        />
      </div>
    </article>
  )
}

export default CandidateCard
