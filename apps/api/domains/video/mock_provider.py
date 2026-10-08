import uuid
from apps.api.domains.video.base import VideoProvider, VideoJobResult


class MockVideoProvider(VideoProvider):
    @property
    def provider_name(self) -> str:
        return "mock"

    async def create_video_job(
        self, prompt: str, aspect_ratio: str = "9:16", duration_seconds: int = 5
    ) -> VideoJobResult:
        job_id = f"mock-video-{uuid.uuid4().hex[:10]}"
        return VideoJobResult(
            provider_job_id=job_id,
            status="completed",
            progress=100,
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        )

    async def check_status(self, provider_job_id: str) -> VideoJobResult:
        return VideoJobResult(
            provider_job_id=provider_job_id,
            status="completed",
            progress=100,
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        )
