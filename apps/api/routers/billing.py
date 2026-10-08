from typing import List
from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_org
from apps.api.models.user import Organization
from apps.api.models.billing import Plan, Subscription
from apps.api.domains.billing.service import BillingService
from apps.api.schemas.billing import (
    PlanResponse,
    SubscriptionResponse,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
)

router = APIRouter(prefix="/billing", tags=["Billing & Stripe"])


@router.get("/plans", response_model=List[PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    BillingService.seed_plans_if_empty(db)
    return db.query(Plan).filter(Plan.is_active == True).all()


@router.get("/subscription", response_model=SubscriptionResponse)
def get_subscription(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return BillingService.get_or_create_subscription(db, org.id)


@router.post("/checkout", response_model=CheckoutSessionResponse)
def create_checkout(
    req: CheckoutSessionRequest,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    session = BillingService.create_checkout_session(
        db=db,
        organization_id=org.id,
        plan_code=req.plan_code,
        billing_period=req.billing_period,
        success_url=req.success_url,
        cancel_url=req.cancel_url,
    )
    return session


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    event_id = payload.get("id", "evt_unknown")
    event_type = payload.get("type", "unknown")

    BillingService.process_webhook_event(
        db=db,
        event_id=event_id,
        event_type=event_type,
        payload=payload,
    )
    return {"received": True}
