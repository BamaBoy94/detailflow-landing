import type { BetCandidate, RuleChecklist, AppSettings } from '../types'

// ─── Scoring engine ───────────────────────────────────────────────────────────
// Produces a 0–10 score used to route candidates to approval queue or watchlist.
//
// Score breakdown (max 10):
//   Projection edge   0–3
//   Odds value        0–2
//   Context           0–2
//   Market confirm    0–2
//   Timing            0–1

export interface ScoreBreakdown {
  projection_edge_score: number   // 0-3
  odds_value_score: number        // 0-2
  context_score: number           // 0-2
  market_confirm_score: number    // 0-2
  timing_score: number            // 0-1
  total: number                   // 0-10
}

/** Minimal projection edge requirements by market type. */
const MIN_EDGE_BY_MARKET: Record<string, number> = {
  'Player Points':   2.0,
  'Player Rebounds': 1.5,
  'Player Assists':  1.5,
  'Player PRA':      3.0,
  'Player Threes':   0.5,
  'Player Blocks':   0.5,
  'Player Steals':   0.5,
  'Game Total':      2.0,
  'Spread':          2.0,
  'Moneyline':       5.0,
}

export function calculateScore(candidate: Partial<BetCandidate>): ScoreBreakdown {
  const market = candidate.market ?? 'Player Points'
  const min_edge = MIN_EDGE_BY_MARKET[market] ?? 2.0
  const proj_edge = candidate.projection_edge ?? 0
  const odds = candidate.odds ?? -110
  const context_notes = candidate.context_notes ?? []
  const market_comparison = candidate.market_comparison ?? []
  const game_start_time = candidate.game_start_time ?? new Date().toISOString()

  // 1. Projection edge (0–3)
  let projection_edge_score = 0
  if (proj_edge >= min_edge * 2) projection_edge_score = 3
  else if (proj_edge >= min_edge * 1.5) projection_edge_score = 2.5
  else if (proj_edge >= min_edge * 1.2) projection_edge_score = 2
  else if (proj_edge >= min_edge) projection_edge_score = 1.5
  else if (proj_edge >= min_edge * 0.5) projection_edge_score = 0.5

  // 2. Odds value (0–2)
  let odds_value_score = 0
  if (odds >= -110) odds_value_score = 2
  else if (odds >= -115) odds_value_score = 1.5
  else if (odds >= -120) odds_value_score = 1
  else if (odds >= -125) odds_value_score = 0.5
  // -130 or worse = 0

  // 3. Context (0–2): each supporting factor adds weight
  const context_score = Math.min(2, context_notes.length * 0.67)

  // 4. Market confirmation (0–2): compare to other books
  let market_confirm_score = 0
  if (market_comparison.length >= 1) {
    const user_odds = odds
    const better_lines = market_comparison.filter(b => b.odds < user_odds) // user has better (less negative)
    if (better_lines.length >= 2) market_confirm_score = 2
    else if (better_lines.length === 1) market_confirm_score = 1
    else market_confirm_score = 0.5
  }

  // 5. Timing (0–1): hours until game start
  let timing_score = 0
  const hours_until = (new Date(game_start_time).getTime() - Date.now()) / 3600000
  if (hours_until > 2 && hours_until < 12) timing_score = 1
  else if (hours_until >= 12 && hours_until <= 24) timing_score = 0.5

  const total = Math.min(
    10,
    projection_edge_score + odds_value_score + context_score + market_confirm_score + timing_score,
  )

  return {
    projection_edge_score,
    odds_value_score,
    context_score: parseFloat(context_score.toFixed(2)),
    market_confirm_score,
    timing_score,
    total: parseFloat(total.toFixed(1)),
  }
}

/** Run all auto-reject checks. Returns array of rejection reasons (empty = no auto-reject). */
export function checkAutoReject(
  candidate: Partial<BetCandidate>,
  settings: Partial<AppSettings>,
): string[] {
  const reasons: string[] = []
  const odds = candidate.odds ?? -110
  const proj_edge = candidate.projection_edge ?? 0
  const risk_flags = candidate.risk_flags ?? []
  const hard_stop = settings.max_juice_hard_stop ?? -130

  if (odds < hard_stop) reasons.push(`Odds worse than hard stop (${hard_stop})`)
  if (proj_edge < 0) reasons.push('Projection edge is negative')
  if (risk_flags.some(f => f.toLowerCase().includes('questionable'))) {
    reasons.push('Player questionable — minutes unclear')
  }
  if (risk_flags.some(f => f.toLowerCase().includes('minutes restriction'))) {
    reasons.push('Possible minutes restriction')
  }
  if (risk_flags.some(f => f.toLowerCase().includes('stale'))) {
    reasons.push('Injury/news data stale')
  }
  if (settings.parlays_enabled === false && (candidate.market ?? '').includes('Parlay')) {
    reasons.push('Parlays disabled in settings')
  }

  return reasons
}

/** Evaluate a candidate's rule checklist. */
export function evaluateRuleChecklist(
  candidate: Partial<BetCandidate>,
  settings: Partial<AppSettings>,
): RuleChecklist {
  const market = candidate.market ?? 'Player Points'
  const min_edge = MIN_EDGE_BY_MARKET[market] ?? 2.0
  const proj_edge = candidate.projection_edge ?? 0
  const odds = candidate.odds ?? -110
  const context_notes = candidate.context_notes ?? []
  const market_comparison = candidate.market_comparison ?? []
  const hard_stop = settings.max_juice_hard_stop ?? -130

  return {
    projection_edge: proj_edge >= min_edge ? 'pass' : proj_edge >= 0 ? 'warn' : 'fail',
    odds_value: odds >= hard_stop ? (odds >= -120 ? 'pass' : 'warn') : 'fail',
    context: context_notes.length >= 2 ? 'pass' : context_notes.length === 1 ? 'warn' : 'fail',
    market_confirmation: market_comparison.length >= 1 ? 'pass' : 'warn',
    bankroll: 'pass', // determined at runtime by bankroll engine
  }
}
