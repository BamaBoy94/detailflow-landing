import React from 'react'
import {
  ChevronDown,
  ChevronsUpDown,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Eye,
  XCircle,
} from 'lucide-react'
import type { BetCandidate } from '@/types'
import { formatOdds, formatEV } from '@/utils/odds'
import { ScoreBadge } from '@/components/sharp/ScoreBadge'

interface CandidateTableProps {
  candidates: BetCandidate[]
  onDecision: (id: string, decision: 'approve' | 'reject' | 'watch') => void
  onRowClick: (candidate: BetCandidate) => void
  sortKey?: string
  onSort?: (key: string) => void
}

interface ColumnConfig {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

const COLUMNS: ColumnConfig[] = [
  { key: 'system_score',    label: 'Score',            sortable: true,  align: 'center', width: '72px' },
  { key: 'player_market',   label: 'Player / Market',  sortable: false, align: 'left'   },
  { key: 'game',            label: 'Game',             sortable: false, align: 'left',   width: '140px' },
  { key: 'line',            label: 'Line',             sortable: false, align: 'center', width: '60px' },
  { key: 'odds',            label: 'Odds',             sortable: true,  align: 'center', width: '70px' },
  { key: 'projection_edge', label: 'Proj. Edge',       sortable: true,  align: 'center', width: '90px' },
  { key: 'estimated_ev',    label: 'Est. EV',          sortable: true,  align: 'center', width: '80px' },
  { key: 'sportsbook',      label: 'Sportsbook',       sortable: false, align: 'left',   width: '100px' },
  { key: 'status',          label: 'Status',           sortable: false, align: 'center', width: '90px' },
  { key: 'actions',         label: 'Actions',          sortable: false, align: 'right',  width: '110px' },
]

function statusConfig(status: BetCandidate['status']) {
  switch (status) {
    case 'approved':  return { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', label: 'Approved' }
    case 'rejected':  return { color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   label: 'Rejected' }
    case 'watchlist': return { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  label: 'Watchlist' }
    case 'expired':   return { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', label: 'Expired' }
    default:          return { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  label: 'Candidate' }
  }
}

interface SortIndicatorProps {
  columnKey: string
  sortKey?: string
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ columnKey, sortKey }) => {
  if (columnKey !== sortKey) {
    return <ChevronsUpDown size={11} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
  }
  return <ChevronDown size={11} style={{ color: '#3b82f6', flexShrink: 0 }} />
}

interface ActionButtonProps {
  decision: 'approve' | 'watch' | 'reject'
  isActive: boolean
  onClick: (e: React.MouseEvent) => void
}

const actionConfigs = {
  approve: {
    icon: CheckCircle,
    label: 'Approve',
    activeStatus: 'approved',
    activeColor: '#10b981',
    activeBg: 'rgba(16,185,129,0.18)',
    activeBorder: 'rgba(16,185,129,0.4)',
    idleColor: 'rgba(16,185,129,0.5)',
    hoverBg: 'rgba(16,185,129,0.10)',
    hoverBorder: 'rgba(16,185,129,0.25)',
  },
  watch: {
    icon: Eye,
    label: 'Watch',
    activeStatus: 'watchlist',
    activeColor: '#f59e0b',
    activeBg: 'rgba(245,158,11,0.18)',
    activeBorder: 'rgba(245,158,11,0.4)',
    idleColor: 'rgba(245,158,11,0.5)',
    hoverBg: 'rgba(245,158,11,0.10)',
    hoverBorder: 'rgba(245,158,11,0.25)',
  },
  reject: {
    icon: XCircle,
    label: 'Reject',
    activeStatus: 'rejected',
    activeColor: '#ef4444',
    activeBg: 'rgba(239,68,68,0.18)',
    activeBorder: 'rgba(239,68,68,0.4)',
    idleColor: 'rgba(239,68,68,0.5)',
    hoverBg: 'rgba(239,68,68,0.10)',
    hoverBorder: 'rgba(239,68,68,0.25)',
  },
} as const

const ActionButton: React.FC<ActionButtonProps> = ({ decision, isActive, onClick }) => {
  const cfg = actionConfigs[decision]
  const Icon = cfg.icon

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${cfg.label}${isActive ? ' (current)' : ''}`}
      aria-pressed={isActive}
      className="flex items-center justify-center w-6 h-6 rounded transition-all duration-150 cursor-pointer"
      style={{
        background: isActive ? cfg.activeBg : 'transparent',
        border: `1px solid ${isActive ? cfg.activeBorder : 'rgba(255,255,255,0.08)'}`,
        color: isActive ? cfg.activeColor : cfg.idleColor,
      }}
      onMouseEnter={e => {
        if (!isActive) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = cfg.hoverBg
          el.style.borderColor = cfg.hoverBorder
          el.style.color = cfg.activeColor
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'transparent'
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.color = cfg.idleColor
        }
      }}
    >
      <Icon size={12} strokeWidth={isActive ? 2.5 : 2} />
    </button>
  )
}

const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onDecision,
  onRowClick,
  sortKey,
  onSort,
}) => {
  if (candidates.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 text-sm"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        No candidates to display.
      </div>
    )
  }

  return (
    <div
      className="w-full overflow-x-auto rounded-lg"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <table className="w-full border-collapse text-xs" style={{ minWidth: '900px' }}>
        {/* ── Sticky header ──────────────────────────────── */}
        <thead
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#111111',
            borderBottom: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-medium select-none ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                style={{
                  width: col.width,
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: col.sortable && onSort ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && onSort && (
                    <SortIndicator columnKey={col.key} sortKey={sortKey} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Table body ─────────────────────────────────── */}
        <tbody>
          {candidates.map((c, idx) => {
            const statusCfg = statusConfig(c.status)
            const edgePositive = c.projection_edge >= 0
            const evPositive = c.estimated_ev >= 0

            return (
              <tr
                key={c.id}
                onClick={() => onRowClick(c)}
                style={{
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background =
                    idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                }}
                role="button"
                tabIndex={0}
                aria-label={`${c.player_or_team} — ${c.market} ${c.bet_type} ${c.line.toFixed(1)}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRowClick(c)
                  }
                }}
              >
                {/* Score */}
                <td className="px-3 py-2.5 text-center">
                  <div className="flex justify-center">
                    <ScoreBadge score={c.system_score} size="sm" />
                  </div>
                </td>

                {/* Player / Market */}
                <td className="px-3 py-2.5">
                  <p
                    className="font-medium truncate"
                    style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)', maxWidth: '160px' }}
                  >
                    {c.player_or_team}
                  </p>
                  <p className="truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '160px' }}>
                    {c.market} · {c.bet_type}
                  </p>
                </td>

                {/* Game */}
                <td className="px-3 py-2.5">
                  <p
                    className="truncate"
                    style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '130px' }}
                  >
                    {c.game}
                  </p>
                  <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-1 py-0.5 rounded mt-0.5 inline-block"
                    style={{ background: 'rgba(59,130,246,0.10)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.18)' }}
                  >
                    {c.league}
                  </span>
                </td>

                {/* Line */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)' }}
                  >
                    {c.line.toFixed(1)}
                  </span>
                </td>

                {/* Odds */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="font-semibold"
                    style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}
                  >
                    {formatOdds(c.odds)}
                  </span>
                </td>

                {/* Projection Edge */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: edgePositive ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}
                  >
                    {edgePositive
                      ? <TrendingUp size={11} strokeWidth={2.5} />
                      : <TrendingDown size={11} strokeWidth={2.5} />}
                    {edgePositive ? '+' : ''}{c.projection_edge.toFixed(1)}
                  </span>
                </td>

                {/* Est. EV */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="font-semibold"
                    style={{
                      color: evPositive ? '#10b981' : '#ef4444',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {formatEV(c.estimated_ev)}
                  </span>
                </td>

                {/* Sportsbook */}
                <td className="px-3 py-2.5">
                  <span
                    className="truncate block"
                    style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '90px' }}
                  >
                    {c.sportsbook}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border whitespace-nowrap"
                    style={{
                      color: statusCfg.color,
                      background: statusCfg.bg,
                      borderColor: statusCfg.border,
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </td>

                {/* Actions */}
                <td
                  className="px-3 py-2.5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    {(['approve', 'watch', 'reject'] as const).map((decision) => {
                      const expectedStatus =
                        decision === 'approve' ? 'approved' :
                        decision === 'watch'   ? 'watchlist' :
                        'rejected'
                      return (
                        <ActionButton
                          key={decision}
                          decision={decision}
                          isActive={c.status === expectedStatus}
                          onClick={(e) => {
                            e.stopPropagation()
                            onDecision(c.id, decision)
                          }}
                        />
                      )
                    })}

                    {/* Risk flag indicator */}
                    {c.risk_flags.length > 0 ? (
                      <ShieldAlert
                        size={12}
                        style={{ color: '#ef4444', marginLeft: 4, flexShrink: 0 }}
                        aria-label={`${c.risk_flags.length} risk flag${c.risk_flags.length !== 1 ? 's' : ''}`}
                      />
                    ) : (
                      <ShieldCheck
                        size={12}
                        style={{ color: 'rgba(16,185,129,0.5)', marginLeft: 4, flexShrink: 0 }}
                        aria-label="No risk flags"
                      />
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CandidateTable
