import uuid
from fastapi import HTTPException
from sqlmodel import Session, select
from ..models.drinks import Drink, DrinkPost, DrinkPut

# Erstellt neuen Getränke-Eintrag
def store_drink_to_db(*, session: Session, drink_post: DrinkPost) -> Drink:
    # Validiert, ob alle Daten korrekt in die Datenbank eingetragen werden können
    db_obj = Drink.model_validate(drink_post)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

# Gibt alle Getränke in einer Liste zurück
def read_drinks_from_db(session: Session) -> list[Drink]:
    sel_statement = select(Drink)
    drinks = session.exec(sel_statement).all()
    return drinks

# Gibt einen einzelnen Getränke anhand der ID zurück
def read_drink_by_id(*, session: Session, drink_id: uuid.UUID) -> Drink:
    drink = session.get(Drink, drink_id)
    if not drink: # Wenn die ID nicht vorhanden ist wird eine Exception zurückgegeben
        raise HTTPException(status_code=404, detail="Drink not found")
    return drink

# Das Getränk mit der gegebenen ID wird aus der Datenbank gelöscht
def delete_drink_by_id(*, session: Session, drink_id: uuid.UUID) -> Drink:
    drink = session.get(Drink, drink_id)
    if not drink:
        raise HTTPException(status_code=404, detail="Drink not found")
    session.delete(drink)
    session.commit()
    return drink

def update_drink_by_id(*, session: Session, drink_id: uuid.UUID, drink_update: DrinkPut) -> Drink:
    drink = session.get(Drink, drink_id)
    if not drink:
        raise HTTPException(status_code=404, detail="Drink not found")
    # Jeder vorhandene Eintrag, der nicht None ist wird aktualisiert
    for field, value in drink_update.model_dump(exclude_none=True).items():
        setattr(drink, field, value)
    session.commit()
    session.refresh(drink)
    return drink