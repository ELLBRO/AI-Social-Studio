import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org
from apps.api.core.exceptions import NotFoundError, AppException
from apps.api.models.user import User, Organization
from apps.api.models.publishing import ScheduledPost, PublishedPost, PostStatus
from apps.api.models.calendar import CalendarItem
from apps.api.domains.publishing.service import PublishingService
from apps.api.schemas.publishing import (
    SchedulePostRequest,
    ScheduledPostResponse,
    PublishedPostResponse,
)

router = APIRouter(prefix="/publishing", tags=["Publishing & Scheduling"])


@router.post("/schedule", response_model=ScheduledPostResponse, status_code=status.HTTP_201_CREATED)
def schedule_post(
    req: SchedulePostRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    idempotency_key = f"sched_{uuid.uuid4().hex}"
    post = ScheduledPost(
        organization_id=org.id,
        user_id=user.id,
        social_account_id=req.social_account_id,
        media_asset_id=req.media_asset_id,
        content_id=req.content_id,
        caption=req.caption,
        scheduled_for=req.scheduled_for,
        status=PostStatus.SCHEDULED,
        idempotency_key=idempotency_key,
        settings_override=req.settings_override or {},
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    # Automatically create calendar item
    cal_item = CalendarItem(
        organization_id=org.id,
        scheduled_post_id=post.id,
        title=req.caption[:40] + ("..." if len(req.caption) > 40 else ""),
        scheduled_time=req.scheduled_for,
        timezone="UTC",
        status="scheduled",
    )
    db.add(cal_item)
    db.commit()

    return post


@router.get("/scheduled", response_model=List[ScheduledPostResponse])
def get_scheduled_posts(
    status_filter: Optional[PostStatus] = None,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    query = db.query(ScheduledPost).filter(ScheduledPost.organization_id == org.id)
    if status_filter:
        query = query.filter(ScheduledPost.status == status_filter)
    return query.order_by(ScheduledPost.scheduled_for.asc()).all()


@router.post("/publish-now/{post_id}", response_model=PublishedPostResponse)
async def publish_now(
    post_id: str,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    post = (
        db.query(ScheduledPost)
        .filter(ScheduledPost.id == post_id, ScheduledPost.organization_id == org.id)
        .first()
    )
    if not post:
        raise NotFoundError("Scheduled post not found")

    published = await PublishingService.publish_scheduled_post(db, post.id)
    return published


@router.get("/published", response_model=List[PublishedPostResponse])
def get_published_posts(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(PublishedPost)
        .filter(PublishedPost.organization_id == org.id)
        .order_by(PublishedPost.published_at.desc())
        .all()
    )
