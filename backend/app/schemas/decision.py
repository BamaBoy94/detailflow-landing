from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class DecisionType(str, Enum):
    approve = "approve"
    reject = "reject"
    watch = "watch"


class BetResult(str, Enum):
    win = "win"
    loss = "loss"
    push = "push"
    pending = "pending"


class DecisionCreate(BaseModel):
    decision: DecisionType
    decision_reason: Optional[str] = None
    approved_units: float = 1.0
    notes: Optional[str] = None


class DecisionResponse(BaseModel):
    id: str
    candidate_id: str
    decision: DecisionType
    decision_reason: Optional[str] = None
    approved_units: float
    timestamp: datetime
    original_line: float
    original_odds: int
    closing_line: Optional[float] = None
    closing_odds: Optional[int] = None
    result: BetResult = BetResult.pending
    profit_loss_units: Optional[float] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class CLVUpdate(BaseModel):
    closing_line: float
    closing_odds: int
    result: BetResult
    profit_loss_units: Optional[float] = None
