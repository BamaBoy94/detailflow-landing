from fastapi import APIRouter, HTTPException
from typing import List

from app.routes.candidates import _decisions
from app.schemas.decision import CLVUpdate

router = APIRouter(prefix="/api/decisions", tags=["decisions"])


@router.get("", response_model=List[dict])
async def list_decisions():
    """Return all recorded decisions."""
    return list(_decisions.values())


@router.get("/{decision_id}", response_model=dict)
async def get_decision(decision_id: str):
    decision = _decisions.get(decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision


@router.patch("/{decision_id}/clv", response_model=dict)
async def update_clv(decision_id: str, payload: CLVUpdate):
    """Update a decision with closing line and result (for CLV tracking)."""
    decision = _decisions.get(decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    decision.update({
        "closing_line": payload.closing_line,
        "closing_odds": payload.closing_odds,
        "result": payload.result,
        "profit_loss_units": payload.profit_loss_units,
    })

    return decision
