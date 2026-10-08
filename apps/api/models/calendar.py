from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class CalendarItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "calendar_items"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_post_id = Column(String(36), ForeignKey("scheduled_posts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False, index=True)
    timezone = Column(String(100), default="UTC", nullable=False)
    status = Column(String(50), default="scheduled", nullable=False)

    scheduled_post = relationship("ScheduledPost", back_populates="calendar_item")
