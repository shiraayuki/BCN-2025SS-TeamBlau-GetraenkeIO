from datetime import datetime
from typing import Annotated
import uuid
from pydantic import AfterValidator
from sqlmodel import Field, SQLModel
from .drinks import DrinkCost, check_invalid_drink_cost

def check_invalid_drink_amount(value: int) -> int:
    if value < 1:
        raise ValueError(f'Der Wert des Attributs amount darf nicht kleiner als 1 sein!')
    return value

DrinkAmount = Annotated[
    int,
    Field(default=1),
    AfterValidator(check_invalid_drink_amount)
]

# Datenmodell für das Erstellen einer neuen Transaktion
class TransactionPost(SQLModel):
    drink_id: uuid.UUID = Field(foreign_key="drink.id")
    amount: DrinkAmount

# Tabelle für Transaktionen
class Transaction(TransactionPost, table=True):
    transaction_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    purchase_price: DrinkCost
    date: datetime