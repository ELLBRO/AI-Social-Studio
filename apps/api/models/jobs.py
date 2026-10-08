import enum
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, Text, JSON
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class WebhookStatus(str, enum.Enum):
    RECEIVED = "received"
    PROCESSED = "processed"
    FAILED = "failed"


class Job(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "jobs"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    job_type = Column(String(100), nullable=False, index=True)  # ai_generation, video_generation, publishing, analytics_sync
    payload = Column(JSON, default=dict)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False, index=True)
    attempts = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    next_run_at = Column(DateTime(timezone=True), nullable=True, index=True)
    result = Column(JSON, default=dict)
    error = Column(Text, nullable=True)


class WebhookEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "webhook_events"

    provider = Column(String(50), nullable=False, index=True)  # stripe, meta, tiktok, etc.
    event_type = Column(String(100), nullable=False)
    idempotency_key = Column(String(255), unique=True, index=True, nullable=False)
    payload = Column(JSON, default=dict)
    status = Column(Enum(WebhookStatus), default=WebhookStatus.RECEIVED, nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)


class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(36), nullable=True)
    metadata_info = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
