"""Configuration management for OpenClaw."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or a .env file."""

    model_config = SettingsConfigDict(
        env_prefix="OPENCLAW_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # API server
    api_host: str = "0.0.0.0"
    api_port: int = 8080
    debug: bool = False

    # AI backend (OpenAI-compatible endpoint)
    ai_api_url: str = "https://api.openai.com/v1"
    ai_api_key: str = ""
    ai_model: str = "gpt-4o-mini"
    ai_max_tokens: int = 1024
    ai_temperature: float = 0.7

    # Storage (in-memory by default; set to a file path for persistence)
    storage_path: str = ""


settings = Settings()
