from abc import ABC, abstractmethod
from typing import Optional
from pydantic import BaseModel


class VideoJobResult(BaseModel):
    provider_job_id: str
    status: str  # pending, processing, completed, failed
    progress: int = 0
    video_url: Optional[str] = None
    error: Optional[str] = None


class VideoProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def create_video_job(
        self, prompt: str, aspect_ratio: str = "9:16", duration_seconds: int = 5
    ) -> VideoJobResult:
        """Starts asynchronous video generation task."""
        pass

    @abstractmethod
    async def check_status(self, provider_job_id: str) -> VideoJobResult:
        """Queries the provider for job status."""
        pass
