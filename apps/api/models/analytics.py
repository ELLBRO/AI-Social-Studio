from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class AnalyticsSnapshot(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "analytics_snapshots"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    social_account_id = Column(String(36), ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    snapshot_date = Column(DateTime(timezone=True), nullable=False, index=True)
    followers_count = Column(Integer, default=0, nullable=False)
    following_count = Column(Integer, default=0, nullable=False)
    total_posts = Column(Integer, default=0, nullable=False)
    engagement_rate = Column(Float, default=0.0, nullable=False)
    raw_data = Column(JSON, default=dict)

    social_account = relationship("SocialAccount", back_populates="analytics_snapshots")


class PostAnalytics(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "post_analytics"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    published_post_id = Column(String(36), ForeignKey("published_posts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    impressions = Column(Integer, default=0, nullable=False)
    reach = Column(Integer, default=0, nullable=False)
    views = Column(Integer, default=0, nullable=False)
    likes = Column(Integer, default=0, nullable=False)
    comments = Column(Integer, default=0, nullable=False)
    shares = Column(Integer, default=0, nullable=False)
    saves = Column(Integer, default=0, nullable=False)
    engagement_rate = Column(Float, default=0.0, nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

    published_post = relationship("PublishedPost", back_populates="post_analytics")
