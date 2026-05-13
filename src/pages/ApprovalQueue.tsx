import React, { useState, useEffect, useCallback } from 'react'
import {
  ClipboardCheck,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react'
import type { BetCandidate, RuleChecklist } from '@/types'
import { getCandidates, submitDecision } from '@/lib/api'
import { Layout } from '@/components/Layout'
import { AlertBanner } from '@/components/sharp/AlertBanner'
import { ScoreBadge } from '@/components/sharp/ScoreBadge'
import { EVBadge } from '@/components/sharp/EVBadge'
import { RiskFlagBadge } from '@/components/sharp/RiskFlagBadge'
import { DecisionButtons } from '@/components/sharp/DecisionButtons'
import CandidateDetailModal from '@/components/sharp/CandidateDetailModal'
import { formatOdds, formatEV } from '@/utils/odds'

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_QUEUE_SCORE = 8

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlertState {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

// ─── Rule checklist summary bar ───────────────────────────────────────────────

interface ChecklistSummaryProps {
  checklist: RuleChecklist
}

const ChecklistSummary: React.FC<ChecklistSummaryProps> = ({ checklist }) => {
  const values = Object.values(checklist)
  const passCount = values.filter(v => v === 'pass').length
  const warnCount = values.filter(v => v === 'warn').length
  const failCount = values.filter(v => v === 'fail').length

  return (
    <div className="flex items-center gap-3">
      <span className="sf-label">Rules</span>
      <div className="flex items-center gap-2 text-xs sf-mono">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border"
          style={{
            color: '#10b981',
            background: 'rgba(16,185,129,0.1)',
            borderColor: 'rgba(16,185,129,0.25)',
          }}
          aria-label={`${passCount} rules passed`}
        >
          <CheckCircle2 size={11} strokeWidth={2} />
          {passCount}
        </span>
        {warnCount > 0 && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border"
            style={{
              color: '#f59e0b',
              background: 'rgba(245,158,11,0.1)',
              borderColor: 'rgba(245,158,11,0.25)',
            }}
            aria-label={`${warnCount} rules warned`}
          >
            <AlertTriangle size={11} strokeWidth={2} />
            {warnCount}
          </span>
        )}
        {failCount > 0 && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border"
            style={{
              color: '#ef4444',
              background: 'rgba(239,68,68,0.1)',
              borderColor: 'rgba(239,68,68,0.25)',
            }}
            aria-label={`${failCount} rules failed`}
          >
            <XCircle size={11} strokeWidth={2} />
            {failCount}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Queue card ───────────────────────────────────────────────────────────────

interface QueueCardProps {
  candidate: BetCandidate
  onDecision: (id: string, decision: 'approve' | 'reject' | 'watch') => void
  onViewDetail: (candidate: BetCandidate) => void
}

const QueueCard: React.FC<QueueCardProps> = ({ candidate, onDecision, onViewDetail }) => {
  const {
    id,
    player_or_team,
    market,
    bet_type,
    line,
    odds,
    sportsbook,
    system_score,
    confidence_tier,
    estimated_ev,
    projection_edge,
    max_units,
    context_notes,
    risk_flags,
    rule_checklist,
    status,
    league,
  } = candidate

  const edgePositive = projection_edge >= 0
  const tierColors: Record<string, { color: string; bg: string; border: string }> = {
    High:   { color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
    Medium: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
    Low:    { color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)' },
  }
  const tierCfg = tierColors[confidence_tier] ?? tierColors.Low

  return (
    <article
      className="sf-card flex flex-col gap-0 overflow-hidden"
      aria-label={`Approval queue: ${player_or_team}`}
    >
      {/* Score tier accent stripe */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            system_score >= 9
              ? 'linear-gradient(90deg, #10b981, #34d399 60%, transparent)'
              : 'linear-gradient(90deg, #10b981, transparent)',
        }}
      />

      <div className="flex flex-col gap-5 p-5">

        {/* ── Header: player + score + tier ─────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3
                className="text-base font-semibold"
                style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-sans)' }}
              >
                {player_or_team}
              </h3>
              <span
                className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  borderColor: 'rgba(59,130,246,0.25)',
                  color: '#60a5fa',
                }}
              >
                {league}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {market} · {bet_type}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Confidence tier */}
            <span
              className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border"
              style={{
                color: tierCfg.color,
                background: tierCfg.bg,
                borderColor: tierCfg.border,
              }}
            >
              {confidence_tier}
            </span>

            {/* System score — large */}
            <ScoreBadge score={system_score} size="lg" />
          </div>
        </div>

        {/* ── Bet details row ───────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-4 gap-3 rounded-lg px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="sf-label" style={{ fontSize: '0.6rem' }}>Line</span>
            <span
              className="text-sm font-semibold sf-mono"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              {line.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="sf-label" style={{ fontSize: '0.6rem' }}>Odds</span>
            <span
              className="text-sm font-semibold sf-mono"
              style={{ color: '#10b981' }}
            >
              {formatOdds(odds)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="sf-label" style={{ fontSize: '0.6rem' }}>Sportsbook</span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {sportsbook}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="sf-label" style={{ fontSize: '0.6rem' }}>Max Units</span>
            <span
              className="text-sm font-semibold sf-mono"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {max_units}u
            </span>
          </div>
        </div>

        {/* ── Metrics row: edge + EV ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Projection edge */}
          <div
            className="flex items-center gap-1.5 rounded border px-2.5 py-1"
            style={{
              background: edgePositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              borderColor: edgePositive ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)',
            }}
          >
            {edgePositive
              ? <TrendingUp size={12} strokeWidth={2.5} style={{ color: '#10b981' }} />
              : <TrendingDown size={12} strokeWidth={2.5} style={{ color: '#ef4444' }} />}
            <span
              className="text-xs font-semibold sf-mono"
              style={{ color: edgePositive ? '#10b981' : '#ef4444' }}
            >
              {edgePositive ? '+' : ''}{projection_edge.toFixed(1)} proj. edge
            </span>
          </div>

          {/* EV badge */}
          <EVBadge ev={estimated_ev} size="sm" />

          {/* EV as percentage confirmation */}
          <span
            className="text-xs sf-mono"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {formatEV(estimated_ev)} EV
          </span>
        </div>

        {/* ── Risk flags ───────────────────────────────────────────────────── */}
        <div>
          <RiskFlagBadge flags={risk_flags} />
        </div>

        {/* ── Context notes (first 2) ───────────────────────────────────────── */}
        {context_notes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="sf-label">Context</p>
            {context_notes.slice(0, 2).map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded px-3 py-2.5 text-xs"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.6',
                }}
              >
                <ChevronRight
                  size={12}
                  style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: 1 }}
                />
                {note}
              </div>
            ))}
            {context_notes.length > 2 && (
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                +{context_notes.length - 2} more — view full analysis
              </p>
            )}
          </div>
        )}

        {/* ── Rule checklist summary ────────────────────────────────────────── */}
        <ChecklistSummary checklist={rule_checklist} />
      </div>

      {/* ── Decision bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-3 flex-wrap"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.018)',
        }}
      >
        <DecisionButtons
          candidateId={id}
          currentStatus={status}
          onDecision={onDecision}
        />

        <button
          type="button"
          onClick={() => onViewDetail(candidate)}
          className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          aria-label={`View full analysis for ${player_or_team}`}
        >
          View Full Analysis
          <ExternalLink size={11} />
        </button>
      </div>
    </article>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div
    className="sf-card flex flex-col items-center justify-center gap-4 py-20 text-center"
    role="status"
    aria-live="polite"
  >
    <ClipboardCheck size={36} style={{ color: 'rgba(255,255,255,0.1)' }} />
    <div>
      <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
        No candidates in queue
      </p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
        Check Dashboard for watchlist items or candidates that haven't yet reached score {MIN_QUEUE_SCORE}.
      </p>
    </div>
  </div>
)

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton: React.FC = () => (
  <div className="grid gap-4 lg:grid-cols-2">
    {[1, 2, 3].map(i => (
      <div
        key={i}
        className="sf-card p-5 flex flex-col gap-4 animate-pulse"
        aria-hidden="true"
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-28 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
          <div className="h-8 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="h-14 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-3 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    ))}
  </div>
)

// ─── Approval Queue page ──────────────────────────────────────────────────────

const ApprovalQueue: React.FC = () => {
  const [queueCandidates, setQueueCandidates] = useState<BetCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<BetCandidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alert, setAlert] = useState<AlertState | null>(null)

  // ── Data loading ───────────────────────────────────────────────────────────

  const loadQueue = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCandidates({ status: 'candidate', min_score: MIN_QUEUE_SCORE })
      // Sort by system_score descending
      const sorted = [...data].sort((a, b) => b.system_score - a.system_score)
      setQueueCandidates(sorted)
    } catch (err) {
      setAlert({
        message: `Failed to load approval queue: ${err instanceof Error ? err.message : 'Unknown error'}`,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  // ── Auto-dismiss alerts ────────────────────────────────────────────────────

  useEffect(() => {
    if (!alert) return
    const id = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(id)
  }, [alert])

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleDecision = useCallback(
    async (candidateId: string, decision: 'approve' | 'reject' | 'watch') => {
      try {
        await submitDecision(candidateId, decision)
        const labels = { approve: 'Approved', reject: 'Rejected', watch: 'Added to watchlist' }
        setAlert({ message: `${labels[decision]} successfully.`, type: 'success' })
        // Remove from queue immediately on any decision
        setQueueCandidates(prev => prev.filter(c => c.id !== candidateId))
        if (selectedCandidate?.id === candidateId) {
          setIsModalOpen(false)
          setSelectedCandidate(null)
        }
      } catch (err) {
        setAlert({
          message: `Decision failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          type: 'error',
        })
      }
    },
    [selectedCandidate],
  )

  const handleViewDetail = useCallback((candidate: BetCandidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
  }, [])

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Layout
      pageTitle="Approval Queue"
      isMockMode={!import.meta.env.VITE_API_URL}
      onRefresh={loadQueue}
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-6xl mx-auto">

        {/* Alert banner */}
        {alert && (
          <AlertBanner
            message={alert.message}
            type={alert.type}
            onDismiss={() => setAlert(null)}
          />
        )}

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div
          className="sf-card p-5 flex flex-col gap-3"
          style={{ borderColor: 'rgba(59,130,246,0.18)' }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5">
                <ClipboardCheck size={16} style={{ color: '#60a5fa' }} />
                <h2
                  className="text-base font-semibold"
                  style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sans)' }}
                >
                  Approval Queue
                </h2>
                {!loading && (
                  <span
                    className="text-xs rounded-full px-2.5 py-0.5 border sf-mono"
                    style={{
                      background: queueCandidates.length > 0
                        ? 'rgba(59,130,246,0.14)'
                        : 'rgba(255,255,255,0.06)',
                      borderColor: queueCandidates.length > 0
                        ? 'rgba(59,130,246,0.3)'
                        : 'rgba(255,255,255,0.12)',
                      color: queueCandidates.length > 0 ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                    }}
                    aria-live="polite"
                  >
                    {queueCandidates.length} pending review
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Candidates that passed all filters — review each carefully before deciding.
              </p>
            </div>

            {/* Live refresh indicator */}
            {loading && (
              <RefreshCw
                size={14}
                className="animate-spin shrink-0"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              />
            )}
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-start gap-3 rounded-lg px-4 py-3"
            style={{
              background: 'rgba(245,158,11,0.07)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
            role="note"
          >
            <AlertTriangle
              size={14}
              strokeWidth={2}
              className="shrink-0 mt-0.5"
              style={{ color: '#f59e0b' }}
            />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <strong style={{ color: '#fbbf24' }}>Important: </strong>
              Reaching this queue does not mean a bet should be placed. Review all context,
              verify current injury reports, and apply your own judgment before any decision.
            </p>
          </div>
        </div>

        {/* ── Queue content ─────────────────────────────────────────────────── */}
        {loading ? (
          <LoadingSkeleton />
        ) : queueCandidates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {queueCandidates.map(candidate => (
              <QueueCard
                key={candidate.id}
                candidate={candidate}
                onDecision={handleDecision}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDecision={handleDecision}
      />
    </Layout>
  )
}

export default ApprovalQueue
