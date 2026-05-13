from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Supabase
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None

    # Odds data
    odds_api_key: Optional[str] = None
    sportsdata_api_key: Optional[str] = None

    # Twilio — all optional; alerts are stubbed if missing
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_from_number: Optional[str] = None
    alert_to_number: Optional[str] = None

    # App
    environment: str = "development"
    log_level: str = "info"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()


def is_mock_mode() -> bool:
    """True when no external API keys are configured — use mock data."""
    return not settings.odds_api_key and not settings.supabase_url
