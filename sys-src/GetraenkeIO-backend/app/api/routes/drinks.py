import uuid
from fastapi import APIRouter
from app.api.dependencies import SessionDep
from app.crud.drinks import read_drink_by_id, read_drinks_from_db, store_drink_to_db,delete_drink_by_id, update_drink_by_id
from app.models.drinks import Drink, DrinkPost, DrinkPut


router = APIRouter(prefix="/drinks", tags=["drinks"])

@router.get("/", response_model=list[Drink])
def read_drinks(session: SessionDep):
    drinks = read_drinks_from_db(session=session)
    return drinks

@router.get("/{drink_id}", response_model=Drink)
def read_drink(session:SessionDep, drink_id: uuid.UUID):
    drink = read_drink_by_id(session=session,drink_id=drink_id)
    return drink

@router.post("/", response_model=Drink)
def create_drink(session: SessionDep, drink: DrinkPost):
    drink = store_drink_to_db(session=session, drink_post=drink)
    return drink

@router.put("/{drink_id}", response_model=Drink)
def update_drink(session: SessionDep, drink_id: uuid.UUID, drink_put: DrinkPut):
    drink = update_drink_by_id(session=session, drink_id=drink_id, drink_update=drink_put)
    return drink

@router.delete("/{drink_id}", response_model=Drink)
def delete_drink(session:SessionDep, drink_id: uuid.UUID):
    drink = delete_drink_by_id(session=session, drink_id=drink_id)
    return drink