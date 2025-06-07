from fastapi import APIRouter

from .routes import users, drinks, transactions, recharges

# Die Router aller Routen Zentral registrieren
api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(drinks.router)
api_router.include_router(transactions.router)
api_router.include_router(recharges.router)
