from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.video import VideoGenerationStatus


class VideoGenerationRequest(BaseModel):
    prompt: str
    script_id: Optional[str] = None
    media_asset_id: Optional[str] = None
    aspect_ratio: str = "9:16"
    duration_seconds: int = 5
    provider: Optional[str] = None


class VideoGenerationResponse(BaseModel):
    id: str
    organization_id: str
    prompt: str
    provider: str
    provider_job_id: Optional[str] = None
    status: VideoGenerationStatus
    progress: int
    video_url: Optional[str] = None
    error_message: Optional[str] = None
    aspect_ratio: str
    duration_seconds: int
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
