from typing import Optional
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import CaptionRequest, CaptionResponse


class CaptionGenerationService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_caption(self, req: CaptionRequest) -> CaptionResponse:
        prompt = f"""
Write a high-converting caption for:
Summary/Topic: {req.topic_or_summary}
Platform: {req.platform}
Tone: {req.tone}
Call To Action: {req.call_to_action or 'Engaging comment question'}

Include text, platform, call_to_action, and calculate character_count.
"""
        config = AIRequestConfig(
            system_prompt="You write scroll-stopping captions formatted specifically for each platform algorithm.",
            temperature=0.7,
        )
        res = await self.provider.generate_structured(prompt, CaptionResponse, config)
        if res.parsed_json and "text" in res.parsed_json:
            item = res.parsed_json
            item["character_count"] = len(item.get("text", ""))
            return CaptionResponse(**item)

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, CaptionResponse, config)
        return CaptionResponse(**fallback_res.parsed_json)
