from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.social import SocialPlatformEnum, AccountStatus


class ConnectAccountRequest(BaseModel):
    platform: SocialPlatformEnum
    auth_code: Optional[str] = None
    account_name: Optional[str] = None
    account_handle: Optional[str] = None


class SocialAccountResponse(BaseModel):
    id: str
    organization_id: str
    platform: SocialPlatformEnum
    platform_user_id: str
    account_name: str
    account_handle: Optional[str] = None
    profile_picture_url: Optional[str] = None
    status: AccountStatus
    metadata_info: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
