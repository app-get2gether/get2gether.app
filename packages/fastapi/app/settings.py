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
    WEBAPP_URL: str
    TELEGRAM_TOKEN: str = ""
    S3_ENDPOINT_URL: str
    S3_BUCKET_NAME: str
    S3_BUCKET_REGION: str
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str

    # optional
    TELEGRAM_ERROR_CHAT_ID: str = ""
    TELEGRAM_SETUP_COMMANDS: bool = False
    CORS_ALLOW_ORIGINS: list[str] = []

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


# https://github.com/pydantic/pydantic/issues/3753
settings = Settings.model_validate({})
