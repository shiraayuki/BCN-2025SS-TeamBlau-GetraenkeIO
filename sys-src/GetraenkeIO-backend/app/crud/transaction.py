# Erstellt neuen Getränke-Eintrag
from sqlmodel import Session
from datetime import datetime, timezone

from app.models.user import User
from ..models.transaction import TransactionPost, Transaction
from ..models.drinks import Drink



def store_transaction_to_db(*, session: Session, transaction_post: TransactionPost, drink_data: Drink, user_data: User) -> Transaction:
    # Überprüfen, ob die übergebene Getränke-ID existiert
    if (drink_data == None):
        raise ValueError(f'Die Angegebene Getränke-ID ist ungültig!')
    # Überprüfen, ob die übergebene Nutzer-ID existiert
    if (user_data == None):
        raise ValueError(f'Die Angegebene Nutzer-ID ist ungültig!')
    transaction_data = {**transaction_post.model_dump(), "purchase_price": drink_data.cost, "date": datetime.now(timezone.utc)}
    # Validiert, ob alle Daten korrekt in die Datenbank eingetragen werden können
    db_obj = Transaction.model_validate(transaction_data)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj