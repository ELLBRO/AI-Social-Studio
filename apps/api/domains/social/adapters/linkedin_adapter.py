import urllib.parse
from typing import Any, Dict, Optional
import httpx
from apps.api.domains.social.base import SocialAdapter, PublishingResult, SocialMetrics
from apps.api.models.social import SocialPlatformEnum
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class LinkedInAdapter(SocialAdapter):
    @property
    def platform(self) -> SocialPlatformEnum:
        return SocialPlatformEnum.LINKEDIN

    def get_oauth_authorization_url(self, state: str) -> str:
        base = "https://www.linkedin.com/oauth/v2/authorization"
        params = {
            "response_type": "code",
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "state": state,
            "scope": "openid profile email w_member_social",
        }
        return f"{base}?{urllib.parse.urlencode(params)}"

    async def exchange_auth_code(self, code: str) -> Dict[str, Any]:
        url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, data=data)
            if resp.status_code != 200:
                raise ProviderError(f"LinkedIn token exchange failed: {resp.text}")
            res = resp.json()
            return {
                "access_token": res.get("access_token"),
                "refresh_token": res.get("refresh_token"),
                "expires_in": res.get("expires_in", 5184000),
                "platform_user_id": "urn:li:person:demo",
                "account_name": "LinkedIn Thought Leader",
                "account_handle": "in/thoughtleader",
                "profile_picture_url": None,
            }

    async def publish(
        self,
        access_token: str,
        caption: str,
        media_url: Optional[str] = None,
        media_type: Optional[str] = "image",
    ) -> PublishingResult:
        post_id = "urn:li:share:123456789"
        return PublishingResult(
            platform_post_id=post_id,
            published_url=f"https://www.linkedin.com/feed/update/{post_id}",
            raw_response={"id": post_id},
        )

    async def fetch_account_metrics(self, access_token: str, platform_account_id: str) -> SocialMetrics:
        return SocialMetrics(
            followers=15400,
            following=890,
            total_posts=112,
            engagement_rate=4.7,
            recent_impressions=68000,
        )
