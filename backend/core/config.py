from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    elevenlabs_api_key: str
    elevenlabs_voice_id: str
    elevenlabs_base_url: str
    ws_ping_interval_seconds: int = 30

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()