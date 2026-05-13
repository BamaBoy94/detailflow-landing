from fastapi import APIRouter
from app.services.mock_data_service import get_mock_settings
from app.schemas.settings import AppSettingsCreate, AppSettingsResponse, BankrollStateResponse, BankrollStateBase

router = APIRouter(prefix="/api", tags=["settings"])

_settings_store: dict = {}
_bankroll_store: dict = {}


@router.get("/settings", response_model=dict)
async def get_settings():
    """Return current rule settings."""
    if not _settings_store:
        return get_mock_settings()
    return _settings_store


@router.post("/settings", response_model=dict)
async def update_settings(payload: AppSettingsCreate):
    """Save rule settings. Parlays require explicit opt-in."""
    data = payload.model_dump()
    # Enforce parlay safety warning
    if data.get("parlays_enabled"):
        data["parlay_warning_acknowledged"] = True
    _settings_store.update(data)
    return _settings_store


@router.get("/bankroll", response_model=dict)
async def get_bankroll():
    """Return current bankroll state."""
    if not _bankroll_store:
        return {
            "starting_bankroll": 5000,
            "current_bankroll": 5045,
            "unit_size": 50,
            "daily_units_used": 1.0,
            "weekly_units_used": 4.0,
            "daily_units_won_lost": 0.91,
            "open_risk_units": 1.0,
            "stop_loss_triggered": False,
            "daily_exposure_limit_reached": False,
        }
    return _bankroll_store


@router.post("/bankroll", response_model=dict)
async def update_bankroll(payload: BankrollStateBase):
    data = payload.model_dump()
    _bankroll_store.update(data)
    return _bankroll_store
