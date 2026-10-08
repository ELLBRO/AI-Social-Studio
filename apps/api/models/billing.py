import enum
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Enum, DateTime, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class SubscriptionStatus(str, enum.Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"
    INCOMPLETE = "incomplete"


class CreditTransactionType(str, enum.Enum):
    GRANT = "grant"
    CONSUMPTION = "consumption"
    REFUND = "refund"
    RESERVATION = "reservation"


class Plan(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "plans"

    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)  # starter, pro, enterprise
    price_monthly = Column(Float, nullable=False)
    price_yearly = Column(Float, nullable=False)
    credit_allowance = Column(Integer, default=500, nullable=False)
    max_social_accounts = Column(Integer, default=5, nullable=False)
    features = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True, nullable=False)

    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "subscriptions"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("plans.id"), nullable=False)
    stripe_customer_id = Column(String(255), nullable=True, index=True)
    stripe_subscription_id = Column(String(255), nullable=True, index=True)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIALING, nullable=False)
    trial_start = Column(DateTime(timezone=True), nullable=True)
    trial_end = Column(DateTime(timezone=True), nullable=True)
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False, nullable=False)

    organization = relationship("Organization", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")


class CreditAccount(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "credit_accounts"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    balance = Column(Integer, default=100, nullable=False)  # 100 free credits on trial
    lifetime_granted = Column(Integer, default=100, nullable=False)
    lifetime_used = Column(Integer, default=0, nullable=False)

    organization = relationship("Organization", back_populates="credit_account")
    transactions = relationship("CreditTransaction", back_populates="credit_account", cascade="all, delete-orphan")


class CreditTransaction(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "credit_transactions"

    credit_account_id = Column(String(36), ForeignKey("credit_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)  # positive for grant/refund, negative for consumption
    type = Column(Enum(CreditTransactionType), nullable=False)
    description = Column(String(255), nullable=False)
    reference_type = Column(String(50), nullable=True)  # e.g. "ai_generation", "video_generation"
    reference_id = Column(String(36), nullable=True)

    credit_account = relationship("CreditAccount", back_populates="transactions")


class UsageRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "usage_records"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    metric = Column(String(100), nullable=False)  # "ai_tokens", "video_seconds", "social_posts"
    quantity = Column(Integer, default=1, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
