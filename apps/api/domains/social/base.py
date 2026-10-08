from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel
from apps.api.models.social import SocialPlatformEnum


class PublishingResult(BaseModel):
    platform_post_id: str
    published_url: Optional[str] = None
    raw_response: Dict[str, Any] = {}


class SocialMetrics(BaseModel):
    followers: int
    following: int = 0
    total_posts: int = 0
    engagement_rate: float = 0.0
    recent_impressions: int = 0
    raw_data: Dict[str, Any] = {}


class SocialAdapter(ABC):
    @property
    @abstractmethod
    def platform(self) -> SocialPlatformEnum:
        pass

    @abstractmethod
    def get_oauth_authorization_url(self, state: str) -> str:
        """Returns official platform OAuth redirect URL."""
        pass

    @abstractmethod
    async def exchange_auth_code(self, code: str) -> Dict[str, Any]:
        """Exchanges auth code for tokens and basic profile details."""
        pass

    @abstractmethod
    async def publish(
        self,
        access_token: str,
        caption: str,
        media_url: Optional[str] = None,
        media_type: Optional[str] = "image",
    ) -> PublishingResult:
        """Publishes post idempotently via official platform API."""
        pass

    @abstractmethod
    async def fetch_account_metrics(self, access_token: str, platform_account_id: str) -> SocialMetrics:
        """Retrieves audience & engagement metrics."""
        pass
