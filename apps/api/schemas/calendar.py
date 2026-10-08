from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from apps.api.schemas.publishing import ScheduledPostResponse


class RescheduleRequest(BaseModel):
    new_scheduled_time: datetime
    timezone: Optional[str] = "UTC"


class CalendarItemResponse(BaseModel):
    id: str
    organization_id: str
    scheduled_post_id: str
    title: str
    scheduled_time: datetime
    timezone: str
    status: str
    scheduled_post: Optional[ScheduledPostResponse] = None

    model_config = ConfigDict(from_attributes=True)
