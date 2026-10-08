from typing import List, Optional
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import ContentIdeaRequest, ContentIdeaResponse


class IdeasWrapper(BaseModel):
    ideas: List[ContentIdeaResponse]


class ContentIdeaService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_ideas(self, req: ContentIdeaRequest) -> List[ContentIdeaResponse]:
        prompt = f"""
Generate {req.count} high-performing viral content ideas for:
Niche: {req.niche}
Specific Topic Focus: {req.topic or 'Broad trending topics in this niche'}
Target Platform: {req.target_platform}

Each idea must have an angle, target audience, estimated engagement tier, and tags.
"""
        config = AIRequestConfig(
            system_prompt="You generate viral, retention-engineered social content ideas.",
            temperature=0.8,
        )
        res = await self.provider.generate_structured(prompt, IdeasWrapper, config)
        if res.parsed_json and "ideas" in res.parsed_json:
            return [ContentIdeaResponse(**item) for item in res.parsed_json["ideas"]]

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, IdeasWrapper, config)
        return [ContentIdeaResponse(**item) for item in fallback_res.parsed_json["ideas"]]
