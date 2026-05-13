"""
Scoring engine — produces a 0–10 score for each bet candidate.

Score breakdown:
  Projection edge:    0–3
  Odds value:         0–2
  Context:            0–2
  Market confirmation: 0–2
  Timing:             0–1

Rules configurable in AppSettings.
"""
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime, timezone


MIN_EDGE_BY_MARKET = {
    "Player Points":   2.0,
    "Player Rebounds": 1.5,
    "Player Assists":  1.5,
    "Player PRA":      3.0,
    "Player Threes":   0.5,
    "Player Blocks":   0.5,
    "Player Steals":   0.5,
    "Game Total":      2.0,
    "Spread":          2.0,
    "Moneyline":       5.0,
}


@dataclass
class ScoreBreakdown:
    projection_edge_score: float
    odds_value_score: float
    context_score: float
    market_confirm_score: float
    timing_score: float
    total: float


@dataclass
class MarketLine:
    sportsbook: str
    odds: int
    line: float


def score_candidate(
    market: str,
    projection_edge: float,
    odds: int,
    context_notes: List[str],
    market_comparison: List[MarketLine],
    game_start_time: Optional[datetime] = None,
) -> ScoreBreakdown:
    """Compute score breakdown for a candidate."""
    min_edge = MIN_EDGE_BY_MARKET.get(market, 2.0)

    # 1. Projection edge (0–3)
    edge_ratio = projection_edge / min_edge if min_edge > 0 else 0
    if edge_ratio >= 2.0:
        proj_score = 3.0
    elif edge_ratio >= 1.5:
        proj_score = 2.5
    elif edge_ratio >= 1.2:
        proj_score = 2.0
    elif edge_ratio >= 1.0:
        proj_score = 1.5
    elif edge_ratio >= 0.5:
        proj_score = 0.5
    else:
        proj_score = 0.0

    # 2. Odds value (0–2)
    if odds >= -110:
        odds_score = 2.0
    elif odds >= -115:
        odds_score = 1.5
    elif odds >= -120:
        odds_score = 1.0
    elif odds >= -125:
        odds_score = 0.5
    else:
        odds_score = 0.0

    # 3. Context (0–2)
    context_score = min(2.0, len(context_notes) * 0.67)

    # 4. Market confirmation (0–2)
    better_lines = [b for b in market_comparison if b.odds > odds]
    if len(better_lines) >= 2:
        mkt_score = 2.0
    elif len(better_lines) == 1:
        mkt_score = 1.0
    elif market_comparison:
        mkt_score = 0.5
    else:
        mkt_score = 0.0

    # 5. Timing (0–1)
    timing_score = 0.0
    if game_start_time:
        now = datetime.now(timezone.utc)
        if game_start_time.tzinfo is None:
            game_start_time = game_start_time.replace(tzinfo=timezone.utc)
        hours_until = (game_start_time - now).total_seconds() / 3600
        if 2 < hours_until < 12:
            timing_score = 1.0
        elif 12 <= hours_until <= 24:
            timing_score = 0.5

    total = min(10.0, proj_score + odds_score + context_score + mkt_score + timing_score)

    return ScoreBreakdown(
        projection_edge_score=proj_score,
        odds_value_score=odds_score,
        context_score=round(context_score, 2),
        market_confirm_score=mkt_score,
        timing_score=timing_score,
        total=round(total, 1),
    )


def recommend_action(score: float, min_score: float = 8.0) -> str:
    """Route candidate to approval queue, watchlist, or rejection."""
    if score >= min_score:
        return "Manual Review"
    if score >= 6.0:
        return "Watch"
    return "Reject"
