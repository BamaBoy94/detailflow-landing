import React from 'react'
import { Info, AlertTriangle, XCircle, CheckCircle, X } from 'lucide-react'

interface AlertBannerProps {
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  onDismiss?: () => void
}

const TYPE_CONFIG = {
  info: {
    icon: Info,
    color: '#60a5fa',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#fbbf24',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
  },
  error: {
    icon: XCircle,
    color: '#f87171',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
  },
  success: {
    icon: CheckCircle,
    color: '#34d399',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
  },
} as const

export const AlertBanner: React.FC<AlertBannerProps> = ({ message, type, onDismiss }) => {
  const cfg = TYPE_CONFIG[type]
  const Icon = cfg.icon

  return (
    <div
      className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
      style={{ background: cfg.bg, borderColor: cfg.border }}
      role="alert"
      aria-live="polite"
    >
      <Icon size={16} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
      <span className="flex-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {message}
      </span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 cursor-pointer opacity-50 hover:opacity-90 transition-opacity duration-150 -mt-0.5"
          style={{ color: cfg.color }}
          aria-label="Dismiss alert"
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

export default AlertBanner
