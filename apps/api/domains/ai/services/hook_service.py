from typing import List, Optional
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import HookRequest, HookResponse


class HooksWrapper(BaseModel):
    hooks: List[HookResponse]


class HookGenerationService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_hooks(self, req: HookRequest) -> List[HookResponse]:
        prompt = f"""
Generate {req.count} viral short-form hooks for the topic: "{req.topic}".
Hook Type Category: {req.hook_type}

Ensure each hook is under 15 words, triggers curiosity or pattern interruption, and scores 1-10 on predicted virality.
"""
        config = AIRequestConfig(
            system_prompt="You are a master hook copywriter for TikTok, Reels, and YouTube Shorts.",
            temperature=0.85,
        )
        res = await self.provider.generate_structured(prompt, HooksWrapper, config)
        if res.parsed_json and "hooks" in res.parsed_json:
            return [HookResponse(**item) for item in res.parsed_json["hooks"]]

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, HooksWrapper, config)
        return [HookResponse(**item) for item in fallback_res.parsed_json["hooks"]]
