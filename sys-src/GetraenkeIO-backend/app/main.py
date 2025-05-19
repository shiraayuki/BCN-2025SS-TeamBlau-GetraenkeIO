from fastapi.concurrency import asynccontextmanager
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from .core.database import create_db_and_tables

from .api.main import api_router

# Funktion wird am Anfang/Ende des Programmes aufgerufen
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Datenbankmodell erzeugen
    create_db_and_tables()
    # TODO: admin anlegen wenn nicht existent
    yield
    # Hier könnte cleanup-Code stehen
    pass

app = FastAPI(
    title="GetraenkeIO",
    lifespan=lifespan
)
# evtl. TODO origin_eintragen
# CORS aktivieren, um Anfragen vom Front-End entgegennehmen zu können. 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routen registrieren
app.include_router(api_router)