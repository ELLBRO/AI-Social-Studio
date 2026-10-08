from typing import Optional
from apps.api.core.config import settings
from apps.api.domains.video.base import VideoProvider
from apps.api.domains.video.mock_provider import MockVideoProvider
from apps.api.domains.video.runway_provider import RunwayVideoProvider


def _is_real_key(val: str) -> bool:
    return bool(val) and "placeholder" not in val.lower()


def get_video_provider(provider_name: Optional[str] = None) -> VideoProvider:
    name = (provider_name or settings.DEFAULT_VIDEO_PROVIDER).lower()
    if name == "runway" and _is_real_key(settings.RUNWAY_API_KEY):
        return RunwayVideoProvider()
    return MockVideoProvider()
