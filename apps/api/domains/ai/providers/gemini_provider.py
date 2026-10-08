import json
from typing import Optional
import httpx
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig, AIResult
from apps.api.core.config import settings
from apps.api.core.exceptions import ProviderError


class GeminiProvider(AIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

    @property
    def provider_name(self) -> str:
        return "gemini"

    async def generate_text(self, prompt: str, config: Optional[AIRequestConfig] = None) -> AIResult:
        if not self.api_key:
            raise ProviderError("Gemini API key is not configured")

        config = config or AIRequestConfig()
        url = f"{self.base_url}/models/gemini-1.5-pro:generateContent?key={self.api_key}"
        
        contents = []
        if config.system_prompt:
            contents.append({"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTION: {config.system_prompt}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood."}]})
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": config.temperature,
                "maxOutputTokens": config.max_tokens,
            },
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise ProviderError(f"Gemini error: {resp.text}")
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise ProviderError("No generation candidates returned from Gemini")
            text = candidates[0]["content"]["parts"][0]["text"]
            usage = data.get("usageMetadata", {})
            return AIResult(
                raw_text=text,
                prompt_tokens=usage.get("promptTokenCount", 0),
                completion_tokens=usage.get("candidatesTokenCount", 0),
                total_tokens=usage.get("totalTokenCount", 0),
                model="gemini-1.5-pro",
                provider="gemini",
            )

    async def generate_structured(
        self, prompt: str, response_schema: type[BaseModel], config: Optional[AIRequestConfig] = None
    ) -> AIResult:
        config = config or AIRequestConfig()
        schema_json = json.dumps(response_schema.model_json_schema())
        system = (config.system_prompt or "") + f"\nOutput ONLY valid JSON adhering strictly to this schema:\n{schema_json}"
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
