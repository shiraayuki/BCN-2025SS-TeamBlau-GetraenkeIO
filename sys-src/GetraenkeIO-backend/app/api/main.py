from fastapi import APIRouter

from .routes import users

# Die Router aller Routen Zentral registrieren
api_router = APIRouter()
api_router.include_router(users.router)
