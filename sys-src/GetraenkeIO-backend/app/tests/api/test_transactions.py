from decimal import Decimal
import math
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
from app.tests.setup_data import VALID_TRANSACTION_UUID, VALID_USER_UUID, add_valid_drink, add_valid_transaction, setup_user, VALID_DRINK, VALID_DRINK_NAME, VALID_DRINK_UUID, VALID_USER_NAME, VALID_USER_PASSWORD, VALID_USER_GUTHABEN

@pytest.mark.parametrize('setup_user', [False], indirect=True)
def test_transaction_post_valid(db, client, setup_user, add_valid_drink):
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

@pytest.mark.parametrize('setup_user', [False], indirect=True)
def test_transaction_post_not_authorized(db, client, setup_user, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":1}
    response = client.post("/transactions", auth=("WrongUser","WrongPW"),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.parametrize('setup_user', [False], indirect=True)
def test_transaction_post_wrong_amount(db, client, setup_user, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":0}
    response = client.post("/transactions", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"

@pytest.mark.parametrize('setup_user', [False], indirect=True)
def test_transaction_post_wrong_drink_id(db, client, setup_user, add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(uuid4()), "amount":1}
    response = client.post("/transactions", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"] == "Die Angegebene Getränke-ID ist ungültig!"

@pytest.mark.parametrize('setup_user', [False], indirect=True)
def test_transaction_post_no_guthaben(db,client,setup_user,add_valid_drink):
    VALID_POST_TRANSACTION = {"drink_id": str(VALID_DRINK_UUID), "amount":math.ceil((round((VALID_USER_GUTHABEN),2)/float(VALID_DRINK.cost))+1)}
    response = client.post("/transactions", auth=(VALID_USER_NAME,VALID_USER_PASSWORD),json=VALID_POST_TRANSACTION)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"] == "Sie haben nicht genügend Guthaben, um diese Bestellung abzuschließen!"

@pytest.mark.parametrize(('setup_user','add_valid_transaction'), [(False, 1)], indirect=True)
def test_transaction_get_personal_transactions_valid(db,client,setup_user,add_valid_drink, add_valid_transaction):
    response = client.get("/transactions/me", auth=(VALID_USER_NAME,VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 1
    response_transaction = Transaction.model_validate(response.json()[0])
    db_transaction = db.get(Transaction,VALID_TRANSACTION_UUID)
    db_drink = db.get(Drink, VALID_DRINK_UUID)

    assert response_transaction.transaction_id == VALID_TRANSACTION_UUID == db_transaction.transaction_id
    assert response_transaction.user_id == VALID_USER_UUID == db_transaction.user_id
    assert response_transaction.drink_id == VALID_DRINK_UUID == db_transaction.drink_id
    assert response_transaction.amount == 1 == db_transaction.amount
    assert response_transaction.purchase_price == db_drink.cost == db_transaction.purchase_price
    assert response_transaction.date == db_transaction.date

@pytest.mark.parametrize(('setup_user','add_valid_transaction'), [(False, 1)], indirect=True)
def test_transaction_get_personal_transactions_unauthorized(db,client,setup_user,add_valid_drink, add_valid_transaction):
    response = client.get("/transactions/me", auth=("WrongUser","WrongPW"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.parametrize(('setup_user','add_valid_transaction'), [(True, 1)], indirect=True)
def test_transaction_get_all_transactions_valid(db,client,setup_user,add_valid_drink, add_valid_transaction):
    response = client.get("/transactions/", auth=(VALID_USER_NAME,VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 1
    response_transaction = Transaction.model_validate(response.json()[0])
    db_transaction = db.get(Transaction,VALID_TRANSACTION_UUID)
    db_drink = db.get(Drink, VALID_DRINK_UUID)

    assert response_transaction.transaction_id == VALID_TRANSACTION_UUID == db_transaction.transaction_id
    assert response_transaction.user_id == VALID_USER_UUID == db_transaction.user_id
    assert response_transaction.drink_id == VALID_DRINK_UUID == db_transaction.drink_id
    assert response_transaction.amount == 1 == db_transaction.amount
    assert response_transaction.purchase_price == db_drink.cost == db_transaction.purchase_price
    assert response_transaction.date == db_transaction.date

@pytest.mark.parametrize(('setup_user','add_valid_transaction'), [(True, 1)], indirect=True)
def test_transaction_get_all_transactions_unauthorized(db,client,setup_user,add_valid_drink, add_valid_transaction):
    response = client.get("/transactions/", auth=("WrongUser","WrongPW"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.parametrize(('setup_user','add_valid_transaction'), [(False, 1)], indirect=True)
def test_transaction_get_all_transactions_forbidden(db,client,setup_user,add_valid_drink, add_valid_transaction):
    response = client.get("/transactions/", auth=(VALID_USER_NAME,VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_403_FORBIDDEN