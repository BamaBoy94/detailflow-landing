/**
 * API service layer.
 * In local/dev mode (no VITE_API_URL), all calls return mock data.
 * Set VITE_API_URL=http://localhost:8000 to connect to the FastAPI backend.
 */

import type {
  BetCandidate,
  BetDecision,
  AppSettings,
  BankrollState,
  PerformanceSummary,
  CandidateFilters,
  DecisionType,
  WatchlistEntry,
} from '../types'
import {
  MOCK_CANDIDATES,
  MOCK_DECISIONS,
  DEFAULT_SETTINGS,
  DEFAULT_BANKROLL,
  MOCK_PERFORMANCE,
} from '../services/mockData'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const USE_MOCK = !BASE_URL

// ─── Utility ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── Candidates ───────────────────────────────────────────────────────────────

export async function getCandidates(filters?: CandidateFilters): Promise<BetCandidate[]> {
  if (USE_MOCK) {
    let data = [...MOCK_CANDIDATES]
    if (filters?.sport) data = data.filter(c => c.sport === filters.sport)
    if (filters?.league) data = data.filter(c => c.league === filters.league)
    if (filters?.market) data = data.filter(c => c.market === filters.market)
    if (filters?.sportsbook) data = data.filter(c => c.sportsbook === filters.sportsbook)
    if (filters?.status) data = data.filter(c => c.status === filters.status)
    if (filters?.min_score != null) data = data.filter(c => c.system_score >= filters.min_score!)
    return data
  }
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => { if (v != null && v !== '') params.set(k, String(v)) })
  }
  return apiFetch<BetCandidate[]>(`/api/candidates?${params}`)
}

export async function getCandidate(id: string): Promise<BetCandidate> {
  if (USE_MOCK) {
    const c = MOCK_CANDIDATES.find(c => c.id === id)
    if (!c) throw new Error(`Candidate ${id} not found`)
    return c
  }
  return apiFetch<BetCandidate>(`/api/candidates/${id}`)
}

export async function submitDecision(
  candidateId: string,
  decision: DecisionType,
  payload?: { reason?: string; units?: number; notes?: string },
): Promise<BetDecision> {
  if (USE_MOCK) {
    const candidate = MOCK_CANDIDATES.find(c => c.id === candidateId)
    const newDecision: BetDecision = {
      id: `dec-${Date.now()}`,
      candidate_id: candidateId,
      decision,
      decision_reason: payload?.reason,
      approved_units: payload?.units ?? 1,
      timestamp: new Date().toISOString(),
      original_line: candidate?.line ?? 0,
      original_odds: candidate?.odds ?? -110,
      result: 'pending',
      notes: payload?.notes,
    }
    // Update in-memory status
    const idx = MOCK_CANDIDATES.findIndex(c => c.id === candidateId)
    if (idx !== -1) {
      const statusMap: Record<DecisionType, BetCandidate['status']> = {
        approve: 'approved',
        reject: 'rejected',
        watch: 'watchlist',
      }
      MOCK_CANDIDATES[idx] = { ...MOCK_CANDIDATES[idx], status: statusMap[decision] }
    }
    return newDecision
  }
  return apiFetch<BetDecision>(`/api/candidates/${candidateId}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision, ...payload }),
  })
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  if (USE_MOCK) {
    return MOCK_CANDIDATES
      .filter(c => c.status === 'watchlist')
      .map(c => ({
        candidate: c,
        watch_reason: c.risk_flags[0] ?? 'Monitoring for better line',
        line_movements: [],
        status_note: c.risk_flags.length > 0 ? c.risk_flags[0] : 'Awaiting injury update',
      }))
  }
  return apiFetch<WatchlistEntry[]>('/api/watchlist')
}

// ─── Performance ──────────────────────────────────────────────────────────────

export async function getPerformance(): Promise<PerformanceSummary> {
  if (USE_MOCK) return MOCK_PERFORMANCE
  return apiFetch<PerformanceSummary>('/api/performance')
}

export async function getDecisions(): Promise<BetDecision[]> {
  if (USE_MOCK) return MOCK_DECISIONS
  return apiFetch<BetDecision[]>('/api/decisions')
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
  if (USE_MOCK) {
    const stored = localStorage.getItem('sf_settings')
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
  }
  return apiFetch<AppSettings>('/api/settings')
}

export async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  if (USE_MOCK) {
    localStorage.setItem('sf_settings', JSON.stringify(settings))
    return settings
  }
  return apiFetch<AppSettings>('/api/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  })
}

// ─── Bankroll ─────────────────────────────────────────────────────────────────

export async function getBankroll(): Promise<BankrollState> {
  if (USE_MOCK) {
    const stored = localStorage.getItem('sf_bankroll')
    return stored ? JSON.parse(stored) : DEFAULT_BANKROLL
  }
  return apiFetch<BankrollState>('/api/bankroll')
}

export async function saveBankroll(state: BankrollState): Promise<BankrollState> {
  if (USE_MOCK) {
    localStorage.setItem('sf_bankroll', JSON.stringify(state))
    return state
  }
  return apiFetch<BankrollState>('/api/bankroll', {
    method: 'POST',
    body: JSON.stringify(state),
  })
}

// ─── Refresh / alerts ─────────────────────────────────────────────────────────

export async function refreshData(): Promise<{ message: string }> {
  if (USE_MOCK) return { message: 'Mock data refreshed (no live API connected)' }
  return apiFetch<{ message: string }>('/api/refresh-data', { method: 'POST' })
}

export async function sendAlert(candidateId: string): Promise<{ status: string }> {
  if (USE_MOCK) return { status: 'Alert stub — no Twilio credentials configured' }
  return apiFetch<{ status: string }>('/api/send-alert', {
    method: 'POST',
    body: JSON.stringify({ candidate_id: candidateId }),
  })
}

export async function healthCheck(): Promise<{ status: string }> {
  if (USE_MOCK) return { status: 'mock_mode' }
  return apiFetch<{ status: string }>('/api/health')
}
