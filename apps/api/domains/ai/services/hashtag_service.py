from typing import Optional
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import HashtagRequest, HashtagResponse


class HashtagGenerationService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_hashtags(self, req: HashtagRequest) -> HashtagResponse:
        prompt = f"""
Generate tiered hashtag strategy for:
Niche: {req.niche}
Platform: {req.platform}
Topic Focus: {req.topic or 'General niche keywords'}

Return overall tags list and segmented tiers:
- High Reach (>1M posts)
- Medium Reach (100k-1M posts)
- Niche / Low Competition (<100k posts)
"""
        config = AIRequestConfig(
            system_prompt="You are an SEO and hashtag optimization expert for social platforms.",
            temperature=0.6,
        )
        res = await self.provider.generate_structured(prompt, HashtagResponse, config)
        if res.parsed_json and "tags" in res.parsed_json:
            return HashtagResponse(**res.parsed_json)

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, HashtagResponse, config)
        return HashtagResponse(**fallback_res.parsed_json)
