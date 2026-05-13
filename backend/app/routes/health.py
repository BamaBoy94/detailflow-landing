from fastapi import APIRouter
from app.config import settings, is_mock_mode

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health():
    return {
        "status": "ok",
        "mode": "mock" if is_mock_mode() else "live",
        "supabase_connected": bool(settings.supabase_url),
        "odds_api_connected": bool(settings.odds_api_key),
        "twilio_configured": bool(settings.twilio_account_sid),
    }


@router.post("/api/refresh-data")
async def refresh_data():
    """
    Trigger a data refresh from external APIs.
    In mock mode, returns a stub response.
    """
    if is_mock_mode():
        return {"message": "Mock mode — no live API connected. Configure ODDS_API_KEY to enable."}

    # TODO: call OddsAPIClient and SportsDataClient, re-score candidates
    return {"message": "Data refresh initiated"}


@router.post("/api/send-alert")
async def send_alert(payload: dict):
    """Send SMS alert for a candidate. Stubs safely if Twilio not configured."""
    from app.services.alert_service import send_sms_alert, format_candidate_alert
    from app.services.mock_data_service import get_mock_candidates

    candidate_id = payload.get("candidate_id")
    candidates = get_mock_candidates()
    candidate = next((c for c in candidates if c["id"] == candidate_id), None)

    if not candidate:
        return {"status": "error", "message": "Candidate not found"}

    message = format_candidate_alert(candidate)
    result = send_sms_alert(
        to_number=settings.alert_to_number or "",
        message=message,
        account_sid=settings.twilio_account_sid,
        auth_token=settings.twilio_auth_token,
        from_number=settings.twilio_from_number,
    )
    return result
