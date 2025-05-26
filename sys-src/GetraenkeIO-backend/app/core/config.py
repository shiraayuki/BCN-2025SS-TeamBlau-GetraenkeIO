from pydantic_settings import BaseSettings, SettingsConfigDict

# Benutzername für den Standard Admin Benutzer. Dieser wird vom Programm erstellt.
ADMIN_USER_NAME = "admin"

class Settings(BaseSettings):
    gv_passwd: str
    database_url: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()