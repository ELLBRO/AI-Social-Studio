from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.billing import SubscriptionStatus, CreditTransactionType


class PlanResponse(BaseModel):
    id: str
    name: str
    code: str
    price_monthly: float
    price_yearly: float
    credit_allowance: int
    max_social_accounts: int
    features: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)


class SubscriptionResponse(BaseModel):
    id: str
    organization_id: str
    plan: Optional[PlanResponse] = None
    status: SubscriptionStatus
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool

    model_config = ConfigDict(from_attributes=True)


class CreditAccountResponse(BaseModel):
    id: str
    organization_id: str
    balance: int
    lifetime_granted: int
    lifetime_used: int

    model_config = ConfigDict(from_attributes=True)


class CreditTransactionResponse(BaseModel):
    id: str
    amount: int
    type: CreditTransactionType
    description: str
    reference_type: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CheckoutSessionRequest(BaseModel):
    plan_code: str  # starter, pro, enterprise
    billing_period: str = "monthly"  # monthly, yearly
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
