from typing import List
from sqlalchemy.orm import Session
from apps.api.models.optimization import OptimizationRecommendation


class OptimizationService:
    @staticmethod
    def seed_default_recommendations_if_empty(db: Session, organization_id: str):
        existing = db.query(OptimizationRecommendation).filter(
            OptimizationRecommendation.organization_id == organization_id
        ).count()
        if existing == 0:
            defaults = [
                OptimizationRecommendation(
                    organization_id=organization_id,
                    category="hook",
                    title="Adopt Curiosity Gap in Short-Form Videos",
                    recommendation_text="Cut the first 3 seconds of speaker introduction and open immediately with an unresolved dilemma or shocking metric.",
                    rationale="Your videos with immediate pattern interrupts experienced 42% higher 5-second completion rates.",
                    expected_impact="High",
                    status="pending",
                ),
                OptimizationRecommendation(
                    organization_id=organization_id,
                    category="posting_time",
                    title="Shift TikTok Posting Window to 11:30 AM EST",
                    recommendation_text="Audience interaction peaks sharply between 11:30 AM and 1:00 PM EST on weekdays.",
                    rationale="Historical engagement was 1.8x higher when published prior to lunchtime consumption spikes.",
                    expected_impact="Medium",
                    status="pending",
                ),
                OptimizationRecommendation(
                    organization_id=organization_id,
                    category="cta",
                    title="Transition from 'Follow for more' to 'Save this checklist'",
                    recommendation_text="Direct viewers to bookmark actionable cheat sheets rather than passive follow requests.",
                    rationale="Instagram's algorithm gives 3x algorithmic weight to saves compared to likes.",
                    expected_impact="High",
                    status="pending",
                ),
            ]
            db.add_all(defaults)
            db.commit()

    @staticmethod
    def get_recommendations(db: Session, organization_id: str) -> List[OptimizationRecommendation]:
        OptimizationService.seed_default_recommendations_if_empty(db, organization_id)
        return (
            db.query(OptimizationRecommendation)
            .filter(OptimizationRecommendation.organization_id == organization_id)
            .all()
        )

    @staticmethod
    def update_status(db: Session, recommendation_id: str, status: str) -> OptimizationRecommendation:
        rec = db.query(OptimizationRecommendation).filter(OptimizationRecommendation.id == recommendation_id).first()
        if rec:
            rec.status = status
            db.commit()
            db.refresh(rec)
        return rec
