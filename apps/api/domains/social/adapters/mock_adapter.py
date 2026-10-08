import uuid
from typing import Any, Dict, Optional
from apps.api.domains.social.base import SocialAdapter, PublishingResult, SocialMetrics
from apps.api.models.social import SocialPlatformEnum


class MockSocialAdapter(SocialAdapter):
    def __init__(self, platform: SocialPlatformEnum = SocialPlatformEnum.INSTAGRAM):
        self._platform = platform

    @property
    def platform(self) -> SocialPlatformEnum:
        return self._platform

    def get_oauth_authorization_url(self, state: str) -> str:
        return f"https://auth.example.com/oauth/{self.platform.value}?state={state}"

    async def exchange_auth_code(self, code: str) -> Dict[str, Any]:
        return {
            "access_token": f"mock_token_{uuid.uuid4().hex}",
            "refresh_token": f"mock_refresh_{uuid.uuid4().hex}",
            "expires_in": 5184000,  # 60 days
            "platform_user_id": f"uid_{uuid.uuid4().hex[:8]}",
            "account_name": f"{self.platform.value.capitalize()} Creator Studio",
            "account_handle": f"@{self.platform.value}_creator",
            "profile_picture_url": f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        }

    async def publish(
        self,
        access_token: str,
        caption: str,
        media_url: Optional[str] = None,
        media_type: Optional[str] = "image",
    ) -> PublishingResult:
        post_id = f"{self.platform.value}_post_{uuid.uuid4().hex[:12]}"
        return PublishingResult(
            platform_post_id=post_id,
            published_url=f"https://{self.platform.value}.com/p/{post_id}",
            raw_response={"status": "published", "post_id": post_id, "platform": self.platform.value},
        )

    async def fetch_account_metrics(self, access_token: str, platform_account_id: str) -> SocialMetrics:
        metrics_by_platform = {
            SocialPlatformEnum.INSTAGRAM: (48200, 420, 184, 5.4, 210000),
            SocialPlatformEnum.TIKTOK: (124000, 180, 240, 8.2, 850000),
            SocialPlatformEnum.YOUTUBE: (35600, 12, 95, 6.8, 145000),
            SocialPlatformEnum.LINKEDIN: (18900, 890, 142, 4.1, 78000),
            SocialPlatformEnum.X: (29400, 410, 520, 3.6, 95000),
            SocialPlatformEnum.FACEBOOK: (15200, 32, 110, 2.9, 42000),
        }
        followers, following, posts, eng, imps = metrics_by_platform.get(
            self.platform, (25000, 100, 50, 4.0, 100000)
        )
        return SocialMetrics(
            followers=followers,
            following=following,
            total_posts=posts,
            engagement_rate=eng,
            recent_impressions=imps,
            raw_data={"synced": True},
        )
