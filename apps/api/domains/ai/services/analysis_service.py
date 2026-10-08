from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.optimization import PerformanceAnalysisResponse


class PerformanceAnalysisService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def analyze_performance(
        self,
        organization_id: str,
        metrics_summary: Dict[str, Any],
        recent_posts: List[Dict[str, Any]],
        period_start: datetime,
        period_end: datetime,
    ) -> PerformanceAnalysisResponse:
        prompt = f"""
Analyze this social media performance data:
Metrics Summary: {metrics_summary}
Recent Posts and Analytics: {recent_posts}

Extract:
1. Executive summary
2. Top performing hooks and why they won
3. Top formats (e.g. video lengths, styles)
4. Weak patterns to eliminate
5. Audience behavior insights
6. 3 immediately actionable takeaways
"""
        config = AIRequestConfig(
            system_prompt="You are an elite viral data scientist dissecting social video retention and engagement algorithms.",
            temperature=0.7,
        )
        res = await self.provider.generate_structured(prompt, PerformanceAnalysisResponse, config)
        now = datetime.now(timezone.utc)
        if res.parsed_json and "summary" in res.parsed_json:
            data = res.parsed_json
            data["id"] = data.get("id") or "analysis-" + str(int(now.timestamp()))
            data["organization_id"] = organization_id
            data["period_start"] = period_start
            data["period_end"] = period_end
            data["created_at"] = now
            return PerformanceAnalysisResponse(**data)

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, PerformanceAnalysisResponse, config)
        data = fallback_res.parsed_json
        data["id"] = "analysis-" + str(int(now.timestamp()))
        data["organization_id"] = organization_id
        data["period_start"] = period_start
        data["period_end"] = period_end
        data["created_at"] = now
        return PerformanceAnalysisResponse(**data)
