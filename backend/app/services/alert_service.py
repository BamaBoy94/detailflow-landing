"""
Alert service — SMS notifications via Twilio.
Safely stubs if credentials are missing.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def send_sms_alert(
    to_number: str,
    message: str,
    account_sid: Optional[str] = None,
    auth_token: Optional[str] = None,
    from_number: Optional[str] = None,
) -> dict:
    """
    Send SMS via Twilio. If credentials are not configured, logs and returns stub response.

    IMPORTANT: This function only sends informational alerts.
    It does NOT place bets or interact with any sportsbook.
    """
    if not all([account_sid, auth_token, from_number]):
        logger.info("Twilio credentials not configured — alert stubbed: %s", message)
        return {"status": "stubbed", "message": message, "reason": "Twilio not configured"}

    try:
        from twilio.rest import Client  # type: ignore
        client = Client(account_sid, auth_token)
        msg = client.messages.create(body=message, from_=from_number, to=to_number)
        logger.info("Alert sent via Twilio: SID %s", msg.sid)
        return {"status": "sent", "sid": msg.sid}
    except ImportError:
        logger.warning("twilio package not installed — alert stubbed")
        return {"status": "stubbed", "reason": "twilio package not installed"}
    except Exception as exc:
        logger.error("Twilio send failed: %s", exc)
        return {"status": "failed", "error": str(exc)}


def format_candidate_alert(candidate: dict) -> str:
    """Format a bet candidate into a plain-text alert message."""
    score = candidate.get("system_score", 0)
    player = candidate.get("player_or_team", "Unknown")
    market = candidate.get("market", "")
    bet_type = candidate.get("bet_type", "")
    line = candidate.get("line", 0)
    odds = candidate.get("odds", -110)
    sportsbook = candidate.get("sportsbook", "")
    ev = candidate.get("estimated_ev", 0)

    odds_str = f"+{odds}" if odds > 0 else str(odds)
    ev_str = f"+{ev*100:.1f}%" if ev >= 0 else f"{ev*100:.1f}%"

    return (
        f"Sharp Filter — Manual Review Candidate\n"
        f"Score: {score}/10 | {player}\n"
        f"{market} {bet_type} {line} ({odds_str}) @ {sportsbook}\n"
        f"Est. EV: {ev_str}\n"
        f"---\n"
        f"This is for analysis only. No bet has been placed.\n"
        f"Open Sharp Filter to review and decide."
    )
