import React, { useEffect, useState, useCallback } from 'react'
import {
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Clock,
  Minus,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import type { WatchlistEntry, BetCandidate } from '@/types'
import { getWatchlist, submitDecision } from '@/lib/api'
import { Layout } from '@/components/Layout'
import { ScoreBadge } from '@/components/sharp/ScoreBadge'
import { RiskFlagBadge } from '@/components/sharp/RiskFlagBadge'
import CandidateDetailModal from '@/components/sharp/CandidateDetailModal'
import { formatOdds } from '@/utils/odds'

// ─── Line movement indicator ──────────────────────────────────────────────────

interface LineMovementProps {
  original: number
  current: number
}

const LineMovement: React.FC<LineMovementProps> = ({ original, current }) => {
  if (original === current) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs sf-mono"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        <Minus size={11} />
        {current.toFixed(1)}
      </span>
    )
  }

  const moved = current > original
  const Icon = moved ? ArrowUp : ArrowDown
  const color = moved ? '#ef4444' : '#10b981'
  const label = moved ? 'line moved up' : 'line moved down'

  return (
    <span
      className="inline-flex items-center gap-1 text-xs sf-mono font-medium"
      style={{ color }}
      aria-label={label}
    >
      <Icon size={11} strokeWidth={2.5} />
      {current.toFixed(1)}
      <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>
        (was {original.toFixed(1)})
      </span>
    </span>
  )
}

// ─── Watchlist card ───────────────────────────────────────────────────────────

interface WatchlistCardProps {
  entry: WatchlistEntry
  onPromote: (candidateId: string) => void
  onRemove: (candidateId: string) => void
  onViewDetail: (candidate: BetCandidate) => void
  actionPending: string | null
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({
  entry,
  onPromote,
  onRemove,
  onViewDetail,
  actionPending,
}) => {
  const { candidate } = entry
  const originalLine = entry.line_movements[0]?.line ?? candidate.line
  const isPending = actionPending === candidate.id
  const contextNotes = candidate.context_notes.slice(0, 2)

  return (
    <article
      className="sf-card sf-card-hover p-5 flex flex-col gap-4"
      aria-label={`Watchlist entry: ${candidate.player_or_team}`}
    >
      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sans)' }}
            >
              {candidate.player_or_team}
            </h3>
            <span
              className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border"
              style={{
                background: 'rgba(59,130,246,0.15)',
                borderColor: 'rgba(59,130,246,0.3)',
                color: '#60a5fa',
              }}
            >
              {candidate.league}
            </span>
          </div>
          <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {candidate.market} · {candidate.game}
          </p>
        </div>
        <ScoreBadge score={candidate.system_score} size="sm" />
      </div>

      {/* ── Status note (amber) ── */}
      <div
        className="rounded px-3 py-2"
        style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <p className="text-xs leading-relaxed" style={{ color: '#fbbf24' }}>
          {entry.status_note}
        </p>
      </div>

      {/* ── Watch reason ── */}
      <div>
        <p className="sf-label mb-1">Watch Reason</p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {entry.watch_reason}
        </p>
      </div>

      {/* ── Line & odds row ── */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="sf-label mb-1">Current Line</p>
          <LineMovement original={originalLine} current={candidate.line} />
        </div>
        <div>
          <p className="sf-label mb-1">Odds</p>
          <span
            className="text-sm sf-mono font-medium"
            style={{ color: candidate.odds <= -110 ? '#fbbf24' : '#10b981' }}
          >
            {formatOdds(candidate.odds)}
          </span>
        </div>
        <div>
          <p className="sf-label mb-1">Bet Type</p>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {candidate.bet_type} {candidate.line.toFixed(1)}
          </span>
        </div>
      </div>

      {/* ── Risk flags ── */}
      {candidate.risk_flags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <RiskFlagBadge flags={candidate.risk_flags} />
        </div>
      )}

      {/* ── Context notes (up to 2) ── */}
      {contextNotes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="sf-label">Context</p>
          {contextNotes.map((note, i) => (
            <p
              key={i}
              className="text-xs leading-relaxed flex items-start gap-2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <ArrowRight
                size={10}
                style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }}
              />
              {note}
            </p>
          ))}
        </div>
      )}

      {/* ── "Waiting for" status pill ── */}
      <div className="flex items-center gap-2">
        <Clock size={12} style={{ color: '#f59e0b' }} />
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border"
          style={{
            background: 'rgba(245,158,11,0.1)',
            borderColor: 'rgba(245,158,11,0.3)',
            color: '#f59e0b',
          }}
        >
          Waiting for: {entry.status_note}
        </span>
      </div>

      {/* ── Action buttons ── */}
      <div
        className="flex items-center justify-between gap-3 pt-1 flex-wrap"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          {/* Promote to Queue */}
          <button
            type="button"
            onClick={() => onPromote(candidate.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              background: 'rgba(16,185,129,0.1)',
              borderColor: 'rgba(16,185,129,0.35)',
              color: '#10b981',
            }}
            onMouseEnter={e => {
              if (!isPending) {
                e.currentTarget.style.background = 'rgba(16,185,129,0.18)'
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.55)'
                e.currentTarget.style.color = '#34d399'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(16,185,129,0.1)'
              e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'
              e.currentTarget.style.color = '#10b981'
            }}
            aria-label={`Promote ${candidate.player_or_team} to approval queue`}
          >
            <CheckCircle size={12} strokeWidth={2} />
            Promote to Queue
          </button>

          {/* Remove from Watchlist */}
          <button
            type="button"
            onClick={() => onRemove(candidate.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              background: 'rgba(239,68,68,0.08)',
              borderColor: 'rgba(239,68,68,0.3)',
              color: '#ef4444',
            }}
            onMouseEnter={e => {
              if (!isPending) {
                e.currentTarget.style.background = 'rgba(239,68,68,0.16)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
                e.currentTarget.style.color = '#f87171'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
              e.currentTarget.style.color = '#ef4444'
            }}
            aria-label={`Remove ${candidate.player_or_team} from watchlist`}
          >
            <XCircle size={12} strokeWidth={2} />
            Remove
          </button>
        </div>

        {/* View Full Analysis */}
        <button
          type="button"
          onClick={() => onViewDetail(candidate)}
          className="inline-flex items-center gap-1.5 text-xs cursor-pointer transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          aria-label={`View full analysis for ${candidate.player_or_team}`}
        >
          View Full Analysis
          <ExternalLink size={11} />
        </button>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<BetCandidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionPending, setActionPending] = useState<string | null>(null)

  const loadWatchlist = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getWatchlist()
      setWatchlist(data)
    } catch (err) {
      console.error('Failed to load watchlist:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  const handlePromote = useCallback(async (candidateId: string) => {
    setActionPending(candidateId)
    try {
      await submitDecision(candidateId, 'approve')
      setWatchlist(prev => prev.filter(e => e.candidate.id !== candidateId))
    } catch (err) {
      console.error('Failed to promote candidate:', err)
    } finally {
      setActionPending(null)
    }
  }, [])

  const handleRemove = useCallback(async (candidateId: string) => {
    setActionPending(candidateId)
    try {
      await submitDecision(candidateId, 'reject')
      setWatchlist(prev => prev.filter(e => e.candidate.id !== candidateId))
    } catch (err) {
      console.error('Failed to remove candidate:', err)
    } finally {
      setActionPending(null)
    }
  }, [])

  const handleViewDetail = useCallback((candidate: BetCandidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }, [])

  const handleModalDecision = useCallback(
    async (id: string, decision: 'approve' | 'reject' | 'watch') => {
      try {
        await submitDecision(id, decision)
        if (decision !== 'watch') {
          setWatchlist(prev => prev.filter(e => e.candidate.id !== id))
          setIsModalOpen(false)
        }
      } catch (err) {
        console.error('Failed to submit decision:', err)
      }
    },
    [],
  )

  return (
    <Layout pageTitle="Watchlist" isMockMode onRefresh={loadWatchlist}>
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Eye size={16} style={{ color: '#f59e0b' }} />
            <h2
              className="text-base font-semibold"
              style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sans)' }}
            >
              Watchlist
            </h2>
            {!loading && (
              <span
                className="text-xs rounded-full px-2 py-0.5 border sf-mono"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  borderColor: 'rgba(245,158,11,0.25)',
                  color: '#f59e0b',
                }}
              >
                {watchlist.length}
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Candidates being monitored for better line or injury clarity
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="sf-card p-5 space-y-3 animate-pulse"
                aria-hidden="true"
              >
                <div className="h-4 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-10 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-3 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && watchlist.length === 0 && (
          <div
            className="sf-card flex flex-col items-center justify-center gap-3 py-16 text-center"
            role="status"
            aria-live="polite"
          >
            <Eye size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
              No bets currently on watchlist
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Move candidates here to monitor for line movement or injury updates.
            </p>
          </div>
        )}

        {/* Watchlist cards */}
        {!loading && watchlist.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {watchlist.map(entry => (
              <WatchlistCard
                key={entry.candidate.id}
                entry={entry}
                onPromote={handlePromote}
                onRemove={handleRemove}
                onViewDetail={handleViewDetail}
                actionPending={actionPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDecision={handleModalDecision}
      />
    </Layout>
  )
}

export default Watchlist
