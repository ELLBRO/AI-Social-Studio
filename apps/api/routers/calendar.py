from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_org
from apps.api.core.exceptions import NotFoundError
from apps.api.models.user import Organization
from apps.api.models.calendar import CalendarItem
from apps.api.models.publishing import ScheduledPost
from apps.api.schemas.calendar import CalendarItemResponse, RescheduleRequest

router = APIRouter(prefix="/calendar", tags=["Content Calendar"])


@router.get("/items", response_model=List[CalendarItemResponse])
def get_calendar_items(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(CalendarItem)
        .filter(CalendarItem.organization_id == org.id)
        .order_by(CalendarItem.scheduled_time.asc())
        .all()
    )


@router.put("/items/{item_id}/reschedule", response_model=CalendarItemResponse)
def reschedule_item(
    item_id: str,
    req: RescheduleRequest,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CalendarItem)
        .filter(CalendarItem.id == item_id, CalendarItem.organization_id == org.id)
        .first()
    )
    if not item:
        raise NotFoundError("Calendar item not found")

    item.scheduled_time = req.new_scheduled_time
    if req.timezone:
        item.timezone = req.timezone

    # Synchronize associated ScheduledPost
    post = db.query(ScheduledPost).filter(ScheduledPost.id == item.scheduled_post_id).first()
    if post:
        post.scheduled_for = req.new_scheduled_time

    db.commit()
    db.refresh(item)
    return item
