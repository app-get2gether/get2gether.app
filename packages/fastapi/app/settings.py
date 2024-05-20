from enum import Enum

from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(str, Enum):
    dev = "dev"
    prod = "prod"


class Settings(BaseSettings):
    ENV: Env = Env.dev
    DEBUG: bool = False
    DEBUG_SQL: bool = False

    # required
    DATABASE_URL: str = ""
    TELEGRAM_TOKEN: str = ""

    # optional
    TELEGRAM_ERROR_CHAT_ID: str = ""
    TELEGRAM_SETUP_COMMANDS: bool = False
    CORS_ALLOW_ORIGINS: list[str] = []

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
