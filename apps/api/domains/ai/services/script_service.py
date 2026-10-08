from typing import Optional
from apps.api.domains.ai.base import AIProvider, AIRequestConfig
from apps.api.domains.ai.factory import get_ai_provider
from apps.api.schemas.content import ScriptRequest, ScriptResponse


class ScriptGenerationService:
    def __init__(self, provider: Optional[AIProvider] = None):
        self.provider = provider or get_ai_provider()

    async def generate_script(self, req: ScriptRequest) -> ScriptResponse:
        prompt = f"""
Write an engaging video script for:
Topic: {req.topic}
Opening Hook: {req.hook or 'Generate a compelling opening hook'}
Platform: {req.platform}
Target Duration: {req.target_duration_seconds} seconds

Provide title, full_text, scenes with visual cues, dialogue, overlay text, and duration_estimate.
"""
        config = AIRequestConfig(
            system_prompt="You write high-retention video scripts optimized for visual storytelling.",
            temperature=0.75,
        )
        res = await self.provider.generate_structured(prompt, ScriptResponse, config)
        if res.parsed_json and "full_text" in res.parsed_json:
            return ScriptResponse(**res.parsed_json)

        mock = get_ai_provider("mock")
        fallback_res = await mock.generate_structured(prompt, ScriptResponse, config)
        return ScriptResponse(**fallback_res.parsed_json)
