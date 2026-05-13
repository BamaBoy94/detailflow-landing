import React, { useState, useEffect, useCallback } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { Settings, Shield, AlertTriangle, Save, Info } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { AlertBanner } from '@/components/sharp/AlertBanner'
import { getSettings, saveSettings } from '@/lib/api'
import type { AppSettings, Market } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_MARKETS: Market[] = [
  'Player Points',
  'Player Rebounds',
  'Player Assists',
  'Player PRA',
  'Player Threes',
  'Player Blocks',
  'Player Steals',
  'Game Total',
  'Spread',
  'Moneyline',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string
  hint?: string
  children: React.ReactNode
}

const FieldRow: React.FC<FieldRowProps> = ({ label, hint, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
    <div className="sm:w-64 shrink-0">
      <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {label}
      </label>
      {hint && (
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {hint}
        </p>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </div>
)

interface NumberInputProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  className?: string
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  className = '',
}) => (
  <div className="relative inline-flex items-center">
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      className={[
        'w-32 rounded border px-3 py-2 text-sm font-mono outline-none transition-colors duration-150',
        'focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30',
        className,
      ].join(' ')}
      style={{
        background: '#0a0a0a',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.9)',
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
      }}
    />
    {suffix && (
      <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {suffix}
      </span>
    )}
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

type SaveState = 'idle' | 'saving' | 'success' | 'error'

export const RulesSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // ── Load on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getSettings()
      .then(data => {
        if (!cancelled) {
          setSettings(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
          setSaveState('error')
          setErrorMessage('Failed to load settings. Showing defaults.')
        }
      })
    return () => { cancelled = true }
  }, [])

  // ── Field updater helpers ────────────────────────────────────────────────
  const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev)
    if (saveState === 'success' || saveState === 'error') setSaveState('idle')
  }, [saveState])

  const toggleMarket = useCallback((market: Market) => {
    setSettings(prev => {
      if (!prev) return prev
      const enabled = prev.allowed_markets.includes(market)
      return {
        ...prev,
        allowed_markets: enabled
          ? prev.allowed_markets.filter(m => m !== market)
          : [...prev.allowed_markets, market],
      }
    })
    if (saveState === 'success' || saveState === 'error') setSaveState('idle')
  }, [saveState])

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!settings) return
    setSaveState('saving')
    setErrorMessage('')
    try {
      await saveSettings(settings)
      setSaveState('success')
    } catch (err) {
      setSaveState('error')
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.')
    }
  }

  // ── Dismiss banner ───────────────────────────────────────────────────────
  const dismissBanner = () => {
    setSaveState('idle')
    setErrorMessage('')
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading || !settings) {
    return (
      <Layout pageTitle="Rules & Settings">
        <div className="p-6 space-y-4 max-w-3xl mx-auto">
          {[140, 200, 160, 120].map((h, i) => (
            <div
              key={i}
              className="sf-card animate-pulse"
              style={{ height: h, opacity: 0.4 }}
            />
          ))}
        </div>
      </Layout>
    )
  }

  const parlaysEnabled = settings.parlays_enabled

  return (
    <Layout pageTitle="Rules & Settings">
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-10">

        {/* ── Alert banner ─────────────────────────────────────────────── */}
        {saveState === 'success' && (
          <AlertBanner
            type="success"
            message="Settings saved successfully."
            onDismiss={dismissBanner}
          />
        )}
        {saveState === 'error' && (
          <AlertBanner
            type="error"
            message={errorMessage || 'Failed to save settings. Please try again.'}
            onDismiss={dismissBanner}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SCORING RULES                                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="sf-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <Settings size={16} style={{ color: '#60a5fa' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Scoring Rules
            </h3>
          </div>

          {/* Minimum Score */}
          <FieldRow label="Minimum Score to Recommend">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={settings.minimum_score}
                  onChange={e => update('minimum_score', Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full cursor-pointer accent-blue-500"
                  style={{ accentColor: '#3b82f6' }}
                  aria-label="Minimum score to recommend"
                />
                <span
                  className="w-10 text-center text-sm font-mono font-semibold tabular-nums"
                  style={{ color: '#60a5fa' }}
                >
                  {settings.minimum_score}
                </span>
              </div>
              <div
                className="flex items-start gap-2 rounded border px-3 py-2.5 text-xs leading-relaxed"
                style={{
                  background: 'rgba(59,130,246,0.07)',
                  borderColor: 'rgba(59,130,246,0.18)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                <Info size={13} className="shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                <span>
                  Score <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{settings.minimum_score}+</strong> routes
                  to <strong style={{ color: '#34d399' }}>Approval Queue</strong>.{' '}
                  6–{(settings.minimum_score - 0.1).toFixed(1)} goes to{' '}
                  <strong style={{ color: '#fbbf24' }}>Watchlist</strong>. Below 6{' '}
                  <strong style={{ color: '#f87171' }}>auto-rejects</strong>.
                </span>
              </div>
            </div>
          </FieldRow>

          {/* Minimum Probability Edge */}
          <FieldRow
            label="Minimum Probability Edge"
            hint="Minimum required edge between projected and implied probability to qualify for analysis."
          >
            <NumberInput
              value={settings.minimum_probability_edge}
              onChange={v => update('minimum_probability_edge', v)}
              min={0}
              max={20}
              step={0.5}
              suffix="%"
            />
          </FieldRow>

          {/* Max Odds Juice Warning */}
          <FieldRow
            label="Max Odds Juice Warning"
            hint="Odds beyond this threshold trigger a caution flag. The bet is still eligible but flagged for review."
          >
            <NumberInput
              value={settings.max_juice_warning}
              onChange={v => update('max_juice_warning', v)}
              max={0}
              step={1}
              suffix="American odds"
            />
          </FieldRow>

          {/* Max Odds Hard Stop */}
          <FieldRow label="Max Odds Hard Stop">
            <div className="space-y-2">
              <NumberInput
                value={settings.max_juice_hard_stop}
                onChange={v => update('max_juice_hard_stop', v)}
                max={0}
                step={1}
                suffix="American odds"
                className="border-red-500/30"
              />
              <div
                className="flex items-center gap-2 rounded border px-3 py-2 text-xs"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  borderColor: 'rgba(239,68,68,0.25)',
                  color: '#f87171',
                }}
              >
                <Shield size={12} className="shrink-0" />
                <span>
                  <strong>Safety control:</strong> any candidate with odds worse than this value is
                  automatically rejected, regardless of score.
                </span>
              </div>
            </div>
          </FieldRow>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* BANKROLL RULES                                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="sf-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <Shield size={16} style={{ color: '#34d399' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Bankroll Rules
            </h3>
          </div>

          <FieldRow
            label="Unit Size % of Bankroll"
            hint="Percentage of total bankroll staked per single unit."
          >
            <NumberInput
              value={settings.unit_percentage}
              onChange={v => update('unit_percentage', v)}
              min={0.1}
              max={10}
              step={0.1}
              suffix="% per unit"
            />
          </FieldRow>

          <FieldRow
            label="Max Daily Units"
            hint="Maximum number of units that can be placed across all bets in a single calendar day."
          >
            <NumberInput
              value={settings.max_daily_units}
              onChange={v => update('max_daily_units', v)}
              min={1}
              max={20}
              suffix="units / day"
            />
          </FieldRow>

          <FieldRow
            label="Max Weekly Units"
            hint="Cap on total units placed per rolling 7-day window."
          >
            <NumberInput
              value={settings.max_weekly_units}
              onChange={v => update('max_weekly_units', v)}
              min={1}
              max={50}
              suffix="units / week"
            />
          </FieldRow>

          <FieldRow
            label="Daily Stop Loss"
            hint="Once net units for the day reaches this negative threshold, no further bets are approved."
          >
            <div className="space-y-1.5">
              <NumberInput
                value={settings.daily_stop_loss_units}
                onChange={v => update('daily_stop_loss_units', v)}
                max={0}
                step={1}
                suffix="units"
                className="border-amber-500/30"
              />
              {settings.daily_stop_loss_units < 0 && (
                <p className="text-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
                  Stop loss activates at {settings.daily_stop_loss_units} units net for the day.
                </p>
              )}
            </div>
          </FieldRow>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ALLOWED MARKETS                                                */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="sf-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <Settings size={16} style={{ color: '#a78bfa' }} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Allowed Markets
              </h3>
              <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Toggle which markets the system evaluates for bet candidates.
              </p>
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {settings.allowed_markets.length} / {ALL_MARKETS.length} enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_MARKETS.map(market => {
              const isEnabled = settings.allowed_markets.includes(market)
              return (
                <label
                  key={market}
                  className="flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-all duration-150 select-none"
                  style={{
                    background: isEnabled ? 'rgba(139,92,246,0.07)' : 'transparent',
                    borderColor: isEnabled ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    if (!isEnabled) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                  }}
                  onMouseLeave={e => {
                    if (!isEnabled) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => toggleMarket(market)}
                    className="rounded cursor-pointer"
                    style={{ accentColor: '#8b5cf6', width: 15, height: 15 }}
                    aria-label={`Enable ${market} market`}
                  />
                  <span
                    className="text-sm"
                    style={{ color: isEnabled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)' }}
                  >
                    {market}
                  </span>
                </label>
              )
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PARLAY SETTINGS                                                */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section
          className="sf-card p-6 space-y-4"
          style={{ borderColor: 'rgba(245,158,11,0.3)' }}
        >
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
            <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#fbbf24' }}>
              Parlay Settings
            </h3>
          </div>

          {/* Strong warning box */}
          <div
            className="rounded-md border px-4 py-3 space-y-1"
            style={{
              background: 'rgba(245,158,11,0.08)',
              borderColor: 'rgba(245,158,11,0.3)',
            }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: '#f59e0b' }} className="shrink-0" />
              <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#fbbf24' }}>
                Parlays Disabled by Default
              </span>
            </div>
            <p className="text-xs leading-relaxed pl-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Sharp Filter does <strong style={{ color: 'rgba(255,255,255,0.75)' }}>not</strong> recommend parlays.
              Parlays dramatically increase house edge and destroy long-term expected value.
              Enabling this feature does not mean you should use it.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Enable Parlay Analysis{' '}
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  (not recommended)
                </span>
              </p>
            </div>
            <Switch.Root
              checked={parlaysEnabled}
              onCheckedChange={v => update('parlays_enabled', v)}
              className="relative inline-flex items-center cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{
                width: 44,
                height: 24,
                background: parlaysEnabled ? '#f59e0b' : 'rgba(255,255,255,0.12)',
                flexShrink: 0,
              }}
              aria-label="Enable parlay analysis"
            >
              <Switch.Thumb
                className="block rounded-full transition-transform duration-200 will-change-transform"
                style={{
                  width: 18,
                  height: 18,
                  background: '#ffffff',
                  transform: parlaysEnabled ? 'translateX(22px)' : 'translateX(3px)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }}
              />
            </Switch.Root>
          </div>

          {/* Conditional red warning when parlays enabled */}
          {parlaysEnabled && (
            <div
              className="rounded-md border px-4 py-3"
              style={{
                background: 'rgba(239,68,68,0.08)',
                borderColor: 'rgba(239,68,68,0.3)',
              }}
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} style={{ color: '#f87171' }} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: '#f87171' }}>
                  <strong>You have enabled parlay analysis.</strong> This is against best practices
                  for disciplined bankroll management. Parlay bets compound variance and erode edge
                  over time.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── Save button ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 pt-1">
          {saveState === 'saving' && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Saving…
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="inline-flex items-center gap-2 rounded border px-5 py-2.5 text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: saveState === 'saving' ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.12)',
              borderColor: 'rgba(59,130,246,0.35)',
              color: '#60a5fa',
            }}
            onMouseEnter={e => {
              if (saveState !== 'saving') {
                e.currentTarget.style.background = 'rgba(59,130,246,0.2)'
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(59,130,246,0.12)'
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'
            }}
            aria-label="Save settings"
          >
            <Save size={15} strokeWidth={2} />
            {saveState === 'saving' ? 'Saving…' : 'Save Settings'}
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default RulesSettings
