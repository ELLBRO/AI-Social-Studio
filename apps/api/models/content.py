import enum
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base
from apps.api.models.base import UUIDMixin, TimestampMixin


class ContentStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEW = "review"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class AIRequest(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_requests"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    provider = Column(String(50), nullable=False)  # openai, anthropic, gemini, mock
    model = Column(String(100), nullable=False)
    task_type = Column(String(50), nullable=False)  # strategy, idea, hook, script, caption, hashtag, analysis
    prompt_tokens = Column(Integer, default=0, nullable=False)
    completion_tokens = Column(Integer, default=0, nullable=False)
    total_tokens = Column(Integer, default=0, nullable=False)
    estimated_cost = Column(Float, default=0.0, nullable=False)
    latency_ms = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="success", nullable=False)


class Content(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "contents"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False)
    content_type = Column(String(50), default="post", nullable=False)  # video, post, carousel, story, reel
    data = Column(JSON, default=dict)  # structured body, slides, sections
    tags = Column(JSON, default=list)

    captions = relationship("Caption", back_populates="content", cascade="all, delete-orphan")


class ContentIdea(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "content_ideas"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    angle = Column(String(255), nullable=True)
    target_audience = Column(String(255), nullable=True)
    estimated_engagement = Column(String(50), default="High", nullable=False)  # High, Viral, Steady
    tags = Column(JSON, default=list)
    status = Column(String(50), default="active", nullable=False)

    hooks = relationship("Hook", back_populates="idea", cascade="all, delete-orphan")
    scripts = relationship("Script", back_populates="idea", cascade="all, delete-orphan")


class Hook(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "hooks"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    idea_id = Column(String(36), ForeignKey("content_ideas.id", ondelete="CASCADE"), nullable=True, index=True)
    hook_text = Column(Text, nullable=False)
    hook_type = Column(String(100), default="curiosity", nullable=False)  # curiosity, contrarian, statistical, story, pain_point
    score = Column(Float, default=8.5, nullable=False)  # 1-10 virality prediction score

    idea = relationship("ContentIdea", back_populates="hooks")


class Script(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "scripts"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    idea_id = Column(String(36), ForeignKey("content_ideas.id", ondelete="CASCADE"), nullable=True, index=True)
    script_type = Column(String(50), default="short_form", nullable=False)  # short_form, explainer, story, promo
    scenes_or_sections = Column(JSON, default=list)
    full_text = Column(Text, nullable=False)
    duration_estimate = Column(Integer, default=45, nullable=False)  # seconds

    idea = relationship("ContentIdea", back_populates="scripts")


class Caption(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "captions"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    content_id = Column(String(36), ForeignKey("contents.id", ondelete="CASCADE"), nullable=True, index=True)
    platform = Column(String(50), nullable=False)  # instagram, tiktok, youtube, linkedin, x
    text = Column(Text, nullable=False)
    call_to_action = Column(String(255), nullable=True)
    character_count = Column(Integer, default=0, nullable=False)

    content = relationship("Content", back_populates="captions")


class Hashtag(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "hashtags"

    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    niche = Column(String(100), nullable=False)
    tags = Column(JSON, default=list)  # list of strings: ["#AI", "#SaaSGrowth"]
    platform = Column(String(50), nullable=False)
    reach_tier = Column(String(50), default="mixed", nullable=False)  # low_competition, medium, high_reach, mixed
