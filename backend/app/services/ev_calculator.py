"""
EV (Expected Value) calculation utilities.

All outputs are labeled "estimated" — not guaranteed projections.
Use for analysis only.
"""
from dataclasses import dataclass
from typing import Optional


def american_to_implied(odds: int) -> float:
    """Convert American odds to implied probability (0–100)."""
    if odds < 0:
        return abs(odds) / (abs(odds) + 100) * 100
    return 100 / (odds + 100) * 100


def american_to_decimal(odds: int) -> float:
    """Convert American odds to decimal odds."""
    if odds < 0:
        return 1 + 100 / abs(odds)
    return 1 + odds / 100


def decimal_to_american(decimal: float) -> int:
    """Convert decimal odds to American odds."""
    if decimal >= 2:
        return int((decimal - 1) * 100)
    return int(-100 / (decimal - 1))


def break_even_probability(odds: int) -> float:
    """Minimum win rate needed to profit at these odds."""
    return american_to_implied(odds)


@dataclass
class EVResult:
    implied_probability: float
    projected_probability: float
    probability_edge: float
    decimal_odds: float
    profit_if_win: float
    estimated_ev: float
    estimated_ev_pct: float


def calculate_ev(odds: int, projected_probability: float, stake: float = 1.0) -> EVResult:
    """
    Calculate expected value from odds and estimated probability.

    EV = (p_win × profit_if_win) - (p_lose × stake)

    Args:
        odds: American odds (e.g. -110, +130)
        projected_probability: Model probability estimate (0-100)
        stake: Bet size in units (default 1.0)

    Returns:
        EVResult with all calculation components
    """
    implied = american_to_implied(odds)
    decimal = american_to_decimal(odds)
    profit = (decimal - 1) * stake
    p_win = projected_probability / 100
    p_lose = 1 - p_win
    ev = p_win * profit - p_lose * stake

    return EVResult(
        implied_probability=implied,
        projected_probability=projected_probability,
        probability_edge=projected_probability - implied,
        decimal_odds=decimal,
        profit_if_win=profit,
        estimated_ev=ev,
        estimated_ev_pct=ev / stake if stake else 0,
    )


def calculate_clv(original_odds: int, closing_odds: int, is_under: bool = False) -> float:
    """
    Closing line value in probability points.
    Positive = we got a better price than closing.
    """
    orig_impl = american_to_implied(original_odds)
    close_impl = american_to_implied(closing_odds)
    if is_under:
        return close_impl - orig_impl
    return orig_impl - close_impl


def estimate_projected_probability(base_implied: float, edge_pct: float) -> float:
    """Heuristic: add edge to implied probability, capped at 95%."""
    return min(max(base_implied + edge_pct, 0), 95)
