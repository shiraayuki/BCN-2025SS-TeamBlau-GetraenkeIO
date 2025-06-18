from fastapi.concurrency import asynccontextmanager
from sqlmodel import Session
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from .core.config import settings
from .core.database import create_db_and_tables, engine

from .crud.user import create_or_update_admin_user_password

from .api.main import api_router

# Funktion wird am Anfang/Ende des Programmes aufgerufen
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Datenbankmodell erzeugen
    create_db_and_tables()
    with Session(engine) as session:
        create_or_update_admin_user_password(session=session, password=settings.gv_passwd)
    yield
    # Hier könnte cleanup-Code stehen
    pass

app = FastAPI(
    title="GetraenkeIO",
    lifespan=lifespan
)

print(settings.allowed_origins.split(","))

# CORS aktivieren, um Anfragen vom Front-End entgegennehmen zu können. 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routen registrieren
app.include_router(api_router)