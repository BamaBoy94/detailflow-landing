// ─── Odds conversion utilities ────────────────────────────────────────────────
// All formulas use standard American odds conventions.

/** Convert American odds to implied probability (0–100). */
export function americanToImplied(odds: number): number {
  if (odds < 0) {
    return (Math.abs(odds) / (Math.abs(odds) + 100)) * 100
  }
  return (100 / (odds + 100)) * 100
}

/** Convert American odds to decimal odds. */
export function americanToDecimal(odds: number): number {
  if (odds < 0) {
    return 1 + 100 / Math.abs(odds)
  }
  return 1 + odds / 100
}

/** Convert decimal odds to American odds. */
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return (decimal - 1) * 100
  }
  return -100 / (decimal - 1)
}

/** The break-even probability required to profit at given American odds. */
export function breakEvenProbability(odds: number): number {
  return americanToImplied(odds)
}

/** Format American odds with explicit +/- sign. */
export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`
}

/** Format probability as percentage string. */
export function formatProb(prob: number, decimals = 1): string {
  return `${prob.toFixed(decimals)}%`
}

/** Format EV as percentage with sign. */
export function formatEV(ev: number): string {
  const pct = (ev * 100).toFixed(1)
  return ev >= 0 ? `+${pct}%` : `${pct}%`
}

/** Return the juice category for color coding. */
export function juiceLevel(odds: number): 'ok' | 'caution' | 'danger' {
  if (odds >= -115) return 'ok'
  if (odds >= -125) return 'caution'
  return 'danger'
}

/** Classify a bet score into tier label. */
export function scoreTier(score: number): 'high' | 'medium' | 'low' {
  if (score >= 8) return 'high'
  if (score >= 6) return 'medium'
  return 'low'
}
