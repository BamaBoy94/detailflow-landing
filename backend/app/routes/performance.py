from fastapi import APIRouter
from app.routes.candidates import _decisions
from app.services.ev_calculator import calculate_clv, american_to_implied

router = APIRouter(prefix="/api", tags=["performance"])


@router.get("/performance", response_model=dict)
async def get_performance():
    """Compute performance analytics from decision history."""
    decisions = list(_decisions.values())

    if not decisions:
        return _mock_performance()

    resolved = [d for d in decisions if d["result"] in ("win", "loss", "push")]
    wins = [d for d in resolved if d["result"] == "win"]
    losses = [d for d in resolved if d["result"] == "loss"]
    pushes = [d for d in resolved if d["result"] == "push"]

    units_won = sum(d.get("profit_loss_units", 0) or 0 for d in wins)
    units_lost = sum(abs(d.get("profit_loss_units", 0) or 0) for d in losses)
    net_units = units_won - units_lost

    total_wagered = len(resolved)
    roi = (net_units / total_wagered * 100) if total_wagered else 0

    clv_positive = [
        d for d in resolved
        if d.get("closing_odds") and calculate_clv(d["original_odds"], d["closing_odds"]) > 0
    ]
    clv_hit_rate = len(clv_positive) / len(resolved) * 100 if resolved else 0

    win_rate = len(wins) / len(resolved) * 100 if resolved else 0

    return {
        "total_approved": len(decisions),
        "total_wins": len(wins),
        "total_losses": len(losses),
        "total_pushes": len(pushes),
        "total_pending": len([d for d in decisions if d["result"] == "pending"]),
        "units_won": round(units_won, 2),
        "units_lost": round(units_lost, 2),
        "net_units": round(net_units, 2),
        "roi": round(roi, 1),
        "clv_hit_rate": round(clv_hit_rate, 1),
        "win_rate": round(win_rate, 1),
        "avg_edge": 0.0,
        "avg_closing_line_movement": 0.0,
    }


@router.get("/watchlist", response_model=list)
async def get_watchlist():
    """Return candidates currently on the watchlist."""
    from app.services.mock_data_service import get_mock_candidates
    all_candidates = get_mock_candidates()
    return [c for c in all_candidates if c.get("status") == "watchlist"]


def _mock_performance() -> dict:
    return {
        "total_approved": 10,
        "total_wins": 6,
        "total_losses": 2,
        "total_pushes": 1,
        "total_pending": 1,
        "units_won": 5.56,
        "units_lost": 2.0,
        "net_units": 3.56,
        "roi": 35.6,
        "clv_hit_rate": 70.0,
        "win_rate": 66.7,
        "avg_edge": 7.8,
        "avg_closing_line_movement": 0.8,
    }
