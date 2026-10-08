from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class PerformanceAnalysisResponse(BaseModel):
    id: str
    organization_id: str
    period_start: datetime
    period_end: datetime
    summary: str
    top_hooks: List[Dict[str, Any]]
    top_formats: List[Dict[str, Any]]
    weak_patterns: List[Dict[str, Any]]
    audience_insights: Dict[str, Any]
    key_takeaways: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OptimizationRecommendationResponse(BaseModel):
    id: str
    organization_id: str
    category: str
    title: str
    recommendation_text: str
    rationale: str
    expected_impact: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UpdateRecommendationStatusRequest(BaseModel):
    status: str  # applied, dismissed
