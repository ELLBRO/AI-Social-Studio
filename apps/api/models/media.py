from sqlalchemy import Column, String, Integer, ForeignKey
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class MediaAsset(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "media_assets"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_key = Column(String(512), nullable=False, index=True)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, default=0, nullable=False)  # in bytes
    storage_provider = Column(String(50), default="local", nullable=False)  # local, s3
    url = Column(String(1024), nullable=False)
    thumbnail_url = Column(String(1024), nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds for videos
