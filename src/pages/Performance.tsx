import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart2,
  Activity,
  RefreshCw,
} from 'lucide-react'
import type { PerformanceSummary, BetDecision } from '@/types'
import { getPerformance, getDecisions } from '@/lib/api'
import { Layout } from '@/components/Layout'
import { PerformanceChart } from '@/components/sharp/PerformanceChart'
import { formatOdds } from '@/utils/odds'

// ─── Summary stat card ────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color: 'emerald' | 'red' | 'amber' | 'blue' | 'neutral'
}

const COLOR_CFG = {
  emerald: { text: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)' },
  red:     { text: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.22)' },
  amber:   { text: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' },
  blue:    { text: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.22)' },
  neutral: { text: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.09)' },
} as const

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, trend, color }) => {
  const cfg = COLOR_CFG[color]
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <div
      className="sf-card flex flex-col gap-2 p-5"
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="sf-label truncate">{label}</span>
        {TrendIcon && (
          <TrendIcon
            size={14}
            style={{ color: trend === 'up' ? '#10b981' : '#ef4444', flexShrink: 0 }}
          />
        )}
      </div>
      <span
        className="text-2xl font-bold sf-mono tabular-nums leading-none"
        style={{ color: cfg.text }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {sub}
        </span>
      )}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div
    className="flex items-center gap-2.5 pb-3"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
  >
    {icon}
    <h3 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
      {title}
    </h3>
  </div>
)

// ─── Breakdown table row ──────────────────────────────────────────────────────

interface BreakdownRowProps {
  label: string
  bets: number
  wins: number
  netUnits: number
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({ label, bets, wins, netUnits }) => {
  const winRate = bets > 0 ? ((wins / bets) * 100).toFixed(0) : '—'
  const isPositive = netUnits >= 0

  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <td
        className="py-2 pr-3 text-xs"
        style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </td>
      <td
        className="py-2 px-2 text-xs sf-mono text-right tabular-nums"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        {bets}
      </td>
      <td
        className="py-2 px-2 text-xs sf-mono text-right tabular-nums"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        {winRate}%
      </td>
      <td
        className="py-2 pl-2 text-xs sf-mono text-right tabular-nums font-semibold"
        style={{ color: isPositive ? '#10b981' : '#ef4444' }}
      >
        {isPositive ? '+' : ''}{netUnits.toFixed(2)}u
      </td>
    </tr>
  )
}

// ─── Result badge ─────────────────────────────────────────────────────────────

const ResultBadge: React.FC<{ result: BetDecision['result'] }> = ({ result }) => {
  const cfg = {
    win:     { label: 'Win',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
    loss:    { label: 'Loss', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)' },
    push:    { label: 'Push', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)' },
    pending: { label: 'Pend', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
  }[result]

  return (
    <span
      className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold sf-mono"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function winRateColor(rate: number): StatCardProps['color'] {
  if (rate >= 55) return 'emerald'
  if (rate >= 50) return 'amber'
  return 'red'
}

function clvColor(rate: number): StatCardProps['color'] {
  if (rate >= 60) return 'emerald'
  if (rate >= 40) return 'amber'
  return 'red'
}

function decisionLabel(d: BetDecision['decision']): string {
  return { approve: 'Approved', reject: 'Rejected', watch: 'Watchlist' }[d]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Performance: React.FC = () => {
  const [summary, setSummary] = useState<PerformanceSummary | null>(null)
  const [decisions, setDecisions] = useState<BetDecision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([getPerformance(), getDecisions()])
      .then(([perf, decs]) => {
        if (!cancelled) {
          setSummary(perf)
          setDecisions(decs)
        }
      })
      .catch(err => {
        console.error('Failed to load performance data:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  // ── Loading skeleton ─────────────────────────────────────────────────────────

  if (loading || !summary) {
    return (
      <Layout pageTitle="Performance">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="sf-card animate-pulse"
                style={{ height: 96, opacity: 0.4 }}
              />
            ))}
          </div>
          <div className="sf-card animate-pulse" style={{ height: 280, opacity: 0.4 }} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="sf-card animate-pulse" style={{ height: 200, opacity: 0.4 }} />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  // ── Derived values ───────────────────────────────────────────────────────────

  const recentDecisions = [...decisions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const sportEntries = Object.entries(summary.bets_by_sport)
  const marketEntries = Object.entries(summary.bets_by_market)
  const sportsbookEntries = Object.entries(summary.bets_by_sportsbook)

  const netUnitsTrend: StatCardProps['trend'] =
    summary.net_units > 0 ? 'up' : summary.net_units < 0 ? 'down' : 'neutral'
  const roiTrend: StatCardProps['trend'] =
    summary.roi > 0 ? 'up' : summary.roi < 0 ? 'down' : 'neutral'

  return (
    <Layout pageTitle="Performance" isMockMode={!import.meta.env.VITE_API_URL}>
      <div className="p-4 sm:p-6 space-y-5 pb-10">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Activity size={16} style={{ color: '#3b82f6' }} />
            <h2
              className="text-base font-semibold"
              style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sans)' }}
            >
              Performance Analytics
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            System-wide betting performance across all logged decisions
          </p>
        </div>

        {/* ── Summary stat cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Net Units"
            value={`${summary.net_units >= 0 ? '+' : ''}${summary.net_units.toFixed(2)}u`}
            sub={`${summary.total_approved} total bets`}
            color={summary.net_units >= 0 ? 'emerald' : 'red'}
            trend={netUnitsTrend}
          />
          <StatCard
            label="Win Rate"
            value={`${summary.win_rate.toFixed(1)}%`}
            sub={`${summary.total_wins}W / ${summary.total_losses}L`}
            color={winRateColor(summary.win_rate)}
          />
          <StatCard
            label="ROI"
            value={`${summary.roi >= 0 ? '+' : ''}${summary.roi.toFixed(1)}%`}
            sub="return on investment"
            color={summary.roi >= 0 ? 'emerald' : 'red'}
            trend={roiTrend}
          />
          <StatCard
            label="CLV Hit Rate"
            value={`${summary.clv_hit_rate.toFixed(1)}%`}
            sub="closing line value"
            color={clvColor(summary.clv_hit_rate)}
          />
          <StatCard
            label="Avg Edge"
            value={`${summary.avg_edge >= 0 ? '+' : ''}${(summary.avg_edge * 100).toFixed(1)}%`}
            sub="avg estimated EV"
            color={summary.avg_edge >= 0 ? 'emerald' : 'red'}
          />
          <StatCard
            label="Total Bets"
            value={String(summary.total_approved)}
            sub={`${summary.total_pending} pending`}
            color="neutral"
          />
        </div>

        {/* ── Cumulative units chart ──────────────────────────────────────────── */}
        <div className="sf-card p-5">
          <SectionHeader
            icon={<TrendingUp size={15} style={{ color: '#10b981' }} />}
            title="Cumulative Units — All Time"
          />
          <div className="mt-4">
            {summary.timeline.length === 0 ? (
              <div
                className="flex items-center justify-center py-10 text-xs"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                No timeline data available.
              </div>
            ) : (
              <PerformanceChart data={summary.timeline} height={220} />
            )}
          </div>
        </div>

        {/* ── Three-column breakdown ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Column 1: By Sport */}
          <div className="sf-card p-5">
            <SectionHeader
              icon={<Target size={15} style={{ color: '#60a5fa' }} />}
              title="Edge by Sport"
            />
            {sportEntries.length === 0 ? (
              <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No sport data yet.
              </p>
            ) : (
              <table className="w-full mt-4" aria-label="Edge by sport">
                <thead>
                  <tr>
                    <th
                      className="pb-2 text-left text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Sport
                    </th>
                    <th
                      className="pb-2 px-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Bets
                    </th>
                    <th
                      className="pb-2 px-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Win%
                    </th>
                    <th
                      className="pb-2 pl-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sportEntries.map(([sport, data]) => (
                    <BreakdownRow
                      key={sport}
                      label={sport}
                      bets={data.count}
                      wins={data.wins}
                      netUnits={data.net_units}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Column 2: By Market */}
          <div className="sf-card p-5">
            <SectionHeader
              icon={<BarChart2 size={15} style={{ color: '#a78bfa' }} />}
              title="Edge by Market"
            />
            {marketEntries.length === 0 ? (
              <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No market data yet.
              </p>
            ) : (
              <table className="w-full mt-4" aria-label="Edge by market">
                <thead>
                  <tr>
                    <th
                      className="pb-2 text-left text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Market
                    </th>
                    <th
                      className="pb-2 px-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Bets
                    </th>
                    <th
                      className="pb-2 px-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Win%
                    </th>
                    <th
                      className="pb-2 pl-2 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketEntries.map(([market, data]) => (
                    <BreakdownRow
                      key={market}
                      label={market}
                      bets={data.count}
                      wins={data.wins}
                      netUnits={data.net_units}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Column 3: Rejection Reasons */}
          <div className="sf-card p-5">
            <SectionHeader
              icon={<TrendingDown size={15} style={{ color: '#f87171' }} />}
              title="Common Rejection Reasons"
            />
            {summary.rejection_reasons.length === 0 ? (
              <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No rejection data yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {summary.rejection_reasons
                  .sort((a, b) => b.count - a.count)
                  .map((item, idx) => {
                    const maxCount = summary.rejection_reasons[0]?.count ?? 1
                    const pct = Math.round((item.count / maxCount) * 100)
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs leading-snug flex-1 min-w-0"
                            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}
                          >
                            {item.reason}
                          </span>
                          <span
                            className="text-[10px] sf-mono tabular-nums shrink-0"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                          >
                            {item.count}
                          </span>
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: 'rgba(239,68,68,0.55)',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>

        {/* ── By Sportsbook ───────────────────────────────────────────────────── */}
        <div className="sf-card p-5">
          <SectionHeader
            icon={<Target size={15} style={{ color: '#fbbf24' }} />}
            title="Performance by Sportsbook"
          />
          {sportsbookEntries.length === 0 ? (
            <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No sportsbook data yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full" aria-label="Performance by sportsbook">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th
                      className="pb-2.5 text-left text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Sportsbook
                    </th>
                    <th
                      className="pb-2.5 px-4 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Bets
                    </th>
                    <th
                      className="pb-2.5 pl-4 text-right text-[10px] font-semibold tracking-wider uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      Net Units
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sportsbookEntries
                    .sort((a, b) => b[1].net_units - a[1].net_units)
                    .map(([book, data]) => {
                      const isPositive = data.net_units >= 0
                      return (
                        <tr
                          key={book}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <td
                            className="py-2.5 pr-4 text-sm font-medium"
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                          >
                            {book}
                          </td>
                          <td
                            className="py-2.5 px-4 text-right text-xs sf-mono tabular-nums"
                            style={{ color: 'rgba(255,255,255,0.45)' }}
                          >
                            {data.count}
                          </td>
                          <td
                            className="py-2.5 pl-4 text-right text-sm sf-mono tabular-nums font-semibold"
                            style={{ color: isPositive ? '#10b981' : '#ef4444' }}
                          >
                            {isPositive ? '+' : ''}{data.net_units.toFixed(2)}u
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Recent decisions table ──────────────────────────────────────────── */}
        <div className="sf-card p-5">
          <SectionHeader
            icon={<RefreshCw size={15} style={{ color: '#60a5fa' }} />}
            title="Recent Decisions"
          />
          {recentDecisions.length === 0 ? (
            <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No decisions recorded yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full" aria-label="Recent decisions">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Player / Team', 'Decision', 'Result', 'P&L', 'CLV'].map(col => (
                      <th
                        key={col}
                        className="pb-2.5 pr-4 last:pr-0 text-left text-[10px] font-semibold tracking-wider uppercase"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDecisions.map(dec => {
                    const isWin = dec.result === 'win'
                    const isLoss = dec.result === 'loss'
                    const rowTint = isWin
                      ? 'rgba(16,185,129,0.04)'
                      : isLoss
                        ? 'rgba(239,68,68,0.04)'
                        : 'transparent'

                    const pl = dec.profit_loss_units
                    const plStr = pl == null
                      ? '—'
                      : `${pl >= 0 ? '+' : ''}${pl.toFixed(2)}u`
                    const plColor = pl == null
                      ? 'rgba(255,255,255,0.3)'
                      : pl >= 0 ? '#10b981' : '#ef4444'

                    const closingMoved =
                      dec.closing_odds != null && dec.closing_odds !== dec.original_odds
                    const clvStr = closingMoved
                      ? formatOdds(dec.closing_odds!)
                      : '—'
                    const clvColor = closingMoved
                      ? (dec.closing_odds! > dec.original_odds ? '#10b981' : '#ef4444')
                      : 'rgba(255,255,255,0.3)'

                    return (
                      <tr
                        key={dec.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: rowTint,
                        }}
                      >
                        <td className="py-2.5 pr-4">
                          <span
                            className="text-xs font-medium"
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                          >
                            {dec.candidate?.player_or_team ?? `Bet #${dec.candidate_id.slice(-4)}`}
                          </span>
                          {dec.candidate && (
                            <span
                              className="block text-[10px] mt-0.5"
                              style={{ color: 'rgba(255,255,255,0.35)' }}
                            >
                              {dec.candidate.market} · {dec.candidate.sportsbook}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span
                            className="text-xs"
                            style={{
                              color: dec.decision === 'approve'
                                ? '#10b981'
                                : dec.decision === 'reject'
                                  ? '#ef4444'
                                  : '#f59e0b',
                            }}
                          >
                            {decisionLabel(dec.decision)}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <ResultBadge result={dec.result} />
                        </td>
                        <td
                          className="py-2.5 pr-4 text-xs sf-mono tabular-nums font-semibold"
                          style={{ color: plColor }}
                        >
                          {plStr}
                        </td>
                        <td
                          className="py-2.5 text-xs sf-mono tabular-nums"
                          style={{ color: clvColor }}
                        >
                          {clvStr}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
        <div
          className="rounded-lg border px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
          role="note"
        >
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Performance data reflects logged decisions in mock mode. Connect live data for production tracking.
          </p>
        </div>

      </div>
    </Layout>
  )
}

export default Performance
