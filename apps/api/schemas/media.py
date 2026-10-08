from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MediaAssetResponse(BaseModel):
    id: str
    organization_id: str
    filename: str
    file_key: str
    mime_type: str
    file_size: int
    storage_provider: str
    url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
