from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    elevenlabs_api_key: str
    elevenlabs_voice_id: str
    elevenlabs_base_url: str
    ws_ping_interval_seconds: int = 30
    jwt_secret_key: str = "changeme-use-a-real-secret-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()