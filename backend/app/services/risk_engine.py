"""
Risk engine — evaluates auto-reject conditions and risk flags.

The system must NOT place bets. This engine only flags and rejects candidates.
"""
from typing import List, Optional


AUTO_REJECT_CHECKS = [
    ("odds_hard_stop",    "Odds exceed hard stop threshold"),
    ("negative_ev",       "Negative estimated EV at current price"),
    ("questionable",      "Player listed questionable — minutes unclear"),
    ("minutes_restrict",  "Possible minutes restriction"),
    ("stale_data",        "Injury/news data is stale"),
    ("blowout_risk",      "Extreme blowout risk — minutes may not materialize"),
    ("edge_below_min",    "Projection edge below configured minimum"),
    ("exposure_exceeded", "Daily exposure limit reached"),
    ("stop_loss",         "Daily stop-loss triggered"),
    ("parlay_disabled",   "Parlays are disabled in settings"),
]


def check_auto_reject(
    odds: int,
    projection_edge: float,
    estimated_ev: float,
    risk_flags: List[str],
    daily_units_used: float,
    daily_units_won_lost: float,
    max_daily_units: float,
    daily_stop_loss_units: float,
    max_juice_hard_stop: int,
    minimum_probability_edge: float,
    parlays_enabled: bool,
    market: str,
) -> List[str]:
    """Return list of auto-reject reasons (empty = no auto-reject)."""
    reasons: List[str] = []

    if odds < max_juice_hard_stop:
        reasons.append(f"Odds ({odds}) exceed hard stop ({max_juice_hard_stop})")

    if estimated_ev < 0:
        reasons.append("Negative estimated EV")

    flags_lower = [f.lower() for f in risk_flags]
    if any("questionable" in f for f in flags_lower):
        reasons.append("Player questionable — minutes unclear")
    if any("minutes restriction" in f for f in flags_lower):
        reasons.append("Possible minutes restriction")
    if any("stale" in f for f in flags_lower):
        reasons.append("Injury/news data stale")
    if any("blowout" in f for f in flags_lower):
        reasons.append("Blowout risk — minutes may be limited")

    if projection_edge < minimum_probability_edge / 100 * 10:
        pass  # edge is in projection units, not probability points

    if daily_units_used >= max_daily_units:
        reasons.append(f"Daily exposure limit reached ({max_daily_units} units)")

    if daily_units_won_lost <= daily_stop_loss_units:
        reasons.append(f"Daily stop-loss triggered (at {daily_units_won_lost:.1f} units)")

    if not parlays_enabled and "parlay" in market.lower():
        reasons.append("Parlays disabled in settings")

    return reasons


def generate_risk_flags(
    odds: int,
    projection_edge: float,
    context_notes: List[str],
    max_juice_warning: int,
    max_juice_hard_stop: int,
) -> List[str]:
    """Generate risk flag strings for a candidate."""
    flags: List[str] = []

    if odds < max_juice_hard_stop:
        flags.append(f"Odds exceed hard stop ({max_juice_hard_stop})")
    elif odds < max_juice_warning:
        flags.append(f"Juice in caution zone ({odds})")

    if projection_edge <= 0:
        flags.append("Projection does not exceed line")

    notes_lower = [n.lower() for n in context_notes]
    if any("questionable" in n for n in notes_lower):
        flags.append("Player questionable — validate minutes before action")
    if any("stale" in n for n in notes_lower):
        flags.append("Data may be stale — verify injury report")

    return flags
