import enum
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, DateTime
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class VideoGenerationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class VideoGeneration(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "video_generations"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    script_id = Column(String(36), ForeignKey("scripts.id", ondelete="SET NULL"), nullable=True)
    media_asset_id = Column(String(36), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    prompt = Column(Text, nullable=False)
    provider = Column(String(50), default="mock", nullable=False)  # runway, luma, replicate, mock
    provider_job_id = Column(String(255), nullable=True, index=True)
    status = Column(Enum(VideoGenerationStatus), default=VideoGenerationStatus.PENDING, nullable=False)
    progress = Column(Integer, default=0, nullable=False)  # 0 to 100 percentage
    video_url = Column(String(1024), nullable=True)
    error_message = Column(Text, nullable=True)
    aspect_ratio = Column(String(20), default="9:16", nullable=False)  # 9:16 (shorts/reels), 16:9, 1:1
    duration_seconds = Column(Integer, default=5, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
