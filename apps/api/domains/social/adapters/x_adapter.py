import urllib.parse
from typing import Any, Dict, Optional
import httpx
from apps.api.domains.social.base import SocialAdapter, PublishingResult, SocialMetrics
from apps.api.models.social import SocialPlatformEnum
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class XAdapter(SocialAdapter):
    @property
    def platform(self) -> SocialPlatformEnum:
        return SocialPlatformEnum.X

    def get_oauth_authorization_url(self, state: str) -> str:
        base = "https://twitter.com/i/oauth2/authorize"
        params = {
            "response_type": "code",
            "client_id": settings.X_CLIENT_ID,
            "redirect_uri": settings.X_REDIRECT_URI,
            "scope": "tweet.read tweet.write users.read offline.access",
            "state": state,
            "code_challenge": "challenge",
            "code_challenge_method": "plain",
        }
        return f"{base}?{urllib.parse.urlencode(params)}"

    async def exchange_auth_code(self, code: str) -> Dict[str, Any]:
        return {
            "access_token": "x_access_token_demo",
            "refresh_token": "x_refresh_token_demo",
            "expires_in": 7200,
            "platform_user_id": "x_user_id",
            "account_name": "X Growth Handle",
            "account_handle": "@growth_hacks",
            "profile_picture_url": None,
        }

    async def publish(
        self,
        access_token: str,
        caption: str,
        media_url: Optional[str] = None,
        media_type: Optional[str] = "image",
    ) -> PublishingResult:
        post_id = "18400011223344"
        return PublishingResult(
            platform_post_id=post_id,
            published_url=f"https://x.com/growth_hacks/status/{post_id}",
            raw_response={"data": {"id": post_id, "text": caption}},
        )

    async def fetch_account_metrics(self, access_token: str, platform_account_id: str) -> SocialMetrics:
        return SocialMetrics(
            followers=31200,
            following=430,
            total_posts=450,
            engagement_rate=3.9,
            recent_impressions=112000,
        )
