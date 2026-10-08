from typing import Optional
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import ContentStrategyRequest, ContentStrategyResponse


class ContentStrategyService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_strategy(self, req: ContentStrategyRequest) -> ContentStrategyResponse:
        prompt = f"""
You are the world's leading social media growth strategist.
Create a high-impact content strategy for:
Brand Name: {req.brand_name}
Niche: {req.niche}
Target Audience: {req.target_audience}
Business Goals: {', '.join(req.goals)}
Primary Platforms: {', '.join(req.platforms)}
Brand Tone: {req.tone}
Posting Cadence: {req.posting_cadence}

Produce actionable pillars, positioning, themes, cadence, and tips.
"""
        config = AIRequestConfig(
            system_prompt="You generate data-driven organic social growth strategies for US businesses.",
            temperature=0.7,
        )
        res = await self.provider.generate_structured(prompt, ContentStrategyResponse, config)
        if res.parsed_json and "pillars" in res.parsed_json:
            return ContentStrategyResponse(**res.parsed_json)

        # Fallback guarantee
        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, ContentStrategyResponse, config)
        return ContentStrategyResponse(**fallback_res.parsed_json)
