import type { BankrollState, AppSettings } from '@/types'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  bankroll: BankrollState
  settings: AppSettings
}

function StatCell({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub?: string
  color?: 'emerald' | 'red' | 'amber' | 'default'
}) {
  const valueColor = {
    emerald: 'text-[#10b981]',
    red: 'text-[#ef4444]',
    amber: 'text-[#f59e0b]',
    default: 'text-white/90',
  }[color ?? 'default']

  return (
    <div className="flex flex-col gap-1">
      <span className="sf-label">{label}</span>
      <span className={cn('text-lg font-semibold sf-mono', valueColor)}>{value}</span>
      {sub && <span className="text-[0.68rem] text-white/30">{sub}</span>}
    </div>
  )
}

export function BankrollSummary({ bankroll, settings }: Props) {
  const unitSize = (bankroll.current_bankroll * settings.unit_percentage) / 100
  const dailyPct = (bankroll.daily_units_used / settings.max_daily_units) * 100
  const weeklyPct = (bankroll.weekly_units_used / settings.max_weekly_units) * 100
  const pnlColor =
    bankroll.daily_units_won_lost > 0
      ? 'emerald'
      : bankroll.daily_units_won_lost < 0
        ? 'red'
        : 'default'
  const pnlSign = bankroll.daily_units_won_lost > 0 ? '+' : ''

  return (
    <div className="sf-card p-5 space-y-5">
      {bankroll.stop_loss_triggered && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)]">
          <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0" />
          <span className="text-[0.78rem] text-[#f87171] font-medium">
            Daily stop-loss triggered — no new exposure today
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        <StatCell
          label="Current Bankroll"
          value={`$${bankroll.current_bankroll.toLocaleString()}`}
          sub={`Started at $${bankroll.starting_bankroll.toLocaleString()}`}
        />
        <StatCell
          label="Unit Size"
          value={`$${unitSize.toFixed(0)}`}
          sub={`${settings.unit_percentage}% of bankroll`}
        />
        <StatCell
          label="Today's P&L"
          value={`${pnlSign}${bankroll.daily_units_won_lost.toFixed(2)}u`}
          color={pnlColor}
          sub="units won / lost"
        />
        <StatCell
          label="Open Risk"
          value={`${bankroll.open_risk_units.toFixed(1)}u`}
          sub="currently at risk"
          color={bankroll.open_risk_units > 0 ? 'amber' : 'default'}
        />
        <StatCell
          label="Daily Used"
          value={`${bankroll.daily_units_used.toFixed(1)} / ${settings.max_daily_units}`}
          sub={`${dailyPct.toFixed(0)}% of daily limit`}
          color={dailyPct >= 90 ? 'red' : dailyPct >= 60 ? 'amber' : 'default'}
        />
        <StatCell
          label="Weekly Used"
          value={`${bankroll.weekly_units_used.toFixed(1)} / ${settings.max_weekly_units}`}
          sub={`${weeklyPct.toFixed(0)}% of weekly limit`}
          color={weeklyPct >= 80 ? 'amber' : 'default'}
        />
      </div>
    </div>
  )
}
