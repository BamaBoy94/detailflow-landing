"""
Mock data service — returns realistic but fictional NBA prop candidates.

NOT live data. NOT betting advice. For development and demonstration only.
"""
from datetime import datetime, timezone, timedelta
from typing import List
import uuid


def _today_at(hour: int, minute: int = 0) -> str:
    now = datetime.now(timezone.utc)
    t = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    return t.isoformat()


def get_mock_candidates() -> List[dict]:
    return [
        {
            "id": "cand-001",
            "sport": "Basketball",
            "league": "NBA",
            "game": "NYK vs BOS",
            "game_start_time": _today_at(19, 30),
            "market": "Player Points",
            "player_or_team": "Marcus Webb",
            "bet_type": "Over",
            "line": 22.5,
            "odds": -110,
            "sportsbook": "FanDuel",
            "projection": 25.1,
            "projection_edge": 2.6,
            "implied_probability": 52.38,
            "projected_probability": 56.2,
            "estimated_ev": 0.072,
            "system_score": 8.5,
            "confidence_tier": "Medium",
            "recommended_action": "Manual Review",
            "max_units": 1,
            "context_notes": [
                "Minutes stable over last 5 games (34.2 avg)",
                "Opponent allows 3rd-highest guard scoring in last 10 games",
                "Usage rate increased with primary playmaker questionable",
            ],
            "risk_flags": [],
            "market_comparison": [
                {"sportsbook": "FanDuel",    "line": 22.5, "odds": -110},
                {"sportsbook": "DraftKings", "line": 23.5, "odds": -115},
                {"sportsbook": "BetMGM",     "line": 23.5, "odds": -110},
                {"sportsbook": "Caesars",    "line": 23.0, "odds": -112},
            ],
            "rule_checklist": {
                "projection_edge": "pass",
                "odds_value": "pass",
                "context": "pass",
                "market_confirmation": "pass",
                "bankroll": "pass",
            },
            "status": "candidate",
            "created_at": _today_at(10, 15),
            "updated_at": _today_at(10, 15),
        },
        {
            "id": "cand-002",
            "sport": "Basketball",
            "league": "NBA",
            "game": "LAL vs GSW",
            "game_start_time": _today_at(20, 0),
            "market": "Player Rebounds",
            "player_or_team": "Devon Okafor",
            "bet_type": "Over",
            "line": 9.5,
            "odds": -108,
            "sportsbook": "DraftKings",
            "projection": 12.1,
            "projection_edge": 2.6,
            "implied_probability": 51.92,
            "projected_probability": 57.8,
            "estimated_ev": 0.114,
            "system_score": 9.1,
            "confidence_tier": "High",
            "recommended_action": "Manual Review",
            "max_units": 1,
            "context_notes": [
                "Opponent ranks 29th in rebounding defense last 15 games",
                "Starting center for opponent is probable but limited",
                "Averaging 11.4 rebounds over last 8 games",
                "Game pace projects as top-3 this week",
            ],
            "risk_flags": [],
            "market_comparison": [
                {"sportsbook": "DraftKings", "line": 9.5,  "odds": -108},
                {"sportsbook": "FanDuel",    "line": 10.5, "odds": -110},
                {"sportsbook": "PointsBet",  "line": 10.5, "odds": -112},
                {"sportsbook": "BetMGM",     "line": 10.0, "odds": -115},
            ],
            "rule_checklist": {
                "projection_edge": "pass",
                "odds_value": "pass",
                "context": "pass",
                "market_confirmation": "pass",
                "bankroll": "pass",
            },
            "status": "candidate",
            "created_at": _today_at(9, 45),
            "updated_at": _today_at(11, 0),
        },
        {
            "id": "cand-005",
            "sport": "Basketball",
            "league": "NBA",
            "game": "ATL vs TOR",
            "game_start_time": _today_at(18, 30),
            "market": "Player Threes",
            "player_or_team": "Andre Simmons",
            "bet_type": "Over",
            "line": 2.5,
            "odds": -120,
            "sportsbook": "BetMGM",
            "projection": 3.1,
            "projection_edge": 0.6,
            "implied_probability": 54.55,
            "projected_probability": 58.0,
            "estimated_ev": 0.028,
            "system_score": 7.2,
            "confidence_tier": "Low",
            "recommended_action": "Watch",
            "max_units": 1,
            "context_notes": [
                "Shooting 41% from three over last 6 games",
                "Toronto opponent ranks 25th in three-point defense",
            ],
            "risk_flags": [
                "Odds near caution threshold (-120)",
                "Edge below preferred minimum on this market",
            ],
            "market_comparison": [
                {"sportsbook": "BetMGM",     "line": 2.5, "odds": -120},
                {"sportsbook": "FanDuel",    "line": 2.5, "odds": -118},
                {"sportsbook": "DraftKings", "line": 3.5, "odds": 102},
            ],
            "rule_checklist": {
                "projection_edge": "warn",
                "odds_value": "warn",
                "context": "pass",
                "market_confirmation": "pass",
                "bankroll": "pass",
            },
            "status": "watchlist",
            "created_at": _today_at(9, 0),
            "updated_at": _today_at(9, 0),
        },
        {
            "id": "cand-007",
            "sport": "Basketball",
            "league": "NBA",
            "game": "CLE vs MIL",
            "game_start_time": _today_at(19, 30),
            "market": "Player Points",
            "player_or_team": "Grant Holloway",
            "bet_type": "Over",
            "line": 24.5,
            "odds": -140,
            "sportsbook": "BetMGM",
            "projection": 26.1,
            "projection_edge": 1.6,
            "implied_probability": 58.33,
            "projected_probability": 58.8,
            "estimated_ev": -0.008,
            "system_score": 4.2,
            "confidence_tier": "Low",
            "recommended_action": "Reject",
            "max_units": 0,
            "context_notes": ["Strong role — averaging 36 minutes per game"],
            "risk_flags": [
                "Odds exceed hard stop (-130 threshold)",
                "Negative estimated EV at current juice level",
                "Edge too small to overcome juice",
            ],
            "market_comparison": [
                {"sportsbook": "BetMGM",     "line": 24.5, "odds": -140},
                {"sportsbook": "FanDuel",    "line": 24.5, "odds": -135},
                {"sportsbook": "DraftKings", "line": 24.5, "odds": -132},
            ],
            "rule_checklist": {
                "projection_edge": "warn",
                "odds_value": "fail",
                "context": "warn",
                "market_confirmation": "pass",
                "bankroll": "pass",
            },
            "status": "rejected",
            "created_at": _today_at(9, 30),
            "updated_at": _today_at(9, 30),
        },
    ]


def get_mock_performance() -> dict:
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


def get_mock_settings() -> dict:
    return {
        "bankroll": 5000,
        "unit_percentage": 1.0,
        "max_daily_units": 3.0,
        "max_weekly_units": 10.0,
        "daily_stop_loss_units": -3.0,
        "minimum_score": 8.0,
        "minimum_probability_edge": 3.0,
        "max_juice_warning": -120,
        "max_juice_hard_stop": -130,
        "parlays_enabled": False,
        "allowed_markets": [
            "Player Points", "Player Rebounds", "Player Assists",
            "Player PRA", "Player Threes", "Player Blocks",
            "Player Steals", "Game Total",
        ],
        "banned_markets": [],
    }
