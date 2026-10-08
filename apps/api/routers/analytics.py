from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_org
from apps.api.models.user import Organization
from apps.api.models.analytics import AnalyticsSnapshot
from apps.api.domains.analytics.service import AnalyticsService
from apps.api.schemas.analytics import AnalyticsOverviewResponse, SnapshotResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_overview(db, org.id)


@router.post("/sync", response_model=List[SnapshotResponse])
async def sync_analytics(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    snapshots = await AnalyticsService.sync_account_snapshots(db, org.id)
    return snapshots


@router.get("/snapshots", response_model=List[SnapshotResponse])
def get_snapshots(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(AnalyticsSnapshot)
        .filter(AnalyticsSnapshot.organization_id == org.id)
        .order_by(AnalyticsSnapshot.snapshot_date.desc())
        .limit(30)
        .all()
    )
