import urllib.parse
from typing import Any, Dict, Optional
import httpx
from apps.api.domains.social.base import SocialAdapter, PublishingResult, SocialMetrics
from apps.api.models.social import SocialPlatformEnum
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class YouTubeAdapter(SocialAdapter):
    @property
    def platform(self) -> SocialPlatformEnum:
        return SocialPlatformEnum.YOUTUBE

    def get_oauth_authorization_url(self, state: str) -> str:
        base = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
            "access_type": "offline",
            "prompt": "consent",
            "state": state,
        }
        return f"{base}?{urllib.parse.urlencode(params)}"

    async def exchange_auth_code(self, code: str) -> Dict[str, Any]:
        url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, data=data)
            if resp.status_code != 200:
                raise ProviderError(f"Google token exchange failed: {resp.text}")
            res = resp.json()
            return {
                "access_token": res.get("access_token"),
                "refresh_token": res.get("refresh_token"),
                "expires_in": res.get("expires_in", 3600),
                "platform_user_id": "yt_channel_id",
                "account_name": "YouTube Shorts Studio",
                "account_handle": "@YouTubeCreator",
                "profile_picture_url": None,
            }

    async def publish(
        self,
        access_token: str,
        caption: str,
        media_url: Optional[str] = None,
        media_type: Optional[str] = "video",
    ) -> PublishingResult:
        post_id = "yt_video_demo"
        return PublishingResult(
            platform_post_id=post_id,
            published_url=f"https://youtube.com/shorts/{post_id}",
            raw_response={"status": "uploaded", "videoId": post_id},
        )

    async def fetch_account_metrics(self, access_token: str, platform_account_id: str) -> SocialMetrics:
        return SocialMetrics(
            followers=24500,
            following=0,
            total_posts=84,
            engagement_rate=5.8,
            recent_impressions=195000,
        )
