from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://wepesi:wepesi_dev_password@localhost:5432/wepesi"
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection: str = "regulatory_chunks"
    upload_dir: str = "uploads/regulations"
    max_upload_bytes: int = 10 * 1024 * 1024
    openai_api_key: str = ""
    openai_model: str = "gpt-5"
    openai_embedding_model: str = "text-embedding-3-small"
    jwt_secret: str = Field(default="change-me-in-production")
    jwt_algorithm: str = "HS256"
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
