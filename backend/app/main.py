"""
Sharp Filter V2 — FastAPI backend

IMPORTANT: This application analyzes betting candidates and records manual decisions.
It does NOT place bets, interact with sportsbooks, or execute any wagers automatically.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import candidates, decisions, settings, performance, health
from app.config import settings as app_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sharp Filter V2",
    description=(
        "Sports betting analysis and decision-tracking engine. "
        "For analysis only — does not place bets."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(decisions.router)
app.include_router(settings.router)
app.include_router(performance.router)
app.include_router(health.router)


@app.on_event("startup")
async def startup_event():
    logger.info("Sharp Filter V2 backend starting")
    logger.info("Mode: %s", "mock" if not app_settings.odds_api_key else "live")
    logger.info("Supabase: %s", "connected" if app_settings.supabase_url else "not configured")
    logger.info("Twilio: %s", "configured" if app_settings.twilio_account_sid else "stubbed")
