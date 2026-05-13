"""
SportsDataIO adapter for player stats and projections.
Returns mock data when SPORTSDATA_API_KEY is not set.
"""
import httpx
import logging
from typing import List, Optional, Dict, Any

logger = logging.getLogger(__name__)

SPORTSDATA_BASE = "https://api.sportsdata.io/v3"


class SportsDataClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.is_mock = not api_key

    async def get_player_game_stats(self, sport: str = "nba", season: str = "2024REG") -> List[dict]:
        """Fetch player game stats for projection baseline."""
        if self.is_mock:
            return self._mock_player_stats()

        url = f"{SPORTSDATA_BASE}/{sport}/stats/json/PlayerGameStatsByDate/{season}"
        headers = {"Ocp-Apim-Subscription-Key": self.api_key}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=10)
                resp.raise_for_status()
                return resp.json()
        except Exception as exc:
            logger.error("SportsDataIO error: %s — mock fallback", exc)
            return self._mock_player_stats()

    async def get_injury_report(self, sport: str = "nba") -> List[dict]:
        """Fetch current injury report."""
        if self.is_mock:
            return self._mock_injuries()

        url = f"{SPORTSDATA_BASE}/{sport}/stats/json/Injuries"
        headers = {"Ocp-Apim-Subscription-Key": self.api_key}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=10)
                resp.raise_for_status()
                return resp.json()
        except Exception as exc:
            logger.error("SportsDataIO injury error: %s — mock fallback", exc)
            return self._mock_injuries()

    def _mock_player_stats(self) -> List[dict]:
        return [
            {
                "PlayerID": 20001001,
                "Name": "Marcus Webb",
                "Team": "NYK",
                "Points": 25.1,
                "Rebounds": 4.2,
                "Assists": 5.8,
                "Minutes": 34.2,
                "Games": 5,
            }
        ]

    def _mock_injuries(self) -> List[dict]:
        return [
            {
                "PlayerID": 20001099,
                "Name": "Example Player",
                "Team": "BOS",
                "Status": "Questionable",
                "Injury": "Ankle",
            }
        ]
