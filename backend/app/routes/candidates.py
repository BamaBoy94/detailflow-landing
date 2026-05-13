from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.services.mock_data_service import get_mock_candidates
from app.services.ev_calculator import calculate_ev, american_to_implied
from app.schemas.candidate import BetCandidateResponse
from app.schemas.decision import DecisionCreate, DecisionResponse, BetResult
from app.config import is_mock_mode

import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/api/candidates", tags=["candidates"])

# In-memory store for decisions (replace with Supabase in production)
_decisions: dict = {}
_candidates: dict = {}


def _get_candidates() -> List[dict]:
    if is_mock_mode():
        return get_mock_candidates()
    # TODO: query Supabase bet_candidates table
    return get_mock_candidates()


@router.get("", response_model=List[dict])
async def list_candidates(
    sport: Optional[str] = Query(None),
    league: Optional[str] = Query(None),
    market: Optional[str] = Query(None),
    sportsbook: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    max_score: Optional[float] = Query(None),
):
    """Return all bet candidates, optionally filtered."""
    data = _get_candidates()

    if sport:
        data = [c for c in data if c.get("sport") == sport]
    if league:
        data = [c for c in data if c.get("league") == league]
    if market:
        data = [c for c in data if c.get("market") == market]
    if sportsbook:
        data = [c for c in data if c.get("sportsbook") == sportsbook]
    if status:
        data = [c for c in data if c.get("status") == status]
    if min_score is not None:
        data = [c for c in data if c.get("system_score", 0) >= min_score]
    if max_score is not None:
        data = [c for c in data if c.get("system_score", 0) <= max_score]

    return data


@router.get("/{candidate_id}", response_model=dict)
async def get_candidate(candidate_id: str):
    """Return a single candidate by ID."""
    data = _get_candidates()
    candidate = next((c for c in data if c["id"] == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
    return candidate


@router.post("/{candidate_id}/decision", response_model=dict)
async def create_decision(candidate_id: str, payload: DecisionCreate):
    """
    Record a manual decision for a candidate.

    IMPORTANT: This endpoint logs the decision only.
    It does NOT place any bet or interact with any sportsbook.
    """
    data = _get_candidates()
    candidate = next((c for c in data if c["id"] == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")

    decision = {
        "id": str(uuid.uuid4()),
        "candidate_id": candidate_id,
        "decision": payload.decision,
        "decision_reason": payload.decision_reason,
        "approved_units": payload.approved_units,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "original_line": candidate["line"],
        "original_odds": candidate["odds"],
        "closing_line": None,
        "closing_odds": None,
        "result": "pending",
        "profit_loss_units": None,
        "notes": payload.notes,
    }

    _decisions[decision["id"]] = decision

    # Update candidate status in memory
    status_map = {"approve": "approved", "reject": "rejected", "watch": "watchlist"}
    candidate["status"] = status_map.get(payload.decision, candidate["status"])

    return decision
