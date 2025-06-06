from decimal import Decimal
from fastapi import status
from sqlmodel import SQLModel, select
from app.crud.user import read_user_by_uname
from app.models.user import UserGet, User
from app.models.drinks import Drink, DrinkPost
from app.models.transaction import Transaction
from uuid import uuid4
from app.core.security import get_password_hash
from app.crud.drinks import read_drink_by_id
import pytest
from app.tests.setup_data import add_valid_drink, setup_admin, setup_normal, VALID_DRINK, VALID_DRINK_NAME, VALID_DRINK_UUID, VALID_USER_NAME, VALID_USER_PASSWORD, VALID_USER_GUTHABEN

def test_transaction_post_valid(db, client, setup_normal, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":1}
    response = client.post("/transactions", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_200_OK
    response_transaction = Transaction.model_validate(response.json())
    db_transaction = db.exec(select(Transaction)).first()
    db_drink = read_drink_by_id(session = db,drink_id=VALID_DRINK_UUID)
    db_user = read_user_by_uname(session = db,name=VALID_USER_NAME)

    assert response_transaction.transaction_id == db_transaction.transaction_id
    assert str(response_transaction.drink_id) == VALID_POST_TRANSACTION["drink_id"] == str(db_transaction.drink_id)
    assert response_transaction.user_id == db_transaction.user_id
    assert response_transaction.amount == VALID_POST_TRANSACTION["amount"] == db_transaction.amount
    assert response_transaction.purchase_price == db_transaction.purchase_price == db_drink.cost
    assert db_drink.count == (VALID_DRINK.count - VALID_POST_TRANSACTION["amount"])
    assert db_user.guthaben == round(Decimal.from_float(VALID_USER_GUTHABEN),2) - db_transaction.purchase_price

def test_transaction_post_not_authorized(db, client, setup_normal, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":1}
    response = client.post("/transactions", auth=("WrongUser","WrongPW"),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_transaction_post_wrong_amount(db, client, setup_normal, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":0}
    response = client.post("/transactions", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"

def test_transaction_post_wrong_drink_id(db, client, setup_normal, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(uuid4()), "amount":1}
    response = client.post("/transactions", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"] == "Die Angegebene Getränke-ID ist ungültig!"