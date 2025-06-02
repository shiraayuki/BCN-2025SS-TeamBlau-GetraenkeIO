from sqlmodel import SQLModel, create_engine
from .config import settings
from ..models import *

# Start mit SQLite PostgreSQL wird später hinzugefügt
# Verbinde die App mit der Datenbank

if "sqlite:///" in settings.database_url:
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.database_url, echo=True, connect_args=connect_args)
else:
    engine = create_engine(settings.database_url)

# Funktion um die Tabellen aus den SQLModel-Modellen zu generieren.
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)