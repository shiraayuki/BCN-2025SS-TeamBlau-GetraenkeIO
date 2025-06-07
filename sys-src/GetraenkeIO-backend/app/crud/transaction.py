# Erstellt neuen Getränke-Eintrag
from sqlmodel import Session, select
from datetime import datetime, timezone
from fastapi import HTTPException

from app.crud.drinks import update_drink_by_id
from app.models.user import User
from ..models.transaction import TransactionPost, Transaction
from ..models.drinks import Drink, DrinkPut



def store_transaction_to_db(*, session: Session, transaction_post: TransactionPost, drink_data: Drink, user_data: User) -> Transaction:
    # Überprüfen, ob die übergebene Getränke-ID existiert
    if (drink_data == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Getränke-ID ist ungültig!')
    # Überprüfen, ob die übergebene Nutzer-ID existiert
    if (user_data == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Nutzer-ID ist ungültig!')
    # Anzahl des Getränks heruntersetzen
    update_drink_by_id(session=session,drink_id=transaction_post.drink_id,drink_update=DrinkPut(count=(drink_data.count - transaction_post.amount)))
    transaction_data = {**transaction_post.model_dump(), "purchase_price": drink_data.cost, "date": datetime.now(timezone.utc), "user_id":user_data.id}
    # Validiert, ob alle Daten korrekt in die Datenbank eingetragen werden können
    db_obj = Transaction.model_validate(transaction_data)
    # Guthaben des Nutzers heruntersetzen
    user_data.guthaben = user_data.guthaben - drink_data.cost * db_obj.amount
    session.add(db_obj)
    session.add(user_data)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def read_all_transactions(*, session: Session) -> list[Transaction]:
    transactions = session.exec(select(Transaction)).all()
    if transactions == None:
        transactions = []
    return transactions

def read_user_transactions(*, session: Session, user: User) -> list[Transaction]:
    transactions = session.exec(select(Transaction).where(Transaction.user_id == user.id)).all()
    if transactions == None:
        transactions = []
    return transactions