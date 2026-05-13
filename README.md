# Sharp Filter V2 — Sports Betting Analysis Engine

> **This tool is for analysis and research only. It does not place bets, interact with sportsbooks, or execute wagers automatically. Sports betting involves significant financial risk. Users are solely responsible for following local laws and sportsbook terms of service.**

---

## What Sharp Filter Does

Sharp Filter is a disciplined betting research dashboard. It:

- **Ingests** odds, player statistics, injury context, and market movement
- **Scores** each potential bet through a rule-based evaluation system (0–10)
- **Routes** qualified candidates to a manual approval queue
- **Records** your approve/reject/watch decisions with timestamps
- **Tracks** performance metrics including CLV (closing line value)
- **Alerts** you via SMS (optional, Twilio) when high-score candidates appear
- **Enforces** bankroll rules and stop-loss limits as safety controls

## What Sharp Filter Does NOT Do

- Does not place bets automatically
- Does not log into any sportsbook account
- Does not scrape or automate sportsbook interactions
- Does not guarantee profitable outcomes
- Does not recommend ignoring stop-loss rules
- Does not recommend parlays (parlay analysis is disabled by default)

---

## Architecture

```
Frontend (React + TypeScript + Tailwind CSS v4)
  pages/: Dashboard, ApprovalQueue, Watchlist, Performance, RulesSettings, Bankroll
  components/sharp/: All UI components
  utils/: EV calculator, scoring engine, odds utils
  lib/api.ts: API layer (mock or live)
        |
        | HTTP (VITE_API_URL)
        v
Backend (FastAPI + Python)
  routes/: candidates, decisions, settings, performance, health
  services/: ev_calculator, scoring_engine, risk_engine, odds_api_client,
             sportsdata_client, alert_service, mock_data_service
        |
        v
Database (Supabase / Postgres)
  Tables: users, settings, bet_candidates, bet_decisions, line_movements, alerts, audit_logs
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- Python 3.11+

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure frontend environment

```bash
cp .env.example .env
# Leave VITE_API_URL blank to use mock data (no backend required for UI development)
```

### 3. Run the frontend

```bash
npm run dev
# Opens at http://localhost:5173
```

The frontend works entirely in **mock mode** without any backend or API keys. All data is realistic fictional NBA prop candidates for demonstration.

### 4. Set up backend (optional)

```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 5. Run the backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### 6. Connect frontend to backend

```bash
# In .env (root):
VITE_API_URL=http://localhost:8000
```

---

## Environment Variables

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | FastAPI backend URL. Leave blank for mock mode. |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | No | Supabase project URL for persistent storage |
| `SUPABASE_ANON_KEY` | No | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key |
| `ODDS_API_KEY` | No | The Odds API key for live odds |
| `SPORTSDATA_API_KEY` | No | SportsDataIO key for player stats |
| `TWILIO_ACCOUNT_SID` | No | Twilio SID for SMS alerts |
| `TWILIO_AUTH_TOKEN` | No | Twilio auth token |
| `TWILIO_FROM_NUMBER` | No | Twilio sender phone number |
| `ALERT_TO_NUMBER` | No | Your phone number for alerts |

All external API keys are optional. The system falls back to mock data gracefully.

---

## Mock Data

Mock data lives in `src/services/mockData.ts` (frontend) and `backend/app/services/mock_data_service.py` (backend).

The mock dataset contains **12 fictional NBA player prop candidates** with varying system scores:
- 5 candidates — Approval Queue (score ≥ 8.0)
- 3 candidates — Watchlist (score 6.0–7.9)
- 3 candidates — Rejected (score < 6.0 or auto-reject triggered)
- Mock performance history (10 past decisions with results)

**All names, lines, odds, and projections are fictional examples. They must not be used for wagering decisions.**

---

## Core Scoring Logic

`src/utils/scoring.ts` / `backend/app/services/scoring_engine.py`

| Component | Max | Logic |
|-----------|-----|-------|
| Projection Edge | 3.0 | vs market-specific minimum edge |
| Odds Value | 2.0 | -110 or better = full score |
| Context | 2.0 | 0.67 pts per supporting factor |
| Market Confirmation | 2.0 | Favourable line vs other books |
| Timing | 1.0 | Game 2–12 hours away = full |
| **Total** | **10.0** | |

Score routing (configurable):
- **≥ 8.0** → Approval Queue
- **6.0–7.9** → Watchlist
- **< 6.0** → Auto-Reject

---

## EV Calculations

`src/utils/evCalculator.ts`

All EV outputs are labeled "estimated" — model approximations, not guaranteed returns.

```
Implied Probability (negative odds):  P = |odds| / (|odds| + 100)
Implied Probability (positive odds):  P = 100 / (odds + 100)

Expected Value:  EV = (P_win × Profit_if_win) - (P_lose × Stake)

Closing Line Value:  CLV = Implied(original_odds) - Implied(closing_odds)
  Positive CLV = got a better price than the closing line
```

---

## Where Things Live

| What | Location |
|------|----------|
| Scoring rules | `src/utils/scoring.ts` |
| EV calculations | `src/utils/evCalculator.ts` |
| Auto-reject logic | `src/utils/scoring.ts::checkAutoReject()` |
| Manual approval UI | `src/pages/ApprovalQueue.tsx` |
| Decision logging | `src/lib/api.ts::submitDecision()` |
| Odds API adapter | `backend/app/services/odds_api_client.py` |
| Stats API adapter | `backend/app/services/sportsdata_client.py` |
| SMS alerts stub | `backend/app/services/alert_service.py` |
| Mock candidates | `src/services/mockData.ts` |
| Database schema | `backend/schema.sql` |
| Settings config | `src/pages/RulesSettings.tsx` |

---

## Connecting Real Odds APIs

### The Odds API
1. Sign up at https://the-odds-api.com
2. Set `ODDS_API_KEY` in `backend/.env`
3. `OddsAPIClient` in `backend/app/services/odds_api_client.py` activates automatically

### SportsDataIO
1. Sign up at https://sportsdata.io
2. Set `SPORTSDATA_API_KEY` in `backend/.env`
3. `SportsDataClient` in `backend/app/services/sportsdata_client.py` activates

---

## What Needs to Be Built Before Using Real Money

Do not use this system with real money until all of the following are complete:

1. **Live projection model** — Current mock edges need a real calibrated model
2. **Live odds ingestion** — Wire `OddsAPIClient` to scoring engine on a schedule
3. **Injury/news feed** — Connect a live injury API and parse status into context flags
4. **Supabase persistence** — Replace in-memory stores with Supabase queries
5. **Authentication** — Implement Supabase Auth for user-scoped data
6. **CLV tracking** — Scheduled job to fetch closing odds and update decision results
7. **Backtesting** — Validate scoring model on historical data
8. **Unit tests** — Test scoring, EV, and risk engines with known inputs
9. **Human review** — Every candidate must be manually reviewed; system never places bets

---

## Responsible Gambling

- Set a bankroll you can afford to lose entirely
- Never increase unit size to chase losses
- Treat stop-loss as a hard limit, not a suggestion
- EV estimates are models, not guarantees
- National Problem Gambling Helpline: 1-800-522-4700
