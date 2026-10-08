from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org
from apps.api.core.exceptions import NotFoundError
from apps.api.models.user import User, Organization
from apps.api.models.video import VideoGeneration, VideoGenerationStatus
from apps.api.domains.video.factory import get_video_provider
from apps.api.domains.credits.service import CreditService
from apps.api.schemas.video import VideoGenerationRequest, VideoGenerationResponse

router = APIRouter(prefix="/video", tags=["AI Video Generation"])


@router.post("/generate", response_model=VideoGenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_video_generation(
    req: VideoGenerationRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Deduct 30 credits for AI video generation
    CreditService.deduct_credits(
        db,
        org.id,
        amount=30,
        description=f"AI Video Generation: {req.prompt[:30]}",
        reference_type="video_generation",
    )

    provider = get_video_provider(req.provider)
    job_result = await provider.create_video_job(
        prompt=req.prompt,
        aspect_ratio=req.aspect_ratio,
        duration_seconds=req.duration_seconds,
    )

    now = datetime.now(timezone.utc)
    status_enum = VideoGenerationStatus.COMPLETED if job_result.status == "completed" else VideoGenerationStatus.PROCESSING

    video_record = VideoGeneration(
        organization_id=org.id,
        user_id=user.id,
        script_id=req.script_id,
        media_asset_id=req.media_asset_id,
        prompt=req.prompt,
        provider=provider.provider_name,
        provider_job_id=job_result.provider_job_id,
        status=status_enum,
        progress=job_result.progress,
        video_url=job_result.video_url,
        aspect_ratio=req.aspect_ratio,
        duration_seconds=req.duration_seconds,
        completed_at=now if status_enum == VideoGenerationStatus.COMPLETED else None,
    )
    db.add(video_record)
    db.commit()
    db.refresh(video_record)
    return video_record


@router.get("", response_model=List[VideoGenerationResponse])
def get_video_generations(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(VideoGeneration)
        .filter(VideoGeneration.organization_id == org.id)
        .order_by(VideoGeneration.created_at.desc())
        .all()
    )


@router.get("/{generation_id}", response_model=VideoGenerationResponse)
async def get_video_status(
    generation_id: str,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    video = (
        db.query(VideoGeneration)
        .filter(VideoGeneration.id == generation_id, VideoGeneration.organization_id == org.id)
        .first()
    )
    if not video:
        raise NotFoundError("Video generation not found")

    if video.status == VideoGenerationStatus.PROCESSING and video.provider_job_id:
        provider = get_video_provider(video.provider)
        status_res = await provider.check_status(video.provider_job_id)
        video.progress = status_res.progress
        if status_res.status == "completed":
            video.status = VideoGenerationStatus.COMPLETED
            video.video_url = status_res.video_url
            video.completed_at = datetime.now(timezone.utc)
        elif status_res.status == "failed":
            video.status = VideoGenerationStatus.FAILED
            video.error_message = status_res.error
        db.commit()
        db.refresh(video)

    return video
