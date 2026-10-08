from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_org
from apps.api.core.exceptions import NotFoundError
from apps.api.models.user import Organization
from apps.api.models.optimization import PerformanceAnalysis, OptimizationRecommendation
from apps.api.domains.ai.services.analysis_service import PerformanceAnalysisService
from apps.api.domains.analytics.service import AnalyticsService
from apps.api.domains.optimization.service import OptimizationService
from apps.api.domains.credits.service import CreditService
from apps.api.schemas.optimization import (
    PerformanceAnalysisResponse,
    OptimizationRecommendationResponse,
    UpdateRecommendationStatusRequest,
)

router = APIRouter(prefix="/optimization", tags=["AI Optimization & Recommendations"])


@router.post("/analyze", response_model=PerformanceAnalysisResponse)
async def run_performance_analysis(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=10, description="AI Performance & Retention Analysis", reference_type="analysis"
    )

    overview = AnalyticsService.get_overview(db, org.id)
    now = datetime.now(timezone.utc)
    period_start = now - timedelta(days=30)

    service = PerformanceAnalysisService()
    analysis = await service.analyze_performance(
        organization_id=org.id,
        metrics_summary=overview.model_dump(),
        recent_posts=overview.top_performing_posts,
        period_start=period_start,
        period_end=now,
    )

    record = PerformanceAnalysis(
        organization_id=org.id,
        period_start=period_start,
        period_end=now,
        summary=analysis.summary,
        top_hooks=analysis.top_hooks,
        top_formats=analysis.top_formats,
        weak_patterns=analysis.weak_patterns,
        audience_insights=analysis.audience_insights,
        key_takeaways=analysis.key_takeaways,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    analysis.id = record.id

    return analysis


@router.get("/recommendations", response_model=List[OptimizationRecommendationResponse])
def get_recommendations(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return OptimizationService.get_recommendations(db, org.id)


@router.put("/recommendations/{recommendation_id}/status", response_model=OptimizationRecommendationResponse)
def update_recommendation_status(
    recommendation_id: str,
    req: UpdateRecommendationStatusRequest,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    rec = OptimizationService.update_status(db, recommendation_id, req.status)
    if not rec:
        raise NotFoundError("Recommendation not found")
    return rec
