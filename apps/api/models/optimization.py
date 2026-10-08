from sqlalchemy import Column, String, ForeignKey, DateTime, Text, JSON
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class PerformanceAnalysis(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "performance_analyses"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    summary = Column(Text, nullable=False)
    top_hooks = Column(JSON, default=list)
    top_formats = Column(JSON, default=list)
    weak_patterns = Column(JSON, default=list)
    audience_insights = Column(JSON, default=dict)
    key_takeaways = Column(JSON, default=list)


class OptimizationRecommendation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "optimization_recommendations"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(100), nullable=False)  # hook, format, posting_time, cta, topic
    title = Column(String(255), nullable=False)
    recommendation_text = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    expected_impact = Column(String(50), default="Medium", nullable=False)  # High, Medium, Low
    status = Column(String(50), default="pending", nullable=False)  # pending, applied, dismissed
