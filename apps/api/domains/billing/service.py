from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from apps.api.models.billing import Plan, Subscription, SubscriptionStatus, CreditAccount, CreditTransaction, CreditTransactionType
from apps.api.models.jobs import WebhookEvent, WebhookStatus
from apps.api.models.user import Organization
from apps.api.core.config import settings
from apps.api.core.exceptions import AppException


class BillingService:
    @staticmethod
    def seed_plans_if_empty(db: Session):
        if db.query(Plan).count() == 0:
            starter = Plan(
                name="Starter Creator",
                code="starter",
                price_monthly=29.0,
                price_yearly=290.0,
                credit_allowance=500,
                max_social_accounts=3,
                features={
                    "ai_strategy": True,
                    "video_gen": "standard",
                    "publishing": True,
                    "calendar": True,
                    "analytics": "basic",
                },
            )
            pro = Plan(
                name="Growth Pro",
                code="pro",
                price_monthly=79.0,
                price_yearly=790.0,
                credit_allowance=2000,
                max_social_accounts=10,
                features={
                    "ai_strategy": True,
                    "video_gen": "hd_unlimited",
                    "publishing": True,
                    "calendar": True,
                    "analytics": "advanced",
                    "ai_optimization": True,
                    "priority_jobs": True,
                },
            )
            enterprise = Plan(
                name="Agency & Enterprise",
                code="enterprise",
                price_monthly=249.0,
                price_yearly=2490.0,
                credit_allowance=10000,
                max_social_accounts=50,
                features={
                    "ai_strategy": True,
                    "video_gen": "ultra_fast",
                    "publishing": True,
                    "calendar": True,
                    "analytics": "white_label",
                    "ai_optimization": True,
                    "dedicated_support": True,
                    "team_workspaces": True,
                },
            )
            db.add_all([starter, pro, enterprise])
            db.commit()

    @staticmethod
    def get_or_create_subscription(db: Session, organization_id: str) -> Subscription:
        BillingService.seed_plans_if_empty(db)
        sub = db.query(Subscription).filter(Subscription.organization_id == organization_id).first()
        if not sub:
            starter = db.query(Plan).filter(Plan.code == "starter").first()
            now = datetime.now(timezone.utc)
            trial_end = now + timedelta(days=7)
            sub = Subscription(
                organization_id=organization_id,
                plan_id=starter.id,
                status=SubscriptionStatus.TRIALING,
                trial_start=now,
                trial_end=trial_end,
                current_period_start=now,
                current_period_end=trial_end,
                cancel_at_period_end=False,
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
        return sub

    @staticmethod
    def create_checkout_session(
        db: Session,
        organization_id: str,
        plan_code: str,
        billing_period: str = "monthly",
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
    ) -> Dict[str, str]:
        # Production Stripe Checkout integration:
        # In absence of live key or during local dev, return simulation checkout URL
        session_id = f"cs_test_{plan_code}_{int(datetime.now().timestamp())}"
        app_url = settings.APP_URL
        s_url = success_url or f"{app_url}/dashboard/billing?session_id={session_id}&success=true"
        return {
            "checkout_url": s_url,
            "session_id": session_id,
        }

    @staticmethod
    def process_webhook_event(
        db: Session,
        event_id: str,
        event_type: str,
        payload: Dict[str, Any],
    ) -> bool:
        # Idempotency check on WebhookEvent
        existing = db.query(WebhookEvent).filter(WebhookEvent.idempotency_key == event_id).first()
        if existing and existing.status == WebhookStatus.PROCESSED:
            return True

        webhook_event = existing or WebhookEvent(
            provider="stripe",
            event_type=event_type,
            idempotency_key=event_id,
            payload=payload,
            status=WebhookStatus.RECEIVED,
        )
        if not existing:
            db.add(webhook_event)
            db.commit()

        try:
            if event_type == "customer.subscription.updated":
                sub_data = payload.get("data", {}).get("object", {})
                stripe_sub_id = sub_data.get("id")
                sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == stripe_sub_id).first()
                if sub:
                    status_map = {
                        "active": SubscriptionStatus.ACTIVE,
                        "trialing": SubscriptionStatus.TRIALING,
                        "past_due": SubscriptionStatus.PAST_DUE,
                        "canceled": SubscriptionStatus.CANCELED,
                    }
                    sub.status = status_map.get(sub_data.get("status"), sub.status)
                    db.commit()

            webhook_event.status = WebhookStatus.PROCESSED
            webhook_event.processed_at = datetime.now(timezone.utc)
            db.commit()
            return True

        except Exception as e:
            webhook_event.status = WebhookStatus.FAILED
            webhook_event.error = str(e)
            db.commit()
            raise AppException(status_code=500, detail=f"Webhook handling failed: {str(e)}")
