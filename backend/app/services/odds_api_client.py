"""
Odds API adapter (The Odds API — https://the-odds-api.com).
Returns mock data when ODDS_API_KEY is not set.
"""
import httpx
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

ODDS_API_BASE = "https://api.the-odds-api.com/v4"


class OddsAPIClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.is_mock = not api_key

    async def get_odds(
        self,
        sport: str = "basketball_nba",
        markets: str = "h2h,spreads,totals",
        regions: str = "us",
    ) -> List[dict]:
        """Fetch current odds. Returns mock data if no API key."""
        if self.is_mock:
            logger.info("OddsAPI: no key configured, returning mock data")
            return self._mock_odds()

        url = f"{ODDS_API_BASE}/sports/{sport}/odds"
        params = {
            "apiKey": self.api_key,
            "markets": markets,
            "regions": regions,
            "oddsFormat": "american",
        }
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, params=params, timeout=10)
                resp.raise_for_status()
                return resp.json()
        except Exception as exc:
            logger.error("OddsAPI error: %s — falling back to mock", exc)
            return self._mock_odds()

    async def get_player_props(self, sport: str = "basketball_nba") -> List[dict]:
        """Fetch player prop markets. Returns mock data if no API key."""
        if self.is_mock:
            return self._mock_player_props()

        url = f"{ODDS_API_BASE}/sports/{sport}/events"
        params = {"apiKey": self.api_key}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, params=params, timeout=10)
                resp.raise_for_status()
                return resp.json()
        except Exception as exc:
            logger.error("OddsAPI player props error: %s — mock fallback", exc)
            return self._mock_player_props()

    def _mock_odds(self) -> List[dict]:
        return [
            {
                "id": "mock-game-001",
                "sport_key": "basketball_nba",
                "home_team": "Boston Celtics",
                "away_team": "New York Knicks",
                "commence_time": "2025-01-15T00:30:00Z",
                "bookmakers": [],
            }
        ]

    def _mock_player_props(self) -> List[dict]:
        return []
