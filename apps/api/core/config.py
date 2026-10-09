import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application
    APP_NAME: str = "AI Social Studio"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_URL: str = "http://localhost:3000"
    API_URL: str = "http://localhost:8000"
    SECRET_KEY: str = "change-this-to-a-very-secure-32-byte-hex-secret-in-production"
    ENCRYPTION_KEY: str = "dGhpcy1pcy1hLXNhbXBsZS0zMi1ieXRlLWtleS0xMjM0NTY="  # 32-byte base64

    # Database
    DATABASE_URL: str = "sqlite:///./ai_social_studio.db"
    DB_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Authentication & JWT
    JWT_SECRET_KEY: str = "super-secret-jwt-signing-key-for-social-studio-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-social-studio-ashy.vercel.app",
        "https://ai-social-studio.vercel.app",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # AI Providers
    DEFAULT_AI_PROVIDER: str = "mock"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Video Generation
    DEFAULT_VIDEO_PROVIDER: str = "mock"
    RUNWAY_API_KEY: str = ""
    LUMA_API_KEY: str = ""
    REPLICATE_API_TOKEN: str = ""

    # Storage
    STORAGE_PROVIDER: str = "local"
    LOCAL_STORAGE_DIR: str = "./uploads"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = "ai-social-studio-media"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_STARTER_MONTHLY: str = "price_starter_monthly"
    STRIPE_PRICE_STARTER_YEARLY: str = "price_starter_yearly"
    STRIPE_PRICE_PRO_MONTHLY: str = "price_pro_monthly"
    STRIPE_PRICE_PRO_YEARLY: str = "price_pro_yearly"
    STRIPE_PRICE_ENTERPRISE_MONTHLY: str = "price_enterprise_monthly"
    STRIPE_PRICE_ENTERPRISE_YEARLY: str = "price_enterprise_yearly"

    # Social Integrations
    META_CLIENT_ID: str = ""
    META_CLIENT_SECRET: str = ""
    META_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/meta"

    TIKTOK_CLIENT_KEY: str = ""
    TIKTOK_CLIENT_SECRET: str = ""
    TIKTOK_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/tiktok"

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/google"

    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: str = ""
    LINKEDIN_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/linkedin"

    X_CLIENT_ID: str = ""
    X_CLIENT_SECRET: str = ""
    X_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/x"


settings = Settings()
