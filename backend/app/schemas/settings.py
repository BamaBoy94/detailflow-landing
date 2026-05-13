from pydantic import BaseModel, Field
from typing import List, Optional


class AppSettingsBase(BaseModel):
    bankroll: float = Field(gt=0, description="Total bankroll in dollars")
    unit_percentage: float = Field(default=1.0, ge=0.1, le=5.0, description="% of bankroll per unit")
    max_daily_units: float = Field(default=3.0, ge=1, le=20)
    max_weekly_units: float = Field(default=10.0, ge=1, le=50)
    daily_stop_loss_units: float = Field(default=-3.0, le=0)
    minimum_score: float = Field(default=8.0, ge=0, le=10)
    minimum_probability_edge: float = Field(default=3.0, ge=0, le=20)
    max_juice_warning: int = Field(default=-120)
    max_juice_hard_stop: int = Field(default=-130)
    parlays_enabled: bool = Field(default=False)
    allowed_markets: List[str] = []
    banned_markets: List[str] = []
    alert_phone: Optional[str] = None


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsResponse(AppSettingsBase):
    id: Optional[str] = None

    class Config:
        from_attributes = True


class BankrollStateBase(BaseModel):
    starting_bankroll: float
    current_bankroll: float
    unit_size: float
    daily_units_used: float = 0
    weekly_units_used: float = 0
    daily_units_won_lost: float = 0
    open_risk_units: float = 0
    stop_loss_triggered: bool = False
    daily_exposure_limit_reached: bool = False


class BankrollStateResponse(BankrollStateBase):
    pass
