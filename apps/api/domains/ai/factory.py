from typing import Optional
from apps.api.core.config import settings
from apps.api.domains.ai.base import AIProvider
from apps.api.domains.ai.providers.mock_provider import MockAIProvider
from apps.api.domains.ai.providers.openai_provider import OpenAIProvider
from apps.api.domains.ai.providers.anthropic_provider import AnthropicProvider
from apps.api.domains.ai.providers.gemini_provider import GeminiProvider


def _is_real_key(val: str) -> bool:
    return bool(val) and "placeholder" not in val.lower()


def get_ai_provider(provider_name: Optional[str] = None) -> AIProvider:
    name = (provider_name or settings.DEFAULT_AI_PROVIDER).lower()

    if name == "openai" and _is_real_key(settings.OPENAI_API_KEY):
        return OpenAIProvider()
    elif name == "anthropic" and _is_real_key(settings.ANTHROPIC_API_KEY):
        return AnthropicProvider()
    elif name == "gemini" and _is_real_key(settings.GEMINI_API_KEY):
        return GeminiProvider()

    # Default/fallback to MockAIProvider for local offline and dev without keys
    return MockAIProvider()
