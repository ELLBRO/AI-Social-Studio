import json
from typing import Optional
import httpx
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig, AIResult
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class AnthropicProvider(AIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.base_url = "https://api.anthropic.com/v1"

    @property
    def provider_name(self) -> str:
        return "anthropic"

    async def generate_text(self, prompt: str, config: Optional[AIRequestConfig] = None) -> AIResult:
        if not self.api_key:
            raise ProviderError("Anthropic API key is not configured")

        config = config or AIRequestConfig()
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": config.max_tokens,
            "temperature": config.temperature,
            "messages": [{"role": "user", "content": prompt}],
        }
        if config.system_prompt:
            payload["system"] = config.system_prompt

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(f"{self.base_url}/messages", headers=headers, json=payload)
            if resp.status_code != 200:
                raise ProviderError(f"Anthropic error: {resp.text}")
            data = resp.json()
            content = data["content"][0]["text"]
            usage = data.get("usage", {})
            return AIResult(
                raw_text=content,
                prompt_tokens=usage.get("input_tokens", 0),
                completion_tokens=usage.get("output_tokens", 0),
                total_tokens=usage.get("input_tokens", 0) + usage.get("output_tokens", 0),
                model="claude-3-5-sonnet",
                provider="anthropic",
            )

    async def generate_structured(
        self, prompt: str, response_schema: type[BaseModel], config: Optional[AIRequestConfig] = None
    ) -> AIResult:
        config = config or AIRequestConfig()
        schema_json = json.dumps(response_schema.model_json_schema())
        system = (config.system_prompt or "") + f"\nRespond ONLY in valid raw JSON matching this schema:\n{schema_json}"
        cfg = AIRequestConfig(
            temperature=config.temperature,
            max_tokens=config.max_tokens,
            system_prompt=system,
        )
        res = await self.generate_text(prompt, cfg)
        try:
            cleaned = res.raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            res.parsed_json = json.loads(cleaned.strip())
        except Exception:
            res.parsed_json = {}
        return res
