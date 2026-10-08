import enum
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class PostStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PROCESSING = "processing"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ScheduledPost(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scheduled_posts"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    social_account_id = Column(String(36), ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    media_asset_id = Column(String(36), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="SET NULL"), nullable=True)
    
    caption = Column(Text, nullable=False)
    scheduled_for = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(Enum(PostStatus), default=PostStatus.SCHEDULED, nullable=False, index=True)
    idempotency_key = Column(String(255), unique=True, index=True, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    last_error = Column(Text, nullable=True)
    settings_override = Column(JSON, default=dict)

    social_account = relationship("SocialAccount", back_populates="scheduled_posts")
    published_post = relationship("PublishedPost", back_populates="scheduled_post", uselist=False)
    calendar_item = relationship("CalendarItem", back_populates="scheduled_post", uselist=False, cascade="all, delete-orphan")


class PublishedPost(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "published_posts"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_post_id = Column(String(36), ForeignKey("scheduled_posts.id", ondelete="SET NULL"), nullable=True, index=True)
    social_account_id = Column(String(36), ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    platform_post_id = Column(String(255), nullable=False, index=True)
    published_url = Column(String(1024), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=False)
    raw_response = Column(JSON, default=dict)

    scheduled_post = relationship("ScheduledPost", back_populates="published_post")
    social_account = relationship("SocialAccount", back_populates="published_posts")
    post_analytics = relationship("PostAnalytics", back_populates="published_post", uselist=False, cascade="all, delete-orphan")
