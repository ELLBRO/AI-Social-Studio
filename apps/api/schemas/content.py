from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.content import ContentStatus


class ContentStrategyRequest(BaseModel):
    brand_name: str
    niche: str
    target_audience: str
    goals: List[str]
    platforms: List[str]
    tone: str = "authoritative yet relatable"
    posting_cadence: str = "daily"


class ContentPillar(BaseModel):
    title: str
    description: str
    sample_topics: List[str]
    target_format: str


class ContentStrategyResponse(BaseModel):
    pillars: List[ContentPillar]
    positioning_statement: str
    content_themes: List[str]
    recommended_cadence: str
    growth_tips: List[str]


class ContentIdeaRequest(BaseModel):
    niche: str
    topic: Optional[str] = None
    target_platform: str = "all"
    count: int = 5


class ContentIdeaResponse(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    angle: str
    target_audience: str
    estimated_engagement: str
    tags: List[str]


class HookRequest(BaseModel):
    topic: str
    hook_type: Optional[str] = "all"
    count: int = 5


class HookResponse(BaseModel):
    id: Optional[str] = None
    hook_text: str
    hook_type: str
    score: float


class ScriptRequest(BaseModel):
    topic: str
    hook: Optional[str] = None
    platform: str = "tiktok"
    target_duration_seconds: int = 45


class ScriptScene(BaseModel):
    scene_number: int
    visual_cue: str
    spoken_dialogue: str
    overlay_text: Optional[str] = None


class ScriptResponse(BaseModel):
    id: Optional[str] = None
    title: str
    full_text: str
    scenes: List[ScriptScene]
    duration_estimate: int


class CaptionRequest(BaseModel):
    topic_or_summary: str
    platform: str = "instagram"
    tone: str = "engaging"
    call_to_action: Optional[str] = None


class CaptionResponse(BaseModel):
    id: Optional[str] = None
    platform: str
    text: str
    call_to_action: Optional[str] = None
    character_count: int


class HashtagRequest(BaseModel):
    niche: str
    platform: str = "instagram"
    topic: Optional[str] = None


class HashtagTierSet(BaseModel):
    tier: str
    hashtags: List[str]


class HashtagResponse(BaseModel):
    niche: str
    platform: str
    tags: List[str]
    tiers: List[HashtagTierSet]


class ContentCreate(BaseModel):
    title: str
    content_type: str = "post"
    status: ContentStatus = ContentStatus.DRAFT
    data: Dict[str, Any] = {}
    tags: List[str] = []


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    content_type: Optional[str] = None
    status: Optional[ContentStatus] = None
    data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None


class ContentResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    content_type: str
    status: ContentStatus
    data: Dict[str, Any]
    tags: List[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
