from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.publishing import PostStatus
from apps.api.schemas.social import SocialAccountResponse


class SchedulePostRequest(BaseModel):
    social_account_id: str
    caption: str
    scheduled_for: datetime
    media_asset_id: Optional[str] = None
    content_id: Optional[str] = None
    settings_override: Optional[Dict[str, Any]] = None


class ScheduledPostResponse(BaseModel):
    id: str
    organization_id: str
    social_account_id: str
    media_asset_id: Optional[str] = None
    content_id: Optional[str] = None
    caption: str
    scheduled_for: datetime
    status: PostStatus
    idempotency_key: str
    retry_count: int
    last_error: Optional[str] = None
    social_account: Optional[SocialAccountResponse] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublishedPostResponse(BaseModel):
    id: str
    organization_id: str
    scheduled_post_id: Optional[str] = None
    social_account_id: str
    platform_post_id: str
    published_url: Optional[str] = None
    published_at: datetime
    raw_response: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
