import { americanToImplied, americanToDecimal } from './odds'

// ─── EV calculation ───────────────────────────────────────────────────────────
// All results are labeled "estimated" — not guaranteed projections.

export interface EVInputs {
  /** American odds (e.g. -110, +130) */
  odds: number
  /** Estimated true probability of winning, expressed as 0-100 */
  projected_probability: number
  /** Stake in units */
  stake?: number
}

export interface EVResult {
  implied_probability: number   // from odds
  break_even: number            // same as implied_probability
  projected_probability: number // model input
  probability_edge: number      // projected - implied (percentage points)
  decimal_odds: number
  profit_if_win: number         // per unit
  estimated_ev: number          // fractional: positive = +EV
  estimated_ev_pct: number      // as percentage
  expected_profit_units: number // per unit staked
}

/**
 * Calculate expected value given estimated probability and American odds.
 *
 * EV = (p_win × profit) - (p_lose × stake)
 *
 * All probability inputs/outputs are 0–100 range internally;
 * fractional values used in formulas.
 */
export function calculateEV(inputs: EVInputs): EVResult {
  const { odds, projected_probability, stake = 1 } = inputs

  const implied_probability = americanToImplied(odds)
  const decimal_odds = americanToDecimal(odds)
  const profit_if_win = (decimal_odds - 1) * stake
  const loss_if_lose = stake

  const p_win = projected_probability / 100
  const p_lose = 1 - p_win

  const ev = p_win * profit_if_win - p_lose * loss_if_lose
  const ev_pct = ev / stake

  return {
    implied_probability,
    break_even: implied_probability,
    projected_probability,
    probability_edge: projected_probability - implied_probability,
    decimal_odds,
    profit_if_win,
    estimated_ev: ev,
    estimated_ev_pct: ev_pct,
    expected_profit_units: ev / stake,
  }
}

/**
 * Estimate closing line value (CLV).
 * Positive = we got a better line than closing; negative = line moved against us.
 */
export function calculateCLV(
  original_odds: number,
  closing_odds: number,
  bet_type: 'over' | 'under' | 'spread' | 'moneyline' = 'moneyline',
): number {
  const original_impl = americanToImplied(original_odds)
  const closing_impl = americanToImplied(closing_odds)
  // Positive CLV: we paid less juice than closing (line moved in our direction)
  if (bet_type === 'under') {
    return closing_impl - original_impl
  }
  return original_impl - closing_impl
}

/**
 * Derive a simple estimated projected probability from projection edge.
 * This is a heuristic for the mock data layer — real implementation would
 * use a calibrated model.
 *
 * @param base_implied  - implied probability from odds (0-100)
 * @param edge_pct      - estimated probability edge in percentage points
 */
export function estimateProjectedProbability(
  base_implied: number,
  edge_pct: number,
): number {
  return Math.min(Math.max(base_implied + edge_pct, 0), 95)
}
