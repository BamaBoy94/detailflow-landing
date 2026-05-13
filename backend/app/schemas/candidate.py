from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class Sport(str, Enum):
    basketball = "Basketball"
    football = "Football"
    baseball = "Baseball"
    hockey = "Hockey"
    soccer = "Soccer"
    tennis = "Tennis"


class League(str, Enum):
    nba = "NBA"
    nfl = "NFL"
    mlb = "MLB"
    nhl = "NHL"
    mls = "MLS"
    atp = "ATP"
    wta = "WTA"


class BetType(str, Enum):
    over = "Over"
    under = "Under"
    spread = "Spread"
    moneyline = "Moneyline"
    total = "Total"


class CandidateStatus(str, Enum):
    candidate = "candidate"
    approved = "approved"
    rejected = "rejected"
    watchlist = "watchlist"
    expired = "expired"


class ConfidenceTier(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"


class RuleResult(str, Enum):
    pass_ = "pass"
    fail = "fail"
    warn = "warn"
    na = "n/a"


class MarketBookLine(BaseModel):
    sportsbook: str
    line: float
    odds: int


class RuleChecklist(BaseModel):
    projection_edge: RuleResult
    odds_value: RuleResult
    context: RuleResult
    market_confirmation: RuleResult
    bankroll: RuleResult


class BetCandidateBase(BaseModel):
    sport: Sport
    league: League
    game: str
    game_start_time: datetime
    market: str
    player_or_team: str
    bet_type: BetType
    line: float
    odds: int
    sportsbook: str
    projection: float
    projection_edge: float
    implied_probability: float
    projected_probability: float
    estimated_ev: float
    system_score: float = Field(ge=0, le=10)
    confidence_tier: ConfidenceTier
    recommended_action: str
    max_units: float
    context_notes: List[str] = []
    risk_flags: List[str] = []
    market_comparison: List[MarketBookLine] = []
    rule_checklist: RuleChecklist
    status: CandidateStatus


class BetCandidateCreate(BetCandidateBase):
    pass


class BetCandidateResponse(BetCandidateBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CandidateFilters(BaseModel):
    sport: Optional[str] = None
    league: Optional[str] = None
    market: Optional[str] = None
    sportsbook: Optional[str] = None
    status: Optional[str] = None
    min_score: Optional[float] = None
    max_score: Optional[float] = None
    confidence_tier: Optional[str] = None
