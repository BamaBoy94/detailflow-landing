// ─── Enums & union types ──────────────────────────────────────────────────────

export type Sport = 'Basketball' | 'Football' | 'Baseball' | 'Hockey' | 'Soccer' | 'Tennis'
export type League = 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS' | 'ATP' | 'WTA'
export type BetType = 'Over' | 'Under' | 'Spread' | 'Moneyline' | 'Total'
export type Market =
  | 'Player Points'
  | 'Player Rebounds'
  | 'Player Assists'
  | 'Player PRA'
  | 'Player Threes'
  | 'Player Blocks'
  | 'Player Steals'
  | 'Player Turnovers'
  | 'Player Minutes'
  | 'Game Total'
  | 'Spread'
  | 'Moneyline'

export type CandidateStatus = 'candidate' | 'approved' | 'rejected' | 'watchlist' | 'expired'
export type ConfidenceTier = 'High' | 'Medium' | 'Low'
export type RecommendedAction = 'Manual Review' | 'Watch' | 'Reject'
export type RuleResult = 'pass' | 'fail' | 'warn' | 'n/a'
export type DecisionType = 'approve' | 'reject' | 'watch'
export type BetResult = 'win' | 'loss' | 'push' | 'pending'

// ─── Core domain types ───────────────────────────────────────────────────────

export interface MarketBookLine {
  sportsbook: string
  line: number
  odds: number
}

export interface RuleChecklist {
  projection_edge: RuleResult
  odds_value: RuleResult
  context: RuleResult
  market_confirmation: RuleResult
  bankroll: RuleResult
}

export interface BetCandidate {
  id: string
  sport: Sport
  league: League
  game: string
  game_start_time: string
  market: Market
  player_or_team: string
  bet_type: BetType
  line: number
  odds: number
  sportsbook: string
  projection: number
  projection_edge: number
  implied_probability: number   // derived from odds, expressed as 0-100
  projected_probability: number // model estimate, 0-100
  estimated_ev: number          // fractional; e.g. 0.072 = 7.2% EV
  system_score: number          // 0-10
  confidence_tier: ConfidenceTier
  recommended_action: RecommendedAction
  max_units: number
  context_notes: string[]
  risk_flags: string[]
  market_comparison: MarketBookLine[]
  rule_checklist: RuleChecklist
  status: CandidateStatus
  created_at: string
  updated_at: string
}

export interface BetDecision {
  id: string
  candidate_id: string
  decision: DecisionType
  decision_reason?: string
  approved_units: number
  timestamp: string
  original_line: number
  original_odds: number
  closing_line?: number
  closing_odds?: number
  result: BetResult
  profit_loss_units?: number
  notes?: string
  candidate?: BetCandidate
}

export interface LineMovement {
  id: string
  candidate_id: string
  sportsbook: string
  line: number
  odds: number
  timestamp: string
}

export interface WatchlistEntry {
  candidate: BetCandidate
  watch_reason: string
  line_movements: LineMovement[]
  status_note: string
}

// ─── Settings & bankroll ─────────────────────────────────────────────────────

export interface AppSettings {
  id?: string
  bankroll: number
  unit_percentage: number           // e.g. 1 = 1% of bankroll per unit
  max_daily_units: number           // default 3
  max_weekly_units: number          // default 10
  daily_stop_loss_units: number     // default -3
  minimum_score: number             // default 8
  minimum_probability_edge: number  // default 3 (%)
  max_juice_warning: number         // default -120
  max_juice_hard_stop: number       // default -130
  parlays_enabled: boolean          // must default false
  allowed_markets: Market[]
  banned_markets: Market[]
  alert_phone?: string
}

export interface BankrollState {
  starting_bankroll: number
  current_bankroll: number
  unit_size: number
  daily_units_used: number
  weekly_units_used: number
  daily_units_won_lost: number
  open_risk_units: number
  stop_loss_triggered: boolean
  daily_exposure_limit_reached: boolean
}

// ─── Performance analytics ────────────────────────────────────────────────────

export interface PerformanceSummary {
  total_approved: number
  total_wins: number
  total_losses: number
  total_pushes: number
  total_pending: number
  units_won: number
  units_lost: number
  net_units: number
  roi: number                  // percentage
  clv_hit_rate: number         // % of bets where closing line was better
  win_rate: number             // %
  avg_edge: number             // average estimated EV %
  avg_closing_line_movement: number
  bets_by_sport: Record<string, SportBreakdown>
  bets_by_market: Record<string, MarketBreakdown>
  bets_by_sportsbook: Record<string, SportsbookBreakdown>
  rejection_reasons: RejectionReason[]
  bad_bets: BetDecision[]
  timeline: PerformancePoint[]
}

export interface SportBreakdown {
  count: number
  wins: number
  net_units: number
  avg_edge: number
}

export interface MarketBreakdown {
  count: number
  wins: number
  net_units: number
}

export interface SportsbookBreakdown {
  count: number
  net_units: number
}

export interface RejectionReason {
  reason: string
  count: number
}

export interface PerformancePoint {
  date: string
  cumulative_units: number
  bets: number
}

// ─── Alert ───────────────────────────────────────────────────────────────────

export interface Alert {
  id: string
  candidate_id: string
  alert_type: 'new_candidate' | 'line_movement' | 'injury_update' | 'score_change'
  message: string
  sent_to?: string
  status: 'pending' | 'sent' | 'failed' | 'disabled'
  created_at: string
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

// ─── Filter / sort state ──────────────────────────────────────────────────────

export interface CandidateFilters {
  sport?: Sport | ''
  league?: League | ''
  market?: Market | ''
  sportsbook?: string
  min_score?: number
  max_score?: number
  status?: CandidateStatus | ''
  confidence_tier?: ConfidenceTier | ''
}

export type SortKey =
  | 'system_score'
  | 'estimated_ev'
  | 'projection_edge'
  | 'odds'
  | 'created_at'

export interface SortConfig {
  key: SortKey
  direction: 'asc' | 'desc'
}
