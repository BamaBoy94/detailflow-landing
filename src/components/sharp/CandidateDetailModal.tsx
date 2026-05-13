import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart2,
  ClipboardList,
  ArrowLeftRight,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import type { BetCandidate } from '@/types'
import { formatOdds } from '@/utils/odds'
import { ProjectionBreakdown } from '@/components/sharp/ProjectionBreakdown'
import { RuleChecklist } from '@/components/sharp/RuleChecklist'
import { MarketComparisonTable } from '@/components/sharp/MarketComparisonTable'
import { DecisionButtons } from '@/components/sharp/DecisionButtons'
import { ScoreBadge } from '@/components/sharp/ScoreBadge'
import { EVBadge } from '@/components/sharp/EVBadge'

interface CandidateDetailModalProps {
  candidate: BetCandidate | null
  isOpen: boolean
  onClose: () => void
  onDecision: (id: string, decision: 'approve' | 'reject' | 'watch') => void
}

type TabId = 'summary' | 'projection' | 'checklist' | 'market' | 'context' | 'risk'

interface TabConfig {
  id: TabId
  label: string
  icon: React.ReactNode
}

const TABS: TabConfig[] = [
  { id: 'summary',    label: 'Summary',     icon: <FileText size={13} strokeWidth={2} /> },
  { id: 'projection', label: 'Projection',  icon: <BarChart2 size={13} strokeWidth={2} /> },
  { id: 'checklist',  label: 'Checklist',   icon: <ClipboardList size={13} strokeWidth={2} /> },
  { id: 'market',     label: 'Market',      icon: <ArrowLeftRight size={13} strokeWidth={2} /> },
  { id: 'context',    label: 'Context',     icon: <CheckCircle2 size={13} strokeWidth={2} /> },
  { id: 'risk',       label: 'Risk Flags',  icon: <ShieldAlert size={13} strokeWidth={2} /> },
]

function statusConfig(status: BetCandidate['status']) {
  switch (status) {
    case 'approved':  return { color: '#34d399', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  label: 'Approved' }
    case 'rejected':  return { color: '#f87171', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   label: 'Rejected' }
    case 'watchlist': return { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',  label: 'Watchlist' }
    case 'expired':   return { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Expired' }
    default:          return { color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  label: 'Candidate' }
  }
}

function formatGameTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
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

interface SummaryRowProps {
  label: string
  value: React.ReactNode
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value }) => (
  <div
    className="flex items-center justify-between gap-4 py-2.5"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
  >
    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-sans)' }}>
      {label}
    </span>
    <span className="text-xs font-medium text-right" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)' }}>
      {value}
    </span>
  </div>
)

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onDecision,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('summary')

  if (!candidate) return null

  const statusCfg = statusConfig(candidate.status)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col w-full"
          style={{
            maxWidth: '56rem',
            maxHeight: '90vh',
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '12px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          }}
          aria-labelledby="candidate-modal-title"
        >
          {/* ── Header ─────────────────────────────────────── */}
          <div
            className="flex items-start justify-between gap-4 px-6 pt-5 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="min-w-0">
                <Dialog.Title
                  id="candidate-modal-title"
                  className="text-base font-semibold truncate"
                  style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-sans)' }}
                >
                  {candidate.player_or_team}
                </Dialog.Title>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}
                  >
                    {candidate.league}
                  </span>
                  <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border"
                    style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.border }}
                  >
                    {statusCfg.label}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {candidate.market} · {candidate.bet_type} {candidate.line.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <ScoreBadge score={candidate.system_score} size="sm" />
              <EVBadge ev={candidate.estimated_ev} size="sm" />
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                  aria-label="Close modal"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────── */}
          <div
            className="flex items-center gap-0.5 px-4 pt-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            role="tablist"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t transition-colors duration-150 cursor-pointer relative"
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                    marginBottom: '-1px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'risk' && candidate.risk_flags.length > 0 && (
                    <span
                      className="ml-0.5 text-[9px] font-bold px-1 rounded-full"
                      style={{ background: 'rgba(239,68,68,0.25)', color: '#f87171' }}
                    >
                      {candidate.risk_flags.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Scrollable Content ─────────────────────────── */}
          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            role="tabpanel"
            style={{ minHeight: 0 }}
          >
            {/* Summary */}
            {activeTab === 'summary' && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="sf-label mb-3">Game Details</p>
                  <div
                    className="rounded-lg px-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <SummaryRow label="Game" value={candidate.game} />
                    <SummaryRow
                      label="Game Time"
                      value={
                        <span className="flex items-center gap-1.5 justify-end">
                          <Clock size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />
                          {formatGameTime(candidate.game_start_time)}
                        </span>
                      }
                    />
                    <SummaryRow label="Sport" value={candidate.sport} />
                    <SummaryRow label="League" value={candidate.league} />
                  </div>
                </div>

                <div>
                  <p className="sf-label mb-3">Bet Details</p>
                  <div
                    className="rounded-lg px-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <SummaryRow label="Market" value={candidate.market} />
                    <SummaryRow label="Bet Type" value={candidate.bet_type} />
                    <SummaryRow
                      label="Line"
                      value={
                        <span style={{ fontFamily: 'var(--font-mono)' }}>
                          {candidate.line.toFixed(1)}
                        </span>
                      }
                    />
                    <SummaryRow
                      label="Odds"
                      value={
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                          {formatOdds(candidate.odds)}
                        </span>
                      }
                    />
                    <SummaryRow
                      label="Sportsbook"
                      value={
                        <span className="flex items-center gap-1.5 justify-end">
                          <MapPin size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />
                          {candidate.sportsbook}
                        </span>
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="sf-label mb-3">System Assessment</p>
                  <div
                    className="rounded-lg px-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <SummaryRow label="System Score" value={<ScoreBadge score={candidate.system_score} size="sm" />} />
                    <SummaryRow label="Confidence Tier" value={candidate.confidence_tier} />
                    <SummaryRow label="Recommended Action" value={candidate.recommended_action} />
                    <SummaryRow label="Max Units" value={<span style={{ fontFamily: 'var(--font-mono)' }}>{candidate.max_units}</span>} />
                    <SummaryRow label="Estimated EV" value={<EVBadge ev={candidate.estimated_ev} size="sm" />} />
                  </div>
                </div>
              </div>
            )}

            {/* Projection Breakdown */}
            {activeTab === 'projection' && (
              <ProjectionBreakdown candidate={candidate} />
            )}

            {/* Rule Checklist */}
            {activeTab === 'checklist' && (
              <RuleChecklist checklist={candidate.rule_checklist} />
            )}

            {/* Market Comparison */}
            {activeTab === 'market' && (
              <MarketComparisonTable
                comparison={candidate.market_comparison}
                selectedBook={candidate.sportsbook}
                selectedLine={candidate.line}
                selectedOdds={candidate.odds}
              />
            )}

            {/* Context Notes */}
            {activeTab === 'context' && (
              <div className="flex flex-col gap-3">
                <p className="sf-label">Supporting Factors</p>
                {candidate.context_notes.length === 0 ? (
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No context notes recorded.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {candidate.context_notes.map((note, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded px-3 py-2.5 text-xs"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: 'var(--font-sans)',
                          lineHeight: '1.6',
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}
                        />
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Risk Flags */}
            {activeTab === 'risk' && (
              <div className="flex flex-col gap-3">
                <p className="sf-label">Risk Flags</p>
                {candidate.risk_flags.length === 0 ? (
                  <div
                    className="flex items-center gap-2.5 rounded-lg px-4 py-3"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}
                  >
                    <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: '#34d399' }}>
                      No risk flags identified.
                    </span>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {candidate.risk_flags.map((flag, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded px-3 py-2.5 text-xs"
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171',
                          fontFamily: 'var(--font-sans)',
                          lineHeight: '1.6',
                        }}
                      >
                        <AlertTriangle
                          size={13}
                          style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }}
                        />
                        {flag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* ── Footer / Decision Bar ──────────────────────── */}
          <div
            className="flex items-center justify-between gap-4 px-6 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Decision:</span>
            </div>
            <DecisionButtons
              candidateId={candidate.id}
              currentStatus={candidate.status}
              onDecision={onDecision}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CandidateDetailModal
