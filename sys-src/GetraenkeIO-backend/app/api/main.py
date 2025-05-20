from fastapi import APIRouter

from .routes import users, drinks

# Die Router aller Routen Zentral registrieren
api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(drinks.router)
