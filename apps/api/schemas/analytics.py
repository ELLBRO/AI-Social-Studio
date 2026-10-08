from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class PostAnalyticsResponse(BaseModel):
    id: str
    organization_id: str
    published_post_id: str
    impressions: int
    reach: int
    views: int
    likes: int
    comments: int
    shares: int
    saves: int
    engagement_rate: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalyticsOverviewResponse(BaseModel):
    total_followers: int
    follower_growth_rate: float
    total_impressions: int
    total_views: int
    total_engagements: int
    avg_engagement_rate: float
    posts_published_count: int
    top_performing_posts: List[Dict[str, Any]]
    performance_by_platform: Dict[str, Dict[str, Any]]


class SnapshotResponse(BaseModel):
    id: str
    social_account_id: str
    snapshot_date: datetime
    followers_count: int
    following_count: int
    total_posts: int
    engagement_rate: float

    model_config = ConfigDict(from_attributes=True)
