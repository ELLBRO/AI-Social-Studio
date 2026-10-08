from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AIRequestConfig(BaseModel):
    temperature: float = 0.7
    max_tokens: int = 1500
    system_prompt: Optional[str] = None


class AIResult(BaseModel):
    raw_text: str
    parsed_json: Optional[Dict[str, Any]] = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    model: str
    provider: str


class AIProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def generate_text(self, prompt: str, config: Optional[AIRequestConfig] = None) -> AIResult:
        pass

    @abstractmethod
    async def generate_structured(
        self, prompt: str, response_schema: type[BaseModel], config: Optional[AIRequestConfig] = None
    ) -> AIResult:
        pass
