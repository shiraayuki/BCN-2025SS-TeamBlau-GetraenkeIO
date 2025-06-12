from fastapi import HTTPException
from sqlmodel import UUID, Session, select
from app.models.drink_history import DrinkHistory
from app.models.drinks import Drink


# Erstellt neuen Eintrag des Angegebenen Getränks zur Sicherung des Getränks,
# sodass bei Veränderung oder Löschung des ursprünglichen Getränks die Transaktionen orginalgetreu bleiben
# Wenn das Getränk bereits vorhanden ist, wird das vorhandene DrinkHistory Objekt zurückgeliefert
def store_drink_to_db(*, session: Session, original_drink: Drink) -> DrinkHistory:
    select_statement = select(DrinkHistory).where(DrinkHistory.name == original_drink.name and DrinkHistory.imageUrl == original_drink.imageUrl and DrinkHistory.cost == original_drink.cost)
    existing_obj = session.exec(statement=select_statement).first()
    if existing_obj != None:
        return existing_obj

    db_obj = DrinkHistory.model_validate({"name": original_drink.name, "imageUrl": original_drink.imageUrl, "cost": original_drink.cost})
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

# Gibt das Getränk mit passender id zurück
def read_drink_from_db(session: Session, drink_history_id: UUID) -> list[Drink]:
    drink = session.get(DrinkHistory, drink_history_id)
    if drink == None:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drink