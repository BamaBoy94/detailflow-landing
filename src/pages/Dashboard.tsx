import React, { useState, useEffect, useCallback } from 'react'
import {
  LayoutGrid,
  List,
  Target,
  CheckCircle2,
  Eye,
  XCircle,
  Activity,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'
import type {
  BetCandidate,
  CandidateFilters,
  SortKey,
  CandidateStatus,
  Market,
  Sport,
} from '@/types'
import { getCandidates, submitDecision, refreshData } from '@/lib/api'
import { Layout } from '@/components/Layout'
import { KillSwitchBanner } from '@/components/sharp/KillSwitchBanner'
import { AlertBanner } from '@/components/sharp/AlertBanner'
import CandidateCard from '@/components/sharp/CandidateCard'
import CandidateTable from '@/components/sharp/CandidateTable'
import CandidateDetailModal from '@/components/sharp/CandidateDetailModal'
import { ExposureMeter } from '@/components/sharp/ExposureMeter'

// ─── Mock bankroll (hardcoded until bankroll context is implemented) ───────────

const MOCK_BANKROLL = {
  daily_units_used: 1,
  max_daily_units: 3,
  stop_loss_triggered: false,
} as const

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'table' | 'cards'

interface AlertState {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode
  value: number | string
  label: string
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'neutral'
}

const COLOR_MAP = {
  blue:    { icon: 'rgba(59,130,246,0.85)',  badge: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.25)',  text: '#60a5fa' },
  emerald: { icon: 'rgba(16,185,129,0.85)',  badge: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.25)',  text: '#34d399' },
  amber:   { icon: 'rgba(245,158,11,0.85)',  badge: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.25)',  text: '#fbbf24' },
  red:     { icon: 'rgba(239,68,68,0.85)',   badge: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.25)',   text: '#f87171' },
  neutral: { icon: 'rgba(255,255,255,0.45)', badge: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.10)', text: 'rgba(255,255,255,0.75)' },
} as const

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  const cfg = COLOR_MAP[color]
  return (
    <div
      className="sf-card flex items-center gap-3 px-4 py-3"
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-md shrink-0"
        style={{ background: cfg.badge, border: `1px solid ${cfg.border}`, color: cfg.icon }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className="text-lg font-bold leading-none sf-mono"
          style={{ color: cfg.text }}
        >
          {value}
        </p>
        <p className="sf-label mt-1 truncate">{label}</p>
      </div>
    </div>
  )
}

// ─── Filter select ────────────────────────────────────────────────────────────

interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  label: string
}

const FilterSelect: React.FC<SelectProps> = ({ value, onChange, options, label }) => (
  <div className="relative inline-flex items-center">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none cursor-pointer rounded border pl-3 pr-7 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
      style={{
        background: '#1a1a1a',
        borderColor: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'var(--font-sans)',
      }}
      aria-label={label}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={12}
      className="pointer-events-none absolute right-2"
      style={{ color: 'rgba(255,255,255,0.35)' }}
    />
  </div>
)

// ─── Status filter tabs ───────────────────────────────────────────────────────

const STATUS_TABS: { value: CandidateStatus | ''; label: string }[] = [
  { value: '',            label: 'All' },
  { value: 'candidate',  label: 'Candidates' },
  { value: 'approved',   label: 'Approved' },
  { value: 'watchlist',  label: 'Watchlist' },
  { value: 'rejected',   label: 'Rejected' },
]

// ─── Option lists ─────────────────────────────────────────────────────────────

const SPORT_OPTIONS: { value: Sport | ''; label: string }[] = [
  { value: '',           label: 'All Sports' },
  { value: 'Basketball', label: 'Basketball' },
  { value: 'Football',   label: 'Football' },
  { value: 'Baseball',   label: 'Baseball' },
  { value: 'Hockey',     label: 'Hockey' },
  { value: 'Soccer',     label: 'Soccer' },
  { value: 'Tennis',     label: 'Tennis' },
]

const MARKET_OPTIONS: { value: Market | ''; label: string }[] = [
  { value: '',                 label: 'All Markets' },
  { value: 'Player Points',    label: 'Player Points' },
  { value: 'Player Rebounds',  label: 'Player Rebounds' },
  { value: 'Player Assists',   label: 'Player Assists' },
  { value: 'Player PRA',       label: 'Player PRA' },
  { value: 'Player Threes',    label: 'Player Threes' },
  { value: 'Player Blocks',    label: 'Player Blocks' },
  { value: 'Player Steals',    label: 'Player Steals' },
  { value: 'Player Turnovers', label: 'Player Turnovers' },
  { value: 'Player Minutes',   label: 'Player Minutes' },
  { value: 'Game Total',       label: 'Game Total' },
  { value: 'Spread',           label: 'Spread' },
  { value: 'Moneyline',        label: 'Moneyline' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'system_score',    label: 'Highest Score' },
  { value: 'estimated_ev',    label: 'Highest EV' },
  { value: 'projection_edge', label: 'Highest Edge' },
  { value: 'created_at',      label: 'Newest First' },
]

// ─── Sorting helper ───────────────────────────────────────────────────────────

function sortCandidates(candidates: BetCandidate[], key: SortKey): BetCandidate[] {
  return [...candidates].sort((a, b) => {
    if (key === 'created_at') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return (b[key] as number) - (a[key] as number)
  })
}

// ─── Dashboard page ───────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<BetCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<BetCandidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<CandidateFilters>({ status: '' })
  const [sortKey, setSortKey] = useState<SortKey>('system_score')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [alert, setAlert] = useState<AlertState | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [minScore, setMinScore] = useState<number>(0)

  // ── Data loading ──────────────────────────────────────────────────────────────

  const loadCandidates = useCallback(async () => {
    try {
      const data = await getCandidates(filters)
      setCandidates(data)
    } catch (err) {
      setAlert({
        message: `Failed to load candidates: ${err instanceof Error ? err.message : 'Unknown error'}`,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    setLoading(true)
    loadCandidates()
  }, [loadCandidates])

  // ── Auto-dismiss alerts ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!alert) return
    const id = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(id)
  }, [alert])

  // ── Actions ───────────────────────────────────────────────────────────────────

  const handleDecision = useCallback(
    async (candidateId: string, decision: 'approve' | 'reject' | 'watch') => {
      try {
        await submitDecision(candidateId, decision)
        await loadCandidates()
        const labels = { approve: 'Approved', reject: 'Rejected', watch: 'Added to watchlist' }
        setAlert({ message: `${labels[decision]} successfully.`, type: 'success' })
        // Keep selected candidate in sync if the modal is open
        if (selectedCandidate?.id === candidateId) {
          setCandidates(prev => {
            const updated = prev.find(c => c.id === candidateId)
            if (updated) setSelectedCandidate(updated)
            return prev
          })
        }
      } catch (err) {
        setAlert({
          message: `Decision failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          type: 'error',
        })
      }
    },
    [loadCandidates, selectedCandidate],
  )

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
      await loadCandidates()
      setAlert({ message: 'Data refreshed.', type: 'info' })
    } catch {
      setAlert({ message: 'Refresh failed. Check API connection.', type: 'error' })
    } finally {
      setIsRefreshing(false)
    }
  }, [loadCandidates])

  const openModal = useCallback((candidate: BetCandidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
  }, [])

  const handleSort = useCallback((key: string) => {
    if (['system_score', 'estimated_ev', 'projection_edge', 'odds', 'created_at'].includes(key)) {
      setSortKey(key as SortKey)
    }
  }, [])

  // ── Derived data ──────────────────────────────────────────────────────────────

  const filteredAndSorted = sortCandidates(
    candidates.filter(c => minScore === 0 || c.system_score >= minScore),
    sortKey,
  )

  const totalCount    = candidates.length
  const approvedCount = candidates.filter(c => c.status === 'approved').length
  const watchlistCount = candidates.filter(c => c.status === 'watchlist').length
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length
  const dailyExposurePct = MOCK_BANKROLL.daily_units_used / MOCK_BANKROLL.max_daily_units

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <Layout
      pageTitle="Dashboard"
      isMockMode={!import.meta.env.VITE_API_URL}
      onRefresh={handleRefresh}
    >
      {/* Kill switch */}
      <KillSwitchBanner triggered={MOCK_BANKROLL.stop_loss_triggered} />

      <div className="flex flex-col gap-4 p-4 sm:p-6">

        {/* Alert banner */}
        {alert && (
          <AlertBanner
            message={alert.message}
            type={alert.type}
            onDismiss={() => setAlert(null)}
          />
        )}

        {/* ── Summary row — 5 stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard
            icon={<Target size={16} strokeWidth={2} />}
            value={totalCount}
            label="Candidates Found"
            color="blue"
          />
          <StatCard
            icon={<CheckCircle2 size={16} strokeWidth={2} />}
            value={approvedCount}
            label="Approved Today"
            color="emerald"
          />
          <StatCard
            icon={<Eye size={16} strokeWidth={2} />}
            value={watchlistCount}
            label="On Watchlist"
            color="amber"
          />
          <StatCard
            icon={<XCircle size={16} strokeWidth={2} />}
            value={rejectedCount}
            label="Rejected Today"
            color="red"
          />

          {/* Daily exposure — spans 2 cols on xs, 1 on sm+ */}
          <div
            className="sf-card col-span-2 sm:col-span-1 px-4 py-3 flex flex-col gap-2"
            role="status"
            aria-label={`Daily exposure: ${MOCK_BANKROLL.daily_units_used} of ${MOCK_BANKROLL.max_daily_units} units`}
          >
            <div className="flex items-center gap-2">
              <Activity
                size={14}
                style={{
                  color: dailyExposurePct >= 0.9
                    ? '#ef4444'
                    : dailyExposurePct >= 0.5
                    ? '#f59e0b'
                    : '#10b981',
                }}
              />
              <span className="sf-label">Daily Exposure</span>
            </div>
            <ExposureMeter
              used={MOCK_BANKROLL.daily_units_used}
              max={MOCK_BANKROLL.max_daily_units}
              label=""
            />
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────────────── */}
        <div className="sf-card p-4 flex flex-col gap-3">

          {/* Top row: dropdowns + sort + view toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal
              size={14}
              style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}
            />

            <FilterSelect
              value={filters.sport ?? ''}
              onChange={v => setFilters(prev => ({ ...prev, sport: v as Sport | '' }))}
              options={SPORT_OPTIONS}
              label="Filter by sport"
            />

            <FilterSelect
              value={filters.market ?? ''}
              onChange={v => setFilters(prev => ({ ...prev, market: v as Market | '' }))}
              options={MARKET_OPTIONS}
              label="Filter by market"
            />

            {/* Min score input */}
            <div className="inline-flex items-center gap-1.5">
              <span className="sf-label text-nowrap">Min Score</span>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={minScore || ''}
                placeholder="0"
                onChange={e => setMinScore(parseFloat(e.target.value) || 0)}
                className="w-14 rounded border px-2 py-1.5 text-xs text-center"
                style={{
                  background: '#1a1a1a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-mono)',
                }}
                aria-label="Minimum score filter"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <FilterSelect
                value={sortKey}
                onChange={v => setSortKey(v as SortKey)}
                options={SORT_OPTIONS}
                label="Sort candidates by"
              />

              {/* View toggle */}
              <div
                className="inline-flex rounded border overflow-hidden"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                role="group"
                aria-label="View mode"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors duration-150"
                  style={{
                    background: viewMode === 'table' ? 'rgba(59,130,246,0.18)' : 'transparent',
                    color: viewMode === 'table' ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                  aria-pressed={viewMode === 'table'}
                  aria-label="Table view"
                >
                  <List size={13} strokeWidth={2} />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors duration-150"
                  style={{
                    background: viewMode === 'cards' ? 'rgba(59,130,246,0.18)' : 'transparent',
                    color: viewMode === 'cards' ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                  }}
                  aria-pressed={viewMode === 'cards'}
                  aria-label="Card grid view"
                >
                  <LayoutGrid size={13} strokeWidth={2} />
                  Cards
                </button>
              </div>

              {/* Refresh indicator */}
              {isRefreshing && (
                <RefreshCw size={13} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
              )}
            </div>
          </div>

          {/* Status filter tabs */}
          <div
            className="flex items-center gap-0.5 border-t pt-3"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            role="tablist"
            aria-label="Filter by status"
          >
            {STATUS_TABS.map(tab => {
              const isActive = (filters.status ?? '') === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() =>
                    setFilters(prev => ({ ...prev, status: tab.value as CandidateStatus | '' }))
                  }
                  className="px-3 py-1 text-xs font-medium rounded-md cursor-pointer transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
                  style={{
                    background: isActive ? 'rgba(59,130,246,0.16)' : 'transparent',
                    color: isActive ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                    border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}

            <span
              className="ml-auto text-[10px] sf-mono"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ── Candidate list ─────────────────────────────────────────────────── */}
        {loading ? (
          <div
            className="sf-card flex items-center justify-center py-20 text-sm"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            role="status"
            aria-live="polite"
          >
            <RefreshCw size={16} className="animate-spin mr-2" />
            Loading candidates…
          </div>
        ) : viewMode === 'table' ? (
          <CandidateTable
            candidates={filteredAndSorted}
            onDecision={handleDecision}
            onRowClick={openModal}
            sortKey={sortKey}
            onSort={handleSort}
          />
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          >
            {filteredAndSorted.length === 0 ? (
              <p
                className="col-span-full text-center py-16 text-sm"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                No candidates match the current filters.
              </p>
            ) : (
              filteredAndSorted.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onDecision={handleDecision}
                  onClick={openModal}
                />
              ))
            )}
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

export default Dashboard
