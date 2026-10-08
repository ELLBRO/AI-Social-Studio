from apps.api.models.social import SocialPlatformEnum
from apps.api.domains.social.base import SocialAdapter
from apps.api.domains.social.adapters.mock_adapter import MockSocialAdapter
from apps.api.domains.social.adapters.instagram_adapter import InstagramAdapter
from apps.api.domains.social.adapters.tiktok_adapter import TikTokAdapter
from apps.api.domains.social.adapters.youtube_adapter import YouTubeAdapter
from apps.api.domains.social.adapters.linkedin_adapter import LinkedInAdapter
from apps.api.domains.social.adapters.x_adapter import XAdapter
from apps.api.core.config import settings


def _is_real_key(val: str) -> bool:
    return bool(val) and "placeholder" not in val.lower()


def get_social_adapter(platform: SocialPlatformEnum) -> SocialAdapter:
    if platform == SocialPlatformEnum.INSTAGRAM and _is_real_key(settings.META_CLIENT_ID):
        return InstagramAdapter()
    elif platform == SocialPlatformEnum.TIKTOK and _is_real_key(settings.TIKTOK_CLIENT_KEY):
        return TikTokAdapter()
    elif platform == SocialPlatformEnum.YOUTUBE and _is_real_key(settings.GOOGLE_CLIENT_ID):
        return YouTubeAdapter()
    elif platform == SocialPlatformEnum.LINKEDIN and _is_real_key(settings.LINKEDIN_CLIENT_ID):
        return LinkedInAdapter()
    elif platform == SocialPlatformEnum.X and _is_real_key(settings.X_CLIENT_ID):
        return XAdapter()

    # Fallback to Mock adapter when credentials are placeholders or absent
    return MockSocialAdapter(platform=platform)
