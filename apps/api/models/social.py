import enum
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class SocialPlatformEnum(str, enum.Enum):
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"
    LINKEDIN = "linkedin"
    X = "x"


class AccountStatus(str, enum.Enum):
    CONNECTED = "connected"
    EXPIRED = "expired"
    ERROR = "error"
    DISCONNECTED = "disconnected"


class SocialAccount(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "social_accounts"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    platform = Column(Enum(SocialPlatformEnum), nullable=False)
    platform_user_id = Column(String(255), nullable=False)
    account_name = Column(String(255), nullable=False)
    account_handle = Column(String(255), nullable=True)
    profile_picture_url = Column(String(1024), nullable=True)
    status = Column(Enum(AccountStatus), default=AccountStatus.CONNECTED, nullable=False)
    metadata_info = Column(JSON, default=dict)

    credentials = relationship("SocialCredential", back_populates="account", uselist=False, cascade="all, delete-orphan")
    scheduled_posts = relationship("ScheduledPost", back_populates="social_account")
    published_posts = relationship("PublishedPost", back_populates="social_account")
    analytics_snapshots = relationship("AnalyticsSnapshot", back_populates="social_account", cascade="all, delete-orphan")


class SocialCredential(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "social_credentials"

    account_id = Column(String(36), ForeignKey("social_accounts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    encrypted_access_token = Column(Text, nullable=False)
    encrypted_refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    scopes = Column(JSON, default=list)

    account = relationship("SocialAccount", back_populates="credentials")
