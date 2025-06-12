# Erstellt neuen Getränke-Eintrag
from sqlmodel import Session, select
from datetime import datetime, timezone
from fastapi import HTTPException

from app.crud.drinks import update_drink_by_id
from app.crud.drink_history import store_drink_to_db, read_drink_from_db
from app.models.user import User
from ..models.transaction import TransactionGet, TransactionGetReturn, TransactionPost, Transaction
from ..models.drinks import Drink, DrinkPut
from app.models.drink_history import DrinkHistory, DrinkHistoryGet



def store_transaction_to_db(*, session: Session, transaction_post: TransactionPost, drink_data: Drink, user_data: User) -> Transaction:
    # Überprüfen, ob die übergebene Getränke-ID existiert
    if (drink_data == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Getränke-ID ist ungültig!')
    # Überprüfen, ob die übergebene Nutzer-ID existiert
    if (user_data == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Nutzer-ID ist ungültig!')
    # Anzahl des Getränks heruntersetzen
    drink_history = store_drink_to_db(session=session, original_drink=drink_data)
    transaction_data = {"amount": transaction_post.amount, "count_before": drink_data.count, "date": datetime.now(timezone.utc), "user_id":user_data.id, "drink_history_id": drink_history.id}
    update_drink_by_id(session=session,drink_id=transaction_post.drink_id,drink_update=DrinkPut(count=(drink_data.count - transaction_post.amount)))
    # Validiert, ob alle Daten korrekt in die Datenbank eingetragen werden können
    db_obj = Transaction.model_validate(transaction_data)
    # Guthaben des Nutzers heruntersetzen
    user_data.guthaben = user_data.guthaben - drink_data.cost * db_obj.amount
    session.add(db_obj)
    session.add(user_data)
    session.commit()
    session.refresh(db_obj)
    # Gibt gesamte Daten der Transaktion zurück
    select_statement = select(Transaction.transaction_id,Transaction.user_id,Transaction.count_before,Transaction.amount, Transaction.date,DrinkHistory.name, DrinkHistory.imageUrl, DrinkHistory.cost).select_from(Transaction).join(DrinkHistory, Transaction.drink_history_id == DrinkHistory.id).where(Transaction.transaction_id == db_obj.transaction_id)
    transaction = session.exec(select_statement).first()
    return transaction

def read_all_transactions(*, session: Session) -> list[TransactionGetReturn]:
    select_statement = select(Transaction.transaction_id,Transaction.user_id,Transaction.count_before,Transaction.amount, Transaction.date,DrinkHistory.name, DrinkHistory.imageUrl, DrinkHistory.cost).select_from(Transaction).join(DrinkHistory, Transaction.drink_history_id == DrinkHistory.id)
    transactions = session.exec(select_statement).all()
    if transactions == None:
        transactions = []
    return transactions

def read_user_transactions(*, session: Session, user: User) -> list[TransactionGetReturn]:
    select_statement = select(Transaction.transaction_id,Transaction.user_id,Transaction.count_before,Transaction.amount, Transaction.date,DrinkHistory.name, DrinkHistory.imageUrl, DrinkHistory.cost).select_from(Transaction).join(DrinkHistory, Transaction.drink_history_id == DrinkHistory.id).where(Transaction.user_id == user.id)
    transactions = session.exec(select_statement).all()
    if transactions == None:
        transactions = []
    return transactions