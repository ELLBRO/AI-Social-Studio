from typing import Optional
import httpx
from apps.api.domains.video.base import VideoProvider, VideoJobResult
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class RunwayVideoProvider(VideoProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.RUNWAY_API_KEY
        self.base_url = "https://api.dev.runwayml.com/v1"

    @property
    def provider_name(self) -> str:
        return "runway"

    async def create_video_job(
        self, prompt: str, aspect_ratio: str = "9:16", duration_seconds: int = 5
    ) -> VideoJobResult:
        if not self.api_key:
            raise ProviderError("Runway API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-Runway-Version": "2024-09-13",
            "Content-Type": "application/json",
        }
        payload = {
            "promptText": prompt,
            "model": "gen3a_turbo",
            "ratio": "768:1280" if aspect_ratio == "9:16" else "1280:768",
            "duration": duration_seconds,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(f"{self.base_url}/image_to_video", headers=headers, json=payload)
            if resp.status_code != 200:
                raise ProviderError(f"Runway error: {resp.text}")
            data = resp.json()
            return VideoJobResult(
                provider_job_id=data.get("id"),
                status="pending",
                progress=0,
            )

    async def check_status(self, provider_job_id: str) -> VideoJobResult:
        if not self.api_key:
            raise ProviderError("Runway API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-Runway-Version": "2024-09-13",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(f"{self.base_url}/tasks/{provider_job_id}", headers=headers)
            if resp.status_code != 200:
                raise ProviderError(f"Runway check error: {resp.text}")
            data = resp.json()
            status_map = {
                "PENDING": "pending",
                "THROTTLED": "pending",
                "RUNNING": "processing",
                "SUCCEEDED": "completed",
                "FAILED": "failed",
                "CANCELLED": "cancelled",
            }
            status = status_map.get(data.get("status"), "processing")
            output_url = data.get("output", [None])[0] if data.get("output") else None
            return VideoJobResult(
                provider_job_id=provider_job_id,
                status=status,
                progress=int(data.get("progressRatio", 0.0) * 100),
                video_url=output_url,
                error=data.get("failureReason"),
            )
