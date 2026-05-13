import React, { useEffect, useState, useCallback } from 'react'
import { DollarSign, Shield, AlertTriangle, Save, ExternalLink, RefreshCw } from 'lucide-react'
import type { BankrollState, AppSettings } from '@/types'
import { getBankroll, saveBankroll, getSettings } from '@/lib/api'
import { Layout } from '@/components/Layout'
import { BankrollSummary } from '@/components/sharp/BankrollSummary'
import { ExposureMeter } from '@/components/sharp/ExposureMeter'
import { AlertBanner } from '@/components/sharp/AlertBanner'

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; sub?: string }> = ({
  icon,
  title,
  sub,
}) => (
  <div
    className="flex items-start gap-2.5 pb-3"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <h3
        className="text-sm font-semibold"
        style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)' }}
      >
        {title}
      </h3>
      {sub && (
        <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {sub}
        </p>
      )}
    </div>
  </div>
)

// ─── Read-only info row ───────────────────────────────────────────────────────

interface InfoRowProps {
  label: string
  value: React.ReactNode
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div
    className="flex items-center justify-between gap-4 py-2.5"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
  >
    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-sans)' }}>
      {label}
    </span>
    <span className="text-xs font-medium sf-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
      {value}
    </span>
  </div>
)

// ─── Styled number input ──────────────────────────────────────────────────────

interface MoneyInputProps {
  id: string
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  hint?: string
  disabled?: boolean
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  id,
  label,
  value,
  onChange,
  prefix = '$',
  hint,
  disabled = false,
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="block text-xs font-medium"
      style={{ color: 'rgba(255,255,255,0.65)' }}
    >
      {label}
    </label>
    <div className="relative inline-flex items-center w-full max-w-[200px]">
      {prefix && (
        <span
          className="absolute left-3 text-sm sf-mono pointer-events-none select-none"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          aria-hidden="true"
        >
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        value={value}
        min={0}
        step={100}
        onChange={e => onChange(Math.max(0, Number(e.target.value)))}
        disabled={disabled}
        className="w-full rounded border py-2 text-sm sf-mono outline-none transition-colors duration-150 focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          paddingLeft: prefix ? '2rem' : '0.75rem',
          paddingRight: '0.75rem',
          background: '#0a0a0a',
          borderColor: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.9)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </div>
    {hint && (
      <p id={`${id}-hint`} className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {hint}
      </p>
    )}
  </div>
)

// ─── Alert state ─────────────────────────────────────────────────────────────

type SaveState = 'idle' | 'saving' | 'success' | 'error'

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Bankroll: React.FC = () => {
  const [bankroll, setBankroll] = useState<BankrollState | null>(null)
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Form-local state mirrors bankroll values so edits don't immediately mutate displayed data
  const [formStarting, setFormStarting] = useState(0)
  const [formCurrent, setFormCurrent] = useState(0)

  // ── Load on mount ─────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [br, cfg] = await Promise.all([getBankroll(), getSettings()])
      setBankroll(br)
      setSettings(cfg)
      setFormStarting(br.starting_bankroll)
      setFormCurrent(br.current_bankroll)
    } catch (err) {
      setErrorMessage('Failed to load bankroll data.')
      setSaveState('error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ── Save bankroll ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!bankroll || !settings) return
    setSaveState('saving')
    setErrorMessage('')
    try {
      const unitSize = (formCurrent * settings.unit_percentage) / 100
      const updated: BankrollState = {
        ...bankroll,
        starting_bankroll: formStarting,
        current_bankroll: formCurrent,
        unit_size: unitSize,
      }
      const saved = await saveBankroll(updated)
      setBankroll(saved)
      setSaveState('success')
    } catch (err) {
      setSaveState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save bankroll.')
    }
  }

  const dismissBanner = () => {
    setSaveState('idle')
    setErrorMessage('')
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading || !bankroll || !settings) {
    return (
      <Layout pageTitle="Bankroll">
        <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
          {[160, 100, 200, 160].map((h, i) => (
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

  // ── Derived values ────────────────────────────────────────────────────────

  const unitSize = (formCurrent * settings.unit_percentage) / 100
  const stopLossTriggered = bankroll.stop_loss_triggered

  return (
    <Layout pageTitle="Bankroll" isMockMode={!import.meta.env.VITE_API_URL} onRefresh={loadData}>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-10">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <DollarSign size={16} style={{ color: '#10b981' }} />
            <h2
              className="text-base font-semibold"
              style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sans)' }}
            >
              Bankroll Management
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Track exposure, adjust bankroll size, and monitor safety controls
          </p>
        </div>

        {/* ── Alert banners ─────────────────────────────────────────────────── */}
        {saveState === 'success' && (
          <AlertBanner
            type="success"
            message="Bankroll updated successfully."
            onDismiss={dismissBanner}
          />
        )}
        {saveState === 'error' && (
          <AlertBanner
            type="error"
            message={errorMessage || 'Failed to save. Please try again.'}
            onDismiss={dismissBanner}
          />
        )}

        {/* ── Bankroll summary ──────────────────────────────────────────────── */}
        <BankrollSummary bankroll={bankroll} settings={settings} />

        {/* ── Exposure meters ───────────────────────────────────────────────── */}
        <div className="sf-card p-5 space-y-5">
          <SectionHeader
            icon={<RefreshCw size={15} style={{ color: '#f59e0b' }} />}
            title="Current Exposure"
            sub="Real-time unit usage against configured limits"
          />
          <ExposureMeter
            used={bankroll.daily_units_used}
            max={settings.max_daily_units}
            label="Daily Exposure"
            stopLoss={settings.daily_stop_loss_units}
          />
          <ExposureMeter
            used={bankroll.weekly_units_used}
            max={settings.max_weekly_units}
            label="Weekly Exposure"
          />
        </div>

        {/* ── Bankroll settings form ────────────────────────────────────────── */}
        <div className="sf-card p-5 space-y-5">
          <SectionHeader
            icon={<DollarSign size={15} style={{ color: '#10b981' }} />}
            title="Update Bankroll"
            sub="Adjust your starting and current bankroll figures"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <MoneyInput
              id="starting-bankroll"
              label="Starting Bankroll"
              value={formStarting}
              onChange={setFormStarting}
              hint="The bankroll amount at the start of your tracking period"
            />
            <MoneyInput
              id="current-bankroll"
              label="Current Bankroll"
              value={formCurrent}
              onChange={setFormCurrent}
              hint="Your bankroll after all wins, losses, and withdrawals"
            />
          </div>

          {/* Calculated unit size display */}
          <div
            className="flex items-center justify-between rounded-md border px-4 py-3"
            style={{
              background: 'rgba(16,185,129,0.06)',
              borderColor: 'rgba(16,185,129,0.2)',
            }}
          >
            <div>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Unit Size
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Calculated as {settings.unit_percentage}% of current bankroll
              </p>
            </div>
            <span
              className="text-lg font-bold sf-mono tabular-nums"
              style={{ color: '#10b981' }}
            >
              ${unitSize.toFixed(0)}
            </span>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-end gap-3 pt-1">
            {saveState === 'saving' && (
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Saving…
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="inline-flex items-center gap-2 rounded border px-5 py-2.5 text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-500"
              style={{
                background: 'rgba(16,185,129,0.10)',
                borderColor: 'rgba(16,185,129,0.35)',
                color: '#10b981',
              }}
              onMouseEnter={e => {
                if (saveState !== 'saving') {
                  e.currentTarget.style.background = 'rgba(16,185,129,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.55)'
                  e.currentTarget.style.color = '#34d399'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(16,185,129,0.10)'
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'
                e.currentTarget.style.color = '#10b981'
              }}
              aria-label="Update bankroll"
            >
              <Save size={14} strokeWidth={2} />
              {saveState === 'saving' ? 'Saving…' : 'Update Bankroll'}
            </button>
          </div>
        </div>

        {/* ── Risk controls display (read-only) ────────────────────────────── */}
        <div className="sf-card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <SectionHeader
              icon={<Shield size={15} style={{ color: '#60a5fa' }} />}
              title="Risk Controls"
              sub="Configured in Settings — read-only view"
            />
            <a
              href="/settings"
              className="inline-flex items-center gap-1.5 text-xs transition-colors duration-150 shrink-0"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
              aria-label="Go to Settings to edit risk controls"
            >
              Edit in Settings
              <ExternalLink size={11} />
            </a>
          </div>

          <div
            className="rounded-lg px-4"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <InfoRow label="Max daily units" value={`${settings.max_daily_units}u`} />
            <InfoRow label="Max weekly units" value={`${settings.max_weekly_units}u`} />
            <InfoRow
              label="Daily stop loss"
              value={`${settings.daily_stop_loss_units}u`}
            />
            <InfoRow
              label="Stop loss status"
              value={
                stopLossTriggered ? (
                  <span
                    className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: 'rgba(239,68,68,0.12)',
                      borderColor: 'rgba(239,68,68,0.35)',
                      color: '#f87171',
                    }}
                  >
                    <AlertTriangle size={10} strokeWidth={2.5} />
                    Active — betting halted
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: 'rgba(16,185,129,0.10)',
                      borderColor: 'rgba(16,185,129,0.25)',
                      color: '#10b981',
                    }}
                  >
                    Not triggered
                  </span>
                )
              }
            />
          </div>
        </div>

        {/* ── Responsibility notice ─────────────────────────────────────────── */}
        <div
          className="rounded-lg border px-5 py-4"
          style={{
            background: 'rgba(245,158,11,0.06)',
            borderColor: 'rgba(245,158,11,0.2)',
          }}
          role="note"
          aria-label="Responsible gambling notice"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={15}
              style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }}
            />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Stop-loss and exposure limits are mandatory safety controls.{' '}
              <strong style={{ color: 'rgba(255,255,255,0.75)' }}>
                Do not disable or override them to chase losses.
              </strong>{' '}
              If stop-loss is triggered, stop for the day. Chasing losses is the primary cause of
              bankroll destruction in sports betting.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Bankroll
