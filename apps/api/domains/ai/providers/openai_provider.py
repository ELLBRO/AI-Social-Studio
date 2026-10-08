import json
from typing import Optional
import httpx
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig, AIResult
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class OpenAIProvider(AIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.base_url = "https://api.openai.com/v1"

    @property
    def provider_name(self) -> str:
        return "openai"

    async def generate_text(self, prompt: str, config: Optional[AIRequestConfig] = None) -> AIResult:
        if not self.api_key:
            raise ProviderError("OpenAI API key is not configured")

        config = config or AIRequestConfig()
        messages = []
        if config.system_prompt:
            messages.append({"role": "system", "content": config.system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "gpt-4o",
            "messages": messages,
            "temperature": config.temperature,
            "max_tokens": config.max_tokens,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            if resp.status_code != 200:
                raise ProviderError(f"OpenAI error: {resp.text}")
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})
            return AIResult(
                raw_text=content,
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
                model="gpt-4o",
                provider="openai",
            )

    async def generate_structured(
        self, prompt: str, response_schema: type[BaseModel], config: Optional[AIRequestConfig] = None
    ) -> AIResult:
        config = config or AIRequestConfig()
        schema_json = json.dumps(response_schema.model_json_schema())
        system = (config.system_prompt or "") + f"\nYou must respond ONLY in valid JSON matching this JSON schema:\n{schema_json}"
        cfg = AIRequestConfig(
            temperature=config.temperature,
            max_tokens=config.max_tokens,
            system_prompt=system,
        )
        res = await self.generate_text(prompt, cfg)
        try:
            # Clean markdown codeblocks if returned
            cleaned = res.raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            res.parsed_json = parsed
        except Exception:
            res.parsed_json = {}
        return res
